<template>
  <v-card class="empresa-info">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-domain</v-icon>
      Información de la Empresa
    </v-card-title>

    <!-- Loading State -->
    <v-card-text v-if="empresaStore.loading">
      <div class="d-flex align-center justify-center py-4">
        <v-progress-circular indeterminate color="primary" class="mr-3"></v-progress-circular>
        <span>Cargando configuración de empresa...</span>
      </div>
    </v-card-text>

    <!-- Error State -->
    <v-card-text v-else-if="empresaStore.error">
      <v-alert type="error" class="mb-4">
        <template v-slot:prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        <v-alert-title>Error de Conexión</v-alert-title>
        {{ empresaStore.error }}
      </v-alert>
      <v-btn
        @click="recargar"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-refresh"
      >
        Reintentar
      </v-btn>
    </v-card-text>

    <!-- Success State -->
    <v-card-text v-else-if="empresaStore.validacion">
      <!-- Nombre de Empresa -->
      <div class="mb-4">
        <h3 class="text-h6 mb-2">{{ empresaStore.nombreEmpresa }}</h3>
        <v-chip
          :color="tipoOperacionColor"
          variant="tonal"
          size="small"
          prepend-icon="mdi-certificate"
        >
          {{ tipoOperacionTexto }}
        </v-chip>
      </div>

      <!-- Mensaje para Cliente -->
      <v-alert
        :type="mensajeAlertType"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon>{{ mensajeIcon }}</v-icon>
        </template>
        {{ empresaStore.mensajeCliente }}
      </v-alert>

      <!-- Configuración IGV -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title class="text-subtitle-1 py-2">
          <v-icon class="mr-2">mdi-calculator</v-icon>
          Configuración de Impuestos
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <span>Estado del IGV:</span>
            <v-chip
              :color="empresaStore.aplicaIgv ? 'success' : 'default'"
              variant="flat"
              size="small"
            >
              <v-icon start>
                {{ empresaStore.aplicaIgv ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              {{ empresaStore.aplicaIgv ? `${empresaStore.porcentajeIgv}%` : 'No aplica' }}
            </v-chip>
          </div>
          <div v-if="!empresaStore.aplicaIgv" class="mt-2">
            <small class="text-medium-emphasis">
              Los precios mostrados no incluyen IGV (empresa informal)
            </small>
          </div>
        </v-card-text>
      </v-card>

      <!-- Capacidades de Emisión -->
      <v-card variant="outlined" class="mb-4">
        <v-card-title class="text-subtitle-1 py-2">
          <v-icon class="mr-2">mdi-file-document</v-icon>
          Comprobantes Disponibles
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              v-for="comprobante in empresaStore.validacion.comprobantesPermitidos"
              :key="comprobante"
              prepend-icon="mdi-check-circle"
              class="text-success"
            >
              <v-list-item-title>{{ comprobante }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Limitaciones (si existen) -->
      <v-card
        v-if="empresaStore.validacion.limitaciones.length > 0"
        variant="outlined"
        color="warning"
        class="mb-4"
      >
        <v-card-title class="text-subtitle-1 py-2">
          <v-icon class="mr-2">mdi-information</v-icon>
          Limitaciones
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              v-for="limitacion in empresaStore.validacion.limitaciones"
              :key="limitacion"
              prepend-icon="mdi-alert-circle"
              class="text-warning"
            >
              <v-list-item-title>{{ limitacion }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Advertencias (si existen) -->
      <v-card
        v-if="empresaStore.validacion.advertencias.length > 0"
        variant="outlined"
        color="error"
        class="mb-4"
      >
        <v-card-title class="text-subtitle-1 py-2">
          <v-icon class="mr-2">mdi-alert-triangle</v-icon>
          Advertencias
        </v-card-title>
        <v-card-text>
          <v-list density="compact">
            <v-list-item
              v-for="advertencia in empresaStore.validacion.advertencias"
              :key="advertencia"
              prepend-icon="mdi-alert"
              class="text-error"
            >
              <v-list-item-title>{{ advertencia }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Información adicional -->
      <div class="text-caption text-medium-emphasis">
        <v-icon size="small" class="mr-1">mdi-update</v-icon>
        Última actualización: {{ formatearFecha(empresaStore.ultimaActualizacion) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEmpresaStore } from '@/stores/empresaStore';
import { TipoOperacion } from '@/types/empresa';

// Store
const empresaStore = useEmpresaStore();

// Computed para clases dinámicas
const tipoOperacionColor = computed(() => {
  if (!empresaStore.tipoOperacion) return 'default';

  switch (empresaStore.tipoOperacion) {
    case TipoOperacion.TICKET_SIMPLE:
      return 'info';
    case TipoOperacion.BOLETA_MANUAL:
      return 'success';
    case TipoOperacion.FACTURA_ELECTRONICA:
      return 'primary';
    case TipoOperacion.MIXTO:
      return 'purple';
    default:
      return 'default';
  }
});

const tipoOperacionTexto = computed(() => {
  if (!empresaStore.tipoOperacion) return 'No definido';

  switch (empresaStore.tipoOperacion) {
    case TipoOperacion.TICKET_SIMPLE:
      return 'Tickets Simples';
    case TipoOperacion.BOLETA_MANUAL:
      return 'Boletas Manuales';
    case TipoOperacion.FACTURA_ELECTRONICA:
      return 'Facturación Electrónica';
    case TipoOperacion.MIXTO:
      return 'Operación Mixta';
    default:
      return 'No definido';
  }
});

const mensajeAlertType = computed(() => {
  if (!empresaStore.tipoOperacion) return 'info';

  switch (empresaStore.tipoOperacion) {
    case TipoOperacion.TICKET_SIMPLE:
      return 'info';
    case TipoOperacion.BOLETA_MANUAL:
      return 'success';
    case TipoOperacion.FACTURA_ELECTRONICA:
      return 'success';
    default:
      return 'info';
  }
});

const mensajeIcon = computed(() => {
  if (!empresaStore.tipoOperacion) return 'mdi-information';

  switch (empresaStore.tipoOperacion) {
    case TipoOperacion.TICKET_SIMPLE:
      return 'mdi-ticket';
    case TipoOperacion.BOLETA_MANUAL:
      return 'mdi-file-document';
    case TipoOperacion.FACTURA_ELECTRONICA:
      return 'mdi-certificate';
    default:
      return 'mdi-information';
  }
});

// Métodos
const recargar = async () => {
  try {
    await empresaStore.cargarValidacion(true);
  } catch (error) {
    console.error('Error al recargar configuración:', error);
  }
};

const formatearFecha = (fecha: Date | null) => {
  if (!fecha) return 'No disponible';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(fecha);
};

// Auto-cargar información si no existe y hay autenticación
if (!empresaStore.validacion && localStorage.getItem('accessToken')) {
  empresaStore.cargarValidacion().catch(err => {
    console.warn('Error cargando validación de empresa:', err);
  });
}
</script>

<style scoped>
.empresa-info {
  max-width: 600px;
}

.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

.text-warning {
  color: rgb(var(--v-theme-warning)) !important;
}

.text-error {
  color: rgb(var(--v-theme-error)) !important;
}
</style>