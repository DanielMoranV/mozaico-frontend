import { apiClient } from './api';
import type {
  PagoRequestDTO,
  PagoResponseDTO,
  PagoCompletoResponseDTO,
  MetodoPagoResponseDTO,
  PagoSearchParams
} from '@/types/pago';
import type { ApiResponse } from '@/types/api';

export class PagoService {
  private static readonly BASE_URL = '/pagos';

  /**
   * Crea un nuevo pago según la documentación del endpoint
   * POST /api/v1/pagos
   */
  static async crearPago(pagoData: PagoRequestDTO): Promise<ApiResponse<PagoResponseDTO>> {
    try {
      console.log('💳 Creando pago:', pagoData);

      const response = await apiClient.post<ApiResponse<PagoResponseDTO>>(
        this.BASE_URL,
        pagoData
      );

      console.log('✅ Pago creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear pago:', error);

      // Extraer mensaje de error del response si existe
      const errorMessage = error.response?.data?.message || 'Error al procesar el pago';

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: errorMessage,
        data: null as any
      };
    }
  }

  /**
   * Obtiene los métodos de pago disponibles
   */
  static async getMetodosPago(): Promise<ApiResponse<MetodoPagoResponseDTO[]>> {
    try {
      const response = await apiClient.get<ApiResponse<MetodoPagoResponseDTO[]>>('/metodos-pago');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener métodos de pago:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: 'Error al cargar métodos de pago',
        data: [] as any
      };
    }
  }

  /**
   * Crea un pago completo con comprobante incluido en la respuesta
   * POST /api/v1/pagos/completo
   */
  static async crearPagoCompleto(pagoData: PagoRequestDTO): Promise<ApiResponse<PagoCompletoResponseDTO>> {
    try {
      console.log('💳 Creando pago completo:', pagoData);

      const response = await apiClient.post<ApiResponse<PagoCompletoResponseDTO>>(
        `${this.BASE_URL}/completo`,
        pagoData
      );

      console.log('✅ Pago completo creado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear pago completo:', error);

      const errorMessage = error.response?.data?.message || 'Error al procesar el pago completo';

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: errorMessage,
        data: null as any
      };
    }
  }

  /**
   * Obtiene todos los pagos del sistema
   * GET /api/v1/pagos
   */
  static async getTodosPagos(): Promise<ApiResponse<PagoResponseDTO[]>> {
    try {
      const response = await apiClient.get<ApiResponse<PagoResponseDTO[]>>(this.BASE_URL);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener todos los pagos:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: 'Error al cargar pagos',
        data: [] as any
      };
    }
  }

  /**
   * Obtiene un pago por ID
   * GET /api/v1/pagos/{id}
   */
  static async getPagoPorId(idPago: number): Promise<ApiResponse<PagoResponseDTO>> {
    try {
      const response = await apiClient.get<ApiResponse<PagoResponseDTO>>(`${this.BASE_URL}/${idPago}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener pago por ID:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: 'Error al cargar pago',
        data: null as any
      };
    }
  }

  /**
   * Actualiza un pago existente
   * PUT /api/v1/pagos/{id}
   */
  static async actualizarPago(idPago: number, pagoData: PagoRequestDTO): Promise<ApiResponse<PagoResponseDTO>> {
    try {
      console.log('🔄 Actualizando pago:', idPago, pagoData);

      const response = await apiClient.put<ApiResponse<PagoResponseDTO>>(
        `${this.BASE_URL}/${idPago}`,
        pagoData
      );

      console.log('✅ Pago actualizado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al actualizar pago:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al actualizar pago',
        data: null as any
      };
    }
  }

  /**
   * Elimina un pago
   * DELETE /api/v1/pagos/{id}
   */
  static async eliminarPago(idPago: number): Promise<ApiResponse<null>> {
    try {
      console.log('🗑️ Eliminando pago:', idPago);

      const response = await apiClient.delete<ApiResponse<null>>(`${this.BASE_URL}/${idPago}`);

      console.log('✅ Pago eliminado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al eliminar pago:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al eliminar pago',
        data: null
      };
    }
  }

  /**
   * Cambia el estado de un pago
   * PATCH /api/v1/pagos/{id}/estado
   */
  static async cambiarEstadoPago(idPago: number, nuevoEstado: string): Promise<ApiResponse<PagoResponseDTO>> {
    try {
      console.log('🔄 Cambiando estado de pago:', idPago, 'a', nuevoEstado);

      const response = await apiClient.patch<ApiResponse<PagoResponseDTO>>(
        `${this.BASE_URL}/${idPago}/estado?nuevoEstado=${nuevoEstado}`
      );

      console.log('✅ Estado de pago cambiado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al cambiar estado de pago:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al cambiar estado de pago',
        data: null as any
      };
    }
  }

  /**
   * Búsqueda avanzada de pagos
   * GET /api/v1/pagos/buscar
   */
  static async buscarPagos(params: PagoSearchParams): Promise<ApiResponse<PagoResponseDTO[]>> {
    try {
      console.log('🔍 Buscando pagos con parámetros:', params);

      // Filtrar parámetros undefined/null
      const filteredParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as any);

      const response = await apiClient.get<ApiResponse<PagoResponseDTO[]>>(`${this.BASE_URL}/buscar`, {
        params: filteredParams
      });

      console.log(`✅ Encontrados ${response.data.data?.length || 0} pagos`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al buscar pagos:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al buscar pagos',
        data: [] as any
      };
    }
  }

  /**
   * Obtiene el historial de pagos de un pedido
   */
  static async getPagosPorPedido(idPedido: number): Promise<ApiResponse<PagoResponseDTO[]>> {
    try {
      const response = await apiClient.get<ApiResponse<PagoResponseDTO[]>>(`${this.BASE_URL}/pedido/${idPedido}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener pagos del pedido:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: 'Error al cargar historial de pagos',
        data: [] as any
      };
    }
  }

  /**
   * Valida los datos del pago antes de enviarlo
   */
  static validarPagoRequest(pagoData: PagoRequestDTO): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validaciones obligatorias según la documentación
    if (!pagoData.idPedido || pagoData.idPedido <= 0) {
      errores.push('ID del pedido es obligatorio y debe ser mayor a 0');
    }

    if (!pagoData.idMetodo || pagoData.idMetodo <= 0) {
      errores.push('ID del método de pago es obligatorio y debe ser mayor a 0');
    }

    if (pagoData.monto === undefined || pagoData.monto === null || pagoData.monto < 0) {
      errores.push('El monto es obligatorio y debe ser mayor o igual a 0');
    }

    // Validar referencia si se proporciona
    if (pagoData.referencia && pagoData.referencia.trim().length === 0) {
      errores.push('La referencia no puede estar vacía si se proporciona');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Genera una referencia automática para el pago
   */
  static generarReferencia(metodoPago: string, idPedido: number): string {
    const timestamp = Date.now();
    const referencia = `${metodoPago.toUpperCase()}-${idPedido}-${timestamp}`;
    return referencia;
  }
}