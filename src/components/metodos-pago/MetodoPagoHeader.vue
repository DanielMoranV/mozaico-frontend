<template>
  <v-card-title class="d-flex align-center justify-space-between">
    <span>Gestión de Métodos de Pago</span>
    <div>
      <v-btn color="primary" @click="emit('crear-metodo-pago')" class="ms-4">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Método de Pago
      </v-btn>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['crear-metodo-pago']);
</script>
