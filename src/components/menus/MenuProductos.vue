<template>
  <v-card flat class="my-2">
    <v-card-title class="text-subtitle-1">Productos del Menú</v-card-title>
    <v-card-text v-if="productos.length === 0">
      Este menú no tiene productos asociados.
    </v-card-text>
    <v-card-text v-else>
      <v-chip-group>
        <v-chip v-for="producto in productos" :key="producto.idProducto" color="primary" variant="tonal">
          {{ producto.nombre }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  menuId: number;
  productos: Array<{
    idProducto: number;
    nombre: string;
  }>;
}>();
</script>
