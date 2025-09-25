<template>
  <v-card flat class="my-2">
    <v-card-title class="text-subtitle-1">Detalles de la Compra #{{ compraId }}</v-card-title>
    <v-card-text v-if="store.loading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
      Cargando detalles...
    </v-card-text>
    <v-card-text v-else-if="store.error">
      <v-alert type="error" dense>{{ store.error }}</v-alert>
    </v-card-text>
    <v-card-text v-else-if="store.selectedCompraDetalles.length === 0">
      No hay detalles para esta compra.
    </v-card-text>
    <v-card-text v-else>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detalle in store.selectedCompraDetalles" :key="detalle.idDetalleCompra">
            <td>{{ detalle.producto?.nombre || 'N/A' }}</td>
            <td>{{ detalle.cantidad }}</td>
            <td>{{ formatCurrency(detalle.precioUnitario) }}</td>
            <td>{{ formatCurrency(detalle.subtotal) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch } from 'vue';
import { useCompraStore } from '@/stores/compraStore';

const props = defineProps<{
  compraId: number;
}>();

const store = useCompraStore();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};

// Fetch details when component mounts or compraId changes
watch(() => props.compraId, (newId) => {
  if (newId) {
    store.fetchSelectedCompraDetalles(newId);
  }
}, { immediate: true });
</script>
