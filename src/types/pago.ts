import { EstadoPago } from "./enums";

export { EstadoPago };

export interface PagoRequestDTO {
  idPedido: number;
  idMetodoPago: number;
  monto: number;
  referencia?: string;
  estado?: EstadoPago;
}

export interface PagoResponseDTO {
  idPago: number;
  pedido: {
    idPedido: number;
    total: number;
  };
  metodoPago: {
    idMetodo: number;
    nombre: string;
  };
  monto: number;
  fechaPago: string; // ISO 8601 date string
  referencia?: string;
  estado: EstadoPago;
}

export interface PagoSearchParams {
  idPedido?: number;
  idMetodoPago?: number;
  estado?: EstadoPago;
  fechaPagoDesde?: string;
  fechaPagoHasta?: string;
  searchTerm?: string; // Global search term
  logic?: "AND" | "OR";
}
