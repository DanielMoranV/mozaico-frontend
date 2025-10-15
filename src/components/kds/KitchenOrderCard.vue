<template>
  <v-card
    :class="['kitchen-order-card', `estado-${detalle.estado.toLowerCase()}`]"
    elevation="2"
    density="compact"
  >
    <v-card-title class="d-flex justify-space-between align-center pa-1 px-2">
      <div class="d-flex align-center gap-1">
        <v-icon :color="getIconColor()" size="x-small">{{ getIcon() }}</v-icon>
        <span class="text-subtitle-2 font-weight-bold"
          >Mesa {{ detalle.pedido?.mesa?.numeroMesa || "N/A" }}</span
        >
      </div>
      <v-chip :color="getEstadoColor()" size="x-small" variant="flat" class="text-caption">
        {{ getEstadoLabel() }}
      </v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-2 py-1">
      <!-- Información del producto -->
      <div class="product-info mb-1">
        <div class="d-flex justify-space-between align-center">
          <h3 class="text-subtitle-1 font-weight-bold mb-0">
            {{ detalle.producto.nombre }}
          </h3>
          <v-chip color="primary" size="small" variant="tonal" class="ml-2">
            x{{ detalle.cantidad }}
          </v-chip>
        </div>

        <!-- Observaciones -->
        <v-alert
          v-if="detalle.observaciones"
          density="compact"
          type="info"
          variant="tonal"
          class="mt-1 pa-1 text-caption"
        >
          <div class="d-flex align-center">
            <v-icon size="x-small" class="mr-1">mdi-note-text</v-icon>
            <span><strong>Obs:</strong> {{ detalle.observaciones }}</span>
          </div>
        </v-alert>
      </div>

      <!-- Información adicional del pedido -->
      <div class="order-metadata text-caption text-medium-emphasis">
        <div class="d-flex align-center gap-1">
          <v-icon size="x-small">mdi-clock-outline</v-icon>
          <span>{{ formatearFecha(detalle.pedido?.fechaPedido) }}</span>
        </div>
        <div
          v-if="detalle.pedido?.cliente"
          class="d-flex align-center gap-1"
        >
          <v-icon size="x-small">mdi-account</v-icon>
          <span
            >{{ detalle.pedido.cliente.nombre }}
            {{ detalle.pedido.cliente.apellido }}</span
          >
        </div>
        <div
          v-if="detalle.pedido?.observaciones"
          class="d-flex align-center gap-1"
        >
          <v-icon size="x-small">mdi-comment-text-outline</v-icon>
          <span>{{ detalle.pedido.observaciones }}</span>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botones de acción -->
    <v-card-actions class="pa-1 px-2">
      <div class="d-flex flex-column w-100" style="gap: 4px">
        <!-- Botón principal según estado -->
        <!-- PEDIDO: Productos que requieren preparación → Iniciar Preparación -->
        <v-btn
          v-if="
            detalle.estado === 'PEDIDO' && detalle.producto.requierePreparacion
          "
          color="success"
          variant="flat"
          block
          size="small"
          :loading="loading"
          @click="$emit('iniciar-preparacion', detalle.idDetalle)"
        >
          <v-icon start size="small">mdi-chef-hat</v-icon>
          <span class="text-caption">Iniciar</span>
        </v-btn>

        <!-- PEDIDO: Productos que NO requieren preparación → Marcar como Listo directamente -->
        <v-btn
          v-else-if="
            detalle.estado === 'PEDIDO' && !detalle.producto.requierePreparacion
          "
          color="primary"
          variant="flat"
          block
          size="small"
          :loading="loading"
          @click="$emit('marcar-listo', detalle.idDetalle)"
        >
          <v-icon start size="small">mdi-room-service</v-icon>
          <span class="text-caption">Listo</span>
        </v-btn>

        <!-- EN_PREPARACION: Cocina terminó → Marcar como Listo -->
        <v-btn
          v-else-if="detalle.estado === 'EN_PREPARACION'"
          color="primary"
          variant="flat"
          block
          size="small"
          :loading="loading"
          @click="$emit('marcar-listo', detalle.idDetalle)"
        >
          <v-icon start size="small">mdi-room-service</v-icon>
          <span class="text-caption">Listo</span>
        </v-btn>

        <!-- LISTO: Mesero recoge → Marcar como Servido -->
        <v-btn
          v-else-if="detalle.estado === 'LISTO'"
          color="success"
          variant="flat"
          block
          size="small"
          :loading="loading"
          @click="$emit('marcar-servido', detalle.idDetalle)"
        >
          <v-icon start size="small">mdi-check-all</v-icon>
          <span class="text-caption">Servido</span>
        </v-btn>

        <!-- SERVIDO: Estado final -->
        <v-btn
          v-else-if="detalle.estado === 'SERVIDO'"
          color="success"
          variant="tonal"
          block
          size="small"
          disabled
        >
          <v-icon start size="small">mdi-check-all</v-icon>
          <span class="text-caption">Servido</span>
        </v-btn>

        <!-- Botón de cancelar (siempre disponible excepto cuando ya está cancelado o servido) -->
        <v-btn
          v-if="detalle.estado !== 'CANCELADO' && detalle.estado !== 'SERVIDO'"
          color="error"
          variant="text"
          block
          size="x-small"
          :loading="loading"
          @click="mostrarDialogoCancelar = true"
        >
          <v-icon start size="x-small">mdi-close-circle</v-icon>
          <span class="text-caption">Cancelar</span>
        </v-btn>
      </div>
    </v-card-actions>

    <!-- Diálogo de confirmación de cancelación -->
    <v-dialog v-model="mostrarDialogoCancelar" max-width="400">
      <v-card density="compact">
        <v-card-title class="d-flex align-center gap-2 bg-error pa-3">
          <v-icon color="white" size="large">mdi-alert-circle</v-icon>
          <span class="text-white text-h6">Cancelar Producto</span>
        </v-card-title>

        <v-card-text class="pa-4">
          <p class="text-body-1 mb-3">
            ¿Estás seguro de que deseas cancelar este producto?
          </p>

          <v-alert type="warning" variant="tonal" density="compact">
            <strong>{{ detalle.producto.nombre }}</strong> x{{
              detalle.cantidad
            }}
            <br />
            <span class="text-caption"
              >Mesa {{ detalle.pedido?.mesa?.numeroMesa }}</span
            >
          </v-alert>

          <p class="text-caption text-medium-emphasis mt-3 mb-0">
            Esta acción no se puede deshacer.
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="mostrarDialogoCancelar = false">
            No, volver
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="loading"
            @click="confirmarCancelacion"
          >
            Sí, cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DetallePedidoResponseDTO } from "@/types/detallePedido";
import type { EstadoDetallePedido } from "@/types/enums";

interface Props {
  detalle: DetallePedidoResponseDTO;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  "iniciar-preparacion": [detalleId: number];
  "marcar-listo": [detalleId: number];
  "marcar-servido": [detalleId: number];
  cancelar: [detalleId: number];
}>();

// Estado del diálogo de cancelación
const mostrarDialogoCancelar = ref(false);

// Función para confirmar cancelación
const confirmarCancelacion = () => {
  emit("cancelar", props.detalle.idDetalle);
  mostrarDialogoCancelar.value = false;
};

const getIcon = () => {
  switch (props.detalle.estado) {
    case "PEDIDO":
      return "mdi-clipboard-list";
    case "EN_PREPARACION":
      return "mdi-chef-hat";
    case "LISTO":
      return "mdi-room-service";
    case "SERVIDO":
      return "mdi-check-all";
    case "CANCELADO":
      return "mdi-close-circle";
    default:
      return "mdi-help-circle";
  }
};

const getIconColor = () => {
  switch (props.detalle.estado) {
    case "PEDIDO":
      return "warning";
    case "EN_PREPARACION":
      return "info";
    case "LISTO":
      return "primary";
    case "SERVIDO":
      return "success";
    case "CANCELADO":
      return "error";
    default:
      return "grey";
  }
};

const getEstadoColor = () => {
  switch (props.detalle.estado) {
    case "PEDIDO":
      return "warning";
    case "EN_PREPARACION":
      return "info";
    case "LISTO":
      return "primary";
    case "SERVIDO":
      return "success";
    case "CANCELADO":
      return "error";
    default:
      return "grey";
  }
};

const getEstadoLabel = () => {
  switch (props.detalle.estado) {
    case "PEDIDO":
      return "Pendiente";
    case "EN_PREPARACION":
      return "En Preparación";
    case "LISTO":
      return "Listo";
    case "SERVIDO":
      return "Servido";
    case "CANCELADO":
      return "Cancelado";
    default:
      return props.detalle.estado;
  }
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "Hace un momento";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;

  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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

.kitchen-order-card.estado-listo {
  border-left-color: rgb(var(--v-theme-primary));
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
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-info), 0);
  }
}

.product-info {
  min-height: auto; /* Reducido para compactar */
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
