export interface ProveedorRequestDTO {
    nombre: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo?: boolean;
}

export interface ProveedorResponseDTO {
    idProveedor: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo: boolean;
    fechaCreacion: string; // ISO 8601 date string
}

export interface ProveedorSearchParams {
    nombre?: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    activo?: boolean;
    searchTerm?: string; // Global search term
    logic?: 'AND' | 'OR';
}
