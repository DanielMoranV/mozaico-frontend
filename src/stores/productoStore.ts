import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ProductoService } from "@/services/productoService";
import type {
  ApiResponse,
} from "@/types";
import type {
  ProductoRequestDTO,
  ProductoResponseDTO,
  ProductoUpdateDTO,
  ProductoSearchCriteria,
} from "@/types/producto";

export const useProductoStore = defineStore("producto", () => {
  // State
  const productos = ref<ProductoResponseDTO[]>([]);
  const productoActual = ref<ProductoResponseDTO | null>(null);
  const busquedaParams = ref<ProductoSearchCriteria>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalProductos = computed(() => productos.value.length);

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

  const fetchProductos = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.obtenerTodosLosProductos();
      if (response.status === "SUCCESS") {
        productos.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al cargar productos";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductoPorId = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.obtenerProductoPorId(id);
      if (response.status === "SUCCESS") {
        productoActual.value = response.data;
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al cargar producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error fetching producto:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearProducto = async (data: ProductoRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.crearProducto(data);
      if (response.status === "SUCCESS") {
        productos.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al crear producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error creating producto:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (id: number, data: ProductoUpdateDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.actualizarProducto(id, data);
      if (response.status === "SUCCESS") {
        const index = productos.value.findIndex((p) => p.idProducto === id);
        if (index !== -1) {
          productos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al actualizar producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error updating producto:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.eliminarProducto(id);
      if (response.status === "SUCCESS") {
        productos.value = productos.value.filter((p) => p.idProducto !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al eliminar producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error deleting producto:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (criteria: ProductoSearchCriteria) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.buscarProductos(criteria);
      if (response.status === "SUCCESS") {
        productos.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al buscar productos";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error searching productos:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const activarProducto = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.activarProducto(id);
      if (response.status === "SUCCESS") {
        const index = productos.value.findIndex((p) => p.idProducto === id);
        if (index !== -1) {
          productos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al activar producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error activating producto:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const desactivarProducto = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.desactivarProducto(id);
      if (response.status === "SUCCESS") {
        const index = productos.value.findIndex((p) => p.idProducto === id);
        if (index !== -1) {
          productos.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al desactivar producto";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error deactivating producto:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadProductImage = async (id: number, imageFile: File) => {
    try {
      setLoading(true);
      clearError();
      const response = await ProductoService.uploadProductImage(id, imageFile);
      if (response.status === "SUCCESS") {
        const index = productos.value.findIndex((p) => p.idProducto === id);
        if (index !== -1) {
          productos.value[index] = response.data;
        }
        if (productoActual.value?.idProducto === id) {
          productoActual.value = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al subir la imagen";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error uploading image:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const setBusquedaParams = (params: ProductoSearchCriteria) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  const clearProductoActual = () => {
    productoActual.value = null;
  };

  const clearProductos = () => {
    productos.value = [];
    productoActual.value = null;
  };

  return {
    // State
    productos,
    productoActual,
    busquedaParams,
    loading,
    error,
    // Getters
    totalProductos,
    // Actions
    fetchProductos,
    fetchProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos,
    activarProducto,
    desactivarProducto,
    uploadProductImage,
    setBusquedaParams,
    clearProductoActual,
    clearProductos,
    clearError,
  };
});
