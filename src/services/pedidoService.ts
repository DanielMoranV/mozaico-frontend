import { apiClient } from "./api";
import type { ApiResponse } from "@/types";
import type {
  PedidoRequestDTO,
  PedidoResponseDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
  EstadoPedido,
} from "@/types/pedido";
import type {
  DetallePedidoRequestDTO,
  DetallePedidoResponseDTO,
  DetallePedidoUpdateDTO,
} from "@/types/detallePedido";

export class PedidoService {
  private static readonly BASE_PATH = "/pedidos";

  static async obtenerTodosLosPedidos(): Promise<
    ApiResponse<PedidoResponseDTO[]>
  > {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerPedidoPorId(
    id: number
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async crearPedido(
    data: PedidoRequestDTO
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async actualizarPedido(
    id: number,
    data: PedidoUpdateDTO
  ): Promise<ApiResponse<PedidoResponseDTO>> {
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

  static async cambiarEstadoPedido(
    id: number,
    nuevoEstado: EstadoPedido
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.patch<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${id}/estado`,
      { estado: nuevoEstado }
    );
    return response.data;
  }

  static async buscarPedidos(
    criteria: PedidoSearchParams
  ): Promise<ApiResponse<PedidoResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<PedidoResponseDTO[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data;
  }

  // Correct endpoints for details management according to documentation
  static async obtenerDetallesPorPedidoId(
    pedidoId: number
  ): Promise<ApiResponse<DetallePedidoResponseDTO[]>> {
    const response = await apiClient.get<
      ApiResponse<DetallePedidoResponseDTO[]>
    >(`/detalles-pedido/pedido/${pedidoId}`);
    console.log("Detalle de pedido del id ", pedidoId, " :", response);
    return response.data;
  }

  static async obtenerDetallePorId(
    detalleId: number
  ): Promise<ApiResponse<DetallePedidoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<DetallePedidoResponseDTO>>(
      `/detalles-pedido/${detalleId}`
    );
    return response.data;
  }

  static async crearDetallePedido(
    detalle: DetallePedidoRequestDTO
  ): Promise<ApiResponse<DetallePedidoResponseDTO>> {
    const response = await apiClient.post<
      ApiResponse<DetallePedidoResponseDTO>
    >(`/detalles-pedido`, detalle);
    return response.data;
  }

  static async actualizarDetallePedido(
    detalleId: number,
    detalle: DetallePedidoUpdateDTO
  ): Promise<ApiResponse<DetallePedidoResponseDTO>> {
    const response = await apiClient.put<ApiResponse<DetallePedidoResponseDTO>>(
      `/detalles-pedido/${detalleId}`,
      detalle
    );
    return response.data;
  }

  static async eliminarDetallePedido(
    detalleId: number
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/detalles-pedido/${detalleId}`
    );
    return response.data;
  }

  // Métodos actualizados para la funcionalidad POS usando endpoints correctos

  // Usar el endpoint GET /api/v1/pedidos/{id} para obtener pedido completo
  static async obtenerPedidoCompleto(
    idPedido: number
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.get<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/${idPedido}`
    );
    return response.data;
  }

  // Usar el nuevo endpoint POST /api/v1/pedidos/completo
  static async crearPedidoCompleto(
    data: {
      idCliente?: number;
      idMesa: number;
      idEmpleado: number;
      tipoServicio: string;
      observaciones?: string;
      direccionDelivery?: string;
      detalles: DetallePedidoRequestDTO[];
    }
  ): Promise<ApiResponse<PedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<PedidoResponseDTO>>(
      `${this.BASE_PATH}/completo`,
      data
    );
    return response.data;
  }

  // Nuevo endpoint para agregar productos a pedido existente
  static async agregarProductoAPedido(
    idPedido: number,
    data: {
      idProducto: number;
      cantidad: number;
      observaciones?: string;
    }
  ): Promise<ApiResponse<DetallePedidoResponseDTO>> {
    const response = await apiClient.post<ApiResponse<DetallePedidoResponseDTO>>(
      `${this.BASE_PATH}/${idPedido}/productos`,
      data
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
