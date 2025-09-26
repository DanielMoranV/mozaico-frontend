<template>
  <v-data-table
    :headers="headers"
    :items="compras"
    :loading="loading"
    loading-text="Cargando compras..."
    no-data-text="No se encontraron compras"
    items-per-page="10"
    class="elevation-0"
    show-expand
    :expanded="selectedCompraId ? [selectedCompraId] : []"
    item-value="idCompra"
    @update:expanded="(expanded) => emit('toggle-expand', expanded.length > 0 ? compras.find(c => c.idCompra === expanded[0]) : null)"
  >
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.proveedor.nombre="{ item }">
      {{ item.proveedor ? item.proveedor.nombre : 'N/A' }}
    </template>
    <template v-slot:item.fechaCompra="{ item }">
      {{ formatDate(item.fechaCompra) }}
    </template>
    <template v-slot:item.total="{ item }">
      {{ formatCurrency(item.total) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-compra', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <CompraDetalles :compra-id="item.idCompra" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { CompraResponseDTO, EstadoCompra } from '@/types/compra';
import CompraDetalles from './CompraDetalles.vue'; // Import the new component

const props = defineProps<{
  compras: CompraResponseDTO[];
  loading: boolean;
  headers: any[];
  selectedCompraId: number | null; // New prop
}>();

const emit = defineEmits([
  'editar-compra',
  'confirmar-eliminar',
  'toggle-expand', // New emit
]);

const getEstadoColor = (estado: EstadoCompra) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'orange';
    case 'COMPLETADA':
      return 'success';
    case 'CANCELADA':
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
