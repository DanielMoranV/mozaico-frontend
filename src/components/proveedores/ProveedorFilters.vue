<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.nombre" label="Nombre" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.contacto" label="Contacto" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.telefono" label="Teléfono" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.email" label="Email" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.direccion" label="Dirección" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.activo"
                :items="[{title: 'Ambos', value: null}, {title: 'Activo', value: true}, {title: 'Inactivo', value: false}]"
                label="Estado"
                variant="outlined"
                dense
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
import type { ProveedorSearchParams } from '@/types/proveedor';

const props = defineProps<{
  show: boolean;
  modelValue: ProveedorSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
