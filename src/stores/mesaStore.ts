import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MesaService } from '@/services/mesaService';
import type {
  Mesa,
  MesaRequestDTO,
  MesaUpdateDTO,
  MesaSearchParams,
  EstadoMesa,
} from '@/types/mesa';

export const useMesaStore = defineStore('mesa', () => {
  // State
  const mesas = ref<Mesa[]>([]);
  const mesaActual = ref<Mesa | null>(null);
  const busquedaParams = ref<MesaSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalMesas = computed(() => mesas.value.length);

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

  const fetchMesas = async () => {
    try {
      setLoading(true);
      clearError();
      console.log('🔍 [mesaStore] Fetching mesas with detailed state...');
      const response = await MesaService.obtenerMesasConEstadoDetallado();

      if (response.status === 'SUCCESS') {
        const mesasConPedido = response.data.filter(m => m.ultimoPedido);
        console.log('✅ [mesaStore] Loaded', response.data.length, 'mesas,', mesasConPedido.length, 'with active orders');
        mesas.value = response.data;
      } else {
        console.log('❌ [mesaStore] Error in response:', response.message);
        setError(response.message);
      }
    } catch (err: any) {
      console.error('❌ [mesaStore] Exception caught:', err);
      setError(err.response?.data?.message || 'Error al cargar mesas');
    } finally {
      setLoading(false);
    }
  };

  const crearMesa = async (data: MesaRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MesaService.crearMesa(data);
      if (response.status === 'SUCCESS') {
        mesas.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear mesa');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarMesa = async (id: number, data: MesaUpdateDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MesaService.actualizarMesa(id, data);
      if (response.status === 'SUCCESS') {
        const index = mesas.value.findIndex((m) => m.idMesa === id);
        if (index !== -1) {
          mesas.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar mesa');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarMesa = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await MesaService.eliminarMesa(id);
      if (response.status === 'SUCCESS') {
        mesas.value = mesas.value.filter((m) => m.idMesa !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar mesa');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoMesa = async (id: number, nuevoEstado: EstadoMesa) => {
    try {
      setLoading(true);
      clearError();
      const response = await MesaService.cambiarEstadoMesa(id, nuevoEstado);
      if (response.status === 'SUCCESS') {
        const index = mesas.value.findIndex((m) => m.idMesa === id);
        if (index !== -1) {
          mesas.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar estado de mesa');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarMesas = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await MesaService.buscarMesas(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        mesas.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar mesas');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: MesaSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    mesas,
    mesaActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalMesas,
    // Actions
    fetchMesas,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
    cambiarEstadoMesa,
    buscarMesas,
    setBusquedaParams,
    clearError,
  };
});
