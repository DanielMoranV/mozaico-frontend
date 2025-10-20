import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  MetodoPagoResponseDTO,
  MetodoPagoRequestDTO,
} from '@/types/metodoPago';

export class MetodoPagoService {
  private static readonly BASE_PATH = '/metodos-pago';

  static async crearMetodoPago(data: MetodoPagoRequestDTO): Promise<ApiResponse<MetodoPagoResponseDTO>> {
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

  static async obtenerTodosLosMetodosPago(): Promise<ApiResponse<MetodoPagoResponseDTO[]>> {
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

  static async obtenerMetodoPagoPorId(id: number): Promise<ApiResponse<MetodoPagoResponseDTO>> {
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

  static async actualizarMetodoPago(id: number, data: MetodoPagoRequestDTO): Promise<ApiResponse<MetodoPagoResponseDTO>> {
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

  static async eliminarMetodoPago(id: number): Promise<ApiResponse<null>> {
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
