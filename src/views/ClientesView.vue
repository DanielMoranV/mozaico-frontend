<template>
  <v-container fluid>
    <v-card>
      <ClientesHeader
        :show-filters="showFilters"
        @crear-cliente="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en nombre, apellido, email, teléfono..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <ClientesFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <ClientesTable
          :clientes="store.clientes"
          :loading="store.loading"
          :headers="headers"
          @editar-cliente="editarCliente"
          @confirmar-eliminar="confirmarEliminar"
          @activar-cliente="activarCliente"
          @desactivar-cliente="desactivarCliente"
        />
      </v-card-text>
    </v-card>

    <ClienteEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-cliente="guardarCliente"
    />

    <ClienteDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :cliente-a-eliminar="clienteAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarClienteConfirmado"
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
import { useClienteStore } from '@/stores/clienteStore';
import type { Cliente, ClienteRequestDTO, ClienteUpdateDTO, ClienteSearchCriteria } from '@/types/cliente';
import ClientesHeader from '@/components/clientes/ClientesHeader.vue';
import ClientesFilters from '@/components/clientes/ClientesFilters.vue';
import ClientesTable from '@/components/clientes/ClientesTable.vue';
import ClienteEditDialog from '@/components/clientes/ClienteEditDialog.vue';
import ClienteDeleteConfirmDialog from '@/components/clientes/ClienteDeleteConfirmDialog.vue';

const store = useClienteStore();

const headers = [
  { title: 'ID', key: 'idCliente', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Apellido', key: 'apellido', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: true },
  { title: 'Activo', key: 'activo', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<ClienteSearchCriteria, 'searchTerm'>>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  activo: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<ClienteRequestDTO>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
});

const clienteIdActual = ref<number | null>(null);
const confirmarDialog = ref(false);
const clienteAEliminar = ref<Cliente | null>(null);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Debe ser un email válido',
};

const cargarClientes = async () => {
  await store.fetchClientes();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const realizarBusqueda = async () => {
  const criteriaToSend: ClienteSearchCriteria = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarClientes();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    activo: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarClientes();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarCliente = (cliente: Cliente) => {
  clienteIdActual.value = cliente.idCliente;
  Object.assign(formulario, {
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    email: cliente.email,
    telefono: cliente.telefono ?? '',
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarCliente = async () => {
  let resultado;
  if (dialogo.editando && clienteIdActual.value) {
    const payload: ClienteUpdateDTO = { ...formulario };
    resultado = await store.actualizarCliente(clienteIdActual.value, payload);
  } else {
    resultado = await store.crearCliente(formulario);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
      'success'
    );
    cerrarDialogo();
    await cargarClientes();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar cliente', 'error');
  }
};

const confirmarEliminar = (cliente: Cliente) => {
  clienteAEliminar.value = cliente;
  confirmarDialog.value = true;
};

const eliminarClienteConfirmado = async () => {
  if (clienteAEliminar.value) {
    const resultado = await store.eliminarCliente(clienteAEliminar.value.idCliente);
    if (resultado.success) {
      mostrarSnackbar('Cliente eliminado exitosamente', 'success');
      await cargarClientes();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar cliente', 'error');
    }
  }
  confirmarDialog.value = false;
  clienteAEliminar.value = null;
};

const activarCliente = async (id: number) => {
  const resultado = await store.activarCliente(id);
  if (resultado.success) {
    mostrarSnackbar('Cliente activado exitosamente', 'success');
  } else {
    mostrarSnackbar(resultado.error || 'Error al activar cliente', 'error');
  }
};

const desactivarCliente = async (id: number) => {
  const resultado = await store.desactivarCliente(id);
  if (resultado.success) {
    mostrarSnackbar('Cliente desactivado exitosamente', 'success');
  } else {
    mostrarSnackbar(resultado.error || 'Error al desactivar cliente', 'error');
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  clienteIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
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
