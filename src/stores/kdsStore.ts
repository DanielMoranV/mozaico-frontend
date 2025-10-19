import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { KDSService } from "@/services/kdsService";
import type { DetallePedidoResponseDTO } from "@/types/detallePedido";
import type { EstadoDetallePedido } from "@/types/enums";

export const useKDSStore = defineStore("kds", () => {
  // State
  const detallesPedido = ref<DetallePedidoResponseDTO[]>([]);
  const detallesEnPreparacion = ref<DetallePedidoResponseDTO[]>([]);
  const detallesListos = ref<DetallePedidoResponseDTO[]>([]);
  const detallesServidos = ref<DetallePedidoResponseDTO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const autoRefreshEnabled = ref(true);
  const refreshInterval = ref<number | null>(null);
  const filtroRequierePreparacion = ref(true); // Por defecto solo productos que requieren preparación

  // Getters con ordenamiento defensivo
  // PEDIDO y EN_PREPARACION: Más antiguo primero (FIFO - First In First Out)
  // LISTO: Más nuevo primero (LIFO - Last In First Out) - Mostrar recién terminados arriba
  // SERVIDO: Más nuevo primero (DESC) - Ver últimos productos entregados

  const totalPedidos = computed(() => detallesPedido.value.length);
  const totalEnPreparacion = computed(() => detallesEnPreparacion.value.length);
  const totalListos = computed(() => detallesListos.value.length);
  const totalServidos = computed(() => detallesServidos.value.length);

  // Detalles ordenados según la documentación
  const detallesPedidoOrdenados = computed(() => {
    return [...detallesPedido.value].sort((a, b) => {
      const dateA = new Date(a.fechaCreacion).getTime();
      const dateB = new Date(b.fechaCreacion).getTime();
      return dateA - dateB; // Más antiguo primero (FIFO)
    });
  });

  const detallesEnPreparacionOrdenados = computed(() => {
    return [...detallesEnPreparacion.value].sort((a, b) => {
      const dateA = new Date(a.fechaCreacion).getTime();
      const dateB = new Date(b.fechaCreacion).getTime();
      return dateA - dateB; // Más antiguo primero (FIFO)
    });
  });

  const detallesListosOrdenados = computed(() => {
    return [...detallesListos.value].sort((a, b) => {
      // Ordenar por fechaEstadoActualizado si existe, sino por fechaCreacion
      const dateA = new Date(
        a.fechaEstadoActualizado || a.fechaCreacion
      ).getTime();
      const dateB = new Date(
        b.fechaEstadoActualizado || b.fechaCreacion
      ).getTime();
      return dateB - dateA; // Más nuevo primero (LIFO)
    });
  });

  const detallesServidosOrdenados = computed(() => {
    return [...detallesServidos.value].sort((a, b) => {
      // Ordenar por fechaEstadoActualizado si existe, sino por fechaCreacion
      const dateA = new Date(
        a.fechaEstadoActualizado || a.fechaCreacion
      ).getTime();
      const dateB = new Date(
        b.fechaEstadoActualizado || b.fechaCreacion
      ).getTime();
      return dateB - dateA; // Más nuevo primero (DESC)
    });
  });

  // Agrupar por mesa para mejor visualización
  const detallesPorMesa = computed(() => {
    const grouped = new Map<number, DetallePedidoResponseDTO[]>();

    detallesPedido.value.forEach((detalle) => {
      const mesaId = detalle.pedido?.mesa?.idMesa || 0;
      if (!grouped.has(mesaId)) {
        grouped.set(mesaId, []);
      }
      grouped.get(mesaId)?.push(detalle);
    });

    return Array.from(grouped.entries()).map(([mesaId, detalles]) => ({
      mesaId,
      numeroMesa: detalles[0]?.pedido?.mesa?.numeroMesa || 0,
      detalles,
    }));
  });

  const detallesEnPreparacionPorMesa = computed(() => {
    const grouped = new Map<number, DetallePedidoResponseDTO[]>();

    detallesEnPreparacion.value.forEach((detalle) => {
      const mesaId = detalle.pedido?.mesa?.idMesa || 0;
      if (!grouped.has(mesaId)) {
        grouped.set(mesaId, []);
      }
      grouped.get(mesaId)?.push(detalle);
    });

    return Array.from(grouped.entries()).map(([mesaId, detalles]) => ({
      mesaId,
      numeroMesa: detalles[0]?.pedido?.mesa?.numeroMesa || 0,
      detalles,
    }));
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

  /**
   * Obtiene detalles por estado específico
   * NOTA: Solo muestra productos de pedidos activos (ABIERTO o ATENDIDO)
   */
  const fetchDetallesPorEstado = async (
    estado: EstadoDetallePedido,
    requierePreparacion?: boolean
  ) => {
    try {
      setLoading(true);
      clearError();
      const filtro =
        requierePreparacion !== undefined
          ? requierePreparacion
          : filtroRequierePreparacion.value;
      const response = await KDSService.obtenerDetallesPorEstado(
        estado,
        filtro
      );

      if (response.success && response.data) {
        switch (estado) {
          case "PEDIDO":
            detallesPedido.value = response.data;
            break;
          case "EN_PREPARACION":
            detallesEnPreparacion.value = response.data;
            break;
          case "LISTO":
            detallesListos.value = response.data;
            break;
          case "SERVIDO":
            detallesServidos.value = response.data;
            break;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al cargar detalles";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga todo el tablero (todos los estados activos)
   * NOTA: Solo muestra productos de pedidos activos (ABIERTO o ATENDIDO)
   */
  const fetchTableroCompleto = async (requierePreparacion?: boolean) => {
    try {
      setLoading(true);
      clearError();
      const filtro =
        requierePreparacion !== undefined
          ? requierePreparacion
          : filtroRequierePreparacion.value;

      // Cargar el tablero completo con el filtro del usuario
      const response = await KDSService.obtenerTableroCompleto(filtro);

      if (response.success && response.data) {
        detallesPedido.value = response.data.pedidos;
        detallesEnPreparacion.value = response.data.enPreparacion;
        detallesListos.value = response.data.listos;
        detallesServidos.value = response.data.servidos;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Error al cargar tablero KDS";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia el estado de un detalle de pedido
   */
  const cambiarEstadoDetalle = async (
    detalleId: number,
    nuevoEstado: EstadoDetallePedido
  ) => {
    try {
      clearError();
      const response = await KDSService.cambiarEstadoDetalle(
        detalleId,
        nuevoEstado
      );

      if (response.success && response.data) {
        // Actualizar el estado local moviendo el detalle entre listas
        await fetchTableroCompleto();
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al cambiar estado";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Marca un pedido como en preparación
   */
  const iniciarPreparacion = async (detalleId: number) => {
    return await cambiarEstadoDetalle(detalleId, "EN_PREPARACION");
  };

  /**
   * Marca un producto como listo (cocina terminó)
   */
  const marcarComoListo = async (detalleId: number) => {
    return await cambiarEstadoDetalle(detalleId, "LISTO");
  };

  /**
   * Marca un producto como servido (mesero entregó)
   */
  const marcarComoServido = async (detalleId: number) => {
    return await cambiarEstadoDetalle(detalleId, "SERVIDO");
  };

  /**
   * Cancela un producto
   */
  const cancelarProducto = async (detalleId: number) => {
    return await cambiarEstadoDetalle(detalleId, "CANCELADO");
  };

  /**
   * Cambiar filtro de productos que requieren preparación
   */
  const setFiltroRequierePreparacion = (valor: boolean) => {
    filtroRequierePreparacion.value = valor;
  };

  /**
   * Habilitar actualización automática
   */
  const enableAutoRefresh = (intervalMs: number = 30000) => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
    }

    autoRefreshEnabled.value = true;
    refreshInterval.value = window.setInterval(() => {
      if (autoRefreshEnabled.value) {
        fetchTableroCompleto();
      }
    }, intervalMs);
  };

  /**
   * Deshabilitar actualización automática
   */
  const disableAutoRefresh = () => {
    autoRefreshEnabled.value = false;
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
  };

  /**
   * Limpiar store
   */
  const resetStore = () => {
    detallesPedido.value = [];
    detallesEnPreparacion.value = [];
    detallesListos.value = [];
    detallesServidos.value = [];
    error.value = null;
    disableAutoRefresh();
  };

  return {
    // State (versiones ordenadas para usar en los componentes)
    detallesPedido: detallesPedidoOrdenados,
    detallesEnPreparacion: detallesEnPreparacionOrdenados,
    detallesListos: detallesListosOrdenados,
    detallesServidos: detallesServidosOrdenados,
    loading,
    error,
    autoRefreshEnabled,
    filtroRequierePreparacion,

    // Getters
    totalPedidos,
    totalEnPreparacion,
    totalListos,
    totalServidos,
    detallesPorMesa,
    detallesEnPreparacionPorMesa,

    // Actions
    fetchDetallesPorEstado,
    fetchTableroCompleto,
    cambiarEstadoDetalle,
    iniciarPreparacion,
    marcarComoListo,
    marcarComoServido,
    cancelarProducto,
    setFiltroRequierePreparacion,
    enableAutoRefresh,
    disableAutoRefresh,
    resetStore,
    clearError,
  };
});
