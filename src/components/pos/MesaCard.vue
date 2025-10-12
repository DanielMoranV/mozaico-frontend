<template>
  <v-card
    class="mesa-card"
    :class="mesaClass"
    @click="emit('select-mesa', mesa.idMesa)"
    hover
    ripple
  >
    <!-- Header compacto -->
    <v-card-text class="pa-3 pb-2">
      <div class="d-flex justify-space-between align-center mb-2">
        <div class="mesa-header">
          <div class="mesa-numero">Mesa #{{ mesa.numeroMesa }}</div>
          <div class="mesa-capacidad">
            <v-icon size="x-small" class="mr-1">mdi-account-multiple</v-icon>
            {{ mesa.capacidad }}
          </div>
        </div>
        <v-chip :color="estadoColor" size="x-small" variant="tonal" class="mesa-estado-chip">
          {{ estadoTexto }}
        </v-chip>
      </div>

      <div v-if="mesa.ubicacion" class="mesa-ubicacion">
        <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
        {{ mesa.ubicacion }}
      </div>

      <!-- Información detallada según el estado -->
      <div v-if="mesa.ultimoPedido" class="pedido-info">
        <v-divider class="my-2"></v-divider>

        <div class="d-flex justify-space-between align-center mb-1">
          <div class="info-item-compact">
            <v-icon size="x-small" color="primary">mdi-receipt</v-icon>
            <span class="info-label">#{{ mesa.ultimoPedido.idPedido }}</span>
          </div>
          <v-chip size="x-small" :color="getPedidoEstadoColor(mesa.ultimoPedido.estado)" variant="tonal">
            {{ getPedidoEstadoTexto(mesa.ultimoPedido.estado) }}
          </v-chip>
        </div>

        <div class="info-row">
          <v-icon size="x-small" class="text-grey">mdi-account</v-icon>
          <span class="info-text">{{ mesa.ultimoPedido.cliente }}</span>
        </div>

        <div class="d-flex justify-space-between align-center mt-1">
          <span class="info-items">{{ mesa.ultimoPedido.detalles.length }} items</span>
          <span class="total-amount">S/{{ mesa.ultimoPedido.total?.toFixed(2) || '0.00' }}</span>
        </div>
      </div>

      <div v-else-if="mesa.ultimaReserva" class="reserva-info">
        <v-divider class="my-2"></v-divider>

        <div class="d-flex justify-space-between align-center mb-1">
          <div class="info-item-compact">
            <v-icon size="x-small" color="warning">mdi-calendar-clock</v-icon>
            <span class="info-label">#{{ mesa.ultimaReserva.idReserva }}</span>
          </div>
          <span class="info-personas">{{ mesa.ultimaReserva.numeroPersonas }} pers.</span>
        </div>

        <div class="info-row">
          <v-icon size="x-small" class="text-grey">mdi-account</v-icon>
          <span class="info-text">{{ mesa.ultimaReserva.cliente }}</span>
        </div>

        <div class="reserva-fecha">
          {{ formatDateTime(mesa.ultimaReserva.fechaHoraReserva) }}
        </div>
      </div>

      <div v-else-if="mesa.estado === EstadoMesa.DISPONIBLE" class="disponible-info">
        <v-divider class="my-2"></v-divider>
        <div class="estado-simple">
          <v-icon size="small" class="text-success">mdi-check-circle</v-icon>
          <span>Lista para ocupar</span>
        </div>
      </div>

      <div v-else-if="mesa.estado === EstadoMesa.MANTENIMIENTO" class="mantenimiento-info">
        <v-divider class="my-2"></v-divider>
        <div class="estado-simple">
          <v-icon size="small" class="text-info">mdi-tools</v-icon>
          <span>En mantenimiento</span>
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
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

/* Header compacto */
.mesa-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mesa-numero {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.mesa-capacidad {
  font-size: 0.7rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: flex;
  align-items: center;
}

.mesa-estado-chip {
  font-size: 0.65rem !important;
  height: 20px !important;
}

.mesa-ubicacion {
  font-size: 0.7rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: flex;
  align-items: center;
  margin-top: 4px;
}

/* Estilos específicos para cada estado */
.mesa-estado-disponible {
  border-left: 3px solid var(--v-theme-success);
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, transparent 100%);
}

.mesa-estado-ocupada {
  border-left: 3px solid var(--v-theme-error);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.03) 0%, transparent 100%);
}

.mesa-estado-reservada {
  border-left: 3px solid var(--v-theme-warning);
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.03) 0%, transparent 100%);
}

.mesa-estado-mantenimiento {
  border-left: 3px solid var(--v-theme-info);
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, transparent 100%);
}

/* Estilos para las secciones de información */
.pedido-info, .reserva-info, .disponible-info, .mantenimiento-info {
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 6px;
  padding: 6px 8px;
  margin-top: 0;
}

.pedido-info {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
}

.reserva-info {
  border: 1px solid rgba(var(--v-theme-warning), 0.15);
}

.disponible-info, .mantenimiento-info {
  padding: 4px 8px;
}

/* Info items compactos */
.info-item-compact {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 600;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.info-text {
  font-size: 0.7rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-items {
  font-size: 0.65rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.total-amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.info-personas {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.reserva-fecha {
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 4px;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.estado-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.7rem;
}

/* Responsive design */
@media (max-width: 600px) {
  .mesa-card {
    margin-bottom: 8px;
  }

  .mesa-numero {
    font-size: 0.9rem;
  }

  .mesa-capacidad {
    font-size: 0.65rem;
  }

  .mesa-estado-chip {
    font-size: 0.6rem !important;
    height: 18px !important;
  }

  .info-label,
  .info-text {
    font-size: 0.65rem;
  }

  .total-amount {
    font-size: 0.8rem;
  }

  .pedido-info, .reserva-info {
    padding: 4px 6px;
  }
}
</style>
