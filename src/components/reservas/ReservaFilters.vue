<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="criteria.idCliente"
                :items="clienteStore.clientes"
                item-title="nombreCompleto"
                item-value="idCliente"
                label="Cliente"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="criteria.idMesa"
                :items="mesaStore.mesas"
                item-title="numeroMesa"
                item-value="idMesa"
                label="Mesa"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.estado"
                :items="estadosReservaItems"
                label="Estado"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaReservaDesde" label="Fecha Reserva Desde" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaReservaHasta" label="Fecha Reserva Hasta" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn-toggle v-model="criteria.logic" mandatory dense variant="outlined">
                <v-btn value="AND">AND</v-btn>
                <v-btn value="OR">OR</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="emit('limpiar')">Limpiar</v-btn>
          <v-btn color="primary" @click="emit('buscar')">Buscar</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import { EstadoReserva } from '@/types/enums';
import type { ReservaSearchParams } from '@/types/reserva';
import { useClienteStore } from '@/stores/clienteStore';
import { useMesaStore } from '@/stores/mesaStore';

const props = defineProps<{
  show: boolean;
  modelValue: ReservaSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const clienteStore = useClienteStore();
const mesaStore = useMesaStore();

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
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
