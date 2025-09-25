<template>
  <v-expand-transition>
    <div v-show="show">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>Filtros Avanzados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="criteria.idProveedor"
                :items="proveedorStore.proveedores"
                item-title="nombre"
                item-value="idProveedor"
                label="Proveedor"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="criteria.estado"
                :items="estadosCompraItems"
                label="Estado"
                variant="outlined"
                dense
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaDesde" label="Fecha Desde" variant="outlined" dense clearable type="date"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="criteria.fechaHasta" label="Fecha Hasta" variant="outlined" dense clearable type="date"></v-text-field>
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
import { EstadoCompra } from '@/types/enums';
import type { CompraSearchParams } from '@/types/compra';
import { useProveedorStore } from '@/stores/proveedorStore'; // Assuming a ProveedorStore exists

const props = defineProps<{
  show: boolean;
  modelValue: CompraSearchParams;
}>();

const emit = defineEmits(['update:modelValue', 'buscar', 'limpiar']);

const proveedorStore = useProveedorStore();

const criteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const estadosCompraItems = computed(() =>
  Object.values(EstadoCompra).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

onMounted(() => {
  proveedorStore.fetchProveedores();
});
</script>
