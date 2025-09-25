<template>
  <v-container fluid>
    <v-card>
      <CompraHeader
        :show-filters="showFilters"
        @crear-compra="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en proveedor, estado..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <CompraFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <CompraTable
          :compras="store.compras"
          :loading="store.loading"
          :headers="headers"
          :selected-compra-id="selectedCompraId"
          @editar-compra="editarCompra"
          @confirmar-eliminar="confirmarEliminar"
          @toggle-expand="toggleExpand"
        />
      </v-card-text>
    </v-card>

    <CompraEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-compra="guardarCompra"
    />

    <CompraDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :compra-a-eliminar="compraAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarCompraConfirmado"
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
import { useCompraStore } from '@/stores/compraStore';
import type { CompraResponseDTO, CompraRequestDTO, CompraSearchParams } from '@/types/compra';
import { EstadoCompra } from '@/types/enums'; // Import EstadoCompra as a value
import CompraHeader from '@/components/compras/CompraHeader.vue';
import CompraFilters from '@/components/compras/CompraFilters.vue';
import CompraTable from '@/components/compras/CompraTable.vue';
import CompraEditDialog from '@/components/compras/CompraEditDialog.vue';
import CompraDeleteConfirmDialog from '@/components/compras/CompraDeleteConfirmDialog.vue';

const store = useCompraStore();

const headers = [
  { title: 'ID', key: 'idCompra', sortable: true },
  { title: '', key: 'data-table-expand', width: '40px' }, // Expand icon column
  { title: 'Proveedor', key: 'proveedor.nombre', sortable: true },
  { title: 'Fecha Compra', key: 'fechaCompra', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');
const selectedCompraId = ref<number | null>(null); // New ref for expanded row

const searchCriteria = reactive<Omit<CompraSearchParams, 'searchTerm'>>({
  idProveedor: undefined,
  estado: undefined,
  fechaDesde: undefined,
  fechaHasta: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<CompraRequestDTO>({
  idProveedor: 0,
  fechaCompra: new Date().toISOString().split('T')[0],
  estado: EstadoCompra.PENDIENTE,
  detalles: [],
});

const compraIdActual = ref<number | null>(null);
const compraAEliminar = ref<CompraResponseDTO | null>(null);
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
  const criteriaToSend: CompraSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarCompras();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    idProveedor: undefined,
    estado: undefined,
    fechaDesde: undefined,
    fechaHasta: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarCompras();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarCompra = (compra: CompraResponseDTO) => {
  compraIdActual.value = compra.idCompra;
  Object.assign(formulario, {
    idProveedor: compra.proveedor.idProveedor,
    fechaCompra: new Date(compra.fechaCompra).toISOString().split('T')[0],
    estado: compra.estado,
    detalles: compra.detalles.map(d => ({ // Map response details to request details
      idProducto: d.producto.idProducto,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
    })),
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarCompra = async () => {
  let resultado;
  if (dialogo.editando && compraIdActual.value) {
    const payload: CompraRequestDTO = { ...formulario };
    resultado = await store.actualizarCompra(compraIdActual.value, payload);
  } else {
    const payload: CompraRequestDTO = { ...formulario };
    resultado = await store.crearCompra(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Compra actualizada exitosamente' : 'Compra creada exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar compra', 'error');
  }
};

const confirmarEliminar = (compra: CompraResponseDTO) => {
  compraAEliminar.value = compra;
  confirmarDialog.value = true;
};

const eliminarCompraConfirmado = async () => {
  if (compraAEliminar.value) {
    const resultado = await store.eliminarCompra(compraAEliminar.value.idCompra);
    if (resultado.success) {
      mostrarSnackbar('Compra eliminada exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar compra', 'error');
    }
  }
  confirmarDialog.value = false;
  compraAEliminar.value = null;
};

const toggleExpand = async (compra: CompraResponseDTO) => {
  if (selectedCompraId.value === compra.idCompra) {
    selectedCompraId.value = null;
  } else {
    selectedCompraId.value = compra.idCompra;
    await store.fetchSelectedCompraDetalles(compra.idCompra);
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  compraIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    idProveedor: 0,
    fechaCompra: new Date().toISOString().split('T')[0],
    estado: EstadoCompra.PENDIENTE,
    detalles: [],
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
