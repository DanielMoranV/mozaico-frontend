<template>
  <v-card class="mb-4" variant="tonal">
    <v-card-title>Resumen de Ventas</v-card-title>
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
      Cargando resumen de ventas...
    </v-card-text>
    <v-card-text v-else-if="error">
      <v-alert type="error" dense>{{ error }}</v-alert>
    </v-card-text>
    <v-card-text v-else-if="!salesSummary">
      No hay datos de resumen de ventas para mostrar.
    </v-card-text>
    <v-card-text v-else>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Período</th>
            <th>Ingresos Totales</th>
            <th>Total de Pedidos</th>
            <th>Valor Promedio del Pedido</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ salesSummary.startDate }} al {{ salesSummary.endDate }}</td>
            <td>{{ formatCurrency(salesSummary.totalRevenue) }}</td>
            <td>{{ salesSummary.totalOrders }}</td>
            <td>{{ formatCurrency(salesSummary.averageOrderValue) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { SalesSummaryResponseDTO } from '@/types/report';

const props = defineProps<{
  salesSummary: SalesSummaryResponseDTO | null;
  loading: boolean;
  error: string | null;
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};
</script>
