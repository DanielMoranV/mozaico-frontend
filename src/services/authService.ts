import { apiClient } from "./api";
import type {
  AuthRequest,
  AuthResponse,
  RefreshTokenRequest,
  UserInfo,
  Permission,
  AuditLogResponse,
  Page
} from "../types/auth";
import type { ApiResponse } from "../types/api";

export class AuthService {

  /**
   * Realiza login con username y password
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
        username,
        password
      } as AuthRequest);

      if (!response.data.data) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const authData = response.data.data;

      // Guardar tokens en localStorage
      this.saveTokens(authData.accessToken, authData.refreshToken);
      this.saveUser(authData.user);

      return authData;
    } catch (error: any) {
      // Manejo específico de errores de autenticación
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 423) {
        throw new Error('Cuenta bloqueada. Contacte al administrador');
      } else if (error.response?.status === 403) {
        throw new Error('Cuenta desactivada');
      }
      throw new Error(error.response?.data?.message || 'Error de conexión');
    }
  }

  /**
   * Renueva el access token usando el refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
        refreshToken
      } as RefreshTokenRequest);

      if (!response.data.data) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const authData = response.data.data;

      // Actualizar tokens
      this.saveTokens(authData.accessToken, authData.refreshToken);
      this.saveUser(authData.user);

      return authData;
    } catch (error) {
      // Si el refresh falla, limpiar todo y redireccionar
      this.clearAuth();
      throw new Error('Sesión expirada');
    }
  }

  /**
   * Realiza logout y limpia tokens
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continuar con logout local aunque falle el servidor
      console.warn('Error en logout del servidor:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Obtiene información del usuario actual desde el servidor
   */
  async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/me');
    if (!response.data.data) {
      throw new Error('No se pudo obtener información del usuario');
    }
    return response.data.data;
  }

  /**
   * Valida si el token actual es válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>('/auth/validate');
      return response.data.data ?? false;
    } catch (error) {
      return false;
    }
  }

  // Métodos para manejo de tokens y usuario local

  /**
   * Obtiene el usuario desde localStorage
   */
  getLocalUser(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtiene el access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getLocalUser();
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(permission: Permission): boolean {
    const user = this.getLocalUser();
    if (!user) return false;

    // Super admin tiene todos los permisos
    if (user.permissions.includes('ALL_PERMISSIONS')) return true;

    return user.permissions.includes(permission);
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    const user = this.getLocalUser();
    if (!user) return false;

    // Super admin tiene todos los permisos
    if (user.permissions.includes('ALL_PERMISSIONS')) return true;

    return permissions.some(permission => user.permissions.includes(permission));
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    const user = this.getLocalUser();
    if (!user) return false;

    // Super admin tiene todos los permisos
    if (user.permissions.includes('ALL_PERMISSIONS')) return true;

    return permissions.every(permission => user.permissions.includes(permission));
  }

  /**
   * Obtiene la empresa del usuario actual
   */
  getCurrentEmpresaId(): number | null {
    const user = this.getLocalUser();
    return user?.empresaId || null;
  }

  // Métodos privados para manejo de almacenamiento

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private saveUser(user: UserInfo): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

// Servicios de auditoría
export class AuditService {

  /**
   * Obtiene logs de auditoría de la empresa (paginado)
   */
  async getAuditLogs(page = 0, size = 20, sort = 'fechaHora'): Promise<Page<AuditLogResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AuditLogResponse>>>(
      `/audit?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data.data!;
  }

  /**
   * Obtiene logs de auditoría de un usuario específico
   */
  async getAuditLogsByUser(usuarioId: number, page = 0, size = 20): Promise<Page<AuditLogResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AuditLogResponse>>>(
      `/audit/user/${usuarioId}?page=${page}&size=${size}`
    );
    return response.data.data!;
  }

  /**
   * Obtiene logs de auditoría de una entidad específica
   */
  async getAuditLogsByEntity(entidad: string, entidadId: number, page = 0, size = 20): Promise<Page<AuditLogResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AuditLogResponse>>>(
      `/audit/entity/${entidad}/${entidadId}?page=${page}&size=${size}`
    );
    return response.data.data!;
  }
}

// Instancias singleton de los servicios
export const authService = new AuthService();
export const auditService = new AuditService();