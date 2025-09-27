<template>
  <v-container fluid class="pos-container">
    <!-- Header con acciones rápidas -->
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="primary" size="large">mdi-storefront</v-icon>
          <h1 class="text-h4 font-weight-bold">Punto de Venta</h1>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-btn-toggle v-model="viewMode" variant="outlined" class="mr-3">
          <v-btn value="grid" size="small">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" size="small">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>

        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-refresh"
          @click="refreshMesas"
          :loading="mesaStore.loading"
        >
          Actualizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="success" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="x-large" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ availableTables }}</div>
            <div class="text-caption">Disponibles</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="error" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="x-large" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold">{{ occupiedTables }}</div>
            <div class="text-caption">Ocupadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="warning" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="x-large" class="mb-2">mdi-clock-outline</v-icon>
            <div class="text-h4 font-weight-bold">{{ reservedTables }}</div>
            <div class="text-caption">Reservadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="info" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="x-large" class="mb-2">mdi-tools</v-icon>
            <div class="text-h4 font-weight-bold">{{ maintenanceTables }}</div>
            <div class="text-caption">Mantenimiento</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchMesa"
          label="Buscar mesa"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="filterEstado"
          :items="estadoOptions"
          label="Filtrar por estado"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <!-- Lista de mesas -->
    <v-card class="elevation-2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-table-furniture</v-icon>
        Mesas ({{ filteredMesas.length }})
      </v-card-title>
      <v-card-text>
        <!-- Loading state -->
        <v-row v-if="mesaStore.loading" class="justify-center align-center" style="min-height: 200px;">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
            <p class="mt-4 text-h6">Cargando mesas...</p>
          </v-col>
        </v-row>

        <!-- Grid view -->
        <v-row v-else-if="viewMode === 'grid' && filteredMesas.length > 0">
          <v-col
            v-for="mesa in filteredMesas"
            :key="mesa.idMesa"
            cols="12" sm="6" md="4" lg="3" xl="2"
          >
            <MesaCard :mesa="mesa" @select-mesa="handleSelectMesa" />
          </v-col>
        </v-row>

        <!-- List view -->
        <v-list v-else-if="viewMode === 'list' && filteredMesas.length > 0">
          <v-list-item
            v-for="mesa in filteredMesas"
            :key="mesa.idMesa"
            @click="handleSelectMesa(mesa.idMesa)"
            class="mesa-list-item"
          >
            <template v-slot:prepend>
              <v-avatar :color="getEstadoColor(mesa.estado)" size="40">
                <v-icon color="white">{{ getEstadoIcon(mesa.estado) }}</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold">
              Mesa #{{ mesa.numeroMesa }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Capacidad: {{ mesa.capacidad }} personas
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="text-right">
                <v-chip :color="getEstadoColor(mesa.estado)" size="small" variant="tonal" class="mb-1">
                  {{ getEstadoTexto(mesa.estado) }}
                </v-chip>
                <div v-if="mesa.ultimoPedido" class="text-caption text-grey">
                  <div>Pedido: #{{ mesa.ultimoPedido.idPedido }}</div>
                  <div class="font-weight-bold">${{ mesa.ultimoPedido.total.toFixed(2) }}</div>
                </div>
                <div v-else-if="mesa.ultimaReserva" class="text-caption text-grey">
                  <div>{{ mesa.ultimaReserva.cliente }}</div>
                  <div>{{ formatDate(mesa.ultimaReserva.fechaHoraReserva) }}</div>
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- Empty state -->
        <v-row v-else class="justify-center align-center" style="min-height: 200px;">
          <v-col cols="12" class="text-center">
            <v-icon size="80" color="grey-lighten-2">mdi-table-furniture</v-icon>
            <p class="text-h6 mt-4 text-grey">{{ getEmptyMessage() }}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- OrderPanel mejorado -->
    <OrderPanel
      :mesa-id="selectedMesaId"
      :visible="!!selectedMesaId"
      @close-panel="handleClosePanel"
      @order-updated="handleOrderUpdated"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMesaStore } from '@/stores/mesaStore';
import { EstadoMesa } from '@/types/enums';
import type { Mesa } from '@/types/mesa';
import MesaCard from '@/components/pos/MesaCard.vue';
import OrderPanel from '@/components/pos/OrderPanel.vue';

const mesaStore = useMesaStore();
const selectedMesaId = ref<number | null>(null);
const searchMesa = ref('');
const filterEstado = ref<EstadoMesa | null>(null);
const viewMode = ref<'grid' | 'list'>('grid');

const estadoOptions = [
  { title: 'Disponible', value: EstadoMesa.DISPONIBLE },
  { title: 'Ocupada', value: EstadoMesa.OCUPADA },
  { title: 'Reservada', value: EstadoMesa.RESERVADA },
  { title: 'Mantenimiento', value: EstadoMesa.MANTENIMIENTO },
];

// Computed properties para estadísticas
const availableTables = computed(() => {
  return mesaStore.mesas.filter(mesa => mesa.estado === EstadoMesa.DISPONIBLE).length;
});

const occupiedTables = computed(() => {
  return mesaStore.mesas.filter(mesa => mesa.estado === EstadoMesa.OCUPADA).length;
});

const reservedTables = computed(() => {
  return mesaStore.mesas.filter(mesa => mesa.estado === EstadoMesa.RESERVADA).length;
});

const maintenanceTables = computed(() => {
  return mesaStore.mesas.filter(mesa => mesa.estado === EstadoMesa.MANTENIMIENTO).length;
});

// Mesas filtradas
const filteredMesas = computed(() => {
  let mesas = mesaStore.mesas;

  // Filtro por búsqueda
  if (searchMesa.value) {
    const searchTerm = searchMesa.value.toLowerCase();
    mesas = mesas.filter(mesa =>
      mesa.numeroMesa.toString().includes(searchTerm) ||
      mesa.capacidad.toString().includes(searchTerm)
    );
  }

  // Filtro por estado
  if (filterEstado.value) {
    mesas = mesas.filter(mesa => mesa.estado === filterEstado.value);
  }

  return mesas;
});

onMounted(() => {
  mesaStore.fetchMesas();
});

const refreshMesas = async () => {
  await mesaStore.fetchMesas();
};

const handleSelectMesa = (mesaId: number) => {
  selectedMesaId.value = mesaId;
};

const handleClosePanel = () => {
  selectedMesaId.value = null;
};

const handleOrderUpdated = () => {
  // Actualizar las mesas después de una operación en el pedido
  mesaStore.fetchMesas();
};

const getEstadoColor = (estado: EstadoMesa) => {
  switch (estado) {
    case EstadoMesa.DISPONIBLE:
      return 'success';
    case EstadoMesa.OCUPADA:
      return 'error';
    case EstadoMesa.RESERVADA:
      return 'warning';
    case EstadoMesa.MANTENIMIENTO:
      return 'info';
    default:
      return 'grey';
  }
};

const getEstadoIcon = (estado: EstadoMesa) => {
  switch (estado) {
    case EstadoMesa.DISPONIBLE:
      return 'mdi-check-circle';
    case EstadoMesa.OCUPADA:
      return 'mdi-account-group';
    case EstadoMesa.RESERVADA:
      return 'mdi-clock-outline';
    case EstadoMesa.MANTENIMIENTO:
      return 'mdi-tools';
    default:
      return 'mdi-help-circle';
  }
};

const getEstadoTexto = (estado: EstadoMesa) => {
  switch (estado) {
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
};

const getEmptyMessage = () => {
  if (searchMesa.value || filterEstado.value) {
    return 'No se encontraron mesas con los filtros aplicados.';
  }
  return 'No hay mesas disponibles.';
};

const formatDate = (dateString: string) => {
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
.pos-container {
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.mesa-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.mesa-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.v-card {
  border-radius: 12px;
}

.v-btn-toggle {
  height: 40px;
}

/* Animaciones suaves */
.v-row {
  transition: opacity 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .pos-container {
    padding: 0 8px;
  }

  .stat-card .text-h4 {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .d-flex.justify-end {
    justify-content: flex-start !important;
    margin-top: 16px;
  }

  .v-btn-toggle {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
