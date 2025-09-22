import { TipoUsuario, EstadoUsuario, TipoDocumentoIdentidad } from './enums';

export interface UsuarioRequestDTO {
  nombre: string;
  username: string;
  email: string;
  password?: string;
  tipoUsuario: TipoUsuario;
  tipoDocumentoIdentidad: TipoDocumentoIdentidad;
  numeroDocumento: string;
}

export interface UsuarioResponseDTO {
  idUsuario: number;
  nombre: string;
  username: string;
  email: string;
  tipoUsuario: TipoUsuario;
  estado: EstadoUsuario;
  fechaCreacion: string;
  numeroDocumentoIdentidad: string;
  tipoDocumentoIdentidad: TipoDocumentoIdentidad;
}

export interface UsuarioSearchParams {
  nombre?: string;
  username?: string;
  email?: string;
  tipoUsuario?: TipoUsuario;
  estado?: EstadoUsuario;
  tipoDocumentoIdentidad?: TipoDocumentoIdentidad;
  numeroDocumento?: string;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}