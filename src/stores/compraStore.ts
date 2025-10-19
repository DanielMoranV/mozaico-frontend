import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CompraService } from '@/services/compraService';
import type {
  CompraResponseDTO,
  CompraRequestDTO,
  CompraSearchParams,
  DetalleCompraResponseDTO,
} from '@/types/compra';

export const useCompraStore = defineStore('compra', () => {
  // State
  const compras = ref<CompraResponseDTO[]>([]);
  const compraActual = ref<CompraResponseDTO | null>(null);
  const selectedCompraDetalles = ref<DetalleCompraResponseDTO[]>([]);
  const busquedaParams = ref<CompraSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalCompras = computed(() => compras.value.length);

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

  const fetchCompras = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.obtenerTodasLasCompras();
      if (response.success && response.data) {
        compras.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  const crearCompra = async (data: CompraRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.crearCompra(data);
      if (response.success && response.data) {
        compras.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear compra');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarCompra = async (id: number, data: CompraRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.actualizarCompra(id, data);
      if (response.success && response.data) {
        const index = compras.value.findIndex((c) => c.idCompra === id);
        if (index !== -1) {
          compras.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar compra');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarCompra = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.eliminarCompra(id);
      if (response.success && response.data) {
        compras.value = compras.value.filter((c) => c.idCompra !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar compra');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarCompras = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.buscarCompras(busquedaParams.value);
      if (response.success && response.data) {
        compras.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar compras');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedCompraDetalles = async (compraId: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await CompraService.obtenerDetallesPorCompraId(compraId);
      if (response.success && response.data) {
        selectedCompraDetalles.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar detalles de la compra');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: CompraSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    compras,
    compraActual,
    selectedCompraDetalles,
    busquedaParams,
    loading,
    error,
    // Getters
    totalCompras,
    // Actions
    fetchCompras,
    crearCompra,
    actualizarCompra,
    eliminarCompra,
    buscarCompras,
    fetchSelectedCompraDetalles,
    setBusquedaParams,
    clearError,
  };
});
