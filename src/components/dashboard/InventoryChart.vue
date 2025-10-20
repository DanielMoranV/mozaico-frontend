<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-donut</v-icon>
      Estado del Inventario
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="error" class="text-center text-error">
        <v-icon size="large">mdi-alert-circle</v-icon>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="!hasData" class="text-center text-grey" style="height: 300px; display: flex; align-items: center; justify-content: center;">
        <div>
          <v-icon size="x-large">mdi-package-variant</v-icon>
          <p>No hay datos de inventario</p>
        </div>
      </div>
      <div v-else style="position: relative; height: 300px">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import { useInventarioStore } from '@/stores/inventarioStore';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const inventarioStore = useInventarioStore();
const loading = ref(false);
const error = ref<string | null>(null);

const hasData = computed(() => {
  return inventarioStore.inventario.length > 0;
});

const chartData = computed(() => {
  const items = inventarioStore.inventario;

  let stockBajo = 0;
  let stockNormal = 0;
  let stockAlto = 0;
  let sinStock = 0;

  items.forEach((item: any) => {
    const stockActual = item.cantidadActual || 0;
    const stockMinimo = item.stockMinimo || 0;
    const stockMaximo = item.stockMaximo || 0;

    if (stockActual === 0) {
      sinStock++;
    } else if (stockActual < stockMinimo) {
      stockBajo++;
    } else if (stockActual > stockMaximo) {
      stockAlto++;
    } else {
      stockNormal++;
    }
  });

  return {
    labels: ['Sin Stock', 'Stock Bajo', 'Stock Normal', 'Stock Alto'],
    datasets: [
      {
        label: 'Productos',
        data: [sinStock, stockBajo, stockNormal, stockAlto],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',   // Sin stock - Rojo
          'rgba(255, 206, 86, 0.6)',   // Stock bajo - Amarillo
          'rgba(75, 192, 192, 0.6)',   // Stock normal - Verde agua
          'rgba(54, 162, 235, 0.6)'    // Stock alto - Azul
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 2
      }
    ]
  };
});

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} productos (${percentage}%)`;
        }
      }
    }
  }
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Cargar inventario si no está cargado
    if (inventarioStore.inventario.length === 0) {
      await inventarioStore.fetchInventario();
    }
  } catch (err: any) {
    console.error('Error cargando inventario:', err);
    error.value = err.message || 'Error al cargar datos de inventario';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
