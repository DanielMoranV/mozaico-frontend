import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  Pedido,
  PedidoRequestDTO,
  PedidoResponseDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
  EstadoPedido,
} from '@/types/pedido';
import type {
  DetallePedido,
  DetallePedidoRequestDTO,
} from '@/types/detallePedido';

export class PedidoService {
  private static readonly BASE_PATH = '/pedidos';

  static async obtenerTodosLosPedidos(): Promise<ApiResponse<PedidoResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerPedidoPorId(id: number): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async crearPedido(data: PedidoRequestDTO): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async actualizarPedido(id: number, data: PedidoUpdateDTO): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarPedido(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async cambiarEstadoPedido(id: number, nuevoEstado: EstadoPedido): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${id}/estado`, null, {
        params: { nuevoEstado }
      }
    );
    return response.data;
  }

  static async buscarPedidos(criteria: PedidoSearchParams): Promise<ApiResponse<PedidoResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<PedidoResponseDTO[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data;
  }

  static async obtenerDetallesPorPedidoId(pedidoId: number): Promise<ApiResponse<DetallePedido[]>> {
    const response = await apiClient.get<ApiResponse<DetallePedido[]>>(
      `/detalle-pedidos/buscar?idPedido=${pedidoId}`
    );
    return response.data;
  }

  // Nuevos métodos para la funcionalidad POS

  static async obtenerPedidoActivoPorMesa(idMesa: number): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/mesa/${idMesa}/activo`
    );
    return response.data;
  }

  static async crearPedidoConDetalles(
    pedidoData: PedidoRequestDTO,
    detallesData: DetallePedidoRequestDTO[]
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/con-detalles`,
      { pedido: pedidoData, detalles: detallesData }
    );
    return response.data;
  }

  static async actualizarPedidoConDetalles(
    idPedido: number,
    pedidoData: PedidoRequestDTO,
    detallesData: DetallePedidoRequestDTO[]
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${idPedido}/con-detalles`,
      { pedido: pedidoData, detalles: detallesData }
    );
    return response.data;
  }

  static async agregarDetalleAPedido(
    idPedido: number,
    detalle: DetallePedidoRequestDTO
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${idPedido}/detalles`,
      detalle
    );
    return response.data;
  }

  static async actualizarDetallePedido(
    idPedido: number,
    idDetallePedido: number,
    data: { cantidad?: number; observaciones?: string; }
  ): Promise<ApiResponse<DetallePedido>> {
    const response = await apiClient.patch<ApiResponse<DetallePedido>>(
      `${this.BASE_PATH}/${idPedido}/detalles/${idDetallePedido}`,
      data
    );
    return response.data;
  }

  static async eliminarDetallePedido(
    idPedido: number,
    idDetallePedido: number
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${idPedido}/detalles/${idDetallePedido}`
    );
    return response.data;
  }

  static async finalizarPedido(
    idPedido: number,
    metodoPago: string,
    clienteId?: number
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${idPedido}/finalizar`,
      { metodoPago, clienteId }
    );
    return response.data;
  }
}
