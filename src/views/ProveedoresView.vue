<template>
  <v-container fluid>
    <v-card>
      <ProveedorHeader
        :show-filters="showFilters"
        @crear-proveedor="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar por nombre, contacto, email..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <ProveedorFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <ProveedorTable
          :proveedores="store.proveedores"
          :loading="store.loading"
          :headers="headers"
          @editar-proveedor="editarProveedor"
          @confirmar-eliminar="confirmarEliminar"
        />
      </v-card-text>
    </v-card>

    <ProveedorEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-proveedor="guardarProveedor"
    />

    <ProveedorDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :proveedor-a-eliminar="proveedorAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarProveedorConfirmado"
    />

    <v-snackbar v-model="snackbar.mostrar" :color="snackbar.color" :timeout="3000">
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useProveedorStore } from '@/stores/proveedorStore';
import type { ProveedorResponseDTO, ProveedorRequestDTO, ProveedorSearchParams } from '@/types/proveedor';
import ProveedorHeader from '@/components/proveedores/ProveedorHeader.vue';
import ProveedorFilters from '@/components/proveedores/ProveedorFilters.vue';
import ProveedorTable from '@/components/proveedores/ProveedorTable.vue';
import ProveedorEditDialog from '@/components/proveedores/ProveedorEditDialog.vue';
import ProveedorDeleteConfirmDialog from '@/components/proveedores/ProveedorDeleteConfirmDialog.vue';

const store = useProveedorStore();

const headers = [
  { title: 'ID', key: 'idProveedor', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Contacto', key: 'contacto', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Dirección', key: 'direccion', sortable: true },
  { title: 'Activo', key: 'activo', sortable: true },
  { title: 'Fecha Creación', key: 'fechaCreacion', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<ProveedorSearchParams, 'searchTerm'>>({
  nombre: '',
  contacto: '',
  telefono: '',
  email: '',
  direccion: '',
  activo: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<ProveedorRequestDTO>({
  nombre: '',
  contacto: undefined,
  telefono: undefined,
  email: undefined,
  direccion: undefined,
  activo: true,
});

const proveedorIdActual = ref<number | null>(null);
const proveedorAEliminar = ref<ProveedorResponseDTO | null>(null);
const confirmarDialog = ref(false);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  emailOpcional: (v: string) => !v || /.+@.+\..+/.test(v) || 'Debe ser un email válido',
};

const realizarBusqueda = async () => {
  const criteriaToSend: ProveedorSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarProveedores();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    activo: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarProveedores();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarProveedor = (proveedor: ProveedorResponseDTO) => {
  proveedorIdActual.value = proveedor.idProveedor;
  Object.assign(formulario, {
    nombre: proveedor.nombre,
    contacto: proveedor.contacto,
    telefono: proveedor.telefono,
    email: proveedor.email,
    direccion: proveedor.direccion,
    activo: proveedor.activo,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarProveedor = async () => {
  let resultado;
  if (dialogo.editando && proveedorIdActual.value) {
    const payload: ProveedorRequestDTO = { ...formulario };
    resultado = await store.actualizarProveedor(proveedorIdActual.value, payload);
  } else {
    const payload: ProveedorRequestDTO = { ...formulario };
    resultado = await store.crearProveedor(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar proveedor', 'error');
  }
};

const confirmarEliminar = (proveedor: ProveedorResponseDTO) => {
  proveedorAEliminar.value = proveedor;
  confirmarDialog.value = true;
};

const eliminarProveedorConfirmado = async () => {
  if (proveedorAEliminar.value) {
    const resultado = await store.eliminarProveedor(proveedorAEliminar.value.idProveedor);
    if (resultado.success) {
      mostrarSnackbar('Proveedor eliminado exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar proveedor', 'error');
    }
  }
  confirmarDialog.value = false;
  proveedorAEliminar.value = null;
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  proveedorIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    nombre: '',
    contacto: undefined,
    telefono: undefined,
    email: undefined,
    direccion: undefined,
    activo: true,
  });
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  realizarBusqueda();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
