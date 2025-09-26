<template>
  <v-container fluid>
    <v-card>
      <ReportHeader />

      <v-card-text>
        <ReportFilters
          @generar-reporte="generarReporte"
          @limpiar="limpiarReporte"
        />

        <SalesSummaryReportTable
          v-if="currentReportType === 'sales-summary'"
          :sales-summary="store.salesSummary"
          :loading="store.loading"
          :error="store.error"
        />

        <!-- Add other report tables here based on currentReportType -->

      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar.mostrar" :color="snackbar.color" :timeout="3000">
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import type { ReportSearchParams } from '@/types/report';
import ReportHeader from '@/components/reports/ReportHeader.vue';
import ReportFilters from '@/components/reports/ReportFilters.vue';
import SalesSummaryReportTable from '@/components/reports/SalesSummaryReportTable.vue';

const store = useReportStore();

const currentReportType = ref('sales-summary'); // Default to sales summary
const currentReportParams = reactive<ReportSearchParams>({
  startDate: undefined,
  endDate: undefined,
});

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const generarReporte = async (reportType: string, params: ReportSearchParams) => {
  currentReportType.value = reportType;
  Object.assign(currentReportParams, params);

  if (reportType === 'sales-summary') {
    await store.fetchSalesSummary(currentReportParams);
  } else if (reportType === 'product-sales') {
    await store.fetchProductSales(currentReportParams);
  } else if (reportType === 'low-stock-inventory') {
    await store.fetchLowStockInventory();
  }

  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarReporte = () => {
  Object.assign(currentReportParams, {
    startDate: undefined,
    endDate: undefined,
  });
  // Clear specific report data if needed
  store.salesSummary = null;
  store.productSales = [];
  store.lowStockInventory = [];
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};
</script>
