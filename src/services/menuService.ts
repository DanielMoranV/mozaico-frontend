import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  MenuResponseDTO,
  MenuRequestDTO,
  MenuSearchParams,
} from '@/types/menu';

export class MenuService {
  private static readonly BASE_PATH = '/menus';

  static async crearMenu(data: MenuRequestDTO): Promise<ApiResponse<MenuResponseDTO>> {
    const response = await apiClient.post<ApiResponse<MenuResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosMenus(): Promise<ApiResponse<MenuResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<MenuResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerMenuPorId(id: number): Promise<ApiResponse<MenuResponseDTO>> {
    const response = await apiClient.get<ApiResponse<MenuResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarMenu(id: number, data: MenuRequestDTO): Promise<ApiResponse<MenuResponseDTO>> {
    const response = await apiClient.put<ApiResponse<MenuResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarMenu(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async agregarProductoAMenu(id: number, productoId: number): Promise<ApiResponse<MenuResponseDTO>> {
    const response = await apiClient.post<ApiResponse<MenuResponseDTO>>(
      `${this.BASE_PATH}/${id}/productos/${productoId}`
    );
    return response.data;
  }

  static async eliminarProductoDeMenu(id: number, productoId: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}/productos/${productoId}`
    );
    return response.data;
  }

  static async buscarMenus(criteria: MenuSearchParams): Promise<ApiResponse<MenuResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<MenuResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }
}
