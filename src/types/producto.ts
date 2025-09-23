import { CategoriaResponseDTO } from './categoria';

export type EstadoProducto = 'ACTIVO' | 'INACTIVO';

export interface ProductoRequestDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  idCategoria: number;
  tiempoPreparacion?: number;
  disponible?: boolean;
  imagenUrl?: string;
  ingredientes?: string;
  calorias?: number;
  codigoBarras?: string;
  marca?: string;
  presentacion?: string;
  requierePreparacion?: boolean;
  esAlcoholico?: boolean;
  estado?: EstadoProducto;
}

export interface ProductoUpdateDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  idCategoria?: number;
  tiempoPreparacion?: number;
  disponible?: boolean;
  imagenUrl?: string;
  ingredientes?: string;
  calorias?: number;
  codigoBarras?: string;
  marca?: string;
  presentacion?: string;
  requierePreparacion?: boolean;
  esAlcoholico?: boolean;
  estado?: EstadoProducto;
}

export interface ProductoResponseDTO {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: CategoriaResponseDTO;
  tiempoPreparacion?: number;
  disponible: boolean;
  imagenUrl?: string;
  ingredientes?: string;
  calorias?: number;
  codigoBarras?: string;
  marca?: string;
  presentacion?: string;
  requierePreparacion: boolean;
  esAlcoholico: boolean;
  estado: EstadoProducto;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProductoSearchCriteria {
  nombre?: string;
  descripcion?: string;
  idCategoria?: number;
  disponible?: boolean;
  requierePreparacion?: boolean;
  esAlcoholico?: boolean;
  estado?: EstadoProducto;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}
