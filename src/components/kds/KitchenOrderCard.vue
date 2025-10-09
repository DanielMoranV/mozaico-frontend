<template>
  <v-card
    :class="['kitchen-order-card', `estado-${detalle.estado.toLowerCase()}`]"
    elevation="3"
  >
    <v-card-title class="d-flex justify-space-between align-center pa-3">
      <div class="d-flex align-center gap-2">
        <v-icon :color="getIconColor()" size="small">{{ getIcon() }}</v-icon>
        <span class="text-h6">Mesa {{ detalle.pedido?.mesa?.numeroMesa || 'N/A' }}</span>
      </div>
      <v-chip :color="getEstadoColor()" size="small" variant="flat">
        {{ getEstadoLabel() }}
      </v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-3">
      <!-- Información del producto -->
      <div class="product-info mb-3">
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h5 font-weight-bold">{{ detalle.producto.nombre }}</h3>
          <v-chip color="primary" size="large" variant="tonal">
            x{{ detalle.cantidad }}
          </v-chip>
        </div>

        <!-- Observaciones -->
        <v-alert
          v-if="detalle.observaciones"
          density="compact"
          type="info"
          variant="tonal"
          class="mt-2"
        >
          <v-icon size="small" class="mr-2">mdi-note-text</v-icon>
          <strong>Observaciones:</strong> {{ detalle.observaciones }}
        </v-alert>
      </div>

      <!-- Información adicional del pedido -->
      <div class="order-metadata text-caption text-medium-emphasis">
        <div class="d-flex align-center gap-1 mb-1">
          <v-icon size="x-small">mdi-clock-outline</v-icon>
          <span>{{ formatearFecha(detalle.pedido?.fechaPedido) }}</span>
        </div>
        <div v-if="detalle.pedido?.cliente" class="d-flex align-center gap-1 mb-1">
          <v-icon size="x-small">mdi-account</v-icon>
          <span>{{ detalle.pedido.cliente.nombre }} {{ detalle.pedido.cliente.apellido }}</span>
        </div>
        <div v-if="detalle.pedido?.observaciones" class="d-flex align-center gap-1">
          <v-icon size="x-small">mdi-comment-text-outline</v-icon>
          <span>{{ detalle.pedido.observaciones }}</span>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botones de acción -->
    <v-card-actions class="pa-3">
      <v-btn
        v-if="detalle.estado === 'PEDIDO'"
        color="success"
        variant="flat"
        block
        size="large"
        :loading="loading"
        @click="$emit('iniciar-preparacion', detalle.idDetalle)"
      >
        <v-icon start>mdi-chef-hat</v-icon>
        Iniciar Preparación
      </v-btn>

      <v-btn
        v-else-if="detalle.estado === 'EN_PREPARACION'"
        color="primary"
        variant="flat"
        block
        size="large"
        :loading="loading"
        @click="$emit('marcar-servido', detalle.idDetalle)"
      >
        <v-icon start>mdi-check-circle</v-icon>
        Marcar como Listo
      </v-btn>

      <template v-else-if="detalle.estado === 'SERVIDO'">
        <v-btn
          color="grey"
          variant="text"
          block
          disabled
        >
          <v-icon start>mdi-check-all</v-icon>
          Servido
        </v-btn>
      </template>

      <!-- Botón de cancelar (siempre disponible excepto cuando ya está cancelado) -->
      <v-btn
        v-if="detalle.estado !== 'CANCELADO' && detalle.estado !== 'SERVIDO'"
        color="error"
        variant="outlined"
        size="small"
        icon
        :loading="loading"
        @click="$emit('cancelar', detalle.idDetalle)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DetallePedidoResponseDTO } from '@/types/detallePedido';
import type { EstadoDetallePedido } from '@/types/enums';

interface Props {
  detalle: DetallePedidoResponseDTO;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'iniciar-preparacion': [detalleId: number];
  'marcar-servido': [detalleId: number];
  'cancelar': [detalleId: number];
}>();

const getIcon = () => {
  switch (props.detalle.estado) {
    case 'PEDIDO':
      return 'mdi-clipboard-list';
    case 'EN_PREPARACION':
      return 'mdi-chef-hat';
    case 'SERVIDO':
      return 'mdi-check-circle';
    case 'CANCELADO':
      return 'mdi-close-circle';
    default:
      return 'mdi-help-circle';
  }
};

const getIconColor = () => {
  switch (props.detalle.estado) {
    case 'PEDIDO':
      return 'warning';
    case 'EN_PREPARACION':
      return 'info';
    case 'SERVIDO':
      return 'success';
    case 'CANCELADO':
      return 'error';
    default:
      return 'grey';
  }
};

const getEstadoColor = () => {
  switch (props.detalle.estado) {
    case 'PEDIDO':
      return 'warning';
    case 'EN_PREPARACION':
      return 'info';
    case 'SERVIDO':
      return 'success';
    case 'CANCELADO':
      return 'error';
    default:
      return 'grey';
  }
};

const getEstadoLabel = () => {
  switch (props.detalle.estado) {
    case 'PEDIDO':
      return 'Pendiente';
    case 'EN_PREPARACION':
      return 'En Preparación';
    case 'SERVIDO':
      return 'Servido';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return props.detalle.estado;
  }
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return 'Hace un momento';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;

  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.kitchen-order-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.kitchen-order-card.estado-pedido {
  border-left-color: rgb(var(--v-theme-warning));
}

.kitchen-order-card.estado-en_preparacion {
  border-left-color: rgb(var(--v-theme-info));
  animation: pulse 2s infinite;
}

.kitchen-order-card.estado-servido {
  border-left-color: rgb(var(--v-theme-success));
  opacity: 0.85;
}

.kitchen-order-card.estado-cancelado {
  border-left-color: rgb(var(--v-theme-error));
  opacity: 0.7;
}

.kitchen-order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-info), 0);
  }
}

.product-info {
  min-height: 60px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
