import { apiClient } from './api';
import type {
  ApiResponse,
} from '@/types';
import type {
  CategoriaRequestDTO,
  CategoriaResponseDTO,
} from '@/types/categoria';

export class CategoriaService {
  private static readonly BASE_PATH = '/categorias'; // Coincide con /api/v1/categorias usando VITE_API_BASE_URL

  static async crearCategoria(data: CategoriaRequestDTO): Promise<ApiResponse<CategoriaResponseDTO>> {
    const response = await apiClient.post<ApiResponse<CategoriaResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodasLasCategorias(): Promise<ApiResponse<CategoriaResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<CategoriaResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerCategoriaPorId(id: number): Promise<ApiResponse<CategoriaResponseDTO>> {
    const response = await apiClient.get<ApiResponse<CategoriaResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarCategoria(id: number, data: CategoriaRequestDTO): Promise<ApiResponse<CategoriaResponseDTO>> {
    const response = await apiClient.put<ApiResponse<CategoriaResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarCategoria(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }
}
