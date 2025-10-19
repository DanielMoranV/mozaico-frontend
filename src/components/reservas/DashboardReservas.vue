<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>Reservas del Día</span>
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="cargarReservasDelDia"
        >
          Actualizar
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Filtros rápidos -->
        <v-row class="mb-4">
          <v-col cols="12" md="3">
            <v-select
              v-model="filtroEstado"
              :items="opcionesEstado"
              label="Filtrar por Estado"
              clearable
              density="compact"
              @update:model-value="aplicarFiltro"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchTerm"
              label="Buscar por nombre"
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              @update:model-value="aplicarFiltro"
            />
          </v-col>
        </v-row>

        <!-- Indicador de carga -->
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <!-- Lista de reservas -->
        <v-row v-else>
          <v-col
            v-for="reserva in reservasFiltradas"
            :key="reserva.idReserva"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              :class="['reserva-card', getColorEstado(reserva.estado)]"
              elevation="2"
            >
              <v-card-title class="d-flex align-center">
                <v-icon :color="getIconColor(reserva.estado)" class="mr-2">
                  {{ getIconEstado(reserva.estado) }}
                </v-icon>
                Mesa {{ reserva.mesa.numeroMesa }}
                <v-spacer />
                <v-chip :color="getChipColor(reserva.estado)" size="small">
                  {{ formatEstado(reserva.estado) }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <div class="mb-2">
                  <v-icon size="small" class="mr-2">mdi-account</v-icon>
                  <strong>{{ reserva.cliente.nombre }} {{ reserva.cliente.apellido }}</strong>
                </div>
                <div class="mb-2">
                  <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                  {{ formatFechaHora(reserva.fechaHoraReserva) }}
                </div>
                <div class="mb-2">
                  <v-icon size="small" class="mr-2">mdi-account-multiple</v-icon>
                  {{ reserva.numeroPersonas }} personas
                </div>
                <div v-if="reserva.observaciones" class="text-caption">
                  <v-icon size="small" class="mr-2">mdi-note-text</v-icon>
                  {{ reserva.observaciones }}
                </div>
              </v-card-text>

              <v-card-actions>
                <!-- Botones según el estado -->
                <v-btn
                  v-if="reserva.estado === EstadoReserva.PENDIENTE"
                  color="success"
                  variant="text"
                  size="small"
                  @click="cambiarEstado(reserva.idReserva, EstadoReserva.CONFIRMADA)"
                >
                  Confirmar
                </v-btn>
                <v-btn
                  v-if="reserva.estado === EstadoReserva.CONFIRMADA"
                  color="primary"
                  variant="text"
                  size="small"
                  @click="cambiarEstado(reserva.idReserva, EstadoReserva.EN_CURSO)"
                >
                  Cliente Llegó
                </v-btn>
                <v-btn
                  v-if="reserva.estado === EstadoReserva.EN_CURSO"
                  color="success"
                  variant="text"
                  size="small"
                  @click="cambiarEstado(reserva.idReserva, EstadoReserva.COMPLETADA)"
                >
                  Finalizar
                </v-btn>

                <v-spacer />

                <!-- Menú de opciones -->
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      v-bind="props"
                    />
                  </template>
                  <v-list>
                    <v-list-item @click="editarReserva(reserva)">
                      <v-list-item-title>
                        <v-icon size="small" class="mr-2">mdi-pencil</v-icon>
                        Editar
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="['PENDIENTE', 'CONFIRMADA'].includes(reserva.estado)"
                      @click="cambiarEstado(reserva.idReserva, EstadoReserva.CANCELADA)"
                    >
                      <v-list-item-title>
                        <v-icon size="small" class="mr-2">mdi-cancel</v-icon>
                        Cancelar
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="reserva.estado === EstadoReserva.CONFIRMADA"
                      @click="cambiarEstado(reserva.idReserva, EstadoReserva.NO_PRESENTADO)"
                    >
                      <v-list-item-title>
                        <v-icon size="small" class="mr-2">mdi-account-off</v-icon>
                        No se presentó
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item @click="eliminarReserva(reserva.idReserva)">
                      <v-list-item-title class="text-error">
                        <v-icon size="small" class="mr-2">mdi-delete</v-icon>
                        Eliminar
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Mensaje si no hay reservas -->
          <v-col v-if="reservasFiltradas.length === 0" cols="12">
            <v-alert type="info">
              No hay reservas para el día de hoy
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Diálogo de edición -->
    <v-dialog v-model="dialogEditar" max-width="800px">
      <CrearReservaForm
        v-if="reservaSeleccionada"
        :reserva-id="reservaSeleccionada.idReserva"
        @success="onReservaActualizada"
        @cancel="dialogEditar = false"
      />
    </v-dialog>

    <!-- Snackbar de notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ReservaService } from '@/services/reservaService';
import { EstadoReserva } from '@/types/enums';
import type { ReservaResponseDTO } from '@/types/reserva';
import { handleApiError } from '@/utils/error-handler';
import CrearReservaForm from './CrearReservaForm.vue';

const reservasDelDia = ref<ReservaResponseDTO[]>([]);
const isLoading = ref(false);
const filtroEstado = ref<EstadoReserva | null>(null);
const searchTerm = ref('');
const dialogEditar = ref(false);
const reservaSeleccionada = ref<ReservaResponseDTO | null>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const opcionesEstado = [
  { title: 'Pendiente', value: EstadoReserva.PENDIENTE },
  { title: 'Confirmada', value: EstadoReserva.CONFIRMADA },
  { title: 'En Curso', value: EstadoReserva.EN_CURSO },
  { title: 'Completada', value: EstadoReserva.COMPLETADA },
  { title: 'Cancelada', value: EstadoReserva.CANCELADA },
  { title: 'No Presentado', value: EstadoReserva.NO_PRESENTADO },
];

const reservasFiltradas = computed(() => {
  let resultado = [...reservasDelDia.value];

  // Filtrar por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(r => r.estado === filtroEstado.value);
  }

  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    resultado = resultado.filter(r =>
      r.cliente.nombre.toLowerCase().includes(term) ||
      (r.cliente.apellido?.toLowerCase().includes(term) || false)
    );
  }

  return resultado;
});

onMounted(async () => {
  await cargarReservasDelDia();
});

async function cargarReservasDelDia() {
  try {
    isLoading.value = true;

    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
    const finDia = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();

    reservasDelDia.value = await ReservaService.buscar({
      fechaHoraReservaDesde: inicioDia,
      fechaHoraReservaHasta: finDia,
    });
  } catch (err) {
    const { message } = handleApiError(err);
    mostrarNotificacion(message, 'error');
    console.error('Error al cargar reservas:', err);
  } finally {
    isLoading.value = false;
  }
}

async function cambiarEstado(idReserva: number, nuevoEstado: EstadoReserva) {
  try {
    await ReservaService.cambiarEstado(idReserva, nuevoEstado);
    mostrarNotificacion('Estado actualizado correctamente', 'success');
    await cargarReservasDelDia();
  } catch (err) {
    const { message } = handleApiError(err);
    mostrarNotificacion(message, 'error');
    console.error('Error al cambiar estado:', err);
  }
}

function editarReserva(reserva: ReservaResponseDTO) {
  reservaSeleccionada.value = reserva;
  dialogEditar.value = true;
}

async function eliminarReserva(idReserva: number) {
  if (!confirm('¿Está seguro de que desea eliminar esta reserva?')) return;

  try {
    await ReservaService.eliminar(idReserva);
    mostrarNotificacion('Reserva eliminada correctamente', 'success');
    await cargarReservasDelDia();
  } catch (err) {
    const { message } = handleApiError(err);
    mostrarNotificacion(message, 'error');
    console.error('Error al eliminar reserva:', err);
  }
}

function onReservaActualizada() {
  dialogEditar.value = false;
  reservaSeleccionada.value = null;
  mostrarNotificacion('Reserva actualizada correctamente', 'success');
  cargarReservasDelDia();
}

function aplicarFiltro() {
  // Los filtros se aplican automáticamente a través del computed
}

function formatEstado(estado: EstadoReserva): string {
  const estados = {
    [EstadoReserva.PENDIENTE]: 'Pendiente',
    [EstadoReserva.CONFIRMADA]: 'Confirmada',
    [EstadoReserva.EN_CURSO]: 'En Curso',
    [EstadoReserva.COMPLETADA]: 'Completada',
    [EstadoReserva.CANCELADA]: 'Cancelada',
    [EstadoReserva.NO_PRESENTADO]: 'No Presentado',
  };
  return estados[estado];
}

function getColorEstado(estado: EstadoReserva): string {
  const colores = {
    [EstadoReserva.PENDIENTE]: 'border-warning',
    [EstadoReserva.CONFIRMADA]: 'border-info',
    [EstadoReserva.EN_CURSO]: 'border-primary',
    [EstadoReserva.COMPLETADA]: 'border-success',
    [EstadoReserva.CANCELADA]: 'border-error',
    [EstadoReserva.NO_PRESENTADO]: 'border-error',
  };
  return colores[estado];
}

function getChipColor(estado: EstadoReserva): string {
  const colores = {
    [EstadoReserva.PENDIENTE]: 'warning',
    [EstadoReserva.CONFIRMADA]: 'info',
    [EstadoReserva.EN_CURSO]: 'primary',
    [EstadoReserva.COMPLETADA]: 'success',
    [EstadoReserva.CANCELADA]: 'error',
    [EstadoReserva.NO_PRESENTADO]: 'error',
  };
  return colores[estado];
}

function getIconEstado(estado: EstadoReserva): string {
  const iconos = {
    [EstadoReserva.PENDIENTE]: 'mdi-clock-alert',
    [EstadoReserva.CONFIRMADA]: 'mdi-check-circle',
    [EstadoReserva.EN_CURSO]: 'mdi-progress-clock',
    [EstadoReserva.COMPLETADA]: 'mdi-check-all',
    [EstadoReserva.CANCELADA]: 'mdi-cancel',
    [EstadoReserva.NO_PRESENTADO]: 'mdi-account-off',
  };
  return iconos[estado];
}

function getIconColor(estado: EstadoReserva): string {
  return getChipColor(estado);
}

function formatFechaHora(fechaHora: string): string {
  const fecha = new Date(fechaHora);
  return fecha.toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function mostrarNotificacion(message: string, color: 'success' | 'error' | 'info' = 'success') {
  snackbar.value = {
    show: true,
    message,
    color
  };
}
</script>

<style scoped>
.reserva-card {
  border-left: 4px solid;
  transition: transform 0.2s;
}

.reserva-card:hover {
  transform: translateY(-2px);
}

.border-warning {
  border-left-color: rgb(var(--v-theme-warning));
}

.border-info {
  border-left-color: rgb(var(--v-theme-info));
}

.border-primary {
  border-left-color: rgb(var(--v-theme-primary));
}

.border-success {
  border-left-color: rgb(var(--v-theme-success));
}

.border-error {
  border-left-color: rgb(var(--v-theme-error));
}
</style>
