/**
 * Tipos TypeScript para la Carta Digital Pública
 * Sistema de visualización pública de menús por slug
 */

// Estado de producto (como constante para evitar error con erasableSyntaxOnly)
export type EstadoProducto = 'ACTIVO' | 'INACTIVO';

// Response wrapper genérico del backend
export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  code: number;
  message: string;
  data: T;
  errors?: any;
}

// Información de la empresa
export interface EmpresaDTO {
  nombre: string;
  slug: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  logoUrl: string | null;
  paginaWeb: string | null;
  moneda: string;
}

// Respuesta de la carta con información de empresa
export interface CartaResponseDTO {
  empresa: EmpresaDTO;
  productos: ProductoCartaDTO[];
}

// Categoría de productos
export interface CategoriaResponseDTO {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Producto individual de la carta
export interface ProductoCartaDTO {
  idProducto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: CategoriaResponseDTO;
  tiempoPreparacion: number | null; // Minutos
  disponible: boolean;
  imagenUrl: string | null;
  ingredientes: string | null;
  calorias: number | null;
  codigoBarras: string | null;
  marca: string | null;
  presentacion: string | null;
  requierePreparacion: boolean;
  esAlcoholico: boolean;
  estado: EstadoProducto;
  fechaCreacion: string; // ISO 8601 DateTime
  fechaActualizacion: string; // ISO 8601 DateTime
}

// Agrupación de productos por categoría
export interface ProductosPorCategoria {
  categoria: CategoriaResponseDTO;
  productos: ProductoCartaDTO[];
}

// Filtros para la carta
export interface FiltrosCarta {
  categoriaId: number | null;
  busqueda: string;
  soloDisponibles: boolean;
  ordenarPor: 'nombre' | 'precio' | 'categoria';
}
