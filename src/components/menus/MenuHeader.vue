<template>
  <v-card-title class="d-flex align-center justify-space-between">
    <span>Gestión de Menús</span>
    <div>
      <v-btn icon @click="emit('toggle-filters')">
        <v-icon>{{ showFilters ? 'mdi-filter-off' : 'mdi-filter' }}</v-icon>
      </v-btn>
      <v-btn color="primary" @click="emit('crear-menu')" class="ms-4">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Menú
      </v-btn>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  showFilters: boolean
}>();

const emit = defineEmits(['crear-menu', 'toggle-filters']);
</script>
