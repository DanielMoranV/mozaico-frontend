<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-line</v-icon>
      Ventas del Período
      <v-spacer></v-spacer>
      <v-btn-toggle
        v-model="selectedPeriod"
        mandatory
        density="compact"
        variant="outlined"
        @update:model-value="loadData"
      >
        <v-btn value="day" size="small">Día</v-btn>
        <v-btn value="week" size="small">Semana</v-btn>
        <v-btn value="month" size="small">Mes</v-btn>
      </v-btn-toggle>
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
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { ReportService } from '@/services/reportService';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const selectedPeriod = ref<'day' | 'week' | 'month'>('week');
const loading = ref(false);
const error = ref<string | null>(null);
const salesData = ref<any>(null);

const chartData = computed(() => {
  if (!salesData.value) {
    return {
      labels: [],
      datasets: []
    };
  }

  return {
    labels: salesData.value.labels,
    datasets: [
      {
        label: 'Ventas (S/)',
        data: salesData.value.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };
});

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y ?? 0;
          return `${label}: S/ ${value.toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value !== null ? `S/ ${value}` : ''
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const endDate = new Date();
    const startDate = new Date();

    // Calcular fecha de inicio según período
    switch (selectedPeriod.value) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const response = await ReportService.getSalesSummary({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    if (response.success && response.data) {
      // Procesar datos del reporte
      processReportData(response.data);
    } else {
      error.value = response.message || 'Error al cargar datos de ventas';
    }
  } catch (err: any) {
    console.error('Error cargando datos de ventas:', err);
    error.value = err.message || 'Error al cargar datos de ventas';
  } finally {
    loading.value = false;
  }
};

const processReportData = (_data: any) => {
  // Generar labels según período
  const labels: string[] = [];
  const values: number[] = [];

  if (selectedPeriod.value === 'day') {
    // Últimas 24 horas por hora
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      labels.push(hour.getHours() + ':00');
      values.push(Math.random() * 500); // TODO: Reemplazar con datos reales
    }
  } else if (selectedPeriod.value === 'week') {
    // Últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }));
      values.push(Math.random() * 2000); // TODO: Reemplazar con datos reales
    }
  } else {
    // Último mes por semanas
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      labels.push('Sem ' + (4 - i));
      values.push(Math.random() * 5000); // TODO: Reemplazar con datos reales
    }
  }

  salesData.value = { labels, values };
};

onMounted(() => {
  loadData();
});
</script>
