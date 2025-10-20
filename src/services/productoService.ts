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
  private static readonly BASE_PATH = '/productos'; // Coincide con /api/v1/productos usando VITE_API_BASE_URL

  static async crearProducto(data: ProductoRequestDTO): Promise<ApiResponse<ProductoResponseDTO>> {
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

  static async obtenerTodosLosProductos(): Promise<ApiResponse<ProductoResponseDTO[]>> {
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

  static async obtenerProductoPorId(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
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

  static async actualizarProducto(id: number, data: ProductoUpdateDTO): Promise<ApiResponse<ProductoResponseDTO>> {
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

  static async eliminarProducto(id: number): Promise<ApiResponse<null>> {
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

  static async buscarProductos(criteria: ProductoSearchCriteria): Promise<ApiResponse<ProductoResponseDTO[]>> {
    const validCriteria = criteria || {}; // Defensive check
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async activarProducto(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.patch<any>(
      `${this.BASE_PATH}/${id}/activar`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async desactivarProducto(id: number): Promise<ApiResponse<ProductoResponseDTO>> {
    const response = await apiClient.patch<any>(
      `${this.BASE_PATH}/${id}/desactivar`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async uploadProductImage(id: number, imageFile: File): Promise<ApiResponse<ProductoResponseDTO>> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post<any>(
      `${this.BASE_PATH}/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }
}
