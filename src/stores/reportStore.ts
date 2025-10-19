import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ReportService } from '@/services/reportService';
import type {
  SalesSummaryResponseDTO,
  ProductSalesResponseDTO,
  LowStockItemResponseDTO,
  ReportSearchParams,
} from '@/types/report';

export const useReportStore = defineStore('report', () => {
  // State
  const salesSummary = ref<SalesSummaryResponseDTO | null>(null);
  const productSales = ref<ProductSalesResponseDTO[]>([]);
  const lowStockInventory = ref<LowStockItemResponseDTO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  // No specific getters for now, as data is directly exposed

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  const fetchSalesSummary = async (params: ReportSearchParams) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReportService.getSalesSummary(params);
      if (response.success && response.data) {
        salesSummary.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar resumen de ventas');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchProductSales = async (params: ReportSearchParams) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReportService.getProductSales(params);
      if (response.success && response.data) {
        productSales.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar ventas por producto');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockInventory = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ReportService.getLowStockInventory();
      if (response.success && response.data) {
        lowStockInventory.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar inventario bajo de stock');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    salesSummary,
    productSales,
    lowStockInventory,
    loading,
    error,
    // Actions
    fetchSalesSummary,
    fetchProductSales,
    fetchLowStockInventory,
    clearError,
  };
});
