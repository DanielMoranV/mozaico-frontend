import { EstadoDetallePedido } from "./enums";

export interface DetallePedido {
  idDetallePedido: number;
  producto: {
    idProducto: number;
    nombre: string;
  };
  cantidad: number;
  precioUnitario: number;
  observaciones?: string;
  estado: EstadoDetallePedido;
}

export interface DetallePedidoRequestDTO {
  idProducto: number;
  cantidad: number;
  observaciones?: string;
}

// Agregar DetallePedidoResponseDTO según especificación
export interface DetallePedidoResponseDTO {
  idDetalle: number;
  idPedido: number;
  producto: {
    idProducto: number;
    nombre: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observaciones?: string;
  estado: EstadoDetallePedido;
}

export interface DetallePedidoUpdateDTO {
  cantidad?: number;
  observaciones?: string;
  estado?: EstadoDetallePedido;
}
