import { EstadoReserva } from "./enums";

export { EstadoReserva };

// Request para crear reserva
export interface ReservaRequestDTO {
  idCliente: number;              // ID del cliente (requerido)
  idMesa: number;                 // ID de la mesa (requerido)
  fechaHoraReserva: string;       // ISO 8601 format: "2025-01-20T19:00:00" (requerido, futuro o presente)
  numeroPersonas: number;         // Cantidad de personas (requerido, mínimo 1)
  observaciones?: string;         // Notas adicionales (opcional)
  estado?: EstadoReserva;         // Por defecto: PENDIENTE (opcional)
}

// Request para actualizar reserva
export interface ReservaUpdateDTO {
  idCliente?: number;
  idMesa?: number;
  fechaHoraReserva?: string;      // ISO 8601 format
  numeroPersonas?: number;
  observaciones?: string;
  estado?: EstadoReserva;
}

// Response de reserva
export interface ReservaResponseDTO {
  idReserva: number;
  cliente: ClienteBasicoDTO;
  mesa: MesaBasicaDTO;
  fechaHoraReserva: string;       // ISO 8601 format
  numeroPersonas: number;
  estado: EstadoReserva;
  observaciones?: string;
  fechaCreacion: string;          // ISO 8601 format
}

export interface ClienteBasicoDTO {
  idCliente: number;
  nombre: string;
  apellido?: string;
}

export interface MesaBasicaDTO {
  idMesa: number;
  numeroMesa: number;
}

// Request para consultar disponibilidad
export interface DisponibilidadRequestDTO {
  fechaHora: string;              // ISO 8601 format (requerido, futuro o presente)
  numeroPersonas: number;         // Cantidad de personas (requerido, mínimo 1)
  ubicacion?: string;             // Filtro opcional por ubicación de mesa
}

// Response de disponibilidad
export interface DisponibilidadResponseDTO {
  mesasDisponibles: MesaDisponibleDTO[];
  totalDisponibles: number;
}

export interface MesaDisponibleDTO {
  idMesa: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion?: string;
  observaciones?: string;
}

// Parámetros de búsqueda
export interface ReservaSearchParams {
  idCliente?: number;
  idMesa?: number;
  fechaHoraReservaDesde?: string;
  fechaHoraReservaHasta?: string;
  estado?: EstadoReserva;
  numeroPersonas?: number;
  searchTerm?: string;
  logic?: "AND" | "OR";
}
