<template>
  <v-card
    class="mesa-card"
    :class="mesaClass"
    @click="emit('select-mesa', mesa.idMesa)"
    hover
    ripple
  >
    <v-card-title class="text-h5">Mesa #{{ mesa.numeroMesa }}</v-card-title>
    <v-card-subtitle>Capacidad: {{ mesa.capacidad }}</v-card-subtitle>
    <v-card-text>
      <v-chip :color="estadoColor" dark small>{{ estadoTexto }}</v-chip>
      <div v-if="mesa.estado === EstadoMesa.OCUPADA" class="mt-2">
        <!-- Aquí podríamos mostrar un resumen del pedido activo -->
        <p class="text-caption mb-0">Pedido Activo: #{{ mesa.idPedidoActivo || 'N/A' }}</p>
        <p class="text-caption mb-0">Total: ${{ mesa.totalPedidoActivo?.toFixed(2) || '0.00' }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EstadoMesa } from '@/types/enums';
import type { Mesa } from '@/types/mesa';

interface Props {
  mesa: Mesa;
}

const props = defineProps<Props>();
const emit = defineEmits(['select-mesa']);

const mesaClass = computed(() => {
  return `mesa-estado-${props.mesa.estado.toLowerCase()}`;
});

const estadoColor = computed(() => {
  switch (props.mesa.estado) {
    case EstadoMesa.DISPONIBLE:
      return 'success'; // Verde
    case EstadoMesa.OCUPADA:
      return 'error'; // Rojo
    case EstadoMesa.RESERVADA:
      return 'warning'; // Naranja
    case EstadoMesa.MANTENIMIENTO:
      return 'info'; // Azul
    default:
      return 'grey';
  }
});

const estadoTexto = computed(() => {
  switch (props.mesa.estado) {
    case EstadoMesa.DISPONIBLE:
      return 'Disponible';
    case EstadoMesa.OCUPADA:
      return 'Ocupada';
    case EstadoMesa.RESERVADA:
      return 'Reservada';
    case EstadoMesa.MANTENIMIENTO:
      return 'Mantenimiento';
    default:
      return 'Desconocido';
  }
});

// Nota: Para mostrar idPedidoActivo y totalPedidoActivo,
// la interfaz Mesa en src/types/mesa.ts necesitará ser extendida
// o se deberá obtener esta información de otra manera (ej. del pedidoStore).
// Por ahora, se asume que estos campos podrían existir en la mesa para simplificar la UI.
</script>

<style scoped>
.mesa-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 100%; /* Asegura que todas las tarjetas tengan la misma altura */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mesa-card:hover {
  transform: translateY(-5px);
}

/* Estilos específicos para cada estado si se desea */
.mesa-estado-disponible {
  border-left: 5px solid var(--v-theme-success);
}
.mesa-estado-ocupada {
  border-left: 5px solid var(--v-theme-error);
}
.mesa-estado-reservada {
  border-left: 5px solid var(--v-theme-warning);
}
.mesa-estado-mantenimiento {
  border-left: 5px solid var(--v-theme-info);
}
</style>
