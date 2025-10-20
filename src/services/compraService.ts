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

  static async obtenerTodasLasCompras(): Promise<
    ApiResponse<CompraResponseDTO[]>
  > {
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

  static async obtenerCompraPorId(
    id: number
  ): Promise<ApiResponse<CompraResponseDTO>> {
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

  static async actualizarCompra(
    id: number,
    data: CompraRequestDTO
  ): Promise<ApiResponse<CompraResponseDTO>> {
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

  static async eliminarCompra(id: number): Promise<ApiResponse<null>> {
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

    const response = await apiClient.get<any>(
      `${this.BASE_PATH}?${searchParams.toString()}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  // Detalles de Compra
  static async obtenerDetallesPorCompraId(
    compraId: number
  ): Promise<ApiResponse<DetalleCompraResponseDTO[]>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async agregarDetalleACompra(
    compraId: number,
    data: DetalleCompraRequestDTO
  ): Promise<ApiResponse<DetalleCompraResponseDTO>> {
    const response = await apiClient.post<any>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}`,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async actualizarDetalleCompra(
    compraId: number,
    detalleId: number,
    data: DetalleCompraRequestDTO
  ): Promise<ApiResponse<DetalleCompraResponseDTO>> {
    const response = await apiClient.put<any>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}/${detalleId}`,
      data
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async eliminarDetalleCompra(
    compraId: number,
    detalleId: number
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<any>(
      `${this.BASE_PATH}/${compraId}${this.DETALLES_PATH}/${detalleId}`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }
}
