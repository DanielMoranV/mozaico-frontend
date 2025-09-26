<template>
  <v-data-table
    :headers="headers"
    :items="mesas"
    :loading="loading"
    loading-text="Cargando mesas..."
    no-data-text="No se encontraron mesas"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-mesa', item)">
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
          <v-list-item
            v-for="estado in estadosDisponibles(item.estado)"
            :key="estado"
            @click="emit('cambiar-estado', item.idMesa, estado)"
          >
            <v-list-item-title>Cambiar a {{ estado }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Mesa } from '@/types/mesa';
import { EstadoMesa } from '@/types/mesa';

const props = defineProps<{
  mesas: Mesa[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-mesa',
  'confirmar-eliminar',
  'cambiar-estado',
]);

const getEstadoColor = (estado: EstadoMesa) => {
  switch (estado) {
    case 'DISPONIBLE':
      return 'success';
    case 'OCUPADA':
      return 'error';
    case 'RESERVADA':
      return 'warning';
    case 'MANTENIMIENTO':
      return 'info';
    default:
      return 'grey';
  }
};

const estadosDisponibles = (estadoActual: EstadoMesa) => {
  return Object.values(EstadoMesa).filter(estado => estado !== estadoActual);
};
</script>
