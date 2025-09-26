export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
  puntosFidelidad: number;
  fechaRegistro: string;
  activo: boolean;
}

export interface ClienteRequestDTO {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
}

export interface ClienteUpdateDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
}

export interface ClienteResponseDTO {
  idCliente: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
  puntosFidelidad: number;
  fechaRegistro: string;
  activo: boolean;
}

export interface ClienteSearchCriteria {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  searchTerm?: string;
  logic?: "AND" | "OR";
}
