import { EstadoReserva } from "./enums";

export { EstadoReserva };

export interface ReservaRequestDTO {
  idCliente: number;
  idMesa: number;
  fechaHoraReserva: string; // ISO 8601 date-time string
  numeroPersonas: number;
  estado?: EstadoReserva;
  observaciones?: string;
}

export interface ReservaResponseDTO {
  idReserva: number;
  cliente: {
    idCliente: number;
    nombre: string;
    apellido: string;
  };
  mesa: {
    idMesa: number;
    numeroMesa: number;
  };
  fechaHoraReserva: string; // ISO 8601 date-time string
  numeroPersonas: number;
  estado: EstadoReserva;
  observaciones?: string;
  fechaCreacion: string; // ISO 8601 date string
}

export interface ReservaSearchParams {
  idCliente?: number;
  idMesa?: number;
  estado?: EstadoReserva;
  fechaReservaDesde?: string; // ISO 8601 date-time string
  fechaReservaHasta?: string; // ISO 8601 date-time string
  searchTerm?: string; // Global search term
  logic?: "AND" | "OR";
}
