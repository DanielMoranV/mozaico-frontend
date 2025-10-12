<template>
  <v-container fluid class="pos-container">
    <!-- Header con acciones rápidas -->
    <v-row class="mb-3">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div class="d-flex align-center mb-2 mb-md-0">
            <v-icon class="mr-2" color="primary" size="large">mdi-storefront</v-icon>
            <h1 class="text-h5 text-md-h4 font-weight-bold">Punto de Venta</h1>
          </div>

          <div class="d-flex align-center header-actions">
            <v-btn-toggle v-model="viewMode" variant="outlined" class="mr-2" density="compact">
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
              size="small"
              icon="mdi-refresh"
              @click="refreshMesas"
              :loading="mesaStore.loading"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-3">
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="success" variant="tonal">
          <v-card-text class="text-center pa-3">
            <v-icon size="large" class="mb-1">mdi-check-circle</v-icon>
            <div class="stat-value">{{ availableTables }}</div>
            <div class="stat-label">Disponibles</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="error" variant="tonal">
          <v-card-text class="text-center pa-3">
            <v-icon size="large" class="mb-1">mdi-account-group</v-icon>
            <div class="stat-value">{{ occupiedTables }}</div>
            <div class="stat-label">Ocupadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="warning" variant="tonal">
          <v-card-text class="text-center pa-3">
            <v-icon size="large" class="mb-1">mdi-clock-outline</v-icon>
            <div class="stat-value">{{ reservedTables }}</div>
            <div class="stat-label">Reservadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="stat-card" color="info" variant="tonal">
          <v-card-text class="text-center pa-3">
            <v-icon size="large" class="mb-1">mdi-tools</v-icon>
            <div class="stat-value">{{ maintenanceTables }}</div>
            <div class="stat-label">Mantenimiento</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-row class="mb-3">
      <v-col cols="12" sm="6">
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
      <v-col cols="12" sm="6">
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
            cols="6" sm="6" md="4" lg="3" xl="2"
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
                  <div class="font-weight-bold">S/{{ mesa.ultimoPedido.total?.toFixed(2) || '0.00' }}</div>
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
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 4px 0;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
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

.header-actions {
  gap: 8px;
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
}

@media (max-width: 600px) {
  .pos-container {
    padding: 0 4px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-card .v-card-text {
    padding: 8px !important;
  }

  .stat-card .v-icon {
    font-size: 1.25rem !important;
  }

  /* Ajustar título del card */
  .v-card-title {
    font-size: 0.95rem !important;
    padding: 12px !important;
  }

  /* Reducir gap en rows */
  .v-row {
    margin: -4px;
  }

  .v-row > .v-col {
    padding: 4px;
  }
}

@media (max-width: 400px) {
  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .header-actions {
    flex-wrap: nowrap;
  }
}
</style>
