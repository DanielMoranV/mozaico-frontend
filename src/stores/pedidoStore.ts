import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PedidoService } from '@/services/pedidoService';
import type { ApiResponse } from '@/types';
import type {
  Pedido,
  PedidoRequestDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
  EstadoPedido,
} from '@/types/pedido';

export const usePedidoStore = defineStore('pedido', () => {
  // State
  const pedidos = ref<Pedido[]>([]);
  const pedidoActual = ref<Pedido | null>(null);
  const selectedPedidoDetalles = ref<DetallePedido[]>([]); // New state for details
  const busquedaParams = ref<PedidoSearchParams>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalPedidos = computed(() => pedidos.value.length);

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

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.obtenerTodosLosPedidos();
      if (response.status === 'SUCCESS') {
        pedidos.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const crearPedido = async (data: PedidoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.crearPedido(data);
      if (response.status === 'SUCCESS') {
        pedidos.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear pedido');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarPedido = async (id: number, data: PedidoUpdateDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.actualizarPedido(id, data);
      if (response.status === 'SUCCESS') {
        const index = pedidos.value.findIndex((p) => p.idPedido === id);
        if (index !== -1) {
          pedidos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar pedido');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarPedido = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.eliminarPedido(id);
      if (response.status === 'SUCCESS') {
        pedidos.value = pedidos.value.filter((p) => p.idPedido !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar pedido');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoPedido = async (id: number, nuevoEstado: EstadoPedido) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.cambiarEstadoPedido(id, nuevoEstado);
      if (response.status === 'SUCCESS') {
        const index = pedidos.value.findIndex((p) => p.idPedido === id);
        if (index !== -1) {
          pedidos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar estado de pedido');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const buscarPedidos = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.buscarPedidos(busquedaParams.value);
      if (response.status === 'SUCCESS') {
        pedidos.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar pedidos');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: PedidoSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  const fetchSelectedPedidoDetalles = async (pedidoId: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.obtenerDetallesPorPedidoId(pedidoId);
      if (response.status === 'SUCCESS') {
        selectedPedidoDetalles.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar detalles del pedido');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    pedidos,
    pedidoActual,
    selectedPedidoDetalles,
    busquedaParams,
    loading,
    error,
    // Getters
    totalPedidos,
    // Actions
    fetchPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    cambiarEstadoPedido,
    buscarPedidos,
    setBusquedaParams,
    fetchSelectedPedidoDetalles,
    clearError,
  };
});
