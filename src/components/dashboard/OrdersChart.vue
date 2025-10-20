<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-bar</v-icon>
      Pedidos por Estado
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="error" class="text-center text-error">
        <v-icon size="large">mdi-alert-circle</v-icon>
        <p>{{ error }}</p>
      </div>
      <div v-else style="position: relative; height: 300px">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import { usePedidoStore } from '@/stores/pedidoStore';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const pedidoStore = usePedidoStore();
const loading = ref(false);
const error = ref<string | null>(null);

const chartData = computed(() => {
  const pedidos = pedidoStore.pedidos;

  // Contar pedidos por estado
  const estadoCounts: Record<string, number> = {
    'PENDIENTE': 0,
    'EN_PREPARACION': 0,
    'LISTO': 0,
    'SERVIDO': 0,
    'COMPLETADO': 0,
    'CANCELADO': 0
  };

  pedidos.forEach(pedido => {
    const estado = pedido?.estado?.toString() || 'PENDIENTE';
    if (estado in estadoCounts) {
      estadoCounts[estado] = (estadoCounts[estado] || 0) + 1;
    }
  });

  const labels = Object.keys(estadoCounts).map(estado => {
    // Formatear labels
    switch (estado) {
      case 'EN_PREPARACION': return 'En Preparación';
      case 'LISTO': return 'Listo';
      case 'SERVIDO': return 'Servido';
      case 'COMPLETADO': return 'Completado';
      case 'CANCELADO': return 'Cancelado';
      default: return 'Pendiente';
    }
  });

  const data = Object.values(estadoCounts);

  // Colores por estado
  const backgroundColors = [
    'rgba(255, 206, 86, 0.6)',   // PENDIENTE - Amarillo
    'rgba(54, 162, 235, 0.6)',   // EN_PREPARACION - Azul
    'rgba(75, 192, 192, 0.6)',   // LISTO - Verde agua
    'rgba(153, 102, 255, 0.6)',  // SERVIDO - Morado
    'rgba(75, 192, 75, 0.6)',    // COMPLETADO - Verde
    'rgba(255, 99, 132, 0.6)'    // CANCELADO - Rojo
  ];

  const borderColors = [
    'rgba(255, 206, 86, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(75, 192, 75, 1)',
    'rgba(255, 99, 132, 1)'
  ];

  return {
    labels,
    datasets: [
      {
        label: 'Cantidad de Pedidos',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }
    ]
  };
});

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `Pedidos: ${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      }
    }
  }
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Cargar pedidos si no están cargados
    if (pedidoStore.pedidos.length === 0) {
      await pedidoStore.fetchPedidos();
    }
  } catch (err: any) {
    console.error('Error cargando pedidos:', err);
    error.value = err.message || 'Error al cargar datos de pedidos';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
