import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ClienteService } from '@/services/clienteService';
import type {
  ClienteRequestDTO,
  ClienteResponseDTO,
  ClienteUpdateDTO,
  ClienteSearchCriteria,
} from '@/types/cliente';

export const useClienteStore = defineStore('cliente', () => {
  // State
  const clientes = ref<ClienteResponseDTO[]>([]);
  const clienteActual = ref<ClienteResponseDTO | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalClientes = computed(() => clientes.value.length);

  const clientesFormateados = computed(() => {
    return clientes.value.map(cliente => {
      let nombreCompleto = '';

      // Si es persona jurídica, usar razón social o nombre comercial
      if (cliente.tipoPersona === 'JURIDICA') {
        nombreCompleto = cliente.razonSocial || cliente.nombreComercial || cliente.nombre;
      } else {
        // Si es persona natural, concatenar nombre y apellido
        nombreCompleto = cliente.nombre;
        if (cliente.apellido) {
          nombreCompleto += ` ${cliente.apellido}`;
        }
      }

      return {
        ...cliente,
        nombreCompleto
      };
    });
  });

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

  const fetchClientes = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.obtenerTodosLosClientes();
      if (response.success && response.data) {
        clientes.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const crearCliente = async (data: ClienteRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.crearCliente(data);
      if (response.success && response.data) {
        clientes.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear cliente');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarCliente = async (id: number, data: ClienteUpdateDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.actualizarCliente(id, data);
      if (response.success && response.data) {
        const index = clientes.value.findIndex((c) => c.idCliente === id);
        if (index !== -1) {
          clientes.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar cliente');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarCliente = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.eliminarCliente(id);
      if (response.success && response.data) {
        clientes.value = clientes.value.filter((c) => c.idCliente !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar cliente');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarClientes = async (criteria: ClienteSearchCriteria) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.buscarClientes(criteria);
      if (response.success && response.data) {
        clientes.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar clientes');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const activarCliente = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.activarCliente(id);
      if (response.success && response.data) {
        const index = clientes.value.findIndex((c) => c.idCliente === id);
        if (index !== -1) {
          clientes.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al activar cliente');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const desactivarCliente = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ClienteService.desactivarCliente(id);
      if (response.success && response.data) {
        const index = clientes.value.findIndex((c) => c.idCliente === id);
        if (index !== -1) {
          clientes.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al desactivar cliente');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    clientes,
    clienteActual,
    loading,
    error,
    // Getters
    totalClientes,
    clientesFormateados,
    // Actions
    fetchClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarClientes,
    activarCliente,
    desactivarCliente,
    clearError,
  };
});
