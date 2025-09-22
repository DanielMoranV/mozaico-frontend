<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-icon size="32" class="me-3" color="primary"
            >mdi-account-group</v-icon
          >
          <div>
            <h1 class="text-h4 font-weight-bold">Gestión de Usuarios</h1>
            <p class="text-body-2 text-medium-emphasis">
              Administrar usuarios del sistema
            </p>
          </div>
        </div>
        <v-btn color="primary" @click="$emit('crear-usuario')">
          <v-icon class="me-2">mdi-plus</v-icon>
          Nuevo Usuario
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const emit = defineEmits(['crear-usuario']);
</script>

<style scoped>
/* Add any specific styles for the header here if needed */
</style>
