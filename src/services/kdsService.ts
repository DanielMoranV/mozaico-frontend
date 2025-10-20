import { apiClient } from "./api";
import type { ApiResponse } from "@/types";
import type { DetallePedidoResponseDTO } from "@/types/detallePedido";
import type { EstadoDetallePedido } from "@/types/enums";

/**
 * Servicio para el Kitchen Display System (KDS)
 * Permite gestionar los estados de preparación de productos en pedidos
 */
export class KDSService {
  private static readonly BASE_PATH = "/kds";

  /**
   * Obtiene todos los productos filtrados por estado de preparación
   * NOTA: Solo muestra productos de pedidos activos (ABIERTO o ATENDIDO)
   * Los pedidos PAGADO o CANCELADO se excluyen automáticamente en el backend
   *
   * @param estado - Estado del detalle de pedido (PEDIDO, EN_PREPARACION, SERVIDO, CANCELADO)
   * @param requierePreparacion - Filtrar solo productos que requieren preparación en cocina (default: true)
   *                              true: Solo productos con requierePreparacion=true (platos cocinados, bebidas preparadas)
   *                              false: TODOS los productos sin filtrar (incluye bebidas embotelladas, snacks, etc.)
   * @returns Lista de detalles de pedido con el estado especificado
   */
  static async obtenerDetallesPorEstado(
    estado: EstadoDetallePedido,
    requierePreparacion: boolean = true
  ): Promise<ApiResponse<DetallePedidoResponseDTO[]>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/detalles`,
      {
        params: {
          estado,
          requierePreparacion
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

  /**
   * Cambia el estado de un detalle de pedido específico
   * @param detalleId - ID del detalle de pedido
   * @param nuevoEstado - Nuevo estado a asignar
   * @returns Detalle de pedido actualizado
   */
  static async cambiarEstadoDetalle(
    detalleId: number,
    nuevoEstado: EstadoDetallePedido
  ): Promise<ApiResponse<DetallePedidoResponseDTO>> {
    const response = await apiClient.put<any>(
      `${this.BASE_PATH}/detalles/${detalleId}/estado`,
      null,
      {
        params: { estado: nuevoEstado },
      }
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  /**
   * Obtiene detalles agrupados por estado para vista de tablero
   * NOTA: Solo muestra productos de pedidos activos (ABIERTO o ATENDIDO)
   *
   * @param requierePreparacion - Filtrar solo productos que requieren preparación (default: true)
   * @returns Objeto con detalles agrupados por cada estado
   */
  static async obtenerTableroCompleto(
    requierePreparacion: boolean = true
  ): Promise<ApiResponse<{
    pedidos: DetallePedidoResponseDTO[];
    enPreparacion: DetallePedidoResponseDTO[];
    listos: DetallePedidoResponseDTO[];
    servidos: DetallePedidoResponseDTO[];
  }>> {
    try {
      const [pedidosRes, enPrepRes, listosRes, servidosRes] = await Promise.all([
        this.obtenerDetallesPorEstado("PEDIDO", requierePreparacion),
        this.obtenerDetallesPorEstado("EN_PREPARACION", requierePreparacion),
        this.obtenerDetallesPorEstado("LISTO", requierePreparacion),
        this.obtenerDetallesPorEstado("SERVIDO", requierePreparacion),
      ]);

      return {
        success: true,
        message: "Tablero KDS obtenido exitosamente",
        data: {
          pedidos: pedidosRes.data || [],
          enPreparacion: enPrepRes.data || [],
          listos: listosRes.data || [],
          servidos: servidosRes.data || [],
        },
      };
    } catch (error: any) {
      throw error;
    }
  }
}
