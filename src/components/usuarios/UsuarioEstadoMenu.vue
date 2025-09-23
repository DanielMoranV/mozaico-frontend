<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon size="small" variant="text" v-bind="props">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-if="usuario.estado !== 'ACTIVO'"
        @click="$emit('activar', usuario.idUsuario)"
      >
        <v-list-item-title>Activar</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="usuario.estado === 'ACTIVO'"
        @click="$emit('desactivar', usuario.idUsuario)"
      >
        <v-list-item-title>Desactivar</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { UsuarioResponseDTO } from '@/types';

defineProps<{ usuario: UsuarioResponseDTO }>();

defineEmits(['activar', 'desactivar']);
</script>
