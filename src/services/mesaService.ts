import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  Mesa,
  MesaRequestDTO,
  MesaUpdateDTO,
  MesaSearchParams,
  EstadoMesa,
} from '@/types/mesa';

export class MesaService {
  private static readonly BASE_PATH = '/mesas';

  static async obtenerTodasLasMesas(): Promise<ApiResponse<Mesa[]>> {
    const response = await apiClient.get<ApiResponse<Mesa[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerMesaPorId(id: number): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.get<ApiResponse<Mesa>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async crearMesa(data: MesaRequestDTO): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.post<ApiResponse<Mesa>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async actualizarMesa(id: number, data: MesaUpdateDTO): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.put<ApiResponse<Mesa>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarMesa(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async cambiarEstadoMesa(id: number, nuevoEstado: EstadoMesa): Promise<ApiResponse<Mesa>> {
    const response = await apiClient.patch<ApiResponse<Mesa>>(
      `${this.BASE_PATH}/${id}/estado`, null, {
        params: { nuevoEstado }
      }
    );
    return response.data;
  }

  static async buscarMesas(criteria: MesaSearchParams): Promise<ApiResponse<Mesa[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<Mesa[]>>(
      `${this.BASE_PATH}/buscar?${searchParams.toString()}`
    );
    return response.data;
  }
}
