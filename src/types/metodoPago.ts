export interface MetodoPagoRequestDTO {
    nombre: string;
    activo?: boolean;
}

export interface MetodoPagoResponseDTO {
    idMetodo: number;
    nombre: string;
    activo: boolean;
}
