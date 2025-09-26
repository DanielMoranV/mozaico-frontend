<template>
  <v-container fluid>
    <v-card>
      <PedidoHeader
        :show-filters="showFilters"
        @crear-pedido="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en observaciones, dirección de delivery..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <PedidoFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <PedidoTable
          :pedidos="store.pedidos"
          :loading="store.loading"
          :headers="headers"
          :selected-pedido-id="selectedPedidoId"
          @editar-pedido="editarPedido"
          @confirmar-eliminar="confirmarEliminar"
          @cambiar-estado="cambiarEstadoPedido"
          @toggle-expand="toggleExpand"
        />
      </v-card-text>
    </v-card>

    <PedidoEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-pedido="guardarPedido"
    />

    <PedidoDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :pedido-a-eliminar="pedidoAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarPedidoConfirmado"
    />

    <v-snackbar
      v-model="snackbar.mostrar"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { usePedidoStore } from "@/stores/pedidoStore";
import { EstadoPedido, TipoServicio } from "@/types/enums"; // Import EstadoPedido and TipoServicio as values
import type {
  Pedido,
  PedidoRequestDTO,
  PedidoUpdateDTO,
  PedidoSearchParams,
} from "@/types/pedido";
import PedidoHeader from "@/components/pedidos/PedidoHeader.vue";
import PedidoFilters from "@/components/pedidos/PedidoFilters.vue";
import PedidoTable from "@/components/pedidos/PedidoTable.vue";
import PedidoEditDialog from "@/components/pedidos/PedidoEditDialog.vue";
import PedidoDeleteConfirmDialog from "@/components/pedidos/PedidoDeleteConfirmDialog.vue";

const store = usePedidoStore();

const headers = [
  { title: "ID", key: "idPedido", sortable: true },
  { title: "", key: "data-table-expand", width: "40px" }, // Expand icon column
  { title: "Cliente", key: "cliente.nombre", sortable: true },
  { title: "Mesa", key: "mesa.numeroMesa", sortable: true },
  { title: "Empleado", key: "empleado.nombre", sortable: true },
  { title: "Fecha", key: "fechaPedido", sortable: true },
  { title: "Estado", key: "estado", sortable: true },
  { title: "Tipo Servicio", key: "tipoServicio", sortable: true },
  { title: "Total", key: "total", sortable: true },
  { title: "Acciones", key: "actions", sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref("");
const selectedPedidoId = ref<number | null>(null); // New ref for expanded row

const searchCriteria = reactive<Omit<PedidoSearchParams, "searchTerm">>({
  idCliente: undefined,
  idMesa: undefined,
  idEmpleado: undefined,
  fechaPedidoDesde: undefined,
  fechaPedidoHasta: undefined,
  estado: undefined,
  tipoServicio: undefined,
  logic: "AND",
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<PedidoRequestDTO>({
  idCliente: undefined,
  idMesa: undefined,
  idEmpleado: undefined,
  tipoServicio: TipoServicio.MESA,
  observaciones: undefined,
  direccionDelivery: undefined,
  detalles: [],
});

const pedidoIdActual = ref<number | null>(null);
const confirmarDialog = ref(false);
const pedidoAEliminar = ref<Pedido | null>(null);

const snackbar = reactive({
  mostrar: false,
  mensaje: "",
  color: "success",
});

const reglasValidacion = {
  requerido: (v: any) => !!v || "Este campo es requerido",
};

const realizarBusqueda = async () => {
  const criteriaToSend: PedidoSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarPedidos();
  if (store.error) {
    mostrarSnackbar(store.error, "error");
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = "";
  Object.assign(searchCriteria, {
    idCliente: undefined,
    idMesa: undefined,
    idEmpleado: undefined,
    fechaPedidoDesde: undefined,
    fechaPedidoHasta: undefined,
    estado: undefined,
    tipoServicio: undefined,
    logic: "AND",
  });
  store.setBusquedaParams({});
  await store.buscarPedidos();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarPedido = (pedido: Pedido) => {
  pedidoIdActual.value = pedido.idPedido;
  Object.assign(formulario, {
    idCliente: pedido.cliente?.idCliente,
    idMesa: pedido.mesa?.idMesa,
    idEmpleado: pedido.empleado?.idUsuario,
    estado: pedido.estado,
    tipoServicio: pedido.tipoServicio,
    observaciones: pedido.observaciones,
    direccionDelivery: pedido.direccionDelivery,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarPedido = async () => {
  let resultado;
  if (dialogo.editando && pedidoIdActual.value) {
    const payload: PedidoUpdateDTO = { ...formulario };
    resultado = await store.actualizarPedido(pedidoIdActual.value, payload);
  } else {
    const payload: PedidoRequestDTO = { ...formulario };
    resultado = await store.crearPedido(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando
        ? "Pedido actualizado exitosamente"
        : "Pedido creado exitosamente",
      "success"
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || "Error al guardar pedido", "error");
  }
};

const confirmarEliminar = (pedido: Pedido) => {
  pedidoAEliminar.value = pedido;
  confirmarDialog.value = true;
};

const eliminarPedidoConfirmado = async () => {
  if (pedidoAEliminar.value) {
    const resultado = await store.eliminarPedido(
      pedidoAEliminar.value.idPedido
    );
    if (resultado.success) {
      mostrarSnackbar("Pedido eliminado exitosamente", "success");
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || "Error al eliminar pedido", "error");
    }
  }
  confirmarDialog.value = false;
  pedidoAEliminar.value = null;
};

const cambiarEstadoPedido = async (id: number, nuevoEstado: EstadoPedido) => {
  const resultado = await store.cambiarEstadoPedido(id, nuevoEstado);
  if (resultado.success) {
    mostrarSnackbar(
      `Estado de pedido ${id} cambiado a ${nuevoEstado} exitosamente`,
      "success"
    );
    await realizarBusqueda();
  } else {
    mostrarSnackbar(
      resultado.error || "Error al cambiar estado de pedido",
      "error"
    );
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  pedidoIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    idCliente: undefined,
    idMesa: undefined,
    idEmpleado: undefined,
    tipoServicio: TipoServicio.MESA,
    observaciones: undefined,
    direccionDelivery: undefined,
    detalles: [],
  });
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

const toggleExpand = (pedido: Pedido | null) => {
  console.log("Toggling expand for pedido:", pedido);
  if (pedido && selectedPedidoId.value !== pedido.idPedido) {
    selectedPedidoId.value = pedido.idPedido;
  } else {
    selectedPedidoId.value = null;
  }
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
