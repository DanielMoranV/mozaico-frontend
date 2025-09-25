<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.idCliente" label="ID Cliente" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.idMesa" label="ID Mesa" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.idEmpleado" label="ID Empleado" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaPedidoDesde" label="Fecha Pedido Desde" variant="outlined" dense clearable type="datetime-local"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaPedidoHasta" label="Fecha Pedido Hasta" variant="outlined" dense clearable type="datetime-local"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.estado"
                :items="estadosPedidoItems"
                label="Estado"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.tipoServicio"
                :items="tiposServicioItems"
                label="Tipo de Servicio"
                variant="outlined"
                dense
                clearable
              ></v-select>
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
import { defineProps, defineEmits, computed } from 'vue';
import { EstadoPedido, TipoServicio } from '@/types/enums';
import type { PedidoSearchParams } from '@/types/pedido';

const props = defineProps<{
  show: boolean;
  modelValue: PedidoSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const estadosPedidoItems = computed(() =>
  Object.values(EstadoPedido).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

const tiposServicioItems = computed(() =>
  Object.values(TipoServicio).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);
</script>
