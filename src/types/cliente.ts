import { EstadoUsuario } from './enums';

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ClienteRequestDTO {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
}

export interface ClienteUpdateDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  activo?: boolean;
}

export interface ClienteSearchCriteria {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}
