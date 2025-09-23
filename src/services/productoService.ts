import { apiClient } from './api';
import type {
  ApiResponse,
} from '@/types';
import type {
  ProductoRequestDTO,
  ProductoResponseDTO,
  ProductoUpdateDTO,
  ProductoSearchCriteria,
} from '@/types/producto';

export class ProductoService {
  private static readonly BASE_PATH = '/productos';

  static async crearProducto(data: ProductoRequestDTO): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<ProductoResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosProductos(): Promise<ApiResponse<ProductoResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<ProductoResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerProductoPorId(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<ProductoResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarProducto(id: number, data: ProductoUpdateDTO): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<ProductoResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarProducto(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async buscarProductos(criteria: ProductoSearchCriteria): Promise<ApiResponse<ProductoResponseDTO[]>> {
    const searchParams = new URLSearchParams();

    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<ProductoResponseDTO[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data;
  }

  static async activarProducto(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<ProductoResponseDTO>>(
      `${this.BASE_PATH}/${id}/activar`
    );
    return response.data;
  }

  static async desactivarProducto(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<ProductoResponseDTO>>(
      `${this.BASE_PATH}/${id}/desactivar`
    );
    return response.data;
  }
}
