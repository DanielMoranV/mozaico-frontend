<template>
  <v-container fluid>
    <v-card>
      <InventarioHeader
        :show-filters="showFilters"
        @crear-inventario="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar por nombre de producto..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <InventarioFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <InventarioTable
          :inventario="store.inventario"
          :loading="store.loading"
          :headers="headers"
          @editar-inventario="editarInventario"
          @ajustar-stock="abrirDialogoAjustarStock"
          @confirmar-eliminar="confirmarEliminar"
        />
      </v-card-text>
    </v-card>

    <InventarioEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-inventario="guardarInventario"
    />

    <InventarioAjustarStockDialog
      :mostrar="dialogoAjustarStock.mostrar"
      @update:mostrar="dialogoAjustarStock.mostrar = $event"
      :inventario-actual="inventarioActualParaAjuste"
      :formulario-ajuste="formularioAjusteStock"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @ajustar-stock-confirmado="ajustarStockConfirmado"
    />

    <InventarioDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :inventario-a-eliminar="inventarioAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarInventarioConfirmado"
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
import { useInventarioStore } from '@/stores/inventarioStore';
import { TipoAjusteStock } from '@/types/enums';
import type { InventarioResponseDTO, InventarioRequestDTO, InventarioUpdateDTO, AjustarStockRequestDTO, InventarioSearchParams } from '@/types/inventario';
import InventarioHeader from '@/components/inventario/InventarioHeader.vue';
import InventarioFilters from '@/components/inventario/InventarioFilters.vue';
import InventarioTable from '@/components/inventario/InventarioTable.vue';
import InventarioEditDialog from '@/components/inventario/InventarioEditDialog.vue';
import InventarioAjustarStockDialog from '@/components/inventario/InventarioAjustarStockDialog.vue';
import InventarioDeleteConfirmDialog from '@/components/inventario/InventarioDeleteConfirmDialog.vue';

const store = useInventarioStore();

const headers = [
  { title: 'ID', key: 'idInventario', sortable: true },
  { title: 'Producto', key: 'producto.nombre', sortable: true },
  { title: 'Stock Actual', key: 'stockActual', sortable: true },
  { title: 'Stock Mínimo', key: 'stockMinimo', sortable: true },
  { title: 'Stock Máximo', key: 'stockMaximo', sortable: true },
  { title: 'Costo Unitario', key: 'costoUnitario', sortable: true },
  { title: 'Última Actualización', key: 'fechaActualizacion', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<InventarioSearchParams, 'searchTerm'>>({
  idProducto: undefined,
  stockActualMin: undefined,
  stockActualMax: undefined,
  stockMinimoMin: undefined,
  stockMinimoMax: undefined,
  stockMaximoMin: undefined,
  stockMaximoMax: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const dialogoAjustarStock = reactive({
  mostrar: false,
});

const formulario = reactive<InventarioRequestDTO>({
  idProducto: 0,
  stockActual: 0,
  stockMinimo: undefined,
  stockMaximo: undefined,
  costoUnitario: undefined,
});

const formularioAjusteStock = reactive<AjustarStockRequestDTO>({
  cantidad: 0,
  tipoAjuste: TipoAjusteStock.ENTRADA,
});

const inventarioIdActual = ref<number | null>(null);
const inventarioAEliminar = ref<InventarioResponseDTO | null>(null);
const inventarioActualParaAjuste = ref<InventarioResponseDTO | null>(null);
const confirmarDialog = ref(false);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  numeroPositivo: (v: number) => v > 0 || 'Debe ser un número positivo',
  numeroNoNegativo: (v: number) => v >= 0 || 'Debe ser un número no negativo',
  numeroNoNegativoOpcional: (v: number | undefined) => {
    if (v === undefined || v === null) return true;
    return v >= 0 || 'Debe ser un número no negativo';
  },
};

const realizarBusqueda = async () => {
  const criteriaToSend: InventarioSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarInventario();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    idProducto: undefined,
    stockActualMin: undefined,
    stockActualMax: undefined,
    stockMinimoMin: undefined,
    stockMinimoMax: undefined,
    stockMaximoMin: undefined,
    stockMaximoMax: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarInventario();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarInventario = (inventario: InventarioResponseDTO) => {
  inventarioIdActual.value = inventario.idInventario;
  Object.assign(formulario, {
    idProducto: inventario.producto.idProducto,
    stockActual: inventario.stockActual,
    stockMinimo: inventario.stockMinimo,
    stockMaximo: inventario.stockMaximo,
    costoUnitario: inventario.costoUnitario,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarInventario = async () => {
  let resultado;
  if (dialogo.editando && inventarioIdActual.value) {
    const payload: InventarioUpdateDTO = { ...formulario };
    resultado = await store.actualizarInventario(inventarioIdActual.value, payload);
  } else {
    const payload: InventarioRequestDTO = { ...formulario };
    resultado = await store.crearInventario(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Entrada de inventario actualizada exitosamente' : 'Entrada de inventario creada exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar entrada de inventario', 'error');
  }
};

const abrirDialogoAjustarStock = (inventario: InventarioResponseDTO) => {
  inventarioActualParaAjuste.value = inventario;
  inventarioIdActual.value = inventario.idInventario;
  formularioAjusteStock.cantidad = 0;
  formularioAjusteStock.tipoAjuste = TipoAjusteStock.ENTRADA;
  dialogoAjustarStock.mostrar = true;
};

const ajustarStockConfirmado = async () => {
  if (inventarioIdActual.value) {
    const resultado = await store.ajustarStock(inventarioIdActual.value, formularioAjusteStock);
    if (resultado.success) {
      mostrarSnackbar('Stock ajustado exitosamente', 'success');
      dialogoAjustarStock.mostrar = false;
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado?.error || 'Error al ajustar stock', 'error');
    }
  }
};

const confirmarEliminar = (inventario: InventarioResponseDTO) => {
  inventarioAEliminar.value = inventario;
  confirmarDialog.value = true;
};

const eliminarInventarioConfirmado = async () => {
  if (inventarioAEliminar.value) {
    const resultado = await store.eliminarInventario(inventarioAEliminar.value.idInventario);
    if (resultado.success) {
      mostrarSnackbar('Entrada de inventario eliminada exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar entrada de inventario', 'error');
    }
  }
  confirmarDialog.value = false;
  inventarioAEliminar.value = null;
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  inventarioIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    idProducto: 0,
    stockActual: 0,
    stockMinimo: undefined,
    stockMaximo: undefined,
    costoUnitario: undefined,
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
