import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  InventarioResponseDTO,
  InventarioRequestDTO,
  InventarioUpdateDTO,
  AjustarStockRequestDTO,
  InventarioSearchParams,
} from '@/types/inventario';

export class InventarioService {
  private static readonly BASE_PATH = '/inventario';

  static async crearInventario(data: InventarioRequestDTO): Promise<ApiResponse<InventarioResponseDTO>> {
    const response = await apiClient.post<ApiResponse<InventarioResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodoElInventario(): Promise<ApiResponse<InventarioResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<InventarioResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerInventarioPorId(id: number): Promise<ApiResponse<InventarioResponseDTO>> {
    const response = await apiClient.get<ApiResponse<InventarioResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarInventario(id: number, data: InventarioUpdateDTO): Promise<ApiResponse<InventarioResponseDTO>> {
    const response = await apiClient.put<ApiResponse<InventarioResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarInventario(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async ajustarStock(id: number, data: AjustarStockRequestDTO): Promise<ApiResponse<InventarioResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<InventarioResponseDTO>>(
      `${this.BASE_PATH}/${id}/ajustar-stock`,
      data
    );
    return response.data;
  }

  static async buscarInventario(criteria: InventarioSearchParams): Promise<ApiResponse<InventarioResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<InventarioResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }
}
