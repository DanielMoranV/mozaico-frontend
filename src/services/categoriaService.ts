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

  static async obtenerTodasLasCategorias(): Promise<ApiResponse<CategoriaResponseDTO[]>> {
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

  static async obtenerCategoriaPorId(id: number): Promise<ApiResponse<CategoriaResponseDTO>> {
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

  static async actualizarCategoria(id: number, data: CategoriaRequestDTO): Promise<ApiResponse<CategoriaResponseDTO>> {
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

  static async eliminarCategoria(id: number): Promise<ApiResponse<null>> {
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
}
