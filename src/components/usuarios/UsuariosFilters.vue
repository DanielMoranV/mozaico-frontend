<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="criteria.nombre" label="Nombre" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="criteria.username" label="Username" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="criteria.email" label="Email" variant="outlined" dense clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="criteria.tipoUsuario"
                :items="tiposUsuarioItems"
                label="Tipo de Usuario"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="criteria.estado"
                :items="estadosUsuarioItems"
                label="Estado"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="criteria.tipoDocumentoIdentidad"
                :items="tiposDocumentoIdentidadItems"
                label="Tipo Documento"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="criteria.numeroDocumento" label="Número Documento" variant="outlined" dense clearable></v-text-field>
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
import { TipoUsuario, EstadoUsuario, TipoDocumentoIdentidad } from '@/types';
import type { UsuarioSearchParams } from '@/types';

const props = defineProps<{
  show: boolean;
  modelValue: UsuarioSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const tiposUsuarioItems = computed(() =>
  Object.values(TipoUsuario).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);

const estadosUsuarioItems = computed(() =>
  Object.values(EstadoUsuario).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

const tiposDocumentoIdentidadItems = computed(() =>
  Object.values(TipoDocumentoIdentidad).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);
</script>
