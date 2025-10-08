<template>
  <div class="filtros-categorias">
    <v-chip-group
      :model-value="categoriaSeleccionada"
      @update:model-value="emit('update:categoriaSeleccionada', $event)"
      selected-class="categoria-activa"
      mandatory
      class="categorias-chips"
    >
      <v-chip
        value="todas"
        filter
        variant="outlined"
        size="large"
        class="categoria-chip"
      >
        <v-icon start>mdi-view-grid</v-icon>
        Todas ({{ totalProductos }})
      </v-chip>

      <v-chip
        v-for="categoria in categorias"
        :key="categoria.idCategoria"
        :value="categoria.idCategoria"
        filter
        variant="outlined"
        size="large"
        class="categoria-chip"
      >
        <v-icon start>mdi-food</v-icon>
        {{ categoria.nombre }} ({{ categoria.count }})
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import type { CategoriaResponseDTO } from '@/types/cartaPublica';

interface CategoriaConConteo extends CategoriaResponseDTO {
  count: number;
}

interface Props {
  categorias: CategoriaConConteo[];
  categoriaSeleccionada: number | 'todas';
  totalProductos: number;
}

interface Emits {
  (e: 'update:categoriaSeleccionada', value: number | 'todas'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<style scoped>
.filtros-categorias {
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  margin-bottom: 24px;
}

.categorias-chips {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

.categoria-chip {
  font-weight: 500;
  white-space: nowrap;
}

:deep(.categoria-activa) {
  background-color: rgb(25, 118, 210) !important;
  color: white !important;
  border-color: rgb(25, 118, 210) !important;
}

:deep(.categoria-activa .v-icon) {
  color: white !important;
}

/* Scrollbar personalizado */
.filtros-categorias::-webkit-scrollbar {
  height: 8px;
}

.filtros-categorias::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.filtros-categorias::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.filtros-categorias::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
