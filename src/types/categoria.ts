export interface CategoriaRequestDTO {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaResponseDTO {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
