<template>
  <v-container fluid>
    <UsuariosHeader @crear-usuario="abrirDialogoCrear" />

    <UsuariosFilters />

    <UsuariosTable
      :usuarios="store.usuarios"
      :loading="store.loading"
      :totalUsuarios="store.totalUsuarios"
      :headers="headers"
      @cargar-usuarios="cargarUsuarios"
      @ver-usuario="verUsuario"
      @editar-usuario="editarUsuario"
      @confirmar-eliminar="confirmarEliminar"
    />

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
      @eliminar-confirmado="eliminarUsuario"
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
import type { UsuarioResponseDTO, UsuarioRequestDTO } from "@/types";
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
  await store.buscarUsuarios(); // Use the store's buscarUsuarios directly
  if (store.error) {
    mostrarSnackbar(store.error, "error");
  }
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarUsuario = (usuario: UsuarioResponseDTO) => {
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

  if (dialogo.editando) {
    const usuario = store.usuarios.find(
      (u: UsuarioResponseDTO) =>
        u.username === formulario.username || u.email === formulario.email
    );
    if (usuario) {
      resultado = await store.actualizarUsuario(usuario.idUsuario, formulario);
    }
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
  } else {
    mostrarSnackbar(resultado?.error || "Error al guardar usuario", "error");
  }
};

const confirmarEliminar = (usuario: UsuarioResponseDTO) => {
  usuarioAEliminar.value = usuario;
  confirmarDialog.value = true;
};

const eliminarUsuario = async () => {
  if (usuarioAEliminar.value) {
    const resultado = await store.eliminarUsuario(
      usuarioAEliminar.value.idUsuario
    );
    if (resultado.success) {
      mostrarSnackbar("Usuario eliminado exitosamente", "success");
    } else {
      mostrarSnackbar(resultado.error || "Error al eliminar usuario", "error");
    }
  }
  confirmarDialog.value = false;
  usuarioAEliminar.value = null;
};

const verUsuario = (usuario: UsuarioResponseDTO) => {
  // TODO: Implementar vista detallada del usuario
  mostrarSnackbar(`Ver detalles de ${usuario.nombre} - Próximamente`, "info");
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
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
  store.buscarUsuarios(); // Initial load using the store's search
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>