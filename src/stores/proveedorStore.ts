import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProveedorService } from '@/services/proveedorService';
import type {
  ProveedorResponseDTO,
  ProveedorRequestDTO,
  ProveedorSearchParams,
} from '@/types/proveedor';

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores = ref<ProveedorResponseDTO[]>([]);
  const proveedorActual = ref<ProveedorResponseDTO | null>(null);
  const busquedaParams = ref<ProveedorSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ProveedorService.obtenerTodosLosProveedores();
      if (response.status === 'SUCCESS') {
        proveedores.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const crearProveedor = async (data: ProveedorRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProveedorService.crearProveedor(data);
      if (response.status === 'SUCCESS') {
        proveedores.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear proveedor');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarProveedor = async (id: number, data: ProveedorRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProveedorService.actualizarProveedor(id, data);
      if (response.status === 'SUCCESS') {
        const index = proveedores.value.findIndex((p) => p.idProveedor === id);
        if (index !== -1) {
          proveedores.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar proveedor');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarProveedor = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProveedorService.eliminarProveedor(id);
      if (response.status === 'SUCCESS') {
        proveedores.value = proveedores.value.filter((p) => p.idProveedor !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar proveedor');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarProveedores = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ProveedorService.buscarProveedores(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        proveedores.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: ProveedorSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    proveedores,
    proveedorActual,
    busquedaParams,
    loading,
    error,
    fetchProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    buscarProveedores,
    setBusquedaParams,
    clearError,
  };
});