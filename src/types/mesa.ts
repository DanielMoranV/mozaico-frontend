import { EstadoMesa } from './enums';

export interface Mesa {
  idMesa: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion?: string;
  estado: EstadoMesa;
  observaciones?: string;
  fechaCreacion: string;
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
