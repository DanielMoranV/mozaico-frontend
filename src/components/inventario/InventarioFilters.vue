<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="criteria.idProducto"
                :items="productoStore.productos"
                item-title="nombre"
                item-value="idProducto"
                label="Producto"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockActualMin" label="Stock Actual Min" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockActualMax" label="Stock Actual Max" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockMinimoMin" label="Stock Mínimo Min" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockMinimoMax" label="Stock Mínimo Max" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockMaximoMin" label="Stock Máximo Min" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="criteria.stockMaximoMax" label="Stock Máximo Max" variant="outlined" dense clearable type="number"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn-toggle v-model="criteria.logic" mandatory dense variant="outlined">
                <v-btn value="AND">AND</v-btn>
                <v-btn value="OR">OR</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="emit('limpiar')">Limpiar</v-btn>
          <v-btn color="primary" @click="emit('buscar')">Buscar</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import type { InventarioSearchParams } from '@/types/inventario';
import { useProductoStore } from '@/stores/productoStore';

const props = defineProps<{
  show: boolean;
  modelValue: InventarioSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const productoStore = useProductoStore();

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

onMounted(() => {
  productoStore.fetchProductos();
});
</script>
