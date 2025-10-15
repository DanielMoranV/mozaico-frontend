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
  idPedido?: number; // Optional for when creating via form, required for API
  idProducto: number;
  cantidad: number;
  observaciones?: string;
}

// Agregar DetallePedidoResponseDTO según especificación
export interface DetallePedidoResponseDTO {
  idDetalle: number;
  pedido?: {
    idPedido: number;
    mesa?: {
      idMesa: number;
      numeroMesa: number;
    };
    cliente?: {
      idCliente: number;
      nombre: string;
      apellido: string;
    };
    empleado?: {
      idUsuario: number;
      nombre: string;
      username: string;
    };
    fechaPedido: string;
    estado: string;
    tipoServicio: string;
    subtotal: number;
    impuestos: number;
    descuento: number;
    total: number;
    observaciones?: string;
    direccionDelivery?: string;
  };
  producto: {
    idProducto: number;
    nombre: string;
    precio: number;
    requierePreparacion?: boolean | null;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observaciones?: string;
  estado: EstadoDetallePedido;
  fechaCreacion: string; // ISO 8601 format - Cuándo se creó el detalle
  fechaEstadoActualizado: string | null; // ISO 8601 format - Cuándo cambió de estado por última vez
}

export interface DetallePedidoUpdateDTO {
  cantidad?: number;
  observaciones?: string;
  estado?: EstadoDetallePedido;
}
