import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PagoService } from '@/services/pagoService';
import type {
  PagoResponseDTO,
  PagoRequestDTO,
  PagoSearchParams,
} from '@/types/pago';

export const usePagoStore = defineStore('pago', () => {
  // State
  const pagos = ref<PagoResponseDTO[]>([]);
  const pagoActual = ref<PagoResponseDTO | null>(null);
  const busquedaParams = ref<PagoSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalPagos = computed(() => pagos.value.length);

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

  const fetchPagos = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await PagoService.obtenerTodosLosPagos();
      if (response.status === 'SUCCESS') {
        pagos.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  const crearPago = async (data: PagoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await PagoService.crearPago(data);
      if (response.status === 'SUCCESS') {
        pagos.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarPago = async (id: number, data: PagoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await PagoService.actualizarPago(id, data);
      if (response.status === 'SUCCESS') {
        const index = pagos.value.findIndex((p) => p.idPago === id);
        if (index !== -1) {
          pagos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarPago = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await PagoService.eliminarPago(id);
      if (response.status === 'SUCCESS') {
        pagos.value = pagos.value.filter((p) => p.idPago !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarPagos = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await PagoService.buscarPagos(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        pagos.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar pagos');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: PagoSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    pagos,
    pagoActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalPagos,
    // Actions
    fetchPagos,
    crearPago,
    actualizarPago,
    eliminarPago,
    buscarPagos,
    setBusquedaParams,
    clearError,
  };
});
