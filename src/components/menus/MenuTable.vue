<template>
  <v-data-table
    :headers="headers"
    :items="menus"
    :loading="loading"
    loading-text="Cargando menús..."
    no-data-text="No se encontraron menús"
    items-per-page="10"
    class="elevation-0"
    show-expand
    v-model:expanded="expandedItems"
    item-value="idMenu"
  >
    <template v-slot:item.disponible="{ item }">
      <v-icon :color="item.disponible ? 'success' : 'error'">
        {{ item.disponible ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
    </template>
    <template v-slot:item.precio="{ item }">
      {{ formatCurrency(item.precio) }}
    </template>
    <template v-slot:item.fechaInicio="{ item }">
      {{ formatDate(item.fechaInicio) }}
    </template>
    <template v-slot:item.fechaFin="{ item }">
      {{ formatDate(item.fechaFin) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-menu', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <MenuProductos :menu-id="item.idMenu" :productos="item.productos" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MenuResponseDTO } from '@/types/menu';
import MenuProductos from './MenuProductos.vue';

defineProps<{
  menus: MenuResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-menu',
  'confirmar-eliminar',
]);

const expandedItems = ref<string[]>([]);

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};
</script>
