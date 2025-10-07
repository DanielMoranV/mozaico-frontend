<template>
  <v-card class="carrito-calculadora">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-calculator</v-icon>
      Resumen del Pedido
    </v-card-title>

    <v-card-text>
      <!-- Loading State -->
      <div v-if="calculadoraLoading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary" class="mb-2"></v-progress-circular>
        <div class="text-body-2">Inicializando calculadora...</div>
      </div>

      <!-- Error State -->
      <v-alert v-else-if="calculadoraError" type="error" variant="tonal" class="mb-4">
        <template v-slot:prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        {{ calculadoraError }}
      </v-alert>

      <!-- Lista de Productos -->
      <div v-else class="productos-carrito">
        <!-- Empty State -->
        <v-alert
          v-if="productos.length === 0"
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon>mdi-cart-outline</v-icon>
          </template>
          No hay productos en el carrito
        </v-alert>

        <!-- Productos List -->
        <v-list v-else density="compact" class="mb-4">
          <v-list-item
            v-for="producto in productos"
            :key="producto.id"
            class="producto-item"
          >
            <template v-slot:prepend>
              <v-avatar size="32" color="primary" variant="tonal">
                <v-icon size="18">mdi-food</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-body-2">
              {{ producto.nombre }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ formatearMoneda(producto.precio) }} × {{ producto.cantidad }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="text-subtitle-2 font-weight-bold">
                {{ formatearMoneda(producto.subtotal) }}
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- Cálculos -->
        <v-card variant="outlined" class="totales-section">
          <v-card-text>
            <!-- Subtotal -->
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-2">Subtotal:</span>
              <span class="text-subtitle-2">{{ formatearMoneda(totales.subtotal) }}</span>
            </div>

            <!-- IGV -->
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-2">
                <template v-if="totales.aplicaIgv">
                  IGV ({{ totales.porcentajeIgv }}%):
                </template>
                <template v-else>
                  <span class="text-medium-emphasis">IGV (No aplica):</span>
                </template>
              </span>
              <span
                class="text-subtitle-2"
                :class="{ 'text-medium-emphasis': !totales.aplicaIgv }"
              >
                {{ formatearMoneda(totales.igv) }}
              </span>
            </div>

            <!-- Descuento si existe -->
            <div
              v-if="totales.descuento > 0"
              class="d-flex justify-space-between align-center mb-2"
            >
              <span class="text-body-2">Descuento:</span>
              <span class="text-subtitle-2 text-success">
                -{{ formatearMoneda(totales.descuento) }}
              </span>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Total -->
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold">Total:</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatearMoneda(totales.total) }}
              </span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Información adicional -->
        <v-alert
          :type="infoAlertType"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon>{{ infoIcon }}</v-icon>
          </template>
          {{ infoMensaje }}
        </v-alert>

        <!-- Información de empresa -->
        <div v-if="mensajeEmpresa" class="mb-4">
          <v-alert type="info" variant="tonal" density="compact">
            <template v-slot:prepend>
              <v-icon>mdi-domain</v-icon>
            </template>
            {{ mensajeEmpresa }}
          </v-alert>
        </div>
      </div>
    </v-card-text>

    <!-- Acciones -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="$emit('procesar-pedido')"
        :disabled="productos.length === 0 || calculadoraLoading"
        color="primary"
        variant="elevated"
        prepend-icon="mdi-cart-check"
        block
      >
        <template v-if="calculadoraLoading">
          <v-progress-circular indeterminate size="16" class="mr-2"></v-progress-circular>
        </template>
        Procesar Pedido
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalculadoraPrecios } from '@/composables/useCalculadoraPrecios';
import type { ProductoCarrito } from '@/types/empresa';

// Props
interface Props {
  productos: ProductoCarrito[];
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  'procesar-pedido': [];
}>();

// Composable
const {
  calcularTotales,
  formatearMoneda,
  config,
  loading: calculadoraLoading,
  error: calculadoraError,
  mensajeEmpresa
} = useCalculadoraPrecios();

// Computed
const totales = computed(() => {
  if (!config.inicializada || props.productos.length === 0) {
    return {
      subtotal: 0,
      igv: 0,
      descuento: 0,
      total: 0,
      aplicaIgv: false,
      porcentajeIgv: 0
    };
  }

  try {
    return calcularTotales(props.productos);
  } catch (error) {
    console.error('Error al calcular totales:', error);
    return {
      subtotal: 0,
      igv: 0,
      descuento: 0,
      total: 0,
      aplicaIgv: false,
      porcentajeIgv: 0
    };
  }
});

const infoMensaje = computed(() => {
  if (!config.inicializada) return 'Cargando configuración...';

  if (!totales.value.aplicaIgv) {
    return 'Los precios NO incluyen IGV (empresa informal)';
  } else {
    return `Los precios incluyen IGV (${totales.value.porcentajeIgv}%)`;
  }
});

const infoAlertType = computed(() => {
  if (!config.inicializada) return 'info';
  return totales.value.aplicaIgv ? 'success' : 'info';
});

const infoIcon = computed(() => {
  if (!config.inicializada) return 'mdi-loading';
  return totales.value.aplicaIgv ? 'mdi-check-circle' : 'mdi-information';
});
</script>

<style scoped>
.carrito-calculadora {
  min-width: 350px;
  max-width: 500px;
}

.producto-item {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.producto-item:last-child {
  border-bottom: none;
}

.totales-section {
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.text-success {
  color: rgb(var(--v-theme-success)) !important;
}
</style>