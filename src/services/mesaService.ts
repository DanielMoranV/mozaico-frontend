import { apiClient } from "./api";
import type { ApiResponse } from "@/types";
import type {
  Mesa,
  MesaRequestDTO,
  MesaUpdateDTO,
  MesaSearchParams,
  EstadoMesa,
} from "@/types/mesa";

export class MesaService {
  private static readonly BASE_PATH = "/mesas";

  static async obtenerTodasLasMesas(): Promise<ApiResponse<Mesa[]>> {
    const response = await apiClient.get<any>(this.BASE_PATH);
    console.log("Respuesta de obtenerTodasLasMesas:", response.data);
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async obtenerMesasConEstadoDetallado(): Promise<ApiResponse<Mesa[]>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/estado-detallado`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async obtenerMesaPorId(id: number): Promise<ApiResponse<Mesa>> {
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

  static async crearMesa(data: MesaRequestDTO): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.post<any>(
      this.BASE_PATH,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async actualizarMesa(
    id: number,
    data: MesaUpdateDTO
  ): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.put<any>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async eliminarMesa(id: number): Promise<ApiResponse<null>> {
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

  static async cambiarEstadoMesa(
    id: number,
    nuevoEstado: EstadoMesa
  ): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.patch<any>(
      `${this.BASE_PATH}/${id}/estado`,
      null,
      {
        params: { nuevoEstado },
      }
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async buscarMesas(
    criteria: MesaSearchParams
  ): Promise<ApiResponse<Mesa[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );

    console.log("Respuesta de buscarMesas:", response.data);

    // Transformar respuesta del backend al formato ApiResponse
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // ============ Métodos helper ============

  /**
   * Obtener todas las mesas (devuelve solo el data)
   */
  static async obtenerTodas(): Promise<Mesa[]> {
    const response = await this.obtenerTodasLasMesas();
    return response.data || [];
  }
}
