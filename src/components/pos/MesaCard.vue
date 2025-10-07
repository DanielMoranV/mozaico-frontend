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
      <div class="d-flex justify-space-between align-center mb-2">
        <v-chip :color="estadoColor" size="small" variant="tonal">{{ estadoTexto }}</v-chip>
        <v-icon v-if="mesa.ubicacion" size="small" class="text-grey">mdi-map-marker</v-icon>
      </div>

      <div v-if="mesa.ubicacion" class="text-caption text-grey mb-2">
        {{ mesa.ubicacion }}
      </div>

      <!-- Información detallada según el estado -->
      <div v-if="mesa.ultimoPedido" class="pedido-info">
        <v-divider class="my-2"></v-divider>
        <div class="d-flex align-center mb-1">
          <v-icon size="small" color="primary" class="mr-1">mdi-receipt</v-icon>
          <span class="text-caption font-weight-bold">Pedido #{{ mesa.ultimoPedido.idPedido }}</span>
        </div>

        <div class="text-caption text-grey mb-1">
          Cliente: {{ mesa.ultimoPedido.cliente }}
        </div>

        <div class="d-flex justify-space-between align-center mb-1">
          <span class="text-caption">{{ mesa.ultimoPedido.detalles.length }} item(s)</span>
          <v-chip size="x-small" :color="getPedidoEstadoColor(mesa.ultimoPedido.estado)" variant="tonal">
            {{ getPedidoEstadoTexto(mesa.ultimoPedido.estado) }}
          </v-chip>
        </div>

        <div class="text-body-2 font-weight-bold text-right">
          Total: S/{{ mesa.ultimoPedido.total?.toFixed(2) || '0.00' }}
        </div>

        <div class="text-caption text-grey">
          {{ formatDateTime(mesa.ultimoPedido.fechaPedido) }}
        </div>
      </div>

      <div v-else-if="mesa.ultimaReserva" class="reserva-info">
        <v-divider class="my-2"></v-divider>
        <div class="d-flex align-center mb-1">
          <v-icon size="small" color="warning" class="mr-1">mdi-calendar-clock</v-icon>
          <span class="text-caption font-weight-bold">Reserva #{{ mesa.ultimaReserva.idReserva }}</span>
        </div>

        <div class="text-caption text-grey mb-1">
          Cliente: {{ mesa.ultimaReserva.cliente }}
        </div>

        <div class="text-caption mb-1">
          {{ mesa.ultimaReserva.numeroPersonas }} persona(s)
        </div>

        <div class="text-body-2 font-weight-bold">
          {{ formatDateTime(mesa.ultimaReserva.fechaHoraReserva) }}
        </div>

        <div v-if="mesa.ultimaReserva.observaciones" class="text-caption text-grey mt-1">
          "{{ mesa.ultimaReserva.observaciones }}"
        </div>
      </div>

      <div v-else-if="mesa.estado === EstadoMesa.DISPONIBLE" class="disponible-info">
        <v-divider class="my-2"></v-divider>
        <div class="d-flex align-center justify-center text-success">
          <v-icon class="mr-1">mdi-check-circle</v-icon>
          <span class="text-caption">Lista para ocupar</span>
        </div>
      </div>

      <div v-else-if="mesa.estado === EstadoMesa.MANTENIMIENTO" class="mantenimiento-info">
        <v-divider class="my-2"></v-divider>
        <div class="d-flex align-center justify-center text-info">
          <v-icon class="mr-1">mdi-tools</v-icon>
          <span class="text-caption">En mantenimiento</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EstadoMesa, EstadoPedido } from '@/types/enums';
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

const getPedidoEstadoColor = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO:
      return 'primary';
    case EstadoPedido.ATENDIDO:
      return 'warning';
    case EstadoPedido.PAGADO:
      return 'success';
    case EstadoPedido.CANCELADO:
      return 'error';
    // Estados legacy
    case EstadoPedido.PENDIENTE:
      return 'orange';
    case EstadoPedido.EN_PREPARACION:
      return 'blue';
    case EstadoPedido.LISTO:
      return 'green';
    case EstadoPedido.ENTREGADO:
      return 'success';
    default:
      return 'grey';
  }
};

const getPedidoEstadoTexto = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO:
      return 'Mesa Abierta';
    case EstadoPedido.ATENDIDO:
      return 'Atendido';
    case EstadoPedido.PAGADO:
      return 'Pagado';
    case EstadoPedido.CANCELADO:
      return 'Cancelado';
    // Estados legacy
    case EstadoPedido.PENDIENTE:
      return 'Pendiente';
    case EstadoPedido.EN_PREPARACION:
      return 'Preparando';
    case EstadoPedido.LISTO:
      return 'Listo';
    case EstadoPedido.ENTREGADO:
      return 'Entregado';
    default:
      return 'Desconocido';
  }
};

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

</script>

<style scoped>
.mesa-card {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.mesa-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Estilos específicos para cada estado */
.mesa-estado-disponible {
  border-left: 4px solid var(--v-theme-success);
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, transparent 100%);
}

.mesa-estado-ocupada {
  border-left: 4px solid var(--v-theme-error);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, transparent 100%);
}

.mesa-estado-reservada {
  border-left: 4px solid var(--v-theme-warning);
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, transparent 100%);
}

.mesa-estado-mantenimiento {
  border-left: 4px solid var(--v-theme-info);
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, transparent 100%);
}

/* Estilos para las secciones de información */
.pedido-info, .reserva-info, .disponible-info, .mantenimiento-info {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 6px;
  padding: 8px;
  margin-top: 8px;
}

.pedido-info {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.reserva-info {
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
}

.disponible-info {
  border: 1px solid rgba(var(--v-theme-success), 0.2);
}

.mantenimiento-info {
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

/* Responsive design */
@media (max-width: 600px) {
  .mesa-card {
    margin-bottom: 12px;
  }

  .text-caption {
    font-size: 0.7rem !important;
  }

  .text-body-2 {
    font-size: 0.8rem !important;
  }
}
</style>
