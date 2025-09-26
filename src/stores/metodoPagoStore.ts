import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MetodoPagoService } from '@/services/metodoPagoService';
import type {
  MetodoPagoResponseDTO,
  MetodoPagoRequestDTO,
} from '@/types/metodoPago';

export const useMetodoPagoStore = defineStore('metodoPago', () => {
  // State
  const metodosPago = ref<MetodoPagoResponseDTO[]>([]);
  const metodoPagoActual = ref<MetodoPagoResponseDTO | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalMetodosPago = computed(() => metodosPago.value.length);

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

  const fetchMetodosPago = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await MetodoPagoService.obtenerTodosLosMetodosPago();
      if (response.status === 'SUCCESS') {
        metodosPago.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const crearMetodoPago = async (data: MetodoPagoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MetodoPagoService.crearMetodoPago(data);
      if (response.status === 'SUCCESS') {
        metodosPago.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear método de pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarMetodoPago = async (id: number, data: MetodoPagoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MetodoPagoService.actualizarMetodoPago(id, data);
      if (response.status === 'SUCCESS') {
        const index = metodosPago.value.findIndex((mp) => mp.idMetodo === id);
        if (index !== -1) {
          metodosPago.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar método de pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarMetodoPago = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await MetodoPagoService.eliminarMetodoPago(id);
      if (response.status === 'SUCCESS') {
        metodosPago.value = metodosPago.value.filter((mp) => mp.idMetodo !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar método de pago');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    metodosPago,
    metodoPagoActual,
    loading,
    error,
    // Getters
    totalMetodosPago,
    // Actions
    fetchMetodosPago,
    crearMetodoPago,
    actualizarMetodoPago,
    eliminarMetodoPago,
    clearError,
  };
});
