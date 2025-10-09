<template>
  <v-card class="empresa-stats-card">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
      <span>Estadísticas de la Empresa</span>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <!-- Productos -->
        <v-col cols="6">
          <v-card
            class="stat-card"
            color="blue-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center py-4">
              <v-icon size="48" color="blue">mdi-food-variant</v-icon>
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
        <v-col cols="6">
          <v-card
            class="stat-card"
            color="green-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center py-4">
              <v-icon size="48" color="green">mdi-account-group</v-icon>
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
        <v-col cols="6">
          <v-card
            class="stat-card"
            color="purple-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center py-4">
              <v-icon size="48" color="purple">mdi-account-tie</v-icon>
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
        <v-col cols="6">
          <v-card
            class="stat-card"
            color="orange-lighten-5"
            variant="tonal"
          >
            <v-card-text class="text-center py-4">
              <v-icon size="48" color="orange">mdi-clipboard-list</v-icon>
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { EmpresaEstadisticas } from '@/types/empresa';

interface Props {
  estadisticas: EmpresaEstadisticas;
}

defineProps<Props>();

</script>

<style scoped>
.empresa-stats-card {
  height: 100%;
}

.stat-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.stat-number {
  line-height: 1.2;
}

.stat-label {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

</style>
