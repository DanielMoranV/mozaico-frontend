import { EstadoCompra } from "./enums";

export { EstadoCompra };

export interface Proveedor {
  idProveedor: number;
  nombre: string;
  // Add other relevant fields for a supplier if needed
}

export interface DetalleCompraRequestDTO {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraRequestDTO {
  idProveedor: number;
  fechaCompra: string; // ISO 8601 date string
  estado: EstadoCompra;
  detalles: DetalleCompraRequestDTO[]; // Lista de detalles de compra
}

export interface DetalleCompraResponseDTO {
  idDetalleCompra: number;
  idCompra: number;
  producto: {
    idProducto: number;
    nombre: string;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CompraResponseDTO {
  idCompra: number;
  proveedor: {
    idProveedor: number;
    nombre: string;
  };
  fechaCompra: string; // ISO 8601 date string
  total: number;
  estado: EstadoCompra;
  fechaCreacion: string; // ISO 8601 date string
  fechaActualizacion: string; // ISO 8601 date string
  detalles: DetalleCompraResponseDTO[];
}

export interface CompraSearchParams {
  idProveedor?: number;
  estado?: EstadoCompra;
  fechaDesde?: string; // ISO 8601 date string
  fechaHasta?: string; // ISO 8601 date string
  searchTerm?: string; // Global search term
  logic?: "AND" | "OR";
}
