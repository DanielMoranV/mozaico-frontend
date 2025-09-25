<template>
  <v-container fluid>
    <v-card>
      <MesaHeader
        :show-filters="showFilters"
        @crear-mesa="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en ubicación, observaciones..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <MesaFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <MesaTable
          :mesas="store.mesas"
          :loading="store.loading"
          :headers="headers"
          @editar-mesa="editarMesa"
          @confirmar-eliminar="confirmarEliminar"
          @cambiar-estado="cambiarEstadoMesa"
        />
      </v-card-text>
    </v-card>

    <MesaEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-mesa="guardarMesa"
    />

    <MesaDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :mesa-a-eliminar="mesaAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarMesaConfirmado"
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
import { useMesaStore } from '@/stores/mesaStore';
import { EstadoMesa } from '@/types/enums'; // Import EstadoMesa as a value
import type { Mesa, MesaRequestDTO, MesaUpdateDTO, MesaSearchParams } from '@/types/mesa';
import MesaHeader from '@/components/mesas/MesaHeader.vue';
import MesaFilters from '@/components/mesas/MesaFilters.vue';
import MesaTable from '@/components/mesas/MesaTable.vue';
import MesaEditDialog from '@/components/mesas/MesaEditDialog.vue';
import MesaDeleteConfirmDialog from '@/components/mesas/MesaDeleteConfirmDialog.vue';

const store = useMesaStore();

const headers = [
  { title: 'ID', key: 'idMesa', sortable: true },
  { title: 'Número', key: 'numeroMesa', sortable: true },
  { title: 'Capacidad', key: 'capacidad', sortable: true },
  { title: 'Ubicación', key: 'ubicacion', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Observaciones', key: 'observaciones', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<MesaSearchParams, 'searchTerm'>>({
  numeroMesa: undefined,
  capacidad: undefined,
  ubicacion: '',
  estado: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<MesaRequestDTO>({
  numeroMesa: 0,
  capacidad: 0,
  ubicacion: undefined,
  observaciones: undefined,
  estado: EstadoMesa.DISPONIBLE, // Default state for new mesas
});

const mesaIdActual = ref<number | null>(null);
const confirmarDialog = ref(false);
const mesaAEliminar = ref<Mesa | null>(null);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  numeroPositivo: (v: number) => v > 0 || 'Debe ser un número positivo',
};

const realizarBusqueda = async () => {
  const criteriaToSend: MesaSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarMesas();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    numeroMesa: undefined,
    capacidad: undefined,
    ubicacion: '',
    estado: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarMesas();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarMesa = (mesa: Mesa) => {
  mesaIdActual.value = mesa.idMesa;
  Object.assign(formulario, {
    numeroMesa: mesa.numeroMesa,
    capacidad: mesa.capacidad,
    ubicacion: mesa.ubicacion,
    observaciones: mesa.observaciones,
    estado: mesa.estado,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarMesa = async () => {
  let resultado;
  if (dialogo.editando && mesaIdActual.value) {
    const payload: MesaUpdateDTO = { ...formulario };
    resultado = await store.actualizarMesa(mesaIdActual.value, payload);
  } else {
    const payload: MesaRequestDTO = { ...formulario };
    resultado = await store.crearMesa(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Mesa actualizada exitosamente' : 'Mesa creada exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar mesa', 'error');
  }
};

const confirmarEliminar = (mesa: Mesa) => {
  mesaAEliminar.value = mesa;
  confirmarDialog.value = true;
};

const eliminarMesaConfirmado = async () => {
  if (mesaAEliminar.value) {
    const resultado = await store.eliminarMesa(mesaAEliminar.value.idMesa);
    if (resultado.success) {
      mostrarSnackbar('Mesa eliminada exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar mesa', 'error');
    }
  }
  confirmarDialog.value = false;
  mesaAEliminar.value = null;
};

const cambiarEstadoMesa = async (id: number, nuevoEstado: EstadoMesa) => {
  const resultado = await store.cambiarEstadoMesa(id, nuevoEstado);
  if (resultado.success) {
    mostrarSnackbar(`Estado de mesa ${id} cambiado a ${nuevoEstado} exitosamente`, 'success');
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado.error || 'Error al cambiar estado de mesa', 'error');
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  mesaIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    numeroMesa: 0,
    capacidad: 0,
    ubicacion: undefined,
    observaciones: undefined,
    estado: EstadoMesa.DISPONIBLE,
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
