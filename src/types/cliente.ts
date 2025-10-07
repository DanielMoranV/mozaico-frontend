export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
  puntosFidelidad: number;
  fechaRegistro: string;
  activo: boolean;
  // Nuevos campos
  tipoPersona?: 'NATURAL' | 'JURIDICA';
  tipoDocumento?: 'DNI' | 'RUC' | 'CARNET_EXTRANJERIA' | 'PASAPORTE' | 'SIN_DOCUMENTO';
  numeroDocumento?: string;
  razonSocial?: string;
  nombreComercial?: string;
  representanteLegal?: string;
}

export interface ClienteRequestDTO {
  // Datos básicos
  nombre: string;              // Obligatorio
  apellido?: string;           // Opcional (no necesario para empresas)
  email?: string;
  telefono?: string;
  direccion?: string;

  // Tipo de persona
  tipoPersona: 'NATURAL' | 'JURIDICA'; // Default: NATURAL

  // Documento (opcional pero recomendado para facturación)
  tipoDocumento?: 'DNI' | 'RUC' | 'CARNET_EXTRANJERIA' | 'PASAPORTE' | 'SIN_DOCUMENTO';
  numeroDocumento?: string;

  // Persona Natural
  fechaNacimiento?: string;    // ISO format
  preferenciasAlimentarias?: string;

  // Persona Jurídica (obligatorio si tipoPersona = JURIDICA)
  razonSocial?: string;        // Nombre legal de la empresa
  nombreComercial?: string;    // Nombre con el que opera
  representanteLegal?: string; // Nombre del representante
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
  apellido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  preferenciasAlimentarias?: string;
  puntosFidelidad: number;
  fechaRegistro: string;
  activo: boolean;
  // Nuevos campos
  tipoPersona?: 'NATURAL' | 'JURIDICA';
  tipoDocumento?: 'DNI' | 'RUC' | 'CARNET_EXTRANJERIA' | 'PASAPORTE' | 'SIN_DOCUMENTO';
  numeroDocumento?: string;
  razonSocial?: string;
  nombreComercial?: string;
  representanteLegal?: string;
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
