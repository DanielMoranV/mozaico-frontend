<template>
  <v-card-title class="d-flex align-center justify-space-between">
    <span>Gestión de Productos</span>
    <div>
      <v-btn icon @click="emit('toggle-filters')">
        <v-icon>{{ showFilters ? 'mdi-filter-off' : 'mdi-filter' }}</v-icon>
      </v-btn>
      <v-btn color="primary" @click="emit('crear-producto')" class="ms-4">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Producto
      </v-btn>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  showFilters: boolean
}>();

const emit = defineEmits(['crear-producto', 'toggle-filters']);
</script>