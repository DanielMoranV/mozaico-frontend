import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { InventarioService } from '@/services/inventarioService';
import type {
  InventarioResponseDTO,
  InventarioRequestDTO,
  InventarioUpdateDTO,
  AjustarStockRequestDTO,
  InventarioSearchParams,
} from '@/types/inventario';

export const useInventarioStore = defineStore('inventario', () => {
  // State
  const inventario = ref<InventarioResponseDTO[]>([]);
  const inventarioActual = ref<InventarioResponseDTO | null>(null);
  const busquedaParams = ref<InventarioSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalInventario = computed(() => inventario.value.length);

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

  const fetchInventario = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.obtenerTodoElInventario();
      if (response.success && response.data) {
        inventario.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const crearInventario = async (data: InventarioRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.crearInventario(data);
      if (response.success && response.data) {
        inventario.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear entrada de inventario');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarInventario = async (id: number, data: InventarioUpdateDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.actualizarInventario(id, data);
      if (response.success && response.data) {
        const index = inventario.value.findIndex((i) => i.idInventario === id);
        if (index !== -1) {
          inventario.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar entrada de inventario');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarInventario = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.eliminarInventario(id);
      if (response.success && response.data) {
        inventario.value = inventario.value.filter((i) => i.idInventario !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar entrada de inventario');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const ajustarStock = async (id: number, data: AjustarStockRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.ajustarStock(id, data);
      if (response.success && response.data) {
        const index = inventario.value.findIndex((i) => i.idInventario === id);
        if (index !== -1) {
          inventario.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al ajustar stock');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarInventario = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await InventarioService.buscarInventario(busquedaParams.value);
      if (response.success && response.data) {
        inventario.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar inventario');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: InventarioSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    inventario,
    inventarioActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalInventario,
    // Actions
    fetchInventario,
    crearInventario,
    actualizarInventario,
    eliminarInventario,
    ajustarStock,
    buscarInventario,
    setBusquedaParams,
    clearError,
  };
});
