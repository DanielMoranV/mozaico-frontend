<template>
  <v-data-table
    :headers="headers"
    :items="metodosPago"
    :loading="loading"
    loading-text="Cargando métodos de pago..."
    no-data-text="No se encontraron métodos de pago"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.activo="{ item }">
      <v-chip :color="item.activo ? 'success' : 'error'" size="small" variant="tonal">
        {{ item.activo ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-metodo-pago', item)">
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
import type { MetodoPagoResponseDTO } from '@/types/metodoPago';

defineProps<{
  metodosPago: MetodoPagoResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-metodo-pago',
  'confirmar-eliminar',
]);
</script>
