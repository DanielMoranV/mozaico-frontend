import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  MetodoPagoResponseDTO,
  MetodoPagoRequestDTO,
} from '@/types/metodoPago';

export class MetodoPagoService {
  private static readonly BASE_PATH = '/metodos-pago';

  static async crearMetodoPago(data: MetodoPagoRequestDTO): Promise<ApiResponse<MetodoPagoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<MetodoPagoResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosMetodosPago(): Promise<ApiResponse<MetodoPagoResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<MetodoPagoResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerMetodoPagoPorId(id: number): Promise<ApiResponse<MetodoPagoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<MetodoPagoResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarMetodoPago(id: number, data: MetodoPagoRequestDTO): Promise<ApiResponse<MetodoPagoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<MetodoPagoResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarMetodoPago(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }
}
