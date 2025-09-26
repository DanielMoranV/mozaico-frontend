import { EstadoMesa } from './enums';

export { EstadoMesa };

export interface Mesa {
  idMesa: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion?: string;
  estado: EstadoMesa;
  observaciones?: string;
  fechaCreacion: string;
  idPedidoActivo?: number; // Nuevo campo para el ID del pedido activo
  totalPedidoActivo?: number; // Nuevo campo para el total del pedido activo
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
