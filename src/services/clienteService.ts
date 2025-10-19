import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  ClienteRequestDTO,
  ClienteResponseDTO,
  ClienteUpdateDTO,
  ClienteSearchCriteria,
} from '@/types/cliente';

export class ClienteService {
  private static readonly BASE_PATH = '/clientes';

  static async crearCliente(data: ClienteRequestDTO): Promise<ApiResponse<ClienteResponseDTO>> {
    console.log('🔍 [ClienteService] Enviando POST a:', this.BASE_PATH);
    console.log('🔍 [ClienteService] Datos del cliente:', data);

    // Debug: Ver headers de la petición
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('🔑 [ClienteService] Token en localStorage:', token.substring(0, 50) + '...');

      // Decodificar el token para ver su contenido
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) {
          throw new Error('Token inválido');
        }
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        console.log('🔍 [ClienteService] Payload del token:', payload);
        console.log('🔍 [ClienteService] Token expira en:', new Date(payload.exp * 1000).toLocaleString());
        console.log('🔍 [ClienteService] Tiempo actual:', new Date().toLocaleString());
      } catch (e) {
        console.error('❌ [ClienteService] Error decodificando token:', e);
      }
    } else {
      console.error('❌ [ClienteService] No hay token en localStorage');
    }

    const response = await apiClient.post<ApiResponse<ClienteResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosClientes(): Promise<ApiResponse<ClienteResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<ClienteResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerClientePorId(id: number): Promise<ApiResponse<ClienteResponseDTO>> {
    const response = await apiClient.get<ApiResponse<ClienteResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarCliente(id: number, data: ClienteUpdateDTO): Promise<ApiResponse<ClienteResponseDTO>> {
    const response = await apiClient.put<ApiResponse<ClienteResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarCliente(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async buscarClientes(criteria: ClienteSearchCriteria): Promise<ApiResponse<ClienteResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<ClienteResponseDTO[]>>(
      `${this.BASE_PATH}/buscar`,
      { params: criteria }
    );
    return response.data;
  }

  static async activarCliente(id: number): Promise<ApiResponse<ClienteResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<ClienteResponseDTO>>(
      `${this.BASE_PATH}/${id}/activar`
    );
    return response.data;
  }

  static async desactivarCliente(id: number): Promise<ApiResponse<ClienteResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<ClienteResponseDTO>>(
      `${this.BASE_PATH}/${id}/desactivar`
    );
    return response.data;
  }

  // ============ Métodos helper ============

  /**
   * Obtener todos los clientes (devuelve solo el data)
   */
  static async obtenerTodos(): Promise<ClienteResponseDTO[]> {
    const response = await this.obtenerTodosLosClientes();
    return response.data || [];
  }
}
