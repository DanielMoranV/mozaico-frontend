<template>
  <v-container fluid>
    <v-card>
      <UsuariosHeader
        :show-filters="showFilters"
        @crear-usuario="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en nombre, username, email, documento..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <UsuariosFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <UsuariosTable
          :usuarios="store.usuarios"
          :loading="store.loading"
          :totalUsuarios="store.totalUsuarios"
          :headers="headers"
          @cargar-usuarios="cargarUsuarios"
          @ver-usuario="verUsuario"
          @editar-usuario="editarUsuario"
          @confirmar-eliminar="confirmarEliminar"
          @activar-usuario="activarUsuario"
          @desactivar-usuario="desactivarUsuario"
        />
      </v-card-text>
    </v-card>

    <UsuarioEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :tiposUsuarioItems="tiposUsuarioItems"
      :tiposDocumentoItems="tiposDocumentoItems"
      :reglasValidacion="reglasValidacion"
      @guardar-usuario="guardarUsuario"
    />

    <UsuarioDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :usuarioAEliminar="usuarioAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarUsuarioConfirmado"
    />

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.mostrar"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useUsuarioStore } from "@/stores/usuarioStore";
import { TipoUsuario, TipoDocumentoIdentidad } from "@/types";
import type { UsuarioResponseDTO, UsuarioRequestDTO, UsuarioSearchParams } from "@/types";
import UsuariosFilters from "@/components/usuarios/UsuariosFilters.vue";
import UsuariosTable from "@/components/usuarios/UsuariosTable.vue";
import UsuarioEditDialog from "@/components/usuarios/UsuarioEditDialog.vue";
import UsuarioDeleteConfirmDialog from "@/components/usuarios/UsuarioDeleteConfirmDialog.vue";
import UsuariosHeader from "@/components/usuarios/UsuariosHeader.vue";

const store = useUsuarioStore();

// Headers para la tabla
const headers = [
  { title: "ID", key: "idUsuario", sortable: true },
  { title: "Nombre", key: "nombre", sortable: true },
  { title: "Username", key: "username", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Tipo", key: "tipoUsuario", sortable: true },
  { title: "Estado", key: "estado", sortable: true },
  { title: "Fecha Creación", key: "fechaCreacion", sortable: true },
  { title: "Acciones", key: "actions", sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref("");

const searchCriteria = reactive<Omit<UsuarioSearchParams, 'searchTerm'>>({
  nombre: "",
  username: "",
  email: "",
  tipoUsuario: undefined,
  estado: undefined,
  tipoDocumentoIdentidad: undefined,
  numeroDocumento: "",
  logic: "AND",
});

// Items para selects
const tiposUsuarioItems = Object.values(TipoUsuario).map((tipo) => ({
  title: tipo,
  value: tipo,
}));

const tiposDocumentoItems = Object.values(TipoDocumentoIdentidad).map(
  (tipo) => ({
    title: tipo,
    value: tipo,
  })
);

// Dialogo para crear/editar
const dialogo = reactive({
  mostrar: false,
  editando: false,
});

// Formulario
const formulario = reactive<UsuarioRequestDTO>({
  nombre: "",
  username: "",
  email: "",
  password: "",
  tipoUsuario: TipoUsuario.CLIENTE,
  tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI,
  numeroDocumento: "",
});

// Confirmación de eliminación
const confirmarDialog = ref(false);
const usuarioAEliminar = ref<UsuarioResponseDTO | null>(null);
const usuarioIdActual = ref<number | null>(null);

// Snackbar
const snackbar = reactive({
  mostrar: false,
  mensaje: "",
  color: "success",
});

// Reglas de validación
const reglasValidacion = {
  requerido: (v: string) => !!v || "Este campo es requerido",
  email: (v: string) => /.+@.+\..+/.test(v) || "Email debe ser válido",
};

// Métodos
const cargarUsuarios = async () => {
  await store.fetchUsuarios();
  if (store.error) {
    mostrarSnackbar(store.error, "error");
  }
};

const realizarBusqueda = async () => {
  const criteriaToSend: UsuarioSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarUsuarios();
  if (store.error) {
    mostrarSnackbar(store.error, "error");
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = "";
  Object.assign(searchCriteria, {
    nombre: "",
    username: "",
    email: "",
    tipoUsuario: undefined,
    estado: undefined,
    tipoDocumentoIdentidad: undefined,
    numeroDocumento: "",
    logic: "AND",
  });
  store.setBusquedaParams({});
  await store.buscarUsuarios();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarUsuario = (usuario: UsuarioResponseDTO) => {
  usuarioIdActual.value = usuario.idUsuario;
  formulario.nombre = usuario.nombre;
  formulario.username = usuario.username;
  formulario.email = usuario.email;
  formulario.tipoUsuario = usuario.tipoUsuario;
  formulario.tipoDocumentoIdentidad = usuario.tipoDocumentoIdentidad;
  formulario.numeroDocumento = usuario.numeroDocumentoIdentidad;
  formulario.password = undefined;

  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarUsuario = async () => {
  let resultado;

  if (dialogo.editando && usuarioIdActual.value) {
    const payload: Partial<UsuarioRequestDTO> = { ...formulario };
    delete payload.password;
    resultado = await store.actualizarUsuario(usuarioIdActual.value, payload as UsuarioRequestDTO);
  } else {
    resultado = await store.crearUsuario(formulario);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando
        ? "Usuario actualizado exitosamente"
        : "Usuario creado exitosamente",
      "success"
    );
    cerrarDialogo();
    await cargarUsuarios();
  } else {
    mostrarSnackbar(resultado?.error || "Error al guardar usuario", "error");
  }
};

const confirmarEliminar = (usuario: UsuarioResponseDTO) => {
  usuarioAEliminar.value = usuario;
  confirmarDialog.value = true;
};

const eliminarUsuarioConfirmado = async () => {
  if (usuarioAEliminar.value) {
    const resultado = await store.eliminarUsuario(
      usuarioAEliminar.value.idUsuario
    );
    if (resultado.success) {
      mostrarSnackbar("Usuario eliminado exitosamente", "success");
      await cargarUsuarios();
    } else {
      mostrarSnackbar(resultado.error || "Error al eliminar usuario", "error");
    }
  }
  confirmarDialog.value = false;
  usuarioAEliminar.value = null;
};

const activarUsuario = async (id: number) => {
  const resultado = await store.activarUsuario(id);
  if (resultado.success) {
    mostrarSnackbar("Usuario activado exitosamente", "success");
  } else {
    mostrarSnackbar(resultado.error || "Error al activar usuario", "error");
  }
};

const desactivarUsuario = async (id: number) => {
  const resultado = await store.desactivarUsuario(id);
  if (resultado.success) {
    mostrarSnackbar("Usuario desactivado exitosamente", "success");
  } else {
    mostrarSnackbar(resultado.error || "Error al desactivar usuario", "error");
  }
};

const verUsuario = (usuario: UsuarioResponseDTO) => {
  // TODO: Implementar vista detallada del usuario
  mostrarSnackbar(`Ver detalles de ${usuario.nombre} - Próximamente`, "info");
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  usuarioIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  formulario.nombre = "";
  formulario.username = "";
  formulario.email = "";
  formulario.password = "";
  formulario.tipoUsuario = TipoUsuario.CLIENTE;
  formulario.tipoDocumentoIdentidad = TipoDocumentoIdentidad.DNI;
  formulario.numeroDocumento = "";
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

// Cargar usuarios al montar el componente
onMounted(() => {
  realizarBusqueda();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
