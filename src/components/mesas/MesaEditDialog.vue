<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Mesa' : 'Nueva Mesa' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.numeroMesa"
                label="Número de Mesa *"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.capacidad"
                label="Capacidad *"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.ubicacion"
                label="Ubicación"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.observaciones"
                label="Observaciones"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col v-if="editando" cols="12">
              <v-select
                v-model="form.estado"
                :items="estadosMesaItems"
                label="Estado"
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
        <v-btn color="primary" variant="flat" @click="$emit('guardar-mesa')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { EstadoMesa } from '@/types/enums';
import type { MesaRequestDTO } from '@/types/mesa';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: MesaRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-mesa']);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const estadosMesaItems = computed(() =>
  Object.values(EstadoMesa).map((estado) => ({
    title: estado,
    value: estado,
  }))
);
</script>
