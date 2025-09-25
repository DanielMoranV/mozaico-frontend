<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.nombre" label="Nombre del Menú" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.disponible"
                :items="[{title: 'Ambos', value: null}, {title: 'Sí', value: true}, {title: 'No', value: false}]"
                label="Disponible"
                variant="outlined"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaInicioDesde" label="Fecha Inicio Desde" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaInicioHasta" label="Fecha Inicio Hasta" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaFinDesde" label="Fecha Fin Desde" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaFinHasta" label="Fecha Fin Hasta" variant="outlined" dense clearable type="date"></v-text-field>
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
import type { MenuSearchParams } from '@/types/menu';

const props = defineProps<{
  show: boolean;
  modelValue: MenuSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
