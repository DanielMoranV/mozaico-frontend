<template>
  <v-data-table
    :headers="headers"
    :items="pedidos"
    :loading="loading"
    loading-text="Cargando pedidos..."
    no-data-text="No se encontraron pedidos"
    items-per-page="10"
    class="elevation-0"
    show-expand
    :expanded="selectedPedidoId ? [selectedPedidoId] : []"
    item-value="idPedido"
    @update:expanded="
      (expanded) =>
        emit(
          'toggle-expand',
          expanded.length > 0
            ? pedidos.find((p) => p.idPedido === expanded[0])
            : null
        )
    "
  >
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.tipoServicio="{ item }">
      <v-chip
        :color="getTipoServicioColor(item.tipoServicio)"
        size="small"
        variant="tonal"
      >
        {{ item.tipoServicio }}
      </v-chip>
    </template>
    <template v-slot:item.cliente.nombre="{ item }">
      {{
        item.cliente ? item.cliente.nombre + " " + item.cliente.apellido : "N/A"
      }}
    </template>
    <template v-slot:item.mesa.numeroMesa="{ item }">
      {{ item.mesa ? item.mesa.numeroMesa : "N/A" }}
    </template>
    <template v-slot:item.empleado.nombre="{ item }">
      {{ item.empleado ? item.empleado.nombre : "N/A" }}
    </template>
    <template v-slot:item.total="{ item }">
      {{ formatCurrency(item.total) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        size="small"
        variant="text"
        @click="emit('editar-pedido', item)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        icon
        size="small"
        variant="text"
        color="error"
        @click="emit('confirmar-eliminar', item)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="estado in estadosDisponibles(item.estado)"
            :key="estado"
            @click="emit('cambiar-estado', item.idPedido, estado)"
          >
            <v-list-item-title>Cambiar a {{ estado }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <PedidoDetalles :pedido-id="item.idPedido" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { PedidoResponseDTO } from "@/types/pedido";
import { EstadoPedido, TipoServicio } from "@/types/enums";
import PedidoDetalles from "./PedidoDetalles.vue"; // Import the new component

const props = defineProps<{
  pedidos: PedidoResponseDTO[];
  loading: boolean;
  headers: any[];
  selectedPedidoId: number | null;
}>();

const emit = defineEmits([
  "editar-pedido",
  "confirmar-eliminar",
  "cambiar-estado",
  "toggle-expand", // New emit
]);

const getEstadoColor = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.PENDIENTE:
      return "orange";
    case EstadoPedido.EN_PREPARACION:
      return "blue";
    case EstadoPedido.LISTO:
      return "light-green";
    case EstadoPedido.ENTREGADO:
      return "success";
    case EstadoPedido.CANCELADO:
      return "error";
    default:
      return "grey";
  }
};

const getTipoServicioColor = (tipo: TipoServicio) => {
  switch (tipo) {
    case TipoServicio.MESA:
      return "purple";
    case TipoServicio.LLEVAR:
      return "teal";
    case TipoServicio.DELIVERY:
      return "indigo";
    default:
      return "grey";
  }
};

const estadosDisponibles = (estadoActual: EstadoPedido) => {
  return Object.values(EstadoPedido).filter(
    (estado) => estado !== estadoActual
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(value);
};
</script>
