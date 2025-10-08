<template>
  <v-data-table
    :headers="headers"
    :items="comprobantes"
    :loading="loading"
    loading-text="Cargando comprobantes..."
    no-data-text="No se encontraron comprobantes"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.tipoComprobante="{ item }">
      <v-chip :color="getTipoComprobanteColor(item.tipoComprobante)" size="small" variant="tonal">
        {{ getTipoComprobanteLabel(item.tipoComprobante) }}
      </v-chip>
    </template>

    <template v-slot:item.estado="{ item }">
      <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
        {{ item.estado }}
      </v-chip>
    </template>

    <template v-slot:item.fechaEmision="{ item }">
      {{ formatDateTime(item.fechaEmision) }}
    </template>

    <template v-slot:item.numeroComprobante="{ item }">
      <div class="d-flex align-center">
        <span class="font-weight-medium">{{ item.numeroComprobante }}</span>
      </div>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-1">
        <!-- Menú Imprimir -->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-tooltip text="Imprimir" location="top">
              <template v-slot:activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="{ ...props, ...tooltipProps }"
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  :disabled="item.estado === 'ANULADO'"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <v-list density="compact">
            <v-list-item
              :disabled="!item.archivoTicketDisponible"
              @click="emit('imprimir-ticket', item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-receipt</v-icon>
              </template>
              <v-list-item-title>Formato Ticket</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="!item.archivoPdfDisponible"
              @click="emit('imprimir-pdf', item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-file-document</v-icon>
              </template>
              <v-list-item-title>Formato A4</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Menú Descargar -->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-tooltip text="Descargar" location="top">
              <template v-slot:activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="{ ...props, ...tooltipProps }"
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <v-list density="compact">
            <v-list-item
              :disabled="!item.archivoTicketDisponible"
              @click="emit('descargar-ticket', item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-receipt</v-icon>
              </template>
              <v-list-item-title>Formato Ticket</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="!item.archivoPdfDisponible"
              @click="emit('descargar-pdf', item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-file-pdf-box</v-icon>
              </template>
              <v-list-item-title>Formato A4 (PDF)</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Reimprimir (Backend) -->
        <v-tooltip text="Reimprimir en el servidor" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              color="secondary"
              :disabled="item.estado === 'ANULADO'"
              @click="emit('reimprimir', item)"
            >
              <v-icon>mdi-printer-settings</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Anular -->
        <v-tooltip text="Anular" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              color="error"
              :disabled="item.estado === 'ANULADO'"
              @click="emit('anular', item)"
            >
              <v-icon>mdi-cancel</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Ver detalles -->
        <v-tooltip text="Ver Detalles" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              @click="emit('ver-detalles', item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { ComprobanteListItem } from '@/types/comprobante';
import type { TipoComprobante, EstadoComprobante } from '@/types/enums';

defineProps<{
  comprobantes: ComprobanteListItem[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'imprimir-ticket',
  'imprimir-pdf',
  'descargar-ticket',
  'descargar-pdf',
  'reimprimir',
  'anular',
  'ver-detalles',
]);

const getTipoComprobanteColor = (tipo: TipoComprobante) => {
  switch (tipo) {
    case 'TICKET_INTERNO':
      return 'blue';
    case 'BOLETA_VENTA':
      return 'green';
    case 'FACTURA':
      return 'purple';
    case 'NOTA_CREDITO':
      return 'orange';
    case 'NOTA_DEBITO':
      return 'red';
    default:
      return 'grey';
  }
};

const getTipoComprobanteLabel = (tipo: TipoComprobante) => {
  switch (tipo) {
    case 'TICKET_INTERNO':
      return 'Ticket';
    case 'BOLETA_VENTA':
      return 'Boleta';
    case 'FACTURA':
      return 'Factura';
    case 'NOTA_CREDITO':
      return 'N. Crédito';
    case 'NOTA_DEBITO':
      return 'N. Débito';
    default:
      return tipo;
  }
};

const getEstadoColor = (estado: EstadoComprobante) => {
  switch (estado) {
    case 'GENERADO':
      return 'info';
    case 'IMPRESO':
      return 'success';
    case 'ENVIADO':
      return 'primary';
    case 'ANULADO':
      return 'error';
    case 'ERROR':
      return 'warning';
    default:
      return 'grey';
  }
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>
