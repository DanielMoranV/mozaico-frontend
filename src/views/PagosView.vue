<template>
  <v-container fluid>
    <v-card>
      <PagoHeader
        :show-filters="showFilters"
        @crear-pago="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar por referencia..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <PagoFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <PagoTable
          :pagos="store.pagos"
          :loading="store.loading"
          :headers="headers"
          @editar-pago="editarPago"
          @confirmar-eliminar="confirmarEliminar"
        />
      </v-card-text>
    </v-card>

    <PagoEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-pago="guardarPago"
    />

    <PagoDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :pago-a-eliminar="pagoAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarPagoConfirmado"
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
import { usePagoStore } from '@/stores/pagoStore';
import { EstadoPago } from '@/types/enums';
import type { PagoResponseDTO, PagoRequestDTO, PagoSearchParams } from '@/types/pago';
import PagoHeader from '@/components/pagos/PagoHeader.vue';
import PagoFilters from '@/components/pagos/PagoFilters.vue';
import PagoTable from '@/components/pagos/PagoTable.vue';
import PagoEditDialog from '@/components/pagos/PagoEditDialog.vue';
import PagoDeleteConfirmDialog from '@/components/pagos/PagoDeleteConfirmDialog.vue';

const store = usePagoStore();

const headers = [
  { title: 'ID', key: 'idPago', sortable: true },
  { title: 'Pedido', key: 'pedido.idPedido', sortable: true },
  { title: 'Método de Pago', key: 'metodoPago.nombre', sortable: true },
  { title: 'Monto', key: 'monto', sortable: true },
  { title: 'Fecha Pago', key: 'fechaPago', sortable: true },
  { title: 'Referencia', key: 'referencia', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<PagoSearchParams, 'searchTerm'>>({
  idPedido: undefined,
  idMetodo: undefined,
  estado: undefined,
  fechaPagoDesde: undefined,
  fechaPagoHasta: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<PagoRequestDTO>({
  idPedido: 0,
  idMetodo: 0,
  monto: 0,
  referencia: undefined,
  estado: EstadoPago.PENDIENTE,
});

const pagoIdActual = ref<number | null>(null);
const pagoAEliminar = ref<PagoResponseDTO | null>(null);
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
  const criteriaToSend: PagoSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };

  store.setBusquedaParams(criteriaToSend);
  const resultado = await store.buscarPagos();

  if (!resultado.success) {
    mostrarSnackbar(resultado.error || 'Error al buscar pagos', 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    idPedido: undefined,
    idMetodo: undefined,
    estado: undefined,
    fechaPagoDesde: undefined,
    fechaPagoHasta: undefined,
    logic: 'AND',
  });

  store.setBusquedaParams({});
  const resultado = await store.fetchPagos();

  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarPago = (pago: PagoResponseDTO) => {
  pagoIdActual.value = pago.idPago;
  Object.assign(formulario, {
    idPedido: pago.pedido.idPedido,
    idMetodo: pago.metodoPago.idMetodo,
    monto: pago.monto,
    referencia: pago.referencia,
    estado: pago.estado,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarPago = async () => {
  let resultado;
  const payload: PagoRequestDTO = { ...formulario };

  if (dialogo.editando && pagoIdActual.value) {
    resultado = await store.actualizarPago(pagoIdActual.value, payload);
  } else {
    resultado = await store.crearPago(payload);
  }

  if (resultado.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Pago actualizado exitosamente' : 'Pago creado exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado.error || 'Error al guardar pago', 'error');
  }
};

const confirmarEliminar = (pago: PagoResponseDTO) => {
  pagoAEliminar.value = pago;
  confirmarDialog.value = true;
};

const eliminarPagoConfirmado = async () => {
  if (pagoAEliminar.value) {
    const resultado = await store.eliminarPago(pagoAEliminar.value.idPago);
    if (resultado.success) {
      mostrarSnackbar('Pago eliminado exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar pago', 'error');
    }
  }
  confirmarDialog.value = false;
  pagoAEliminar.value = null;
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  pagoIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    idPedido: 0,
    idMetodo: 0,
    monto: 0,
    referencia: undefined,
    estado: EstadoPago.PENDIENTE,
  });
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  store.fetchPagos();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
