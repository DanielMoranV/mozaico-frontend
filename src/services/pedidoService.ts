import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  Pedido,
  PedidoRequestDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
  EstadoPedido,
} from '@/types/pedido';
import type {
  DetallePedido,
  DetallePedidoSearchParams,
} from '@/types/detallePedido';

export class PedidoService {
  private static readonly BASE_PATH = '/pedidos';

  static async obtenerTodosLosPedidos(): Promise<ApiResponse<Pedido[]>> {
    const response = await apiClient.get<ApiResponse<Pedido[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerPedidoPorId(id: number): Promise<ApiResponse<Pedido>> {
    const response = await apiClient.get<ApiResponse<Pedido>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async crearPedido(data: PedidoRequestDTO): Promise<ApiResponse<Pedido>> {
    const response = await apiClient.post<ApiResponse<Pedido>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async actualizarPedido(id: number, data: PedidoUpdateDTO): Promise<ApiResponse<Pedido>> {
    const response = await apiClient.put<ApiResponse<Pedido>>(
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

  static async cambiarEstadoPedido(id: number, nuevoEstado: EstadoPedido): Promise<ApiResponse<Pedido>> {
    const response = await apiClient.patch<ApiResponse<Pedido>>(
      `${this.BASE_PATH}/${id}/estado`, null, {
        params: { nuevoEstado }
      }
    );
    return response.data;
  }

  static async buscarPedidos(criteria: PedidoSearchParams): Promise<ApiResponse<Pedido[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<Pedido[]>>(
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
}
