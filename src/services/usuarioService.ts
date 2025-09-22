import { apiClient } from './api';
import type {
  ApiResponse,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  UsuarioSearchParams
} from '@/types';

export class UsuarioService {
  private static readonly BASE_PATH = '/usuarios';

  // Crear usuario
  static async crearUsuario(usuario: UsuarioRequestDTO): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.post<ApiResponse<UsuarioResponseDTO>>(
      this.BASE_PATH,
      usuario
    );
    return response.data;
  }

  // Obtener todos los usuarios
  static async obtenerUsuarios(): Promise<ApiResponse<UsuarioResponseDTO[]>> {
    const response = await apiClient.get<ApiResponse<UsuarioResponseDTO[]>>(this.BASE_PATH);
    return response.data;
  }

  // Obtener usuario por ID
  static async obtenerUsuarioPorId(id: number): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.get<ApiResponse<UsuarioResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  // Actualizar usuario
  static async actualizarUsuario(
    id: number,
    usuario: UsuarioRequestDTO
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.put<ApiResponse<UsuarioResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      usuario
    );
    return response.data;
  }

  // Eliminar usuario
  static async eliminarUsuario(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  // Búsqueda avanzada
  static async buscarUsuarios(params: UsuarioSearchParams): Promise<ApiResponse<UsuarioResponseDTO[]>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<UsuarioResponseDTO[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data;
  }
}