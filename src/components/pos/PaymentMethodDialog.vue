<template>
  <v-dialog v-model="isVisible" max-width="600px" persistent no-click-animation>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-credit-card</v-icon>
        <span class="text-h6">Procesar Pago</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Información del pedido -->
        <v-alert type="info" variant="tonal" class="mb-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <strong>Pedido #{{ pedido?.idPedido }}</strong>
              <div class="text-body-2">
                Mesa #{{ pedido?.mesa?.numeroMesa }}
              </div>
            </div>
            <div class="text-h6 font-weight-bold">
              {{ formatearMoneda(pedido?.total || 0) }}
            </div>
          </div>
        </v-alert>

        <!-- Loading de métodos de pago -->
        <div v-if="loadingMetodos" class="text-center py-4">
          <v-progress-circular
            indeterminate
            color="primary"
            class="mb-2"
          ></v-progress-circular>
          <div class="text-body-2">Cargando métodos de pago...</div>
        </div>

        <!-- Selección de método de pago -->
        <div v-else>
          <v-label class="text-subtitle-2 mb-2">Método de Pago *</v-label>
          <v-radio-group
            v-model="selectedMetodo"
            :error="!!errorMetodo"
            :error-messages="errorMetodo"
          >
            <v-radio
              v-for="metodo in metodosPago"
              :key="metodo.idMetodo"
              :value="metodo.idMetodo"
              :label="metodo.nombre"
              color="primary"
            >
              <template v-slot:label>
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-2"
                    :color="getMetodoIcon(metodo.nombre).color"
                  >
                    {{ getMetodoIcon(metodo.nombre).icon }}
                  </v-icon>
                  <span>{{ metodo.nombre }}</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <!-- Campo de referencia (opcional) -->
          <v-text-field
            v-model="referencia"
            label="Referencia (Opcional)"
            placeholder="Ej: VISA-123456, YAPE-987654321"
            prepend-inner-icon="mdi-tag"
            variant="outlined"
            density="compact"
            class="mt-4"
            :hint="referenciaHint"
            persistent-hint
          ></v-text-field>

          <!-- Monto a pagar -->
          <v-text-field
            v-model.number="monto"
            label="Monto a Pagar *"
            type="number"
            step="0.01"
            min="0"
            prepend-inner-icon="mdi-currency-usd"
            variant="outlined"
            density="compact"
            class="mt-4"
            :error="!!errorMonto"
            :error-messages="errorMonto"
            readonly
          ></v-text-field>

          <!-- Estado del pago -->
          <v-select
            v-model="estadoPago"
            :items="estadosDisponibles"
            label="Estado del Pago"
            prepend-inner-icon="mdi-check-circle"
            variant="outlined"
            density="compact"
            class="mt-4"
          ></v-select>

          <!-- Información de comprobante (mostrar después del pago) -->
          <v-alert
            v-if="ultimoComprobante"
            type="success"
            variant="tonal"
            class="mt-4"
          >
            <div class="d-flex justify-space-between align-center">
              <div>
                <strong>Comprobante generado</strong>
                <div class="text-body-2">
                  {{ ultimoComprobante.numeroComprobante }}
                </div>
              </div>
              <div class="d-flex gap-2">
                <v-btn
                  v-if="ultimoComprobante.archivoTicketDisponible"
                  size="small"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-printer"
                  @click="imprimirTicketManual"
                  :loading="descargandoTicket"
                >
                  Imprimir Ticket
                </v-btn>
                <v-btn
                  v-if="ultimoComprobante.archivoTicketDisponible"
                  size="small"
                  color="secondary"
                  variant="text"
                  prepend-icon="mdi-download"
                  @click="descargarTicket"
                  :loading="descargandoTicket"
                >
                  Descargar
                </v-btn>
                <v-btn
                  v-if="ultimoComprobante.archivoPdfDisponible"
                  size="small"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-printer-outline"
                  @click="imprimirPdfManual"
                  :loading="descargandoPdf"
                >
                  Imprimir PDF
                </v-btn>
              </div>
            </div>
          </v-alert>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog" :disabled="processing">
          Cancelar
        </v-btn>
        <v-btn
          v-if="!ultimoComprobante"
          color="primary"
          variant="elevated"
          @click="procesarPago"
          :loading="processing"
          :disabled="!canProcessPayment"
          prepend-icon="mdi-check"
        >
          Procesar Pago
        </v-btn>
        <v-btn
          v-else
          color="success"
          variant="elevated"
          @click="closeDialog"
          prepend-icon="mdi-check-circle"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { PagoService } from "@/services/pagoService";
import { ComprobanteService } from "@/services/comprobanteService";
import { useTicketPrinter } from "@/composables/useTicketPrinter";
import { EstadoPago } from "@/types/enums";
import { METODOS_PAGO_DEFAULT } from "@/types/pago";
import type {
  PagoRequestDTO,
  PagoCompletoResponseDTO,
  MetodoPagoResponseDTO,
} from "@/types/pago";
import type { Pedido } from "@/types/pedido";

// Composable para impresión
const { imprimirTicket } = useTicketPrinter();

// Props
interface Props {
  visible: boolean;
  pedido: Pedido | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:visible": [value: boolean];
  "pago-completado": [pagoResponse: PagoCompletoResponseDTO];
  "pago-error": [error: string];
  "comprobante-generado": [comprobante: any];
}>();

// Estado local
const isVisible = ref(props.visible);
const selectedMetodo = ref<number | null>(null);
const referencia = ref("");
const monto = ref(0);
const estadoPago = ref<EstadoPago>(EstadoPago.COMPLETADO);
const processing = ref(false);
const loadingMetodos = ref(false);
const metodosPago = ref<MetodoPagoResponseDTO[]>([]);

// Estado para comprobantes
const ultimoComprobante = ref<any>(null);
const descargandoTicket = ref(false);
const descargandoPdf = ref(false);

// Errores de validación
const errorMetodo = ref("");
const errorMonto = ref("");

// Estados disponibles
const estadosDisponibles = [
  { title: "Completado", value: EstadoPago.COMPLETADO },
  { title: "Pendiente", value: EstadoPago.PENDIENTE },
];

// Computed
const canProcessPayment = computed(() => {
  return selectedMetodo.value && monto.value > 0 && !processing.value;
});

const referenciaHint = computed(() => {
  const metodo = metodosPago.value.find(
    (m) => m.idMetodo === selectedMetodo.value
  );
  if (!metodo) return "";

  switch (metodo.nombre.toLowerCase()) {
    case "efectivo":
      return "Ej: EFECTIVO-001";
    case "yape":
      return "Ej: Número de operación Yape";
    case "plin":
      return "Ej: Número de operación Plin";
    case "tarjeta de crédito":
    case "tarjeta de débito":
      return "Ej: Últimos 4 dígitos de la tarjeta";
    case "transferencia bancaria":
      return "Ej: Número de transferencia";
    default:
      return "Referencia opcional del pago";
  }
});

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    console.log("🔍 [PaymentMethodDialog] visible cambió a:", newVal);
    isVisible.value = newVal;
    if (newVal) {
      console.log("🔍 [PaymentMethodDialog] Dialog visible, inicializando...");
      initializeDialog();
    }
  }
);

watch(
  () => props.pedido,
  (newPedido) => {
    if (newPedido) {
      monto.value = newPedido.total || 0;
    }
  }
);

watch(isVisible, (newVal) => {
  emit("update:visible", newVal);
});

// Métodos
const initializeDialog = async () => {
  console.log(
    "🔍 [PaymentMethodDialog] initializeDialog llamado. props.pedido:",
    props.pedido
  );
  if (props.pedido) {
    monto.value = props.pedido.total || 0;
    console.log("🔍 [PaymentMethodDialog] Monto asignado:", monto.value);
    await loadMetodosPago();
  } else {
    console.warn("⚠️ [PaymentMethodDialog] No hay pedido disponible");
  }
  clearErrors();
};

const loadMetodosPago = async () => {
  console.log("🔍 [PaymentMethodDialog] Iniciando carga de métodos de pago...");
  loadingMetodos.value = true;
  try {
    console.log(
      "🔍 [PaymentMethodDialog] Llamando a PagoService.getMetodosPago()..."
    );
    const response = await PagoService.getMetodosPago();
    console.log("🔍 [PaymentMethodDialog] Respuesta recibida:", response);

    if (response.status === "SUCCESS" && response.data) {
      console.log(
        "✅ [PaymentMethodDialog] Métodos de pago cargados exitosamente:",
        response.data
      );
      metodosPago.value = response.data;
      console.log(
        "🔍 [PaymentMethodDialog] metodosPago.value asignado:",
        metodosPago.value
      );
    } else {
      // Usar métodos por defecto si hay error
      console.warn(
        "⚠️ [PaymentMethodDialog] Usando métodos de pago por defecto. Status:",
        response.status
      );
      metodosPago.value = METODOS_PAGO_DEFAULT.map((m) => ({
        idMetodo: m.idMetodo,
        nombre: m.nombre,
        activo: true,
      }));
      console.log(
        "🔍 [PaymentMethodDialog] Métodos por defecto:",
        metodosPago.value
      );
    }
  } catch (error) {
    console.error(
      "❌ [PaymentMethodDialog] Error al cargar métodos de pago:",
      error
    );
    // Usar métodos por defecto
    metodosPago.value = METODOS_PAGO_DEFAULT.map((m) => ({
      idMetodo: m.idMetodo,
      nombre: m.nombre,
      activo: true,
    }));
    console.log(
      "🔍 [PaymentMethodDialog] Métodos por defecto (después de error):",
      metodosPago.value
    );
  } finally {
    loadingMetodos.value = false;
    console.log(
      "🔍 [PaymentMethodDialog] loadingMetodos finalizado. metodosPago.value:",
      metodosPago.value
    );
  }
};

const getMetodoIcon = (nombreMetodo: string) => {
  switch (nombreMetodo.toLowerCase()) {
    case "efectivo":
      return { icon: "mdi-cash", color: "green" };
    case "tarjeta de crédito":
      return { icon: "mdi-credit-card", color: "blue" };
    case "tarjeta de débito":
      return { icon: "mdi-credit-card-outline", color: "indigo" };
    case "yape":
      return { icon: "mdi-cellphone", color: "purple" };
    case "plin":
      return { icon: "mdi-cellphone-wireless", color: "orange" };
    case "transferencia bancaria":
      return { icon: "mdi-bank-transfer", color: "teal" };
    default:
      return { icon: "mdi-credit-card", color: "grey" };
  }
};

const validateForm = (): boolean => {
  clearErrors();
  let isValid = true;

  if (!selectedMetodo.value) {
    errorMetodo.value = "Debe seleccionar un método de pago";
    isValid = false;
  }

  if (!monto.value || monto.value <= 0) {
    errorMonto.value = "El monto debe ser mayor a 0";
    isValid = false;
  }

  return isValid;
};

const clearErrors = () => {
  errorMetodo.value = "";
  errorMonto.value = "";
};

const procesarPago = async () => {
  if (!validateForm() || !props.pedido) return;

  processing.value = true;

  try {
    // Preparar datos del pago según la documentación
    const pagoData: PagoRequestDTO = {
      idPedido: props.pedido.idPedido,
      idMetodo: selectedMetodo.value!,
      monto: monto.value,
      estado: estadoPago.value,
    };

    // Agregar referencia si se proporcionó
    if (referencia.value.trim()) {
      pagoData.referencia = referencia.value.trim();
    } else {
      // Generar referencia automática
      const metodo = metodosPago.value.find(
        (m) => m.idMetodo === selectedMetodo.value
      );
      if (metodo) {
        pagoData.referencia = PagoService.generarReferencia(
          metodo.nombre,
          props.pedido.idPedido
        );
      }
    }

    // Validar datos antes de enviar
    const validacion = PagoService.validarPagoRequest(pagoData);
    if (!validacion.valido) {
      emit("pago-error", validacion.errores.join(", "));
      return;
    }

    // Crear el pago completo con comprobante
    const response = await PagoService.crearPagoCompleto(pagoData);

    if (response.status === "SUCCESS") {
      console.log(
        "✅ [PaymentMethodDialog] Pago procesado exitosamente:",
        response.data
      );
      emit("pago-completado", response.data);

      // Emitir evento de comprobante generado si existe
      if (response.data.comprobante) {
        console.log(
          "📄 [PaymentMethodDialog] Comprobante recibido:",
          response.data.comprobante
        );
        console.log(
          "📄 [PaymentMethodDialog] Ticket disponible:",
          response.data.comprobante.archivoTicketDisponible
        );
        console.log(
          "📄 [PaymentMethodDialog] PDF disponible:",
          response.data.comprobante.archivoPdfDisponible
        );
        ultimoComprobante.value = response.data.comprobante;
        emit("comprobante-generado", response.data.comprobante);

        // 🖨️ Imprimir automáticamente el ticket si está disponible
        if (response.data.comprobante.archivoTicketDisponible) {
          console.log("🖨️ [PaymentMethodDialog] Iniciando impresión automática del ticket...");

          // Esperar un momento para asegurar que el archivo esté listo
          setTimeout(async () => {
            try {
              await imprimirTicket(response.data.comprobante.idComprobante, true);
              console.log("✅ [PaymentMethodDialog] Ticket enviado a impresión");
            } catch (error) {
              console.error("❌ [PaymentMethodDialog] Error al imprimir ticket automáticamente:", error);
              // No mostrar error al usuario, el ticket sigue disponible para descarga manual
            }
          }, 1000); // Esperar 1 segundo
        }
      } else {
        console.warn(
          "⚠️ [PaymentMethodDialog] No se recibió comprobante en la respuesta"
        );
      }

      // No cerrar el diálogo inmediatamente para permitir descargar comprobante
      // closeDialog();
    } else {
      console.error(
        "❌ [PaymentMethodDialog] Error en la respuesta del pago:",
        response.message
      );
      emit("pago-error", response.message || "Error al procesar el pago");
    }
  } catch (error) {
    console.error("Error al procesar pago:", error);
    emit("pago-error", "Error inesperado al procesar el pago");
  } finally {
    processing.value = false;
  }
};

const closeDialog = () => {
  isVisible.value = false;
  // Reset form
  selectedMetodo.value = null;
  referencia.value = "";
  estadoPago.value = EstadoPago.COMPLETADO;
  ultimoComprobante.value = null;
  clearErrors();
};

// Métodos para imprimir comprobantes
const imprimirTicketManual = async () => {
  console.log("🖨️ [PaymentMethodDialog] imprimirTicketManual llamado");

  if (!ultimoComprobante.value) {
    console.error("❌ [PaymentMethodDialog] No hay comprobante disponible");
    return;
  }

  try {
    descargandoTicket.value = true;
    console.log("🖨️ [PaymentMethodDialog] Iniciando impresión de ticket...");
    await imprimirTicket(ultimoComprobante.value.idComprobante, true);
    console.log("✅ [PaymentMethodDialog] Ticket enviado a impresión");
  } catch (error) {
    console.error("❌ [PaymentMethodDialog] Error al imprimir ticket:", error);
    emit("pago-error", "Error al imprimir el ticket");
  } finally {
    descargandoTicket.value = false;
  }
};

const imprimirPdfManual = async () => {
  console.log("🖨️ [PaymentMethodDialog] imprimirPdfManual llamado");

  if (!ultimoComprobante.value) {
    console.error("❌ [PaymentMethodDialog] No hay comprobante disponible");
    return;
  }

  try {
    descargandoPdf.value = true;
    console.log("🖨️ [PaymentMethodDialog] Iniciando impresión de PDF...");
    const { imprimirPdf: printPdf } = useTicketPrinter();
    await printPdf(ultimoComprobante.value.idComprobante, true);
    console.log("✅ [PaymentMethodDialog] PDF enviado a impresión");
  } catch (error) {
    console.error("❌ [PaymentMethodDialog] Error al imprimir PDF:", error);
    emit("pago-error", "Error al imprimir el PDF");
  } finally {
    descargandoPdf.value = false;
  }
};

// Métodos para descargar comprobantes
const descargarTicket = async () => {
  console.log("🎫 [PaymentMethodDialog] descargarTicket llamado");
  console.log(
    "🎫 [PaymentMethodDialog] ultimoComprobante.value:",
    ultimoComprobante.value
  );

  if (!ultimoComprobante.value) {
    console.error("❌ [PaymentMethodDialog] No hay comprobante disponible");
    return;
  }

  try {
    descargandoTicket.value = true;
    console.log("🎫 [PaymentMethodDialog] Iniciando descarga de ticket...");
    console.log(
      "🎫 [PaymentMethodDialog] ID Comprobante:",
      ultimoComprobante.value.idComprobante
    );
    await ComprobanteService.descargarYGuardarTicket(ultimoComprobante.value);
    console.log("✅ [PaymentMethodDialog] Ticket descargado exitosamente");
  } catch (error) {
    console.error("❌ [PaymentMethodDialog] Error al descargar ticket:", error);
    emit("pago-error", "Error al descargar el ticket");
  } finally {
    descargandoTicket.value = false;
  }
};

const descargarPdf = async () => {
  console.log("📄 [PaymentMethodDialog] descargarPdf llamado");
  console.log(
    "📄 [PaymentMethodDialog] ultimoComprobante.value:",
    ultimoComprobante.value
  );

  if (!ultimoComprobante.value) {
    console.error("❌ [PaymentMethodDialog] No hay comprobante disponible");
    return;
  }

  try {
    descargandoPdf.value = true;
    console.log("📄 [PaymentMethodDialog] Iniciando descarga de PDF...");
    console.log(
      "📄 [PaymentMethodDialog] ID Comprobante:",
      ultimoComprobante.value.idComprobante
    );
    await ComprobanteService.descargarYGuardarPdf(ultimoComprobante.value);
    console.log("✅ [PaymentMethodDialog] PDF descargado exitosamente");
  } catch (error) {
    console.error("❌ [PaymentMethodDialog] Error al descargar PDF:", error);
    emit("pago-error", "Error al descargar el PDF");
  } finally {
    descargandoPdf.value = false;
  }
};

const formatearMoneda = (amount: number): string => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
};

// Initialize on mount
onMounted(() => {
  console.log(
    "🔍 [PaymentMethodDialog] Component mounted. props.visible:",
    props.visible,
    "props.pedido:",
    props.pedido
  );
  if (props.visible) {
    console.log("🔍 [PaymentMethodDialog] Visible en mount, inicializando...");
    initializeDialog();
  }
});
</script>

<style scoped>
.v-radio-group {
  margin-bottom: 0;
}

.v-radio {
  margin-bottom: 8px;
}
</style>
