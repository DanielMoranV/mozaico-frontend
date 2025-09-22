export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  code: number;
  message: string;
  data: T;
  errors?: any;
}

export interface BusquedaUsuariosParams {
  nombre?: string;
  username?: string;
  email?: string;
  tipoUsuario?: string;
  estado?: string;
  tipoDocumentoIdentidad?: string;
  numeroDocumento?: string;
}