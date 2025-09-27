import { apiClient } from "./api";
import type { ApiResponse } from "@/types";
import type {
  CompraResponseDTO,
  CompraRequestDTO,
  CompraSearchParams,
  DetalleCompraResponseDTO,
  DetalleCompraRequestDTO,
} from "@/types/compra";

export class CompraService {
  private static readonly BASE_PATH = "/compras";
  private static readonly DETALLES_PATH = "/detalles";

  static async crearCompra(
    data: CompraRequestDTO
  ): Promise<ApiResponse<CompraResponseDTO>> {
    const response = await apiClient.post<ApiResponse<CompraResponseDTO>>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  static async obtenerTodasLasCompras(): Promise<
    ApiResponse<CompraResponseDTO[]>
  > {
    const response = await apiClient.get<ApiResponse<CompraResponseDTO[]>>(
      this.BASE_PATH
    );
    return response.data;
  }

  static async obtenerCompraPorId(
    id: number
  ): Promise<ApiResponse<CompraResponseDTO>> {
    const response = await apiClient.get<ApiResponse<CompraResponseDTO>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async actualizarCompra(
    id: number,
    data: CompraRequestDTO
  ): Promise<ApiResponse<CompraResponseDTO>> {
    const response = await apiClient.put<ApiResponse<CompraResponseDTO>>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async eliminarCompra(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async buscarCompras(
    criteria: CompraSearchParams
  ): Promise<ApiResponse<CompraResponseDTO[]>> {
    const validCriteria = criteria || {};
    const searchParams = new URLSearchParams();

    Object.entries(validCriteria).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApiResponse<CompraResponseDTO[]>>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    return response.data;
  }

  // Detalles de Compra
  static async obtenerDetallesPorCompraId(
    compraId: number
  ): Promise<ApiResponse<DetalleCompraResponseDTO[]>> {
    const response = await apiClient.get<
      ApiResponse<DetalleCompraResponseDTO[]>
    >(`${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}`);
    return response.data;
  }

  static async agregarDetalleACompra(
    compraId: number,
    data: DetalleCompraRequestDTO
  ): Promise<ApiResponse<DetalleCompraResponseDTO>> {
    const response = await apiClient.post<
      ApiResponse<DetalleCompraResponseDTO>
    >(`${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}`, data);
    return response.data;
  }

  static async actualizarDetalleCompra(
    compraId: number,
    detalleId: number,
    data: DetalleCompraRequestDTO
  ): Promise<ApiResponse<DetalleCompraResponseDTO>> {
    const response = await apiClient.put<ApiResponse<DetalleCompraResponseDTO>>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}/${detalleId}`,
      data
    );
    return response.data;
  }

  static async eliminarDetalleCompra(
    compraId: number,
    detalleId: number
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}/${detalleId}`
    );
    return response.data;
  }
}
