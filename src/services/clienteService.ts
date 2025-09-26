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
}
