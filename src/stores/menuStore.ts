import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MenuService } from '@/services/menuService';
import type { ApiResponse } from '@/types';
import type {
  MenuResponseDTO,
  MenuRequestDTO,
  MenuSearchParams,
} from '@/types/menu';

export const useMenuStore = defineStore('menu', () => {
  // State
  const menus = ref<MenuResponseDTO[]>([]);
  const menuActual = ref<MenuResponseDTO | null>(null);
  const busquedaParams = ref<MenuSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalMenus = computed(() => menus.value.length);

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

  const fetchMenus = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.obtenerTodosLosMenus();
      if (response.status === 'SUCCESS') {
        menus.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar menús');
    } finally {
      setLoading(false);
    }
  };

  const crearMenu = async (data: MenuRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.crearMenu(data);
      if (response.status === 'SUCCESS') {
        menus.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear menú');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarMenu = async (id: number, data: MenuRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.actualizarMenu(id, data);
      if (response.status === 'SUCCESS') {
        const index = menus.value.findIndex((m) => m.idMenu === id);
        if (index !== -1) {
          menus.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar menú');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarMenu = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.eliminarMenu(id);
      if (response.status === 'SUCCESS') {
        menus.value = menus.value.filter((m) => m.idMenu !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar menú');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const agregarProductoAMenu = async (id: number, productoId: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.agregarProductoAMenu(id, productoId);
      if (response.status === 'SUCCESS') {
        const index = menus.value.findIndex((m) => m.idMenu === id);
        if (index !== -1) {
          menus.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar producto al menú');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarProductoDeMenu = async (id: number, productoId: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.eliminarProductoDeMenu(id, productoId);
      if (response.status === 'SUCCESS') {
        const index = menus.value.findIndex((m) => m.idMenu === id);
        if (index !== -1) {
          menus.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar producto del menú');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarMenus = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await MenuService.buscarMenus(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        menus.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar menús');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: MenuSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    menus,
    menuActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalMenus,
    // Actions
    fetchMenus,
    crearMenu,
    actualizarMenu,
    eliminarMenu,
    agregarProductoAMenu,
    eliminarProductoDeMenu,
    buscarMenus,
    setBusquedaParams,
    clearError,
  };
});
