<template>
  <v-card flat class="my-2">
    <v-card-title class="text-subtitle-1">Detalles del Pedido #{{ pedidoId }}</v-card-title>
    <v-card-text v-if="store.loading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
      Cargando detalles...
    </v-card-text>
    <v-card-text v-else-if="store.error">
      <v-alert type="error" dense>{{ store.error }}</v-alert>
    </v-card-text>
    <v-card-text v-else-if="store.selectedPedidoDetalles.length === 0">
      No hay detalles para este pedido.
    </v-card-text>
    <v-card-text v-else>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Observaciones</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detalle in store.selectedPedidoDetalles" :key="detalle.idDetalle">
            <td>{{ detalle.producto?.nombre || 'N/A' }}</td>
            <td>{{ detalle.cantidad }}</td>
            <td>{{ formatCurrency(detalle.precioUnitario) }}</td>
            <td>{{ formatCurrency(detalle.subtotal) }}</td>
            <td>{{ detalle.observaciones || '-' }}</td>
            <td>
              <v-chip :color="getEstadoColor(detalle.estado)" size="small" variant="tonal">
                {{ detalle.estado }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch } from 'vue';
import { usePedidoStore } from '@/stores/pedidoStore';
import { EstadoDetallePedido } from '@/types/enums';

const props = defineProps<{
  pedidoId: number;
}>();

const store = usePedidoStore();

const getEstadoColor = (estado: EstadoDetallePedido) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'orange';
    case 'EN_PREPARACION':
      return 'blue';
    case 'LISTO':
      return 'light-green';
    case 'ENTREGADO':
      return 'success';
    default:
      return 'grey';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};

// Fetch details when component mounts or pedidoId changes
watch(() => props.pedidoId, (newId) => {
  if (newId) {
    store.fetchSelectedPedidoDetalles(newId);
  }
}, { immediate: true });
</script>
