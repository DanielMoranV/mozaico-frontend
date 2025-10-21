<template>
  <v-card>
    <v-card-title>
      {{ isEditing ? 'Editar Reserva' : 'Crear Nueva Reserva' }}
    </v-card-title>
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.idCliente"
              :items="clientesFormateados"
              item-title="nombreCompleto"
              item-value="idCliente"
              label="Cliente"
              :rules="[rules.required]"
              required
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw.nombreCompleto"
                  :subtitle="item.raw.telefono || item.raw.email || ''"
                ></v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.idMesa"
              :items="mesas"
              item-title="numeroMesa"
              item-value="idMesa"
              label="Mesa"
              :rules="[rules.required]"
              required
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`Mesa ${item.raw.numeroMesa}`"
                  :subtitle="`Capacidad: ${item.raw.capacidad} personas`"
                ></v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.fechaHoraReserva"
              label="Fecha y Hora de Reserva"
              type="datetime-local"
              :rules="[rules.required, rules.fechaFutura]"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.numeroPersonas"
              label="Número de Personas"
              type="number"
              min="1"
              :rules="[rules.required, rules.minPersonas]"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.estado"
              :items="estadosReserva"
              label="Estado"
              item-title="text"
              item-value="value"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.observaciones"
              label="Observaciones (Opcional)"
              rows="3"
            />
          </v-col>
        </v-row>

        <!-- Mensaje de error -->
        <v-alert v-if="error" type="error" class="mt-4 mb-2">
          {{ error }}
        </v-alert>

        <!-- Botón para verificar disponibilidad -->
        <v-row>
          <v-col cols="12">
            <v-btn
              color="info"
              variant="outlined"
              prepend-icon="mdi-calendar-search"
              :disabled="!form.fechaHoraReserva || !form.numeroPersonas"
              @click="verificarDisponibilidad"
            >
              Verificar Disponibilidad
            </v-btn>
          </v-col>
        </v-row>

        <!-- Sugerencias de mesas alternativas -->
        <v-alert v-if="showAlternativas && mesasAlternativas.length > 0" type="info" class="mt-4">
          <div class="mb-2"><strong>Mesas alternativas disponibles:</strong></div>
          <v-chip
            v-for="mesa in mesasAlternativas"
            :key="mesa.idMesa"
            class="ma-1"
            @click="seleccionarMesaAlternativa(mesa.idMesa)"
            clickable
          >
            Mesa {{ mesa.numeroMesa }} (Capacidad: {{ mesa.capacidad }})
            <template v-if="mesa.ubicacion">
              - {{ mesa.ubicacion }}
            </template>
          </v-chip>
        </v-alert>

        <!-- Mensaje de disponibilidad confirmada -->
        <v-alert v-if="disponibilidadConfirmada" type="success" class="mt-4">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Mesa {{ form.idMesa }} disponible para {{ form.numeroPersonas }} personas
        </v-alert>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="emit('cancel')">
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        @click="submitForm"
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }} Reserva
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { ReservaService } from '@/services/reservaService';
import { ClienteService } from '@/services/clienteService';
import { MesaService } from '@/services/mesaService';
import type { ReservaRequestDTO, ReservaUpdateDTO, ReservaResponseDTO } from '@/types/reserva';
import type { ClienteResponseDTO } from '@/types/cliente';
import type { MesaResponseDTO } from '@/types/mesa';
import { EstadoReserva } from '@/types/enums';
import { handleApiError, isDisponibilidadError, getErrorMessage } from '@/utils/error-handler';

interface Props {
  reservaId?: number;
  mesaPreseleccionada?: number;
  fechaHoraPreseleccionada?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  success: [ReservaResponseDTO];
  cancel: [];
}>();

const formRef = ref();
const form = ref<ReservaRequestDTO>({
  idCliente: 0,
  idMesa: props.mesaPreseleccionada || 0,
  fechaHoraReserva: props.fechaHoraPreseleccionada || '',
  numeroPersonas: 2,
  observaciones: '',
  estado: EstadoReserva.PENDIENTE,
});

const clientes = ref<ClienteResponseDTO[]>([]);
const mesas = ref<MesaResponseDTO[]>([]);
const mesasAlternativas = ref<any[]>([]);

const isSubmitting = ref(false);
const isEditing = ref(false);
const error = ref<string | null>(null);
const showAlternativas = ref(false);
const disponibilidadConfirmada = ref(false);

// Formatear clientes para el select
const clientesFormateados = computed(() => {
  return clientes.value.map(cliente => {
    let nombreCompleto = '';

    // Si es persona jurídica, usar razón social o nombre comercial
    if (cliente.tipoPersona === 'JURIDICA') {
      nombreCompleto = cliente.razonSocial || cliente.nombreComercial || cliente.nombre;
    } else {
      // Si es persona natural, concatenar nombre y apellido
      nombreCompleto = cliente.nombre;
      if (cliente.apellido) {
        nombreCompleto += ` ${cliente.apellido}`;
      }
    }

    return {
      ...cliente,
      nombreCompleto
    };
  });
});

const estadosReserva = [
  { text: 'Pendiente', value: EstadoReserva.PENDIENTE },
  { text: 'Confirmada', value: EstadoReserva.CONFIRMADA },
  { text: 'En Curso', value: EstadoReserva.EN_CURSO },
  { text: 'Completada', value: EstadoReserva.COMPLETADA },
  { text: 'Cancelada', value: EstadoReserva.CANCELADA },
  { text: 'No Presentado', value: EstadoReserva.NO_PRESENTADO },
];

const rules = {
  required: (v: any) => !!v || 'Este campo es requerido',
  minPersonas: (v: number) => v >= 1 || 'Debe ser al menos 1 persona',
  fechaFutura: (v: string) => {
    if (!v) return true;
    const fecha = new Date(v);
    const ahora = new Date();
    return fecha >= ahora || 'La fecha debe ser presente o futura';
  }
};

onMounted(async () => {
  await Promise.all([
    cargarClientes(),
    cargarMesas()
  ]);

  if (props.reservaId) {
    isEditing.value = true;
    await cargarReserva(props.reservaId);
  }
});

async function cargarClientes() {
  try {
    clientes.value = await ClienteService.obtenerTodos();
  } catch (err) {
    console.error('Error al cargar clientes:', err);
  }
}

async function cargarMesas() {
  try {
    mesas.value = await MesaService.obtenerTodas();
  } catch (err) {
    console.error('Error al cargar mesas:', err);
  }
}

async function cargarReserva(id: number) {
  try {
    const reserva = await ReservaService.obtenerPorId(id);
    form.value = {
      idCliente: reserva.cliente.idCliente,
      idMesa: reserva.mesa.idMesa,
      fechaHoraReserva: reserva.fechaHoraReserva,
      numeroPersonas: reserva.numeroPersonas,
      observaciones: reserva.observaciones,
      estado: reserva.estado,
    };
  } catch (err) {
    const { message } = handleApiError(err);
    error.value = message;
  }
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    isSubmitting.value = true;
    error.value = null;
    showAlternativas.value = false;

    let reserva: ReservaResponseDTO;

    if (isEditing.value && props.reservaId) {
      const updateData: ReservaUpdateDTO = { ...form.value };
      reserva = await ReservaService.actualizar(props.reservaId, updateData);
    } else {
      reserva = await ReservaService.crear(form.value);
    }

    emit('success', reserva);
  } catch (err) {
    const { message, statusCode } = handleApiError(err);

    if (isDisponibilidadError(err)) {
      error.value = 'La mesa no está disponible para esa fecha/hora';
      await buscarMesasAlternativas();
      showAlternativas.value = true;
    } else {
      error.value = getErrorMessage(statusCode, message);
    }

    console.error('Error al guardar reserva:', err);
  } finally {
    isSubmitting.value = false;
  }
}

async function verificarDisponibilidad() {
  try {
    error.value = null;
    disponibilidadConfirmada.value = false;
    showAlternativas.value = false;

    const disponibilidad = await ReservaService.consultarDisponibilidad({
      fechaHora: form.value.fechaHoraReserva,
      numeroPersonas: form.value.numeroPersonas,
    });

    if (disponibilidad.totalDisponibles > 0) {
      mesasAlternativas.value = disponibilidad.mesasDisponibles;

      // Si la mesa seleccionada está en la lista de disponibles, confirmar
      const mesaDisponible = disponibilidad.mesasDisponibles.find(
        m => m.idMesa === form.value.idMesa
      );

      if (mesaDisponible) {
        disponibilidadConfirmada.value = true;
      } else if (form.value.idMesa) {
        // La mesa seleccionada NO está disponible, mostrar alternativas
        showAlternativas.value = true;
        error.value = `Mesa ${form.value.idMesa} no disponible para esa fecha/hora. Selecciona una mesa alternativa:`;
      } else {
        // No hay mesa seleccionada, mostrar todas las disponibles
        showAlternativas.value = true;
      }
    } else {
      error.value = 'No hay mesas disponibles para la fecha, hora y número de personas especificados.';
    }
  } catch (err) {
    console.error('Error al verificar disponibilidad:', err);
    error.value = 'Error al verificar disponibilidad de mesas';
  }
}

async function buscarMesasAlternativas() {
  try {
    const disponibilidad = await ReservaService.consultarDisponibilidad({
      fechaHora: form.value.fechaHoraReserva,
      numeroPersonas: form.value.numeroPersonas,
    });
    mesasAlternativas.value = disponibilidad.mesasDisponibles;
  } catch (err) {
    console.error('Error al buscar mesas alternativas:', err);
  }
}

function seleccionarMesaAlternativa(idMesa: number) {
  form.value.idMesa = idMesa;
  showAlternativas.value = false;
  disponibilidadConfirmada.value = true;
  error.value = null;
}

// Watch para resetear validación cuando cambia la fecha/hora o número de personas
watch([() => form.value.fechaHoraReserva, () => form.value.numeroPersonas], () => {
  disponibilidadConfirmada.value = false;
  showAlternativas.value = false;
});

// Watch para actualizar mesa preseleccionada
watch(() => props.mesaPreseleccionada, (newVal) => {
  if (newVal) form.value.idMesa = newVal;
});

watch(() => props.fechaHoraPreseleccionada, (newVal) => {
  if (newVal) form.value.fechaHoraReserva = newVal;
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
