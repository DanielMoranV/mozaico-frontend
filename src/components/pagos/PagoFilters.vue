<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.idPedido" label="ID Pedido" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="criteria.idMetodo"
                :items="metodoPagoStore.metodosPago"
                item-title="nombre"
                item-value="idMetodo"
                label="Método de Pago"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.estado"
                :items="estadosPagoItems"
                label="Estado"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaPagoDesde" label="Fecha Pago Desde" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaPagoHasta" label="Fecha Pago Hasta" variant="outlined" dense clearable type="date"></v-text-field>
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
import { EstadoPago } from '@/types/enums';
import type { PagoSearchParams } from '@/types/pago';
import { useMetodoPagoStore } from '@/stores/metodoPagoStore';

const props = defineProps<{
  show: boolean;
  modelValue: PagoSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const metodoPagoStore = useMetodoPagoStore();

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const estadosPagoItems = computed(() =>
  Object.values(EstadoPago).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

onMounted(() => {
  metodoPagoStore.fetchMetodosPago();
});
</script>
