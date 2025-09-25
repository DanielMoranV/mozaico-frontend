<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Método de Pago' : 'Nuevo Método de Pago' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.nombre"
                label="Nombre *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-switch v-model="form.activo" label="Activo" color="primary" inset></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-metodo-pago')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { MetodoPagoRequestDTO } from '@/types/metodoPago';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: MetodoPagoRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-metodo-pago']);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});
</script>
