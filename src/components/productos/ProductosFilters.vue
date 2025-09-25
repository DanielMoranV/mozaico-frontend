<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.nombre" label="Nombre del producto" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.idCategoria"
                :items="categoriaStore.categorias"
                item-title="nombre"
                item-value="idCategoria"
                label="Categoría"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="criteria.disponible"
                :items="[{title: 'Ambos', value: null}, {title: 'Sí', value: true}, {title: 'No', value: false}]"
                label="Disponible"
                variant="outlined"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="criteria.estado"
                :items="[{title: 'Ambos', value: null}, {title: 'Activo', value: 'ACTIVO'}, {title: 'Inactivo', value: 'INACTIVO'}]"
                label="Estado"
                variant="outlined"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
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
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { ProductoSearchCriteria } from '@/types/producto';

const props = defineProps<{
  show: boolean;
  modelValue: ProductoSearchCriteria;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const categoriaStore = useCategoriaStore();

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>