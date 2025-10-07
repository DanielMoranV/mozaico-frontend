<template>
  <v-data-table
    :headers="headers"
    :items="inventario"
    :loading="loading"
    loading-text="Cargando inventario..."
    no-data-text="No se encontraron entradas de inventario"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.producto.nombre="{ item }">
      {{ item.producto ? item.producto.nombre : 'N/A' }}
    </template>
    <template v-slot:item.costoUnitario="{ item }">
      {{ item.costoUnitario !== undefined ? formatCurrency(item.costoUnitario) : 'N/A' }}
    </template>
    <template v-slot:item.fechaActualizacion="{ item }">
      {{ formatDate(item.fechaActualizacion) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-inventario', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="info" @click="emit('ajustar-stock', item)">
        <v-icon>mdi-swap-horizontal</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { InventarioResponseDTO } from '@/types/inventario';

defineProps<{
  inventario: InventarioResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-inventario',
  'ajustar-stock',
  'confirmar-eliminar',
]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};
</script>
