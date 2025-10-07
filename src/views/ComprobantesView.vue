<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon size="large" class="mr-2">mdi-receipt-text</v-icon>
          <span class="text-h5">Comprobantes</span>
        </div>
        <div>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            @click="cargarComprobantes"
            :loading="store.loading"
          >
            Actualizar
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Buscar comprobante"
          placeholder="Buscar por número de comprobante..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
        />

        <ComprobanteTable
          :comprobantes="comprobantesFiltrados"
          :loading="store.loading || printing"
          :headers="headers"
          @imprimir-ticket="imprimirTicketDirecto"
          @imprimir-pdf="imprimirPdfDirecto"
          @descargar-ticket="descargarTicket"
          @descargar-pdf="descargarPdf"
          @reimprimir="reimprimirComprobante"
          @anular="confirmarAnulacion"
          @ver-detalles="verDetalles"
        />
      </v-card-text>
    </v-card>

    <!-- Dialog para anular comprobante -->
    <v-dialog v-model="dialogAnular.mostrar" max-width="500">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          Anular Comprobante
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="mb-4">
            ¿Está seguro que desea anular el comprobante
            <strong>{{ dialogAnular.comprobante?.numeroComprobante }}</strong>?
          </p>
          <v-text-field
            v-model="dialogAnular.motivo"
            label="Motivo de anulación (opcional)"
            placeholder="Ingrese el motivo de la anulación..."
            variant="outlined"
            density="comfortable"
            hint="El motivo es opcional pero recomendado"
            persistent-hint
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cancelar"
            @click="dialogAnular.mostrar = false"
          />
          <v-btn
            color="error"
            text="Anular"
            :loading="store.loading"
            @click="anularComprobante"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para ver detalles -->
    <v-dialog v-model="dialogDetalles.mostrar" max-width="800">
      <v-card v-if="dialogDetalles.comprobante">
        <v-card-title class="text-h6 bg-primary text-white">
          <v-icon class="mr-2">mdi-receipt-text</v-icon>
          Detalles del Comprobante
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Número</v-list-item-title>
                  <v-list-item-subtitle>{{ dialogDetalles.comprobante.numeroComprobante }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Serie</v-list-item-title>
                  <v-list-item-subtitle>{{ dialogDetalles.comprobante.serieComprobante }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Tipo</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip :color="getTipoComprobanteColor(dialogDetalles.comprobante.tipoComprobante)" size="small">
                      {{ getTipoComprobanteLabel(dialogDetalles.comprobante.tipoComprobante) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Estado</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip :color="getEstadoColor(dialogDetalles.comprobante.estado)" size="small">
                      {{ dialogDetalles.comprobante.estado }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Fecha Emisión</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(dialogDetalles.comprobante.fechaEmision) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Ticket Disponible</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon :color="dialogDetalles.comprobante.archivoTicketDisponible ? 'success' : 'error'">
                      {{ dialogDetalles.comprobante.archivoTicketDisponible ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">PDF Disponible</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon :color="dialogDetalles.comprobante.archivoPdfDisponible ? 'success' : 'error'">
                      {{ dialogDetalles.comprobante.archivoPdfDisponible ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="dialogDetalles.comprobante.observaciones">
                  <v-list-item-title class="font-weight-bold">Observaciones</v-list-item-title>
                  <v-list-item-subtitle>{{ dialogDetalles.comprobante.observaciones }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="d-flex gap-2 justify-center">
            <v-btn
              v-if="dialogDetalles.comprobante.archivoTicketDisponible"
              color="primary"
              prepend-icon="mdi-receipt"
              @click="descargarTicketDetalles"
            >
              Descargar Ticket
            </v-btn>
            <v-btn
              v-if="dialogDetalles.comprobante.archivoPdfDisponible"
              color="primary"
              prepend-icon="mdi-file-pdf-box"
              @click="descargarPdfDetalles"
            >
              Descargar PDF
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text="Cerrar" @click="dialogDetalles.mostrar = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.mostrar" :color="snackbar.color" :timeout="3000">
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useComprobanteStore } from '@/stores/comprobanteStore';
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import type { ComprobanteListItem } from '@/types/comprobante';
import type { ComprobanteDTO } from '@/types/pago';
import type { TipoComprobante, EstadoComprobante } from '@/types/enums';
import ComprobanteTable from '@/components/comprobantes/ComprobanteTable.vue';

const store = useComprobanteStore();
const { imprimirTicket, imprimirPdf, printing, error: printError } = useTicketPrinter();

const headers = [
  { title: 'Número', key: 'numeroComprobante', sortable: true },
  { title: 'Serie', key: 'serieComprobante', sortable: true },
  { title: 'Tipo', key: 'tipoComprobante', sortable: true },
  { title: 'Fecha Emisión', key: 'fechaEmision', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const searchTerm = ref('');

const dialogAnular = reactive({
  mostrar: false,
  comprobante: null as ComprobanteListItem | null,
  motivo: '',
});

const dialogDetalles = reactive({
  mostrar: false,
  comprobante: null as ComprobanteListItem | null,
});

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const comprobantesFiltrados = computed(() => {
  if (!searchTerm.value) return store.comprobantes;

  const term = searchTerm.value.toLowerCase();
  return store.comprobantes.filter((c) =>
    c.numeroComprobante.toLowerCase().includes(term) ||
    c.serieComprobante.toLowerCase().includes(term)
  );
});

const cargarComprobantes = async () => {
  await store.fetchComprobantes();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

/**
 * Imprime ticket directamente sin descargar
 */
const imprimirTicketDirecto = async (comprobante: ComprobanteListItem) => {
  const success = await imprimirTicket(comprobante.idComprobante, true);

  if (success) {
    mostrarSnackbar('Imprimiendo ticket...', 'info');
  } else {
    mostrarSnackbar(printError.value || 'Error al imprimir ticket', 'error');
  }
};

/**
 * Imprime PDF A4 directamente sin descargar
 */
const imprimirPdfDirecto = async (comprobante: ComprobanteListItem) => {
  const success = await imprimirPdf(comprobante.idComprobante, true);

  if (success) {
    mostrarSnackbar('Imprimiendo PDF...', 'info');
  } else {
    mostrarSnackbar(printError.value || 'Error al imprimir PDF', 'error');
  }
};

const descargarTicket = async (comprobante: ComprobanteListItem) => {
  try {
    await store.descargarTicket(comprobante as ComprobanteDTO);
    mostrarSnackbar('Ticket descargado exitosamente', 'success');
  } catch (error) {
    mostrarSnackbar('Error al descargar ticket', 'error');
  }
};

const descargarPdf = async (comprobante: ComprobanteListItem) => {
  try {
    await store.descargarPdf(comprobante as ComprobanteDTO);
    mostrarSnackbar('PDF descargado exitosamente', 'success');
  } catch (error) {
    mostrarSnackbar('Error al descargar PDF', 'error');
  }
};

const reimprimirComprobante = async (comprobante: ComprobanteListItem) => {
  const success = await store.reimprimirComprobante(comprobante.idComprobante);
  if (success) {
    mostrarSnackbar('Comprobante reimpreso exitosamente', 'success');
  } else {
    mostrarSnackbar(store.error || 'Error al reimprimir comprobante', 'error');
  }
};

const confirmarAnulacion = (comprobante: ComprobanteListItem) => {
  dialogAnular.comprobante = comprobante;
  dialogAnular.motivo = '';
  dialogAnular.mostrar = true;
};

const anularComprobante = async () => {
  if (!dialogAnular.comprobante) return;

  const success = await store.anularComprobante(
    dialogAnular.comprobante.idComprobante,
    dialogAnular.motivo || undefined
  );

  if (success) {
    mostrarSnackbar('Comprobante anulado exitosamente', 'success');
    dialogAnular.mostrar = false;
    dialogAnular.comprobante = null;
    dialogAnular.motivo = '';
  } else {
    mostrarSnackbar(store.error || 'Error al anular comprobante', 'error');
  }
};

const verDetalles = (comprobante: ComprobanteListItem) => {
  dialogDetalles.comprobante = comprobante;
  dialogDetalles.mostrar = true;
};

const descargarTicketDetalles = async () => {
  if (!dialogDetalles.comprobante) return;
  await descargarTicket(dialogDetalles.comprobante);
};

const descargarPdfDetalles = async () => {
  if (!dialogDetalles.comprobante) return;
  await descargarPdf(dialogDetalles.comprobante);
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

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
      return 'Ticket Interno';
    case 'BOLETA_VENTA':
      return 'Boleta de Venta';
    case 'FACTURA':
      return 'Factura';
    case 'NOTA_CREDITO':
      return 'Nota de Crédito';
    case 'NOTA_DEBITO':
      return 'Nota de Débito';
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
    minute: '2-digit',
  });
};

onMounted(() => {
  cargarComprobantes();
});
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
