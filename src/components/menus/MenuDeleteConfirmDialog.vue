<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
      <v-card-text>
        ¿Está seguro de que desea eliminar el menú "{{ menuAEliminar?.nombre }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="error" variant="flat" @click="$emit('eliminar-confirmado')" :loading="loading">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { MenuResponseDTO } from '@/types/menu';

defineProps<{
  mostrar: boolean;
  menuAEliminar: MenuResponseDTO | null;
  loading: boolean;
}>();

defineEmits(['update:mostrar', 'eliminar-confirmado']);
</script>
