import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  PagoResponseDTO,
  PagoRequestDTO,
  PagoSearchParams,
} from '@/types/pago';

export class PagoService {
  private static readonly BASE_PATH = '/pagos';

  static async crearPago(data: PagoRequestDTO): Promise<ApiResponse<PagoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PagoResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodosLosPagos(): Promise<ApiResponse<PagoResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<PagoResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerPagoPorId(id: number): Promise<ApiResponse<PagoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<PagoResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarPago(id: number, data: PagoRequestDTO): Promise<ApiResponse<PagoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<PagoResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarPago(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async buscarPagos(criteria: PagoSearchParams): Promise<ApiResponse<PagoResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<PagoResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }
}
