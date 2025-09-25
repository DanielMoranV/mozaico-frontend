<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.numeroMesa" label="Número de Mesa" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model.number="criteria.capacidad" label="Capacidad" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.ubicacion" label="Ubicación" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.estado"
                :items="estadosMesaItems"
                label="Estado"
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
import { EstadoMesa } from '@/types/enums';
import type { MesaSearchParams } from '@/types/mesa';

const props = defineProps<{
  show: boolean;
  modelValue: MesaSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const estadosMesaItems = computed(() =>
  Object.values(EstadoMesa).map((estado) => ({
    title: estado,
    value: estado,
  }))
);
</script>
