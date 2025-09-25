import type { Pedido } from './pedido';
import type { ProductoResponseDTO } from './producto';
import { EstadoDetallePedido } from './enums';

export interface DetallePedido {
  idDetalle: number;
  pedido?: Pedido;
  producto?: ProductoResponseDTO;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observaciones?: string;
  estado: EstadoDetallePedido;
}

export interface DetallePedidoRequestDTO {
  idPedido: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
  estado?: EstadoDetallePedido;
}

export interface DetallePedidoUpdateDTO {
  idPedido?: number;
  idProducto?: number;
  cantidad?: number;
  precioUnitario?: number;
  observaciones?: string;
  estado?: EstadoDetallePedido;
}

export interface DetallePedidoSearchParams {
  idPedido?: number;
  idProducto?: number;
  estado?: EstadoDetallePedido;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}
