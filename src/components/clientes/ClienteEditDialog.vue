<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nombre"
                label="Nombre *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.apellido"
                label="Apellido *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="Email"
                variant="outlined"
                :rules="[reglasValidacion.email]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.telefono"
                label="Teléfono"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.fechaNacimiento"
                label="Fecha de Nacimiento"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.direccion"
                label="Dirección"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.preferenciasAlimentarias"
                label="Preferencias Alimentarias"
                variant="outlined"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-cliente')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { ClienteRequestDTO } from '@/types/cliente';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: ClienteRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-cliente']);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});
</script>
