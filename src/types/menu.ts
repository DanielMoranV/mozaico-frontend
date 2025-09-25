import type { ProductoResponseDTO } from './producto';

export interface MenuRequestDTO {
    nombre: string;
    descripcion?: string;
    precio: number;
    disponible?: boolean;
    fechaInicio?: string; // ISO 8601 date string (YYYY-MM-DD)
    fechaFin?: string; // ISO 8601 date string (YYYY-MM-DD)
    productosIds?: number[]; // IDs de productos asociados
}

export interface MenuResponseDTO {
    idMenu: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    disponible: boolean;
    fechaInicio?: string; // ISO 8601 date string (YYYY-MM-DD)
    fechaFin?: string; // ISO 8601 date string (YYYY-MM-DD)
    productos: Array<{
        idProducto: number;
        nombre: string;
    }>; // Lista de productos asociados (simplificado)
}

export interface MenuSearchParams {
    nombre?: string;
    disponible?: boolean;
    fechaInicioDesde?: string;
    fechaInicioHasta?: string;
    fechaFinDesde?: string;
    fechaFinHasta?: string;
    searchTerm?: string; // Global search term
    logic?: 'AND' | 'OR';
}
