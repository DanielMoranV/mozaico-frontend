<template>
  <v-container fluid>
    <!-- Header del Dashboard -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-icon size="32" class="me-3" color="primary">mdi-view-dashboard</v-icon>
          <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        </div>
        <p class="text-h6 text-medium-emphasis">Bienvenido al panel de control de Mozaico</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-6">
      <v-col v-for="card in summaryCards" :key="card.title" cols="12" sm="6" md="3">
        <v-card class="h-100" elevation="2">
          <v-card-text class="pb-0">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">{{ card.title }}</p>
                <h2 class="text-h4 font-weight-bold">{{ card.value }}</h2>
                <div class="d-flex align-center mt-2">
                  <v-icon :color="card.trend > 0 ? 'success' : 'error'" size="16" class="me-1">
                    {{ card.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </v-icon>
                  <span :class="card.trend > 0 ? 'text-success' : 'text-error'" class="text-caption">
                    {{ Math.abs(card.trend) }}%
                  </span>
                </div>
              </div>
              <v-avatar :color="card.color" size="56">
                <v-icon color="white" size="24">{{ card.icon }}</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos y actividad reciente -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="me-2">mdi-chart-line</v-icon>
            Ventas del Mes
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-icon size="64" color="primary" class="mb-4">mdi-chart-areaspline</v-icon>
              <p class="text-body-1 text-medium-emphasis">Gráfico de ventas próximamente</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="h-100">
          <v-card-title>
            <v-icon class="me-2">mdi-history</v-icon>
            Actividad Reciente
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="activity in recentActivity"
                :key="activity.id"
                :prepend-icon="activity.icon"
                :title="activity.title"
                :subtitle="activity.time"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar size="32" :color="activity.color">
                    <v-icon size="16" color="white">{{ activity.icon }}</v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sección de accesos rápidos -->
    <v-row class="mt-6">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Accesos Rápidos</h2>
      </v-col>
      <v-col v-for="quickAccess in quickActions" :key="quickAccess.title" cols="12" sm="6" md="3">
        <v-card
          class="h-100 cursor-pointer"
          elevation="2"
          hover
          @click="() => $router.push(quickAccess.to)"
        >
          <v-card-text class="text-center pa-6">
            <v-avatar size="48" :color="quickAccess.color" class="mb-3">
              <v-icon color="white" size="24">{{ quickAccess.icon }}</v-icon>
            </v-avatar>
            <h3 class="text-h6 mb-2">{{ quickAccess.title }}</h3>
            <p class="text-caption text-medium-emphasis">{{ quickAccess.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const $router = useRouter();

const summaryCards = ref([
  {
    title: 'Pedidos Hoy',
    value: '156',
    trend: 8.2,
    icon: 'mdi-clipboard-list',
    color: 'primary'
  },
  {
    title: 'Ventas Hoy',
    value: '$2,847',
    trend: 12.5,
    icon: 'mdi-currency-usd',
    color: 'success'
  },
  {
    title: 'Mesas Ocupadas',
    value: '12/20',
    trend: -5.1,
    icon: 'mdi-table-chair',
    color: 'warning'
  },
  {
    title: 'Clientes Activos',
    value: '48',
    trend: 3.7,
    icon: 'mdi-account-group',
    color: 'info'
  }
]);

const recentActivity = ref([
  {
    id: 1,
    title: 'Nuevo pedido - Mesa 5',
    time: 'Hace 2 minutos',
    icon: 'mdi-plus-circle',
    color: 'success'
  },
  {
    id: 2,
    title: 'Pago procesado - $45.80',
    time: 'Hace 5 minutos',
    icon: 'mdi-credit-card',
    color: 'primary'
  },
  {
    id: 3,
    title: 'Mesa 3 liberada',
    time: 'Hace 8 minutos',
    icon: 'mdi-check-circle',
    color: 'info'
  },
  {
    id: 4,
    title: 'Stock bajo: Tomates',
    time: 'Hace 15 minutos',
    icon: 'mdi-alert-circle',
    color: 'warning'
  },
  {
    id: 5,
    title: 'Nueva reserva para mañana',
    time: 'Hace 30 minutos',
    icon: 'mdi-calendar-plus',
    color: 'secondary'
  }
]);

const quickActions = ref([
  {
    title: 'Nuevo Pedido',
    description: 'Crear un nuevo pedido',
    icon: 'mdi-plus-circle',
    color: 'primary',
    to: '/pedidos'
  },
  {
    title: 'Ver Mesas',
    description: 'Estado de las mesas',
    icon: 'mdi-table-chair',
    color: 'success',
    to: '/mesas'
  },
  {
    title: 'Inventario',
    description: 'Gestionar stock',
    icon: 'mdi-package-variant',
    color: 'warning',
    to: '/inventario'
  },
  {
    title: 'Reportes',
    description: 'Ver estadísticas',
    icon: 'mdi-chart-bar',
    color: 'info',
    to: '/reportes'
  }
]);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.h-100 {
  height: 100%;
}
</style>
