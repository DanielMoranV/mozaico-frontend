import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  ReservaResponseDTO,
  ReservaRequestDTO,
  ReservaUpdateDTO,
  ReservaSearchParams,
  EstadoReserva,
  DisponibilidadRequestDTO,
  DisponibilidadResponseDTO,
} from '@/types/reserva';

export class ReservaService {
  private static readonly BASE_PATH = '/reservas';

  /**
   * Crear una nueva reserva
   */
  static async crear(data: ReservaRequestDTO): Promise<ReservaResponseDTO> {
    const response = await apiClient.post<ApiResponse<ReservaResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data.data!;
  }

  /**
   * Obtener todas las reservas de la empresa
   */
  static async obtenerTodas(): Promise<ReservaResponseDTO[]> {
    const response = await apiClient.get<ApiResponse<ReservaResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data.data!;
  }

  /**
   * Obtener una reserva por ID
   */
  static async obtenerPorId(id: number): Promise<ReservaResponseDTO> {
    const response = await apiClient.get<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data.data!;
  }

  /**
   * Actualizar una reserva existente
   */
  static async actualizar(id: number, data: ReservaUpdateDTO): Promise<ReservaResponseDTO> {
    const response = await apiClient.put<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data.data!;
  }

  /**
   * Eliminar una reserva
   */
  static async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Cambiar el estado de una reserva
   */
  static async cambiarEstado(id: number, nuevoEstado: EstadoReserva): Promise<ReservaResponseDTO> {
    const response = await apiClient.patch<ApiResponse<ReservaResponseDTO>>(
      `${this.BASE_PATH}/${id}/estado`,
      null,
      {
        params: { nuevoEstado }
      }
    );
    return response.data.data!;
  }

  /**
   * Buscar reservas con filtros
   */
  static async buscar(params: ReservaSearchParams): Promise<ReservaResponseDTO[]> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<ReservaResponseDTO[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data.data!;
  }

  /**
   * Consultar disponibilidad de mesas
   */
  static async consultarDisponibilidad(data: DisponibilidadRequestDTO): Promise<DisponibilidadResponseDTO> {
    const response = await apiClient.post<ApiResponse<DisponibilidadResponseDTO>>(
      `${this.BASE_PATH}/disponibilidad`,
      data
    );
    return response.data.data!;
  }

  // ============ Métodos legacy para compatibilidad ============

  /**
   * @deprecated Usar crear() en su lugar
   */
  static async crearReserva(data: ReservaRequestDTO): Promise<ApiResponse<ReservaResponseDTO>> {
    const reserva = await this.crear(data);
    return {
      success: true,
      message: 'Reserva creada exitosamente',
      data: reserva
    };
  }

  /**
   * @deprecated Usar obtenerTodas() en su lugar
   */
  static async obtenerTodasLasReservas(): Promise<ApiResponse<ReservaResponseDTO[]>> {
    const reservas = await this.obtenerTodas();
    return {
      success: true,
      message: 'Reservas obtenidas exitosamente',
      data: reservas
    };
  }

  /**
   * @deprecated Usar obtenerPorId() en su lugar
   */
  static async obtenerReservaPorId(id: number): Promise<ApiResponse<ReservaResponseDTO>> {
    const reserva = await this.obtenerPorId(id);
    return {
      success: true,
      message: 'Reserva obtenida exitosamente',
      data: reserva
    };
  }

  /**
   * @deprecated Usar actualizar() en su lugar
   */
  static async actualizarReserva(id: number, data: ReservaRequestDTO): Promise<ApiResponse<ReservaResponseDTO>> {
    const reserva = await this.actualizar(id, data);
    return {
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: reserva
    };
  }

  /**
   * @deprecated Usar eliminar() en su lugar
   */
  static async eliminarReserva(id: number): Promise<ApiResponse<null>> {
    await this.eliminar(id);
    return {
      success: true,
      message: 'Reserva eliminada exitosamente',
      data: null
    };
  }

  /**
   * @deprecated Usar cambiarEstado() en su lugar
   */
  static async actualizarEstadoReserva(id: number, nuevoEstado: EstadoReserva): Promise<ApiResponse<ReservaResponseDTO>> {
    const reserva = await this.cambiarEstado(id, nuevoEstado);
    return {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: reserva
    };
  }

  /**
   * @deprecated Usar buscar() en su lugar con parámetros apropiados
   */
  static async buscarReservas(criteria: ReservaSearchParams): Promise<ApiResponse<ReservaResponseDTO[]>> {
    const reservas = await this.buscar(criteria);
    return {
      success: true,
      message: 'Búsqueda realizada exitosamente',
      data: reservas
    };
  }
}
