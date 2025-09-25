import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  ProveedorResponseDTO,
  ProveedorRequestDTO,
  ProveedorSearchParams,
} from '@/types/proveedor';

export class ProveedorService {
  private static readonly BASE_PATH = '/proveedores';

  static async crearProveedor(data: ProveedorRequestDTO): Promise<ApiResponse<ProveedorResponseDTO>> {
    const response = await apiClient.post<ApiResponse<ProveedorResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosProveedores(): Promise<ApiResponse<ProveedorResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<ProveedorResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerProveedorPorId(id: number): Promise<ApiResponse<ProveedorResponseDTO>> {
    const response = await apiClient.get<ApiResponse<ProveedorResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarProveedor(id: number, data: ProveedorRequestDTO): Promise<ApiResponse<ProveedorResponseDTO>> {
    const response = await apiClient.put<ApiResponse<ProveedorResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarProveedor(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async buscarProveedores(criteria: ProveedorSearchParams): Promise<ApiResponse<ProveedorResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<ProveedorResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }
}