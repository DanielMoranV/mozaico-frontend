<template>
  <div class="kitchen-board">
    <v-row>
      <!-- Columna PEDIDOS (Pendientes) -->
      <v-col cols="12" md="4">
        <v-card class="column-card" elevation="0">
          <v-card-title class="d-flex justify-space-between align-center pa-4 bg-warning">
            <div class="d-flex align-center gap-2">
              <v-icon color="white" size="large">mdi-clipboard-list</v-icon>
              <span class="text-h6 text-white">Pendientes</span>
            </div>
            <v-chip color="white" variant="flat" size="small">
              {{ pedidos.length }}
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="column-content pa-2">
            <div v-if="pedidos.length === 0" class="empty-state text-center pa-4">
              <v-icon size="64" color="grey-lighten-2">mdi-tray</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">
                No hay pedidos pendientes
              </p>
            </div>

            <v-fade-transition group>
              <div
                v-for="detalle in pedidos"
                :key="`pedido-${detalle.idDetalle}`"
                class="mb-3"
              >
                <KitchenOrderCard
                  :detalle="detalle"
                  :loading="loadingDetalle === detalle.idDetalle"
                  @iniciar-preparacion="handleIniciarPreparacion"
                  @cancelar="handleCancelar"
                />
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna EN_PREPARACION -->
      <v-col cols="12" md="4">
        <v-card class="column-card" elevation="0">
          <v-card-title class="d-flex justify-space-between align-center pa-4 bg-info">
            <div class="d-flex align-center gap-2">
              <v-icon color="white" size="large">mdi-chef-hat</v-icon>
              <span class="text-h6 text-white">En Preparación</span>
            </div>
            <v-chip color="white" variant="flat" size="small">
              {{ enPreparacion.length }}
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="column-content pa-2">
            <div v-if="enPreparacion.length === 0" class="empty-state text-center pa-4">
              <v-icon size="64" color="grey-lighten-2">mdi-tray</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">
                No hay productos en preparación
              </p>
            </div>

            <v-fade-transition group>
              <div
                v-for="detalle in enPreparacion"
                :key="`prep-${detalle.idDetalle}`"
                class="mb-3"
              >
                <KitchenOrderCard
                  :detalle="detalle"
                  :loading="loadingDetalle === detalle.idDetalle"
                  @marcar-servido="handleMarcarServido"
                  @cancelar="handleCancelar"
                />
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna SERVIDOS -->
      <v-col cols="12" md="4">
        <v-card class="column-card" elevation="0">
          <v-card-title class="d-flex justify-space-between align-center pa-4 bg-success">
            <div class="d-flex align-center gap-2">
              <v-icon color="white" size="large">mdi-check-circle</v-icon>
              <span class="text-h6 text-white">Listos</span>
            </div>
            <v-chip color="white" variant="flat" size="small">
              {{ servidos.length }}
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="column-content pa-2">
            <div v-if="servidos.length === 0" class="empty-state text-center pa-4">
              <v-icon size="64" color="grey-lighten-2">mdi-tray</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">
                No hay productos listos
              </p>
            </div>

            <v-fade-transition group>
              <div
                v-for="detalle in servidos"
                :key="`servido-${detalle.idDetalle}`"
                class="mb-3"
              >
                <KitchenOrderCard
                  :detalle="detalle"
                  :loading="loadingDetalle === detalle.idDetalle"
                />
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useKDSStore } from '@/stores/kdsStore';
import KitchenOrderCard from './KitchenOrderCard.vue';
import type { DetallePedidoResponseDTO } from '@/types/detallePedido';

const kdsStore = useKDSStore();
const loadingDetalle = ref<number | null>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Getters del store
const pedidos = computed(() => kdsStore.detallesPedido);
const enPreparacion = computed(() => kdsStore.detallesEnPreparacion);
const servidos = computed(() => kdsStore.detallesServidos);

// Handlers de eventos
const handleIniciarPreparacion = async (detalleId: number) => {
  loadingDetalle.value = detalleId;
  try {
    const result = await kdsStore.iniciarPreparacion(detalleId);
    if (result.success) {
      showNotification('Producto iniciado en preparación', 'success');
    } else {
      showNotification(result.error || 'Error al iniciar preparación', 'error');
    }
  } finally {
    loadingDetalle.value = null;
  }
};

const handleMarcarServido = async (detalleId: number) => {
  loadingDetalle.value = detalleId;
  try {
    const result = await kdsStore.marcarComoServido(detalleId);
    if (result.success) {
      showNotification('Producto marcado como listo', 'success');
    } else {
      showNotification(result.error || 'Error al marcar como listo', 'error');
    }
  } finally {
    loadingDetalle.value = null;
  }
};

const handleCancelar = async (detalleId: number) => {
  if (!confirm('¿Estás seguro de cancelar este producto?')) return;

  loadingDetalle.value = detalleId;
  try {
    const result = await kdsStore.cancelarProducto(detalleId);
    if (result.success) {
      showNotification('Producto cancelado', 'warning');
    } else {
      showNotification(result.error || 'Error al cancelar producto', 'error');
    }
  } finally {
    loadingDetalle.value = null;
  }
};

const showNotification = (message: string, color: string) => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};
</script>

<style scoped>
.kitchen-board {
  height: 100%;
}

.column-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.column-content {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}

.column-content::-webkit-scrollbar {
  width: 8px;
}

.column-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.column-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.gap-2 {
  gap: 8px;
}
</style>
