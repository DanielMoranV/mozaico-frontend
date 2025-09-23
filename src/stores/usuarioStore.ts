import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { UsuarioService } from "@/services/usuarioService";
import type {
  UsuarioResponseDTO,
  UsuarioRequestDTO,
  UsuarioSearchParams,
} from "@/types";

export const useUsuarioStore = defineStore("usuario", () => {
  // State
  const usuarios = ref<UsuarioResponseDTO[]>([]);
  const usuarioActual = ref<UsuarioResponseDTO | null>(null);
  const busquedaParams = ref<UsuarioSearchParams>({}); // Initialize with an empty object
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const usuariosActivos = computed(() =>
    usuarios.value.filter(
      (user: UsuarioResponseDTO) => user.estado === "ACTIVO"
    )
  );

  const totalUsuarios = computed(() => usuarios.value.length);

  const usuariosPorTipo = computed(() => {
    const grupos = usuarios.value.reduce(
      (acc: Record<string, number>, user: UsuarioResponseDTO) => {
        acc[user.tipoUsuario] = (acc[user.tipoUsuario] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return grupos;
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

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.obtenerUsuarios();

      if (response.status === "SUCCESS") {
        usuarios.value = response.data;
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar usuarios");
      console.error("Error fetching usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuario por ID
  const fetchUsuarioPorId = async (id: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.obtenerUsuarioPorId(id);

      if (response.status === "SUCCESS") {
        usuarioActual.value = response.data;
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar usuario");
      console.error("Error fetching usuario:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const crearUsuario = async (usuario: UsuarioRequestDTO) => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.crearUsuario(usuario);

      if (response.status === "SUCCESS") {
        usuarios.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al crear usuario";

      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }

      setError(errorMessage);
      console.error("Error creating usuario:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async (id: number, usuario: UsuarioRequestDTO) => {
    try {
      setLoading(true);
      clearError();

      console.log("Actualizar usuario:", id, usuario);

      const response = await UsuarioService.actualizarUsuario(id, usuario);

      console.log("Actualizar response:", response);

      if (response.status === "SUCCESS") {
        const index = usuarios.value.findIndex(
          (u: UsuarioResponseDTO) => u.idUsuario === id
        );
        if (index !== -1) {
          usuarios.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = errorData?.message || "Error al actualizar usuario";

      if (errorData?.errors) {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(", ");
        errorMessage = `${errorMessage}: ${errorDetails}`;
      }

      setError(errorMessage);
      console.error("Error updating usuario:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.eliminarUsuario(id);

      if (response.status === "SUCCESS") {
        usuarios.value = usuarios.value.filter(
          (u: UsuarioResponseDTO) => u.idUsuario !== id
        );
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al eliminar usuario";
      setError(errorMessage);
      console.error("Error deleting usuario:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuarios
  const buscarUsuarios = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.buscarUsuarios(
        busquedaParams.value
      );

      console.log("Busqueda response:", response);

      if (response.status === "SUCCESS") {
        usuarios.value = response.data;
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error en la búsqueda";
      setError(errorMessage);
      console.error("Error searching usuarios:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Activar usuario
  const activarUsuario = async (id: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.activarUsuario(id);

      if (response.status === "SUCCESS") {
        const index = usuarios.value.findIndex((u) => u.idUsuario === id);
        if (index !== -1) {
          usuarios.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al activar usuario";
      setError(errorMessage);
      console.error("Error activating usuario:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Desactivar usuario
  const desactivarUsuario = async (id: number) => {
    try {
      setLoading(true);
      clearError();

      const response = await UsuarioService.desactivarUsuario(id);

      console.log("Desactivar response:", response);

      if (response.status === "SUCCESS") {
        const index = usuarios.value.findIndex((u) => u.idUsuario === id);
        if (index !== -1) {
          usuarios.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al desactivar usuario";
      setError(errorMessage);
      console.error("Error deactivating usuario:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Limpiar usuario actual
  const clearUsuarioActual = () => {
    usuarioActual.value = null;
  };

  // Limpiar todos los usuarios
  const clearUsuarios = () => {
    usuarios.value = [];
    usuarioActual.value = null;
  };

  // Establecer parámetros de búsqueda
  const setBusquedaParams = (params: UsuarioSearchParams) => {
    busquedaParams.value = { ...busquedaParams.value, ...params };
  };

  return {
    // State
    usuarios,
    usuarioActual,
    busquedaParams, // Export busquedaParams
    loading,
    error,
    // Getters
    usuariosActivos,
    totalUsuarios,
    usuariosPorTipo,
    // Actions
    fetchUsuarios,
    fetchUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    buscarUsuarios,
    activarUsuario,
    desactivarUsuario,
    setBusquedaParams, // Export setBusquedaParams
    clearUsuarioActual,
    clearUsuarios,
    clearError,
  };
});
