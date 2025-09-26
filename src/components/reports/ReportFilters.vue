<template>
  <v-card class="mb-4" variant="tonal">
    <v-card-title>Filtros de Reporte</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedReportType"
            :items="reportTypes"
            label="Seleccionar Reporte"
            variant="outlined"
            dense
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="selectedReportType === 'sales-summary' || selectedReportType === 'product-sales'">
        <v-col cols="12" md="6">
          <v-text-field v-model="params.startDate" label="Fecha Inicio" type="date" variant="outlined" dense></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="params.endDate" label="Fecha Fin" type="date" variant="outlined" dense></v-text-field>
        </v-col>
      </v-row>

      <!-- Add more dynamic filter fields based on selectedReportType -->

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey" @click="emit('limpiar')">Limpiar</v-btn>
      <v-btn color="primary" @click="emit('generar-reporte', selectedReportType, params)">Generar Reporte</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue';
import type { ReportSearchParams } from '@/types/report';

const emit = defineEmits(['generar-reporte', 'limpiar']);

const selectedReportType = ref('sales-summary'); // Default selected report

const reportTypes = [
  { title: 'Resumen de Ventas', value: 'sales-summary' },
  { title: 'Ventas por Producto', value: 'product-sales' },
  { title: 'Inventario Bajo Stock', value: 'low-stock-inventory' },
];

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const params = reactive<ReportSearchParams>({
  startDate: formatDate(oneMonthAgo),
  endDate: formatDate(today),
});
</script>