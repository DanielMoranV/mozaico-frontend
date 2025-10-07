<template>
  <v-card class="empresa-stats-card">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
      <span>Estadísticas de la Empresa</span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Productos -->
        <v-col cols="6" md="3">
          <v-card
            class="stat-card"
            color="blue-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center">
              <v-icon size="40" color="blue">mdi-food-variant</v-icon>
              <div class="stat-number text-h4 font-weight-bold mt-2">
                {{ estadisticas.totalProductos }}
              </div>
              <div class="stat-label text-caption text-grey-darken-1">
                Productos
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Clientes -->
        <v-col cols="6" md="3">
          <v-card
            class="stat-card"
            color="green-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center">
              <v-icon size="40" color="green">mdi-account-group</v-icon>
              <div class="stat-number text-h4 font-weight-bold mt-2">
                {{ estadisticas.totalClientes }}
              </div>
              <div class="stat-label text-caption text-grey-darken-1">
                Clientes
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Empleados -->
        <v-col cols="6" md="3">
          <v-card
            class="stat-card"
            color="purple-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center">
              <v-icon size="40" color="purple">mdi-account-tie</v-icon>
              <div class="stat-number text-h4 font-weight-bold mt-2">
                {{ estadisticas.totalEmpleados }}
              </div>
              <div class="stat-label text-caption text-grey-darken-1">
                Empleados
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Pedidos -->
        <v-col cols="6" md="3">
          <v-card
            class="stat-card"
            color="orange-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center">
              <v-icon size="40" color="orange">mdi-clipboard-list</v-icon>
              <div class="stat-number text-h4 font-weight-bold mt-2">
                {{ estadisticas.totalPedidos }}
              </div>
              <div class="stat-label text-caption text-grey-darken-1">
                Pedidos
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Información adicional -->
      <v-divider class="my-4" />

      <v-row>
        <v-col cols="12" md="6">
          <div class="info-item">
            <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
            <div>
              <div class="text-caption text-grey">Fecha de Creación</div>
              <div class="text-body-2 font-weight-medium">
                {{ formatDate(estadisticas.empresa.fechaCreacion) }}
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="info-item">
            <v-icon class="mr-2" color="primary">mdi-update</v-icon>
            <div>
              <div class="text-caption text-grey">Última Actualización</div>
              <div class="text-body-2 font-weight-medium">
                {{ formatDate(estadisticas.empresa.fechaActualizacion) }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { EmpresaEstadisticas } from '@/types/empresa';

interface Props {
  estadisticas: EmpresaEstadisticas;
}

defineProps<Props>();

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.empresa-stats-card {
  height: 100%;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-number {
  line-height: 1.2;
}

.stat-label {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}
</style>
