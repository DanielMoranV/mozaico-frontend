import { apiClient } from './api';
import type { ValidacionIgvResponse, Empresa, EmpresaUpdateDTO, EmpresaEstadisticas } from '@/types/empresa';
import type { ApiResponse } from '@/types/api';

export class EmpresaService {
  private static readonly BASE_URL = '/empresa';
  private static readonly VALIDACION_URL = '/empresa/validacion';

  // =====================================================
  // GESTIÓN DE EMPRESA
  // =====================================================

  /**
   * Obtener información de la empresa
   * GET /api/v1/empresa
   */
  static async getEmpresa(): Promise<ApiResponse<Empresa>> {
    try {
      console.log('🏢 Obteniendo información de empresa');
      const response = await apiClient.get<ApiResponse<Empresa>>(this.BASE_URL);
      console.log('✅ Empresa obtenida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener empresa:', error);
      throw error;
    }
  }

  /**
   * Actualizar información de la empresa
   * PUT /api/v1/empresa
   * Requiere: ADMIN o SUPER_ADMIN
   */
  static async updateEmpresa(data: EmpresaUpdateDTO): Promise<ApiResponse<Empresa>> {
    try {
      console.log('📝 Actualizando empresa:', data);
      const response = await apiClient.put<ApiResponse<Empresa>>(this.BASE_URL, data);
      console.log('✅ Empresa actualizada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al actualizar empresa:', error);
      throw error;
    }
  }

  /**
   * Actualizar logo de la empresa
   * PUT /api/v1/empresa/logo
   * Requiere: ADMIN o SUPER_ADMIN
   */
  static async updateLogo(file: File): Promise<ApiResponse<Empresa>> {
    try {
      console.log('🖼️ Actualizando logo de empresa');
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.put<ApiResponse<Empresa>>(
        `${this.BASE_URL}/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('✅ Logo actualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al actualizar logo:', error);
      throw error;
    }
  }

  /**
   * Cambiar estado de la empresa (activar/desactivar)
   * PATCH /api/v1/empresa/estado?activa=true
   * Requiere: SUPER_ADMIN
   */
  static async cambiarEstado(activa: boolean): Promise<ApiResponse<Empresa>> {
    try {
      console.log(`🔄 Cambiando estado de empresa a: ${activa ? 'ACTIVA' : 'INACTIVA'}`);
      const response = await apiClient.patch<ApiResponse<Empresa>>(
        `${this.BASE_URL}/estado`,
        null,
        {
          params: { activa }
        }
      );
      console.log('✅ Estado actualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al cambiar estado:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de la empresa
   * GET /api/v1/empresa/estadisticas
   * Requiere: ADMIN o SUPER_ADMIN
   */
  static async getEstadisticas(): Promise<ApiResponse<EmpresaEstadisticas>> {
    try {
      console.log('📊 Obteniendo estadísticas de empresa');
      const response = await apiClient.get<ApiResponse<EmpresaEstadisticas>>(
        `${this.BASE_URL}/estadisticas`
      );
      console.log('✅ Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Cambiar slug de la empresa
   * PUT /api/v1/empresa/slug
   * Requiere: ADMIN o SUPER_ADMIN
   *
   * Formato: ^[a-z0-9]+(-[a-z0-9]+)*$ (minúsculas, números y guiones)
   * - No puede empezar ni terminar con guión
   * - No puede tener guiones consecutivos
   * - Debe ser único
   */
  static async cambiarSlug(nuevoSlug: string): Promise<ApiResponse<Empresa>> {
    try {
      console.log('🔗 Cambiando slug a:', nuevoSlug);
      const response = await apiClient.put<ApiResponse<Empresa>>(
        `${this.BASE_URL}/slug`,
        { slug: nuevoSlug }  // Enviar en el body como objeto
      );
      console.log('✅ Slug actualizado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al cambiar slug:', error);
      throw error;
    }
  }

  // =====================================================
  // VALIDACIÓN DE IGV (Legacy)
  // =====================================================

  /**
   * Obtiene la validación completa de IGV y capacidades
   */
  static async getValidacionCompleta(): Promise<ValidacionIgvResponse> {
    try {
      const response = await apiClient.get<ValidacionIgvResponse>(`${this.VALIDACION_URL}/igv`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener validación de empresa:', error);
      throw new Error('No se pudo cargar la configuración de la empresa');
    }
  }

  /**
   * Verificación rápida si aplica IGV
   */
  static async verificarAplicaIgv(): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`${this.VALIDACION_URL}/aplica-igv`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar IGV:', error);
      return false;
    }
  }

  /**
   * Obtiene el porcentaje de IGV configurado
   */
  static async getPorcentajeIgv(): Promise<number> {
    try {
      const response = await apiClient.get<number>(`${this.VALIDACION_URL}/porcentaje-igv`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener porcentaje IGV:', error);
      return 0;
    }
  }

  /**
   * Obtiene mensaje personalizado para mostrar al cliente
   */
  static async getMensajeCliente(): Promise<string> {
    try {
      const response = await apiClient.get(`${this.VALIDACION_URL}/mensaje-cliente`, {
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener mensaje cliente:', error);
      return 'No se pudo cargar información de la empresa';
    }
  }
}