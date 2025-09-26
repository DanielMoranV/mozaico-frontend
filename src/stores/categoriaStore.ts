import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CategoriaService } from "@/services/categoriaService";
import type {
  CategoriaRequestDTO,
  CategoriaResponseDTO,
} from "@/types/categoria";

export const useCategoriaStore = defineStore("categoria", () => {
  // State
  const categorias = ref<CategoriaResponseDTO[]>([]);
  const categoriaActual = ref<CategoriaResponseDTO | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const totalCategorias = computed(() => categorias.value.length);

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

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await CategoriaService.obtenerTodasLasCategorias();
      if (response.status === "SUCCESS") {
        categorias.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al cargar categorías";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error fetching categorías:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriaPorId = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await CategoriaService.obtenerCategoriaPorId(id);
      if (response.status === "SUCCESS") {
        categoriaActual.value = response.data;
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al cargar categoría";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error fetching categoría:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearCategoria = async (data: CategoriaRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await CategoriaService.crearCategoria(data);
      if (response.status === "SUCCESS") {
        categorias.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al crear categoría";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error creating categoría:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const actualizarCategoria = async (id: number, data: CategoriaRequestDTO) => {
    try {
      setLoading(true);
      clearError();
      const response = await CategoriaService.actualizarCategoria(id, data);
      if (response.status === "SUCCESS") {
        const index = categorias.value.findIndex((c) => c.idCategoria === id);
        if (index !== -1) {
          categorias.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al actualizar categoría";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error updating categoría:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id: number) => {
    try {
      setLoading(true);
      clearError();
      const response = await CategoriaService.eliminarCategoria(id);
      if (response.status === "SUCCESS") {
        categorias.value = categorias.value.filter((c) => c.idCategoria !== id);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al eliminar categoría";
      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }
      setError(errorMessage);
      console.error("Error deleting categoría:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCategoriaActual = () => {
    categoriaActual.value = null;
  };

  const clearCategorias = () => {
    categorias.value = [];
    categoriaActual.value = null;
  };

  return {
    // State
    categorias,
    categoriaActual,
    loading,
    error,
    // Getters
    totalCategorias,
    // Actions
    fetchCategorias,
    fetchCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    clearCategoriaActual,
    clearCategorias,
    clearError,
  };
});
