<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Ajustar Stock para {{ inventarioActual?.producto.nombre }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.number="form.cantidad"
                label="Cantidad a ajustar *"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.tipoAjuste"
                :items="tiposAjusteStockItems"
                label="Tipo de Ajuste *"
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
        <v-btn color="primary" variant="flat" @click="$emit('ajustar-stock-confirmado')" :loading="loading">Ajustar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { TipoAjusteStock } from '@/types/enums';
import type { AjustarStockRequestDTO, InventarioResponseDTO } from '@/types/inventario';

const props = defineProps<{
  mostrar: boolean;
  inventarioActual: InventarioResponseDTO | null;
  formularioAjuste: AjustarStockRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formularioAjuste', 'ajustar-stock-confirmado']);

const form = computed({
  get: () => props.formularioAjuste,
  set: (value) => emit('update:formularioAjuste', value),
});

const tiposAjusteStockItems = computed(() =>
  Object.values(TipoAjusteStock).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);
</script>
