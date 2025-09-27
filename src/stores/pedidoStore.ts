import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { PedidoService } from "@/services/pedidoService";
import type { ApiResponse } from "@/types";
import type {
  PedidoRequestDTO,
  PedidoResponseDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
} from "@/types/pedido";
import type { EstadoPedido } from "@/types/enums";
import type {
  DetallePedidoRequestDTO,
  DetallePedidoResponseDTO,
} from "@/types/detallePedido";

export const usePedidoStore = defineStore("pedido", () => {
  // State
  const pedidos = ref<PedidoResponseDTO[]>([]);
  const pedidoActual = ref<PedidoResponseDTO | null>(null);
  const selectedPedidoDetalles = ref<DetallePedidoResponseDTO[]>([]); // New state for details
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

      console.log("Respuesta de fetchPedidos:", response);
      if (response.status === "SUCCESS") {
        pedidos.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const crearPedido = async (data: PedidoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.crearPedido(data);
      if (response.status === "SUCCESS") {
        pedidos.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al crear pedido");
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
      if (response.status === "SUCCESS") {
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
      setError(err.response?.data?.message || "Error al actualizar pedido");
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
      if (response.status === "SUCCESS") {
        pedidos.value = pedidos.value.filter((p) => p.idPedido !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar pedido");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Nuevas acciones para la funcionalidad POS

  const fetchPedidoActivoPorMesa = async (
    idMesa: number
  ): Promise<PedidoResponseDTO | null> => {
    try {
      setLoading(true);
      clearError();
      // Asumimos un nuevo endpoint o lógica en el servicio para esto
      const response = await PedidoService.obtenerPedidoActivoPorMesa(idMesa);
      if (response.status === "SUCCESS" && response.data) {
        // Actualizar el estado local si el pedido ya existe
        const index = pedidos.value.findIndex(
          (p) => p.idPedido === response.data.idPedido
        );
        if (index !== -1) {
          pedidos.value[index] = response.data;
        } else {
          pedidos.value.push(response.data);
        }
        return response.data;
      } else if (response.status === "SUCCESS" && !response.data) {
        // No hay pedido activo, retornar null para que se cree uno nuevo en la UI
        return null;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err: any) {
      // Si el error es 404 (no encontrado), significa que no hay pedido activo, lo cual es esperado
      if (err.response?.status === 404) {
        return null;
      }
      setError(err.response?.data?.message || "Error al buscar pedido activo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearOActualizarPedidoConDetalles = async (
    pedidoData: PedidoRequestDTO,
    detallesData: DetallePedidoRequestDTO[],
    idPedidoExistente?: number
  ) => {
    try {
      setLoading(true);
      clearError();
      let response: ApiResponse<PedidoResponseDTO>;

      if (idPedidoExistente) {
        // Actualizar pedido existente
        response = await PedidoService.actualizarPedidoConDetalles(
          idPedidoExistente,
          pedidoData,
          detallesData
        );
      } else {
        // Crear nuevo pedido
        response = await PedidoService.crearPedidoConDetalles(
          pedidoData,
          detallesData
        );
      }

      if (response.status === "SUCCESS") {
        const index = pedidos.value.findIndex(
          (p) => p.idPedido === response.data.idPedido
        );
        if (index !== -1) {
          pedidos.value[index] = response.data;
        } else {
          pedidos.value.push(response.data);
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar pedido");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const agregarProductoAPedido = async (
    idPedido: number,
    detalle: DetallePedidoRequestDTO
  ) => {
    try {
      setLoading(true);
      clearError();
      // Add pedidoId to the detalle object since the new API expects it
      const detalleConPedido = { ...detalle, idPedido };
      const response = await PedidoService.crearDetallePedido(detalleConPedido);
      if (response.status === "SUCCESS") {
        // Refresh the order to get updated details and totals
        const updatedPedidoResponse = await PedidoService.obtenerPedidoPorId(idPedido);
        if (updatedPedidoResponse.status === "SUCCESS") {
          const index = pedidos.value.findIndex((p) => p.idPedido === idPedido);
          if (index !== -1) {
            pedidos.value[index] = updatedPedidoResponse.data;
          }
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al agregar producto");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidadProductoEnPedido = async (
    idPedido: number,
    idDetallePedido: number,
    nuevaCantidad: number
  ) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.actualizarDetallePedido(
        idDetallePedido,
        { cantidad: nuevaCantidad }
      );
      if (response.status === "SUCCESS") {
        // Refresh the order to get updated details and totals
        const updatedPedidoResponse = await PedidoService.obtenerPedidoPorId(idPedido);
        if (updatedPedidoResponse.status === "SUCCESS") {
          const pedidoIndex = pedidos.value.findIndex(
            (p) => p.idPedido === idPedido
          );
          if (pedidoIndex !== -1) {
            pedidos.value[pedidoIndex] = updatedPedidoResponse.data;
          }
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar cantidad");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const eliminarProductoDePedido = async (
    idPedido: number,
    idDetallePedido: number
  ) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.eliminarDetallePedido(idDetallePedido);
      if (response.status === "SUCCESS") {
        // Vuelve a buscar el pedido para obtener los totales actualizados
        const updatedPedidoResponse = await PedidoService.obtenerPedidoPorId(
          idPedido
        );
        if (updatedPedidoResponse.status === "SUCCESS") {
          const pedidoIndex = pedidos.value.findIndex(
            (p) => p.idPedido === idPedido
          );
          if (pedidoIndex !== -1) {
            pedidos.value[pedidoIndex] = updatedPedidoResponse.data;
          }
        }
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar producto");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const finalizarPedido = async (
    idPedido: number,
    metodoPago: string,
    clienteId?: number
  ) => {
    try {
      setLoading(true);
      clearError();
      const response = await PedidoService.finalizarPedido(
        idPedido,
        metodoPago,
        clienteId
      );
      if (response.status === "SUCCESS") {
        const index = pedidos.value.findIndex((p) => p.idPedido === idPedido);
        if (index !== -1) {
          pedidos.value[index] = response.data; // Asumimos que devuelve el pedido actualizado (ej. estado PAGADO)
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al finalizar pedido");
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
      if (response.status === "SUCCESS") {
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
      setError(
        err.response?.data?.message || "Error al cambiar estado de pedido"
      );
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
      console.log("Respuesta de buscarPedidos:", response);
      if (response.status === "SUCCESS") {
        pedidos.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al buscar pedidos");
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
      if (response.status === "SUCCESS") {
        selectedPedidoDetalles.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error al cargar detalles del pedido"
      );
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
    // Acciones para POS
    fetchPedidoActivoPorMesa,
    crearOActualizarPedidoConDetalles,
    agregarProductoAPedido,
    actualizarCantidadProductoEnPedido,
    eliminarProductoDePedido,
    finalizarPedido,
  };
});
