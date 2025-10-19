import { EstadoMesa, EstadoPedido, TipoServicio } from './enums';

export { EstadoMesa };

// Interfaces para el endpoint detallado
export interface DetallePedidoDetallado {
  idDetalle: number;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  estado: string;
}

export interface UltimoPedido {
  idPedido: number;
  fechaPedido: string;
  estado: EstadoPedido;
  tipoServicio: TipoServicio;
  cliente: string;
  empleado: string;
  total: number;
  detalles: DetallePedidoDetallado[];
}

export interface UltimaReserva {
  idReserva: number;
  fechaHoraReserva: string;
  numeroPersonas: number;
  estado: string;
  cliente: string;
  observaciones: string;
  fechaCreacion: string;
}

export interface Mesa {
  idMesa: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion?: string;
  estado: EstadoMesa;
  observaciones?: string;
  fechaCreacion: string;
  ultimoPedido?: UltimoPedido | null;
  ultimaReserva?: UltimaReserva | null;
  // Campos legacy para compatibilidad
  idPedidoActivo?: number;
  totalPedidoActivo?: number;
}

export interface MesaRequestDTO {
  numeroMesa: number;
  capacidad: number;
  ubicacion?: string;
  observaciones?: string;
  estado?: EstadoMesa;
}

export interface MesaUpdateDTO {
  numeroMesa?: number;
  capacidad?: number;
  ubicacion?: string;
  estado?: EstadoMesa;
  observaciones?: string;
}

export interface MesaSearchParams {
  numeroMesa?: number;
  capacidad?: number;
  ubicacion?: string;
  estado?: EstadoMesa;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}

// Alias para compatibilidad con la API de reservas
export type MesaResponseDTO = Mesa;
