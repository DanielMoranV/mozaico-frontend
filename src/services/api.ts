import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8091/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

interface JwtPayload {
  userId: number;
  empresaId: number;
  tipoUsuario: string;
  permissions: string[];
  exp: number;
  iat: number;
}

/**
 * Verifica si un token JWT ha expirado
 */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    // Considerar expirado 30 segundos antes para dar margen
    return decoded.exp < (currentTime + 30);
  } catch {
    return true;
  }
}

// Variable para evitar bucles infinitos en refresh de tokens
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para requests - Verificar token y agregarlo
apiClient.interceptors.request.use(
  async (config) => {
    // Debug: Log de todas las peticiones
    console.log('📤 [API REQUEST]', config.method?.toUpperCase(), config.url);

    // No agregar token a endpoints de autenticación
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')) {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    console.log('🔑 [API REQUEST] Token presente:', !!token);

    if (token) {
      // Verificar si el token está expirado ANTES de hacer la petición
      if (isTokenExpired(token)) {
        console.warn('⚠️ Token expirado detectado antes de la petición');

        // Verificar si tenemos refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('❌ No hay refresh token, cerrando sesión');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }

        // Intentar refrescar el token antes de la petición
        try {
          if (!isRefreshing) {
            isRefreshing = true;
            console.log('🔄 Refrescando token antes de la petición...');

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            console.log('✅ Token refrescado exitosamente');

            // Actualizar el header con el nuevo token
            config.headers.Authorization = `Bearer ${accessToken}`;

            processQueue(null, accessToken);
          } else {
            // Esperar a que termine el refresh en progreso
            const newToken = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } catch (error) {
          console.error('❌ Error al refrescar token:', error);
          processQueue(error, null);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - Manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Manejo de 401 (No autorizado) y 403 (Token expirado/inválido)
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      // Si es endpoint de auth, no intentar refresh
      if (originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // Si el error es 403 con mensaje de token, tratarlo como 401
      const errorMessage = error.response?.data?.message || '';
      const isTokenError = errorMessage.toLowerCase().includes('token') ||
                          errorMessage.toLowerCase().includes('jwt') ||
                          errorMessage.toLowerCase().includes('expired');

      // Debug: Log detallado del error 403
      if (error.response?.status === 403) {
        console.error('❌ [API ERROR 403] URL:', originalRequest.url);
        console.error('❌ [API ERROR 403] Método:', originalRequest.method);
        console.error('❌ [API ERROR 403] Mensaje:', errorMessage);
        console.error('❌ [API ERROR 403] Respuesta completa:', error.response?.data);
        console.error('❌ [API ERROR 403] Headers enviados:', originalRequest.headers);
        console.error('❌ [API ERROR 403] isTokenError:', isTokenError);
      }

      if (error.response?.status === 403 && !isTokenError) {
        // Es un 403 real de permisos, no intentar refresh
        console.warn('❌ Acceso denegado - Permisos insuficientes');
        return Promise.reject(error);
      }

      // Token expirado o inválido, intentar refresh
      console.warn(`⚠️ Error ${error.response?.status} - Intentando refrescar token...`);

      if (isRefreshing) {
        // Si ya se está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error('❌ No hay refresh token, cerrando sesión');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        console.log('🔄 Refrescando token después de error...');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        console.log('✅ Token refrescado exitosamente');

        processQueue(null, accessToken);

        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('❌ Error al refrescar token, cerrando sesión');
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Manejo de otros códigos de error
    switch (error.response?.status) {
      case 423:
        console.warn('⚠️ Cuenta bloqueada por intentos fallidos');
        break;
      case 404:
        console.warn('⚠️ Recurso no encontrado');
        break;
      case 500:
        console.error('❌ Error interno del servidor');
        break;
    }

    return Promise.reject(error);
  }
);
