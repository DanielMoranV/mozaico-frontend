import { apiClient } from './api';
import type { ApiResponse } from '@/types';
import type {
  SalesSummaryResponseDTO,
  ProductSalesResponseDTO,
  LowStockItemResponseDTO,
  ReportSearchParams,
} from '@/types/report';

export class ReportService {
  private static readonly BASE_PATH = '/reports';

  static async getSalesSummary(params: ReportSearchParams): Promise<ApiResponse<SalesSummaryResponseDTO>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/sales-summary`,
      { params }
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async getProductSales(params: ReportSearchParams): Promise<ApiResponse<ProductSalesResponseDTO[]>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/product-sales`,
      { params }
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }

  static async getLowStockInventory(): Promise<ApiResponse<LowStockItemResponseDTO[]>> {
    const response = await apiClient.get<any>(
      `${this.BASE_PATH}/low-stock-inventory`
    );
    const backendResponse = response.data;
    return {
      success: backendResponse.status === 'SUCCESS',
      message: backendResponse.message,
      data: backendResponse.data
    };
  }
}
