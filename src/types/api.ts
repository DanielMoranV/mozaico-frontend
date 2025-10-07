export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}

// Mantener compatibilidad con el formato anterior si es necesario
export interface LegacyApiResponse<T> {
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