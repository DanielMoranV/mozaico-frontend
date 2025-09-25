<template>
  <v-data-table
    :headers="headers"
    :items="reservas"
    :loading="loading"
    loading-text="Cargando reservas..."
    no-data-text="No se encontraron reservas"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>
    <template v-slot:item.cliente.nombre="{ item }">
      {{ item.cliente ? item.cliente.nombre + ' ' + item.cliente.apellido : 'N/A' }}
    </template>
    <template v-slot:item.mesa.numeroMesa="{ item }">
      {{ item.mesa ? item.mesa.numeroMesa : 'N/A' }}
    </template>
    <template v-slot:item.fechaHoraReserva="{ item }">
      {{ formatDateTime(item.fechaHoraReserva) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-reserva', item)">
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
            @click="emit('actualizar-estado', item.idReserva, estado)"
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
import type { ReservaResponseDTO, EstadoReserva } from '@/types/reserva';

const props = defineProps<{
  reservas: ReservaResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-reserva',
  'confirmar-eliminar',
  'actualizar-estado',
]);

const getEstadoColor = (estado: EstadoReserva) => {
  switch (estado) {
    case 'CONFIRMADA':
      return 'success';
    case 'PENDIENTE':
      return 'warning';
    case 'CANCELADA':
      return 'error';
    default:
      return 'grey';
  }
};

const estadosDisponibles = (estadoActual: EstadoReserva) => {
  return Object.values(EstadoReserva).filter(estado => estado !== estadoActual);
};

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString();
};
</script>
