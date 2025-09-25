import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  ReservaResponseDTO,
  ReservaRequestDTO,
  ReservaSearchParams,
  EstadoReserva,
} from '@/types/reserva';

export class ReservaService {
  private static readonly BASE_PATH = '/reservas';

  static async crearReserva(data: ReservaRequestDTO): Promise<ApiResponse<ReservaResponseDTO>> {
    const response = await apiClient.post<ApiResponse<ReservaResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodasLasReservas(): Promise<ApiResponse<ReservaResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<ReservaResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerReservaPorId(id: number): Promise<ApiResponse<ReservaResponseDTO>> {
    const response = await apiClient.get<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarReserva(id: number, data: ReservaRequestDTO): Promise<ApiResponse<ReservaResponseDTO>> {
    const response = await apiClient.put<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarReserva(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarEstadoReserva(id: number, nuevoEstado: EstadoReserva): Promise<ApiResponse<ReservaResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}/estado`, null, {
        params: { nuevoEstado }
      }
    );
    return response.data;
  }

  static async buscarReservas(criteria: ReservaSearchParams): Promise<ApiResponse<ReservaResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<ReservaResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }
}
