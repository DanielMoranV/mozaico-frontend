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
    const response = await apiClient.post<any>(
      this.BASE_PATH,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async obtenerTodosLosProveedores(): Promise<ApiResponse<ProveedorResponseDTO[]>> {
    const response = await apiClient.get<any>(
      this.BASE_PATH
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async obtenerProveedorPorId(id: number): Promise<ApiResponse<ProveedorResponseDTO>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/${id}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async actualizarProveedor(id: number, data: ProveedorRequestDTO): Promise<ApiResponse<ProveedorResponseDTO>> {
    const response = await apiClient.put<any>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async eliminarProveedor(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<any>(
      `${this.BASE_PATH}/${id}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async buscarProveedores(criteria: ProveedorSearchParams): Promise<ApiResponse<ProveedorResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<any>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }
}