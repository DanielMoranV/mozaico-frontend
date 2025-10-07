# 📋 Ejemplos de Uso - Impresión de Tickets

## Diferencia entre Endpoints de Ticket

### 📥 `/ticket` - Para Descargar y Guardar
```typescript
// Usa: GET /api/v1/comprobantes/{id}/ticket
// Content-Disposition: attachment
const blob = await ComprobanteService.descargarTicket(idComprobante);
ComprobanteService.downloadFile(blob, 'ticket.pdf');
```

### 🖨️ `/ticket/imprimir` - Para Imprimir Directamente
```typescript
// Usa: GET /api/v1/comprobantes/{id}/ticket/imprimir
// Content-Disposition: inline + X-Auto-Print: true
const blob = await ComprobanteService.obtenerTicketParaImprimir(idComprobante);
// Crear iframe y abrir diálogo de impresión
```

**Importante:** Ambos devuelven el mismo PDF de 80mm, solo cambian los headers HTTP.

---

## Ejemplo 1: Imprimir Ticket desde un Componente Vue

```vue
<template>
  <div>
    <v-btn
      @click="imprimirTicketComprobante"
      :loading="printing"
      color="primary"
    >
      🖨️ Imprimir Ticket
    </v-btn>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { useTicketPrinter } from '@/composables/useTicketPrinter';

const { imprimirTicket, printing, error } = useTicketPrinter();

const imprimirTicketComprobante = async () => {
  const idComprobante = 123; // ID del comprobante
  const success = await imprimirTicket(idComprobante, true);

  if (!success) {
    console.error('Error al imprimir:', error.value);
  }
};
</script>
```

## Ejemplo 2: Imprimir Después de Crear un Pago

```typescript
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import { PagoService } from '@/services/pagoService';

const { imprimirTicket } = useTicketPrinter();

async function procesarPagoConImpresion(datosPago) {
  try {
    // 1. Crear el pago
    const response = await PagoService.crearPagoCompleto(datosPago);

    if (response.status === 'SUCCESS' && response.data.comprobante) {
      const comprobante = response.data.comprobante;

      // 2. Esperar un momento para que el archivo esté listo
      setTimeout(async () => {
        // 3. Imprimir automáticamente
        if (comprobante.archivoTicketDisponible) {
          await imprimirTicket(comprobante.idComprobante, true);
          console.log('✅ Ticket impreso automáticamente');
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Ejemplo 3: Botones de Acción Múltiple

```vue
<template>
  <div class="d-flex gap-2">
    <!-- Imprimir -->
    <v-btn
      @click="handlePrint"
      :loading="printing"
      color="primary"
      prepend-icon="mdi-printer"
    >
      Imprimir
    </v-btn>

    <!-- Descargar -->
    <v-btn
      @click="handleDownload"
      :loading="downloading"
      color="secondary"
      prepend-icon="mdi-download"
    >
      Descargar
    </v-btn>

    <!-- Vista Previa -->
    <v-btn
      @click="handlePreview"
      variant="outlined"
      prepend-icon="mdi-eye"
    >
      Vista Previa
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import { ComprobanteService } from '@/services/comprobanteService';
import type { ComprobanteDTO } from '@/types/pago';

interface Props {
  comprobante: ComprobanteDTO;
}

const props = defineProps<Props>();

const { imprimirTicket, printing } = useTicketPrinter();
const downloading = ref(false);

const handlePrint = async () => {
  await imprimirTicket(props.comprobante.idComprobante, true);
};

const handleDownload = async () => {
  downloading.value = true;
  try {
    await ComprobanteService.descargarYGuardarTicket(props.comprobante);
  } finally {
    downloading.value = false;
  }
};

const handlePreview = async () => {
  // Abrir en nueva ventana sin imprimir
  const blob = await ComprobanteService.descargarTicket(props.comprobante.idComprobante);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
</script>
```

## Ejemplo 4: Tabla con Acciones de Impresión

```vue
<template>
  <v-data-table
    :headers="headers"
    :items="comprobantes"
    :loading="loading"
  >
    <template v-slot:item.actions="{ item }">
      <div class="d-flex gap-1">
        <!-- Imprimir Ticket -->
        <v-tooltip text="Imprimir Ticket" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              color="primary"
              :disabled="!item.archivoTicketDisponible"
              @click="imprimirItem(item)"
            >
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Descargar -->
        <v-tooltip text="Descargar" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="text"
              :disabled="!item.archivoTicketDisponible"
              @click="descargarItem(item)"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import type { ComprobanteListItem } from '@/types/comprobante';

const { imprimirTicket } = useTicketPrinter();
const comprobantes = ref<ComprobanteListItem[]>([]);
const loading = ref(false);

const headers = [
  { title: 'Número', key: 'numeroComprobante' },
  { title: 'Fecha', key: 'fechaEmision' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const imprimirItem = async (item: ComprobanteListItem) => {
  await imprimirTicket(item.idComprobante, true);
};

const descargarItem = async (item: ComprobanteListItem) => {
  // Implementar descarga
};
</script>
```

## Ejemplo 5: Store con Gestión de Impresión

```typescript
// stores/comprobanteStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import { ComprobanteService } from '@/services/comprobanteService';

export const useComprobanteStore = defineStore('comprobante', () => {
  const comprobantes = ref([]);
  const printing = ref(false);

  const { imprimirTicket } = useTicketPrinter();

  async function imprimirComprobante(idComprobante: number) {
    printing.value = true;
    try {
      const success = await imprimirTicket(idComprobante, true);
      return success;
    } catch (error) {
      console.error('Error al imprimir:', error);
      return false;
    } finally {
      printing.value = false;
    }
  }

  async function imprimirUltimoComprobante() {
    const ultimo = comprobantes.value[0];
    if (ultimo) {
      return await imprimirComprobante(ultimo.idComprobante);
    }
    return false;
  }

  return {
    comprobantes,
    printing,
    imprimirComprobante,
    imprimirUltimoComprobante,
  };
});
```

## Ejemplo 6: Manejo de Errores Avanzado

```typescript
import { useTicketPrinter } from '@/composables/useTicketPrinter';
import { useSnackbar } from '@/composables/useSnackbar';

const { imprimirTicket, error: printError, clearError } = useTicketPrinter();
const { showSnackbar } = useSnackbar();

async function imprimirConManejadorErrores(idComprobante: number) {
  clearError(); // Limpiar errores previos

  try {
    const success = await imprimirTicket(idComprobante, true);

    if (success) {
      showSnackbar('Imprimiendo ticket...', 'info');
    } else {
      // Mostrar error específico
      const mensaje = printError.value || 'Error desconocido al imprimir';
      showSnackbar(mensaje, 'error');

      // Ofrecer alternativa
      const descargar = confirm('¿Desea descargar el ticket en su lugar?');
      if (descargar) {
        await descargarTicketAlternativo(idComprobante);
      }
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    showSnackbar('Error inesperado al imprimir', 'error');
  }
}

async function descargarTicketAlternativo(idComprobante: number) {
  // Implementar descarga como plan B
  const blob = await ComprobanteService.descargarTicket(idComprobante);
  ComprobanteService.downloadFile(blob, `ticket_${idComprobante}.pdf`);
  showSnackbar('Ticket descargado exitosamente', 'success');
}
```

## Ejemplo 7: Impresión en Lote

```typescript
import { useTicketPrinter } from '@/composables/useTicketPrinter';

async function imprimirMultiplesTickets(idsComprobantes: number[]) {
  const { imprimirTicket } = useTicketPrinter();
  const resultados = [];

  for (const id of idsComprobantes) {
    console.log(`Imprimiendo comprobante ${id}...`);

    const success = await imprimirTicket(id, true);
    resultados.push({ id, success });

    // Esperar 2 segundos entre impresiones
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const exitosos = resultados.filter(r => r.success).length;
  console.log(`✅ ${exitosos}/${idsComprobantes.length} tickets impresos`);

  return resultados;
}

// Uso
const ids = [1, 2, 3, 4, 5];
await imprimirMultiplesTickets(ids);
```

## Ejemplo 8: Configuración Personalizada

```typescript
interface OpcionesImpresion {
  autoPrint: boolean;
  abrirEnNuevaVentana: boolean;
  tiempoEspera: number;
}

async function imprimirConOpciones(
  idComprobante: number,
  opciones: OpcionesImpresion = {
    autoPrint: true,
    abrirEnNuevaVentana: false,
    tiempoEspera: 1000
  }
) {
  const { imprimirTicket } = useTicketPrinter();

  if (!opciones.autoPrint && opciones.abrirEnNuevaVentana) {
    // Solo abrir en nueva ventana, no imprimir
    const blob = await ComprobanteService.descargarTicket(idComprobante);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    return;
  }

  // Esperar tiempo configurado antes de imprimir
  await new Promise(resolve => setTimeout(resolve, opciones.tiempoEspera));

  await imprimirTicket(idComprobante, opciones.autoPrint);
}
```

## Tips y Mejores Prácticas

### ✅ DO - Buenas Prácticas

```typescript
// ✅ Esperar antes de imprimir después de crear
setTimeout(async () => {
  await imprimirTicket(id, true);
}, 1000);

// ✅ Manejar errores adecuadamente
const success = await imprimirTicket(id, true);
if (!success) {
  console.error(printError.value);
}

// ✅ Limpiar errores antes de nueva impresión
clearError();
await imprimirTicket(id, true);

// ✅ Verificar disponibilidad antes de imprimir
if (comprobante.archivoTicketDisponible) {
  await imprimirTicket(comprobante.idComprobante, true);
}
```

### ❌ DON'T - Malas Prácticas

```typescript
// ❌ No esperar después de crear
const response = await crearPago(datos);
await imprimirTicket(response.data.comprobante.idComprobante, true); // Puede fallar

// ❌ Ignorar errores
await imprimirTicket(id, true); // Sin manejo de errores

// ❌ No verificar disponibilidad
await imprimirTicket(comprobanteAnulado.idComprobante, true); // Fallará

// ❌ Imprimir en bucle sin espera
for (const id of ids) {
  await imprimirTicket(id, true); // Sobrecarga el navegador
}
```

## Recursos Adicionales

- [Documentación General](./IMPRESION_TICKETS.md)
- [API de Comprobantes](../../backend/docs/API_COMPROBANTES.md)
- [Troubleshooting](./IMPRESION_TICKETS.md#solucion-de-problemas)
