<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Pago' : 'Nuevo Pago' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idPedido"
                :items="pedidoStore.pedidos"
                item-title="idPedido"
                item-value="idPedido"
                label="Pedido *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idMetodo"
                :items="metodoPagoStore.metodosPago"
                item-title="nombre"
                item-value="idMetodo"
                label="Método de Pago *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.monto"
                label="Monto *"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.referencia"
                label="Referencia"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.estado"
                :items="estadosPagoItems"
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
        <v-btn color="primary" variant="flat" @click="$emit('guardar-pago')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import { EstadoPago } from '@/types/enums';
import type { PagoRequestDTO } from '@/types/pago';
import { usePedidoStore } from '@/stores/pedidoStore';
import { useMetodoPagoStore } from '@/stores/metodoPagoStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: PagoRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-pago']);

const pedidoStore = usePedidoStore();
const metodoPagoStore = useMetodoPagoStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const estadosPagoItems = computed(() =>
  Object.values(EstadoPago).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

onMounted(() => {
  pedidoStore.fetchPedidos();
  metodoPagoStore.fetchMetodosPago();
});
</script>
