<template>
  <v-data-table
    :headers="headers"
    :items="proveedores"
    :loading="loading"
    loading-text="Cargando proveedores..."
    no-data-text="No se encontraron proveedores"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.activo="{ item }">
      <v-chip :color="item.activo ? 'success' : 'error'" size="small" variant="tonal">
        {{ item.activo ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>
    <template v-slot:item.fechaCreacion="{ item }">
      {{ formatDate(item.fechaCreacion) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-proveedor', item)">
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
import type { ProveedorResponseDTO } from '@/types/proveedor';

defineProps<{
  proveedores: ProveedorResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-proveedor',
  'confirmar-eliminar',
]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>
