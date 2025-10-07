import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import type { UserInfo, Permission, AuthState } from '../types/auth';
import { authService } from '../services/authService';

interface JwtPayload {
  userId: number;
  empresaId: number;
  tipoUsuario: string;
  permissions: string[];
  exp: number;
  iat: number;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo - Inicializar con datos de localStorage si existen
  const localUser = authService.getLocalUser();
  console.log('🔄 AUTH STORE - Inicializando con usuario local:', !!localUser);

  const user = ref<UserInfo | null>(localUser);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters computados
  const isAuthenticated = computed(() => {
    const result = !!user.value;
    console.log('🔍 AUTH STORE - isAuthenticated computed:', result, 'user:', !!user.value);
    return result;
  });
  const permissions = computed(() => user.value?.permissions || []);
  const empresaId = computed(() => user.value?.empresaId || null);
  const empresaNombre = computed(() => user.value?.empresaNombre || '');
  const userRole = computed(() => user.value?.tipoUsuario || null);
  const userRoleDisplay = computed(() => user.value?.tipoUsuarioDisplayName || '');

  // Acciones

  /**
   * Inicializa el store cargando el usuario desde localStorage
   */
  function initialize() {
    const localUser = authService.getLocalUser();
    if (localUser) {
      user.value = localUser;
    }
  }

  /**
   * Realiza login con credenciales
   */
  async function login(username: string, password: string): Promise<void> {
    console.log('🔄 LOGIN STORE - Iniciando...');
    isLoading.value = true;
    error.value = null;

    try {
      console.log('🔄 LOGIN STORE - Llamando authService.login...');
      const authResponse = await authService.login(username, password);

      console.log('✅ LOGIN STORE - Respuesta recibida:', {
        user: authResponse.user.nombre,
        hasToken: !!authResponse.accessToken
      });

      user.value = authResponse.user;

      console.log('✅ LOGIN STORE - Usuario establecido, isAuthenticated:', isAuthenticated.value);
    } catch (err: any) {
      console.error('❌ LOGIN STORE - Error:', err.message);
      error.value = err.message || 'Error de autenticación';
      throw err;
    } finally {
      isLoading.value = false;
      console.log('🏁 LOGIN STORE - Finalizado, isAuthenticated:', isAuthenticated.value);
    }
  }

  /**
   * Realiza logout
   */
  async function logout(): Promise<void> {
    console.log('🔄 LOGOUT STORE - Iniciando...');
    isLoading.value = true;
    error.value = null;

    try {
      console.log('🔄 LOGOUT STORE - Llamando authService.logout...');
      await authService.logout();
      console.log('✅ LOGOUT STORE - Servidor respondió OK');
    } catch (err: any) {
      console.warn('⚠️ LOGOUT STORE - Error del servidor:', err);
    } finally {
      // Limpiar estado independientemente del resultado del servidor
      console.log('🔄 LOGOUT STORE - Limpiando estado local...');
      user.value = null;
      error.value = null;
      isLoading.value = false;
      console.log('✅ LOGOUT STORE - Estado limpiado, isAuthenticated:', isAuthenticated.value);
    }
  }

  /**
   * Refresca el token de acceso
   */
  async function refreshToken(): Promise<void> {
    try {
      const authResponse = await authService.refreshToken();
      user.value = authResponse.user;
    } catch (err: any) {
      // Si el refresh falla, hacer logout
      await logout();
      throw err;
    }
  }

  /**
   * Actualiza la información del usuario desde el servidor
   */
  async function updateUserInfo(): Promise<void> {
    if (!isAuthenticated.value) return;

    try {
      const updatedUser = await authService.getCurrentUser();
      user.value = updatedUser;
    } catch (err: any) {
      console.warn('Error actualizando información del usuario:', err);
      error.value = 'Error actualizando información del usuario';
    }
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  function hasPermission(permission: Permission): boolean {
    return authService.hasPermission(permission);
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   */
  function hasAnyPermission(permissions: Permission[]): boolean {
    return authService.hasAnyPermission(permissions);
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  function hasAllPermissions(permissions: Permission[]): boolean {
    return authService.hasAllPermissions(permissions);
  }

  /**
   * Verifica si una entidad pertenece a la empresa del usuario
   */
  function belongsToUserCompany(entityEmpresaId: number): boolean {
    return empresaId.value === entityEmpresaId;
  }

  /**
   * Limpia el estado de error
   */
  function clearError(): void {
    error.value = null;
  }

  /**
   * Establece un error
   */
  function setError(message: string): void {
    error.value = message;
  }

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  function canAccessRoute(requiredPermissions: Permission[] = []): boolean {
    if (!isAuthenticated.value) return false;
    if (requiredPermissions.length === 0) return true;
    return hasAnyPermission(requiredPermissions);
  }

  /**
   * Verifica si el token actual es válido (no expirado)
   */
  function isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Verifica el estado de autenticación actual
   */
  async function checkAuth(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const localUser = authService.getLocalUser();

    console.log('🔍 checkAuth - Token:', !!token, 'LocalUser:', !!localUser);

    if (!token) {
      user.value = null;
      console.log('❌ No token found, clearing auth');
      return;
    }

    // Verificar si el token está expirado
    if (!isTokenValid(token)) {
      console.warn('⚠️ Token expirado detectado en checkAuth');

      const refreshTokenStr = localStorage.getItem('refreshToken');
      if (!refreshTokenStr) {
        console.error('❌ No hay refresh token, cerrando sesión');
        await logout();
        window.location.href = '/login';
        return;
      }

      // Intentar refrescar el token
      try {
        console.log('🔄 Intentando refrescar token...');
        await authService.refreshToken();
        console.log('✅ Token refrescado en checkAuth');
      } catch (error) {
        console.error('❌ Error al refrescar token en checkAuth:', error);
        await logout();
        window.location.href = '/login';
        return;
      }
    }

    // Si tenemos token válido y usuario local, usar eso
    if (localUser && token) {
      // Solo actualizar si no es el mismo usuario (evitar re-renders innecesarios)
      if (!user.value || user.value.id !== localUser.id) {
        user.value = localUser;
      }
      console.log('✅ Usuario autenticado desde localStorage:', localUser.nombre);
      return;
    }

    // Solo si no tenemos usuario local pero sí token, intentar obtenerlo del servidor
    if (token && !localUser) {
      try {
        console.log('🔄 Obteniendo usuario del servidor...');
        const currentUser = await authService.getCurrentUser();
        user.value = currentUser;
        console.log('✅ Usuario obtenido del servidor:', currentUser.nombre);
      } catch (error) {
        console.warn('❌ Error verificando autenticación:', error);
        // Si falla, limpiar autenticación
        await logout();
        window.location.href = '/login';
      }
    }
  }

  /**
   * Obtiene el estado completo de autenticación
   */
  function getAuthState(): AuthState {
    return {
      user: user.value,
      isAuthenticated: isAuthenticated.value,
      permissions: permissions.value,
      empresaId: empresaId.value,
      isLoading: isLoading.value
    };
  }

  // Métodos de utilidad para verificación de roles específicos
  const isSuperAdmin = computed(() => user.value?.tipoUsuario === 'SUPER_ADMIN');
  const isAdmin = computed(() => user.value?.tipoUsuario === 'ADMIN');
  const isGerente = computed(() => user.value?.tipoUsuario === 'GERENTE');
  const isCajero = computed(() => user.value?.tipoUsuario === 'CAJERO');
  const isMesero = computed(() => user.value?.tipoUsuario === 'MESERO');
  const isCocinero = computed(() => user.value?.tipoUsuario === 'COCINERO');

  return {
    // Estado
    user,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    permissions,
    empresaId,
    empresaNombre,
    userRole,
    userRoleDisplay,
    isSuperAdmin,
    isAdmin,
    isGerente,
    isCajero,
    isMesero,
    isCocinero,

    // Acciones
    initialize,
    login,
    logout,
    refreshToken,
    updateUserInfo,
    checkAuth,
    isTokenValid,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    belongsToUserCompany,
    clearError,
    setError,
    canAccessRoute,
    getAuthState
  };
});

// Composable para usar el store de autenticación
export function useAuth() {
  const authStore = useAuthStore();

  // Usar storeToRefs para mantener reactividad
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    permissions,
    empresaId,
    empresaNombre,
    userRole,
    userRoleDisplay,
    isSuperAdmin,
    isAdmin,
    isGerente,
    isCajero,
    isMesero,
    isCocinero
  } = storeToRefs(authStore);

  return {
    // Estado reactivo con storeToRefs
    user,
    isLoading,
    error,
    isAuthenticated,
    permissions,
    empresaId,
    empresaNombre,
    userRole,
    userRoleDisplay,
    isSuperAdmin,
    isAdmin,
    isGerente,
    isCajero,
    isMesero,
    isCocinero,

    // Acciones (no necesitan storeToRefs)
    initialize: authStore.initialize,
    login: authStore.login,
    logout: authStore.logout,
    refreshToken: authStore.refreshToken,
    updateUserInfo: authStore.updateUserInfo,
    checkAuth: authStore.checkAuth,
    isTokenValid: authStore.isTokenValid,
    hasPermission: authStore.hasPermission,
    hasAnyPermission: authStore.hasAnyPermission,
    hasAllPermissions: authStore.hasAllPermissions,
    belongsToUserCompany: authStore.belongsToUserCompany,
    clearError: authStore.clearError,
    setError: authStore.setError,
    canAccessRoute: authStore.canAccessRoute,
    getAuthState: authStore.getAuthState,

    // Métodos de conveniencia adicionales
    requireAuth(): UserInfo {
      if (!authStore.isAuthenticated || !authStore.user) {
        throw new Error('Usuario no autenticado');
      }
      return authStore.user;
    },

    requirePermission(permission: Permission): void {
      if (!authStore.hasPermission(permission)) {
        throw new Error(`Permiso requerido: ${permission}`);
      }
    },

    requireAnyPermission(permissions: Permission[]): void {
      if (!authStore.hasAnyPermission(permissions)) {
        throw new Error(`Se requiere al menos uno de estos permisos: ${permissions.join(', ')}`);
      }
    }
  };
}