import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ReservaService } from '@/services/reservaService';
import type {
  ReservaResponseDTO,
  ReservaRequestDTO,
  ReservaSearchParams,
  EstadoReserva,
} from '@/types/reserva';

export const useReservaStore = defineStore('reserva', () => {
  // State
  const reservas = ref<ReservaResponseDTO[]>([]);
  const reservaActual = ref<ReservaResponseDTO | null>(null);
  const busquedaParams = ref<ReservaSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalReservas = computed(() => reservas.value.length);

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

  const fetchReservas = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.obtenerTodasLasReservas();
      if (response.status === 'SUCCESS') {
        reservas.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const crearReserva = async (data: ReservaRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.crearReserva(data);
      if (response.status === 'SUCCESS') {
        reservas.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear reserva');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarReserva = async (id: number, data: ReservaRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.actualizarReserva(id, data);
      if (response.status === 'SUCCESS') {
        const index = reservas.value.findIndex((r) => r.idReserva === id);
        if (index !== -1) {
          reservas.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar reserva');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarReserva = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.eliminarReserva(id);
      if (response.status === 'SUCCESS') {
        reservas.value = reservas.value.filter((r) => r.idReserva !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar reserva');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoReserva = async (id: number, nuevoEstado: EstadoReserva) => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.actualizarEstadoReserva(id, nuevoEstado);
      if (response.status === 'SUCCESS') {
        const index = reservas.value.findIndex((r) => r.idReserva === id);
        if (index !== -1) {
          reservas.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar estado de reserva');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarReservas = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ReservaService.buscarReservas(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        reservas.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar reservas');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: ReservaSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    reservas,
    reservaActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalReservas,
    // Actions
    fetchReservas,
    crearReserva,
    actualizarReserva,
    eliminarReserva,
    actualizarEstadoReserva,
    buscarReservas,
    setBusquedaParams,
    clearError,
  };
});
