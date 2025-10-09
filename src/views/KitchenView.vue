<template>
  <v-container fluid class="kitchen-view pa-4">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center gap-3">
              <v-icon size="x-large" color="primary">mdi-chef-hat</v-icon>
              <div>
                <h1 class="text-h4 font-weight-bold">Kitchen Display System</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Gestión de preparación de pedidos
                </p>
              </div>
            </div>

            <div class="d-flex align-center gap-2">
              <!-- Filtro: Solo productos que requieren preparación -->
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :color="kdsStore.filtroRequierePreparacion ? 'primary' : 'grey'"
                    variant="tonal"
                    icon
                    @click="toggleFiltroPreparacion"
                  >
                    <v-icon>
                      {{ kdsStore.filtroRequierePreparacion ? 'mdi-chef-hat' : 'mdi-food' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ kdsStore.filtroRequierePreparacion ? 'Mostrando solo cocina' : 'Mostrando todos los productos' }}
                </span>
              </v-tooltip>

              <!-- Auto-refresh toggle -->
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :color="kdsStore.autoRefreshEnabled ? 'success' : 'grey'"
                    variant="tonal"
                    icon
                    @click="toggleAutoRefresh"
                  >
                    <v-icon>
                      {{ kdsStore.autoRefreshEnabled ? 'mdi-sync' : 'mdi-sync-off' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ kdsStore.autoRefreshEnabled ? 'Desactivar' : 'Activar' }} actualización automática
                </span>
              </v-tooltip>

              <!-- Refresh button -->
              <v-btn
                color="primary"
                variant="tonal"
                :loading="kdsStore.loading"
                @click="refreshData"
              >
                <v-icon start>mdi-refresh</v-icon>
                Actualizar
              </v-btn>

              <!-- Stats -->
              <v-chip color="warning" variant="flat" class="ml-2">
                <v-icon start>mdi-clipboard-list</v-icon>
                {{ kdsStore.totalPedidos }} Pendientes
              </v-chip>

              <v-chip color="info" variant="flat">
                <v-icon start>mdi-chef-hat</v-icon>
                {{ kdsStore.totalEnPreparacion }} En Prep.
              </v-chip>

              <v-chip color="success" variant="flat">
                <v-icon start>mdi-check-circle</v-icon>
                {{ kdsStore.totalServidos }} Listos
              </v-chip>
            </div>
          </v-card-title>

          <!-- Error alert -->
          <v-alert
            v-if="kdsStore.error"
            type="error"
            variant="tonal"
            closable
            class="ma-4"
            @click:close="kdsStore.clearError()"
          >
            {{ kdsStore.error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Kitchen Board -->
    <v-row>
      <v-col cols="12">
        <KitchenBoard />
      </v-col>
    </v-row>

    <!-- Footer info -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card variant="tonal" color="grey-lighten-4" class="py-1">
          <v-card-text class="d-flex justify-center align-center text-caption text-medium-emphasis pa-2">
            <v-icon size="small" class="mr-1">mdi-sync</v-icon>
            Auto-refresh 30s
            <v-divider vertical class="mx-3"></v-divider>
            <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
            {{ lastUpdateTime }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useKDSStore } from '@/stores/kdsStore';
import KitchenBoard from '@/components/kds/KitchenBoard.vue';

const kdsStore = useKDSStore();
const lastUpdateTime = ref<string>('Nunca');

// Cargar datos al montar
onMounted(async () => {
  await loadData();
  // Habilitar auto-refresh cada 30 segundos
  kdsStore.enableAutoRefresh(30000);
  updateLastUpdateTime();
});

// Limpiar al desmontar
onUnmounted(() => {
  kdsStore.disableAutoRefresh();
});

const loadData = async () => {
  await kdsStore.fetchTableroCompleto();
  updateLastUpdateTime();
};

const refreshData = async () => {
  await loadData();
};

const toggleAutoRefresh = () => {
  if (kdsStore.autoRefreshEnabled) {
    kdsStore.disableAutoRefresh();
  } else {
    kdsStore.enableAutoRefresh(30000);
  }
};

const toggleFiltroPreparacion = async () => {
  kdsStore.setFiltroRequierePreparacion(!kdsStore.filtroRequierePreparacion);
  // Recargar datos con el nuevo filtro
  await loadData();
};

const updateLastUpdateTime = () => {
  const now = new Date();
  lastUpdateTime.value = now.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
</script>

<style scoped>
.kitchen-view {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
