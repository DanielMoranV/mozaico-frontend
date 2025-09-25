<template>
  <v-container fluid>
    <v-card>
      <ReservaHeader
        :show-filters="showFilters"
        @crear-reserva="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar por cliente, mesa, observaciones..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <ReservaFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <ReservaTable
          :reservas="store.reservas"
          :loading="store.loading"
          :headers="headers"
          @editar-reserva="editarReserva"
          @confirmar-eliminar="confirmarEliminar"
          @actualizar-estado="actualizarEstadoReserva"
        />
      </v-card-text>
    </v-card>

    <ReservaEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-reserva="guardarReserva"
    />

    <ReservaDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :reserva-a-eliminar="reservaAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarReservaConfirmado"
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
import { useReservaStore } from '@/stores/reservaStore';
import { EstadoReserva } from '@/types/enums';
import type { ReservaResponseDTO, ReservaRequestDTO, ReservaSearchParams } from '@/types/reserva';
import ReservaHeader from '@/components/reservas/ReservaHeader.vue';
import ReservaFilters from '@/components/reservas/ReservaFilters.vue';
import ReservaTable from '@/components/reservas/ReservaTable.vue';
import ReservaEditDialog from '@/components/reservas/ReservaEditDialog.vue';
import ReservaDeleteConfirmDialog from '@/components/reservas/ReservaDeleteConfirmDialog.vue';

const store = useReservaStore();

const headers = [
  { title: 'ID', key: 'idReserva', sortable: true },
  { title: 'Cliente', key: 'cliente.nombre', sortable: true },
  { title: 'Mesa', key: 'mesa.numeroMesa', sortable: true },
  { title: 'Fecha/Hora', key: 'fechaHoraReserva', sortable: true },
  { title: 'Personas', key: 'numeroPersonas', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Observaciones', key: 'observaciones', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<ReservaSearchParams, 'searchTerm'>>({
  idCliente: undefined,
  idMesa: undefined,
  estado: undefined,
  fechaReservaDesde: undefined,
  fechaReservaHasta: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<ReservaRequestDTO>({
  idCliente: 0,
  idMesa: 0,
  fechaHoraReserva: new Date().toISOString().slice(0, 16),
  numeroPersonas: 1,
  estado: EstadoReserva.PENDIENTE,
  observaciones: undefined,
});

const reservaIdActual = ref<number | null>(null);
const reservaAEliminar = ref<ReservaResponseDTO | null>(null);
const confirmarDialog = ref(false);

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
  const criteriaToSend: ReservaSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarReservas();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    idCliente: undefined,
    idMesa: undefined,
    estado: undefined,
    fechaReservaDesde: undefined,
    fechaReservaHasta: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarReservas();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarReserva = (reserva: ReservaResponseDTO) => {
  reservaIdActual.value = reserva.idReserva;
  Object.assign(formulario, {
    idCliente: reserva.cliente.idCliente,
    idMesa: reserva.mesa.idMesa,
    fechaHoraReserva: reserva.fechaHoraReserva.slice(0, 16),
    numeroPersonas: reserva.numeroPersonas,
    estado: reserva.estado,
    observaciones: reserva.observaciones,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarReserva = async () => {
  let resultado;
  if (dialogo.editando && reservaIdActual.value) {
    const payload: ReservaRequestDTO = { ...formulario };
    resultado = await store.actualizarReserva(reservaIdActual.value, payload);
  } else {
    const payload: ReservaRequestDTO = { ...formulario };
    resultado = await store.crearReserva(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Reserva actualizada exitosamente' : 'Reserva creada exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar reserva', 'error');
  }
};

const confirmarEliminar = (reserva: ReservaResponseDTO) => {
  reservaAEliminar.value = reserva;
  confirmarDialog.value = true;
};

const eliminarReservaConfirmado = async () => {
  if (reservaAEliminar.value) {
    const resultado = await store.eliminarReserva(reservaAEliminar.value.idReserva);
    if (resultado.success) {
      mostrarSnackbar('Reserva eliminada exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar reserva', 'error');
    }
  }
  confirmarDialog.value = false;
  reservaAEliminar.value = null;
};

const actualizarEstadoReserva = async (id: number, nuevoEstado: EstadoReserva) => {
  const resultado = await store.actualizarEstadoReserva(id, nuevoEstado);
  if (resultado.success) {
    mostrarSnackbar(`Estado de reserva ${id} cambiado a ${nuevoEstado} exitosamente`, 'success');
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado.error || 'Error al actualizar estado de reserva', 'error');
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  reservaIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    idCliente: 0,
    idMesa: 0,
    fechaHoraReserva: new Date().toISOString().slice(0, 16),
    numeroPersonas: 1,
    estado: EstadoReserva.PENDIENTE,
    observaciones: undefined,
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
