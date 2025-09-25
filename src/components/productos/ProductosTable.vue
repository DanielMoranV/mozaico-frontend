<template>
  <v-data-table
    :headers="headers"
    :items="productos"
    :loading="loading"
    loading-text="Cargando productos..."
    no-data-text="No se encontraron productos"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.imagenUrl="{ item }">
      <v-avatar size="40">
        <v-img v-if="item.imagenUrl" :src="item.imagenUrl" :alt="item.nombre"></v-img>
        <v-icon v-else>mdi-camera-off</v-icon>
      </v-avatar>
    </template>
    <template v-slot:item.categoria.nombre="{ item }">
      {{ item.categoria.nombre }}
    </template>
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.disponible="{ item }">
      <v-icon :color="item.disponible ? 'success' : 'error'">
        {{ item.disponible ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-producto', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-if="item.estado !== 'ACTIVO'" @click="emit('activar-producto', item.idProducto)">
            <v-list-item-title>Activar</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item.estado === 'ACTIVO'" @click="emit('desactivar-producto', item.idProducto)">
            <v-list-item-title>Desactivar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { ProductoResponseDTO, EstadoProducto } from '@/types/producto';

defineProps<{
  productos: ProductoResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-producto',
  'confirmar-eliminar',
  'activar-producto',
  'desactivar-producto',
]);

const getEstadoColor = (estado: EstadoProducto) => {
  switch (estado) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'warning';
    default:
      return 'grey';
  }
};
</script>
