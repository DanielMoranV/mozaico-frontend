<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Reserva' : 'Nueva Reserva' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idCliente"
                :items="clienteStore.clientesFormateados"
                item-title="nombreCompleto"
                item-value="idCliente"
                label="Cliente *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idMesa"
                :items="mesaStore.mesas"
                item-title="numeroMesa"
                item-value="idMesa"
                label="Mesa *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.fechaHoraReserva"
                label="Fecha y Hora de Reserva *"
                type="datetime-local"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.numeroPersonas"
                label="Número de Personas *"
                type="number"
                variant="outlined"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.observaciones"
                label="Observaciones"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" v-if="editando">
              <v-select
                v-model="form.estado"
                :items="estadosReservaItems"
                label="Estado *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-reserva')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import { EstadoReserva } from '@/types/enums';
import type { ReservaRequestDTO } from '@/types/reserva';
import { useClienteStore } from '@/stores/clienteStore';
import { useMesaStore } from '@/stores/mesaStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: ReservaRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-reserva']);

const clienteStore = useClienteStore();
const mesaStore = useMesaStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const estadosReservaItems = computed(() =>
  Object.values(EstadoReserva).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

onMounted(() => {
  clienteStore.fetchClientes();
  mesaStore.fetchMesas();
});
</script>
