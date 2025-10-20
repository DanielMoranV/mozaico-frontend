import { apiClient } from "./api";
import type {
  ApiResponse,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  UsuarioSearchParams,
} from "@/types";

export class UsuarioService {
  private static readonly BASE_PATH = "/usuarios";

  // Crear usuario
  static async crearUsuario(
    usuario: UsuarioRequestDTO
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.post<any>(
      this.BASE_PATH,
      usuario
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Obtener todos los usuarios
  static async obtenerUsuarios(): Promise<ApiResponse<UsuarioResponseDTO[]>> {
    const response = await apiClient.get<any>(
      this.BASE_PATH
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Obtener usuario por ID
  static async obtenerUsuarioPorId(
    id: number
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/${id}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Actualizar usuario
  static async actualizarUsuario(
    id: number,
    usuario: UsuarioRequestDTO
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.put<any>(
      `${this.BASE_PATH}/${id}`,
      usuario
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Eliminar usuario
  static async eliminarUsuario(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<any>(
      `${this.BASE_PATH}/${id}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Búsqueda avanzada
  static async buscarUsuarios(
    params: UsuarioSearchParams
  ): Promise<ApiResponse<UsuarioResponseDTO[]>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Activar usuario
  static async activarUsuario(
    id: number
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.patch<any>(
      `${this.BASE_PATH}/${id}/activar`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Desactivar usuario
  static async desactivarUsuario(
    id: number
  ): Promise<ApiResponse<UsuarioResponseDTO>> {
    const response = await apiClient.patch<any>(
      `${this.BASE_PATH}/${id}/desactivar`
    );

    console.log("Usuario desactivado:", response);
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }
}
