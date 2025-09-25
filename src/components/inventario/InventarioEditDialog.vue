<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Entrada de Inventario' : 'Nueva Entrada de Inventario' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model.number="form.idProducto"
                :items="productoStore.productos"
                item-title="nombre"
                item-value="idProducto"
                label="Producto *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
                :disabled="editando" <!-- Product cannot be changed when editing -->
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.stockActual"
                label="Stock Actual *"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.requerido, reglasValidacion.numeroNoNegativo]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.stockMinimo"
                label="Stock Mínimo"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.numeroNoNegativoOpcional]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.stockMaximo"
                label="Stock Máximo"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.numeroNoNegativoOpcional]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.costoUnitario"
                label="Costo Unitario"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.numeroNoNegativoOpcional]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-inventario')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import type { InventarioRequestDTO } from '@/types/inventario';
import { useProductoStore } from '@/stores/productoStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: InventarioRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-inventario']);

const productoStore = useProductoStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

onMounted(() => {
  productoStore.fetchProductos();
});
</script>
