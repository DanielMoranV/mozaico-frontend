<template>
  <v-card>
    <v-card-title>Consultar Disponibilidad de Mesas</v-card-title>
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="buscarDisponibilidad">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="fechaHora"
              label="Fecha y Hora"
              type="datetime-local"
              :rules="[rules.required]"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="numeroPersonas"
              label="Número de Personas"
              type="number"
              min="1"
              :rules="[rules.required, rules.minPersonas]"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="ubicacion"
              label="Ubicación (Opcional)"
              placeholder="Ej: Terraza, Interior"
            />
          </v-col>
        </v-row>
        <v-btn
          type="submit"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Buscar Disponibilidad
        </v-btn>
      </v-form>

      <!-- Resultados de disponibilidad -->
      <div v-if="disponibilidad" class="mt-6">
        <v-divider class="mb-4" />
        <h3 class="mb-4">
          {{ disponibilidad.totalDisponibles }} mesas disponibles
        </h3>

        <v-alert v-if="disponibilidad.totalDisponibles === 0" type="warning">
          No hay mesas disponibles para la fecha y hora seleccionadas
        </v-alert>

        <v-row v-else>
          <v-col
            v-for="mesa in disponibilidad.mesasDisponibles"
            :key="mesa.idMesa"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              hover
              class="mesa-card"
              @click="seleccionarMesa(mesa)"
            >
              <v-card-title>Mesa {{ mesa.numeroMesa }}</v-card-title>
              <v-card-text>
                <div class="mb-2">
                  <strong>Capacidad:</strong> {{ mesa.capacidad }} personas
                </div>
                <div v-if="mesa.ubicacion" class="mb-2">
                  <strong>Ubicación:</strong> {{ mesa.ubicacion }}
                </div>
                <div v-if="mesa.observaciones" class="text-caption">
                  {{ mesa.observaciones }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" variant="text">
                  Seleccionar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Mensaje de error -->
      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ReservaService } from '@/services/reservaService';
import type { DisponibilidadResponseDTO, MesaDisponibleDTO } from '@/types/reserva';
import { handleApiError, getErrorMessage } from '@/utils/error-handler';

const emit = defineEmits<{
  mesaSeleccionada: [{ idMesa: number; fechaHora: string }];
}>();

const formRef = ref();
const fechaHora = ref('');
const numeroPersonas = ref(2);
const ubicacion = ref('');

const disponibilidad = ref<DisponibilidadResponseDTO | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const rules = {
  required: (v: any) => !!v || 'Este campo es requerido',
  minPersonas: (v: number) => v >= 1 || 'Debe ser al menos 1 persona'
};

// Computed para verificar si hay mesas disponibles (no usado actualmente pero útil para futuro)
// const hasMesasDisponibles = computed(
//   () => disponibilidad.value && disponibilidad.value.totalDisponibles > 0
// );

async function buscarDisponibilidad() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    isLoading.value = true;
    error.value = null;

    disponibilidad.value = await ReservaService.consultarDisponibilidad({
      fechaHora: fechaHora.value,
      numeroPersonas: numeroPersonas.value,
      ubicacion: ubicacion.value || undefined,
    });
  } catch (err) {
    const { message, statusCode } = handleApiError(err);
    error.value = getErrorMessage(statusCode, message);
    console.error('Error al consultar disponibilidad:', err);
  } finally {
    isLoading.value = false;
  }
}

function seleccionarMesa(mesa: MesaDisponibleDTO) {
  emit('mesaSeleccionada', {
    idMesa: mesa.idMesa,
    fechaHora: fechaHora.value
  });
}
</script>

<style scoped>
.mesa-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.mesa-card:hover {
  transform: translateY(-4px);
}
</style>
