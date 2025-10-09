<template>
  <v-dialog v-model="isOpen" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white">
        <v-icon class="mr-2">mdi-printer</v-icon>
        <span>Imprimir QR para Mesas</span>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-6">
        <!-- Opciones de impresión -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-select
              v-model="printSize"
              label="Tamaño de impresión"
              :items="sizeOptions"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-resize"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="qrPerPage"
              label="QR por página"
              :items="qrPerPageOptions"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-table"
            />
          </v-col>
        </v-row>

        <!-- Vista previa -->
        <div class="preview-container">
          <h3 class="text-subtitle-1 mb-3">Vista Previa</h3>
          <div id="qr-print-area" class="print-area" :class="`size-${printSize} qr-grid-${qrPerPage}`">
            <div
              v-for="n in qrPerPage"
              :key="n"
              class="qr-card"
            >
              <div class="qr-header">
                <h2>{{ empresa?.nombre || 'Restaurante' }}</h2>
                <p class="subtitle">Escanea para ver nuestro menú</p>
              </div>
              <div class="qr-image-container">
                <img :src="qrUrl" alt="QR Code" class="qr-image" crossorigin="anonymous" />
              </div>
              <div class="qr-footer">
                <span class="instructions">📱 Usa la cámara de tu celular</span>
              </div>
              <div class="qr-url">
                {{ cartaUrl }}
              </div>
            </div>
          </div>
        </div>

        <v-alert type="info" variant="tonal" class="mt-4">
          <div class="text-caption">
            <strong>Recomendaciones:</strong>
            <ul class="ml-4 mt-2">
              <li>Imprime en papel de buena calidad o plastifica</li>
              <li>Coloca en un lugar visible de cada mesa</li>
              <li>Evita que se moje o ensucie el QR</li>
              <li>Tamaño pequeño: ideal para mesas individuales</li>
              <li>Tamaño grande: ideal para mesas compartidas o cartelera</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="imprimirQR"
          prepend-icon="mdi-printer"
        >
          Imprimir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Empresa } from '@/types/empresa';

interface Props {
  modelValue: boolean;
  empresa: Empresa | null;
  qrUrl: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const printSize = ref<'small' | 'medium' | 'large'>('medium');
const qrPerPage = ref(4);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const sizeOptions = [
  { title: 'Pequeño (10x10cm)', value: 'small' },
  { title: 'Mediano (15x15cm)', value: 'medium' },
  { title: 'Grande (20x20cm)', value: 'large' },
];

const qrPerPageOptions = [
  { title: '1 QR por página', value: 1 },
  { title: '2 QR por página', value: 2 },
  { title: '4 QR por página', value: 4 },
  { title: '6 QR por página', value: 6 },
];

const cartaUrl = computed(() => {
  if (!props.empresa?.slug) return '';
  return `${window.location.origin}/carta/${props.empresa.slug}`;
});

async function imprimirQR() {
  const printArea = document.getElementById('qr-print-area');
  if (!printArea) {
    console.error('No se encontró el área de impresión');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  // Generar el HTML para cada QR card
  const qrCardsHTML = Array.from({ length: qrPerPage.value }, () => `
    <div class="qr-card">
      <div class="qr-header">
        <h2>${props.empresa?.nombre || 'Restaurante'}</h2>
        <p class="subtitle">Escanea para ver nuestro menú</p>
      </div>
      <div class="qr-image-container">
        <img src="${props.qrUrl}" alt="QR Code" class="qr-image" crossorigin="anonymous" />
      </div>
      <div class="qr-footer">
        <span class="instructions">📱 Usa la cámara de tu celular</span>
      </div>
      <div class="qr-url">${cartaUrl.value}</div>
    </div>
  `).join('');

  const styles = `
    <style>
      @page {
        size: A4 portrait;
        margin: 15mm;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Roboto', Arial, sans-serif;
        background: white;
      }

      .print-area {
        display: grid;
        gap: 15px;
        padding: 10px;
        width: 100%;
      }

      .qr-grid-1 {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
      }

      .qr-grid-2 {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
      }

      .qr-grid-4 {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
      }

      .qr-grid-6 {
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: auto;
      }

      .qr-card {
        border: 2px solid #1976d2;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        background: white;
        page-break-inside: avoid;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      /* Alturas fijas según cantidad de QR */
      .qr-grid-1 .qr-card {
        min-height: 250mm;
      }

      .qr-grid-2 .qr-card {
        min-height: 250mm;
      }

      .qr-grid-4 .qr-card {
        min-height: 120mm;
        max-height: 120mm;
      }

      .qr-grid-6 .qr-card {
        min-height: 120mm;
        max-height: 120mm;
      }

      .qr-header h2 {
        color: #1976d2;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .qr-header .subtitle {
        color: #666;
        font-size: 0.85rem;
        margin-bottom: 10px;
      }

      .qr-image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        flex: 1;
      }

      /* Tamaños QR según configuración */
      .qr-grid-1 .qr-image { width: 200px; height: 200px; }
      .qr-grid-2 .qr-image { width: 150px; height: 150px; }
      .qr-grid-4 .qr-image { width: 120px; height: 120px; }
      .qr-grid-6 .qr-image { width: 90px; height: 90px; }

      /* Override por tamaño */
      .size-small .qr-image { transform: scale(0.8); }
      .size-medium .qr-image { transform: scale(1); }
      .size-large .qr-image { transform: scale(1.2); }

      .qr-image {
        border: 3px solid #1976d2;
        border-radius: 8px;
        padding: 8px;
        background: white;
        display: block;
      }

      .qr-footer {
        margin-top: 8px;
        color: #666;
        font-size: 0.8rem;
        text-align: center;
      }

      .qr-footer .instructions {
        font-weight: 500;
      }

      .qr-url {
        margin-top: 6px;
        font-size: 0.65rem;
        color: #999;
        word-break: break-all;
      }

      @media print {
        @page {
          size: A4 portrait;
          margin: 15mm;
        }

        body {
          background: white;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        .print-area {
          width: 100%;
        }

        .qr-card {
          border-color: #1976d2;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .qr-header h2 {
          color: #1976d2;
        }

        .qr-image {
          border-color: #1976d2;
        }
      }
    </style>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${props.empresa?.nombre || 'Carta Digital'}</title>
        <meta charset="utf-8">
        ${styles}
      </head>
      <body>
        <div class="print-area size-${printSize.value} qr-grid-${qrPerPage.value}">
          ${qrCardsHTML}
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  // Esperar a que carguen las imágenes antes de imprimir
  const images = printWindow.document.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve(true);
      } else {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      }
    });
  });

  await Promise.all(imagePromises);

  // Dar tiempo adicional para que se renderice todo
  setTimeout(() => {
    printWindow.print();
    // No cerrar automáticamente para que el usuario pueda ver el resultado
    // printWindow.close();
  }, 500);
}

function close() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.preview-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.print-area {
  display: grid;
  gap: 16px;
}

.qr-grid-1 { grid-template-columns: 1fr; }
.qr-grid-2 { grid-template-columns: repeat(2, 1fr); }
.qr-grid-4 { grid-template-columns: repeat(2, 1fr); }
.qr-grid-6 { grid-template-columns: repeat(3, 1fr); }

.qr-card {
  border: 2px solid #1976d2;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.size-small .qr-card { min-height: 200px; }
.size-medium .qr-card { min-height: 280px; }
.size-large .qr-card { min-height: 360px; }

.qr-header h2 {
  color: #1976d2;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.qr-header .subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.qr-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 12px 0;
}

.size-small .qr-image { width: 100px; height: 100px; }
.size-medium .qr-image { width: 140px; height: 140px; }
.size-large .qr-image { width: 180px; height: 180px; }

.qr-image {
  border: 3px solid #1976d2;
  border-radius: 8px;
  padding: 8px;
  background: white;
}

.qr-footer {
  margin-top: 8px;
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-footer .instructions {
  font-weight: 500;
}

.qr-url {
  margin-top: 8px;
  font-size: 0.7rem;
  color: #999;
  word-break: break-all;
}
</style>
