<template>
  <v-data-table
    :headers="headers"
    :items="pagos"
    :loading="loading"
    loading-text="Cargando pagos..."
    no-data-text="No se encontraron pagos"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.pedido.idPedido="{ item }">
      {{ item.pedido ? item.pedido.idPedido : 'N/A' }}
    </template>
    <template v-slot:item.metodoPago.nombre="{ item }">
      {{ item.metodoPago ? item.metodoPago.nombre : 'N/A' }}
    </template>
    <template v-slot:item.monto="{ item }">
      {{ formatCurrency(item.monto) }}
    </template>
    <template v-slot:item.fechaPago="{ item }">
      {{ formatDate(item.fechaPago) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-pago', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { PagoResponseDTO, EstadoPago } from '@/types/pago';

const props = defineProps<{
  pagos: PagoResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-pago',
  'confirmar-eliminar',
]);

const getEstadoColor = (estado: EstadoPago) => {
  switch (estado) {
    case 'COMPLETADO':
      return 'success';
    case 'PENDIENTE':
      return 'warning';
    case 'FALLIDO':
      return 'error';
    default:
      return 'grey';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};
</script>
