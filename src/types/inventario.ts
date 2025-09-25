import type { ProductoResponseDTO } from './producto';
import { TipoAjusteStock } from './enums';

export interface InventarioRequestDTO {
    idProducto: number;
    stockActual: number;
    stockMinimo?: number;
    stockMaximo?: number;
    costoUnitario?: number;
}

export interface InventarioUpdateDTO {
    stockActual?: number;
    stockMinimo?: number;
    stockMaximo?: number;
    costoUnitario?: number;
}

export interface InventarioResponseDTO {
    idInventario: number;
    producto: {
        idProducto: number;
        nombre: string;
    };
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    costoUnitario?: number;
    fechaActualizacion: string; // ISO 8601 date string
}

export interface AjustarStockRequestDTO {
    cantidad: number; // Cantidad a añadir o restar
    tipoAjuste: TipoAjusteStock; // O un enum más descriptivo
}

export interface InventarioSearchParams {
    idProducto?: number;
    stockActualMin?: number;
    stockActualMax?: number;
    stockMinimoMin?: number;
    stockMinimoMax?: number;
    stockMaximoMin?: number;
    stockMaximoMax?: number;
    searchTerm?: string; // Global search term
    logic?: 'AND' | 'OR';
}
