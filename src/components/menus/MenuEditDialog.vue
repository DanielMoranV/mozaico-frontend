<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Menú' : 'Nuevo Menú' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombre"
                  label="Nombre *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.precio"
                  label="Precio *"
                  variant="outlined"
                  type="number"
                  :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.descripcion"
                  label="Descripción"
                  variant="outlined"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="4">
                <v-switch v-model="form.disponible" label="Disponible" color="primary" inset></v-switch>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.fechaInicio"
                  label="Fecha Inicio"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.fechaFin"
                  label="Fecha Fin"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="form.productosIds"
                  :items="productoStore.productos"
                  item-title="nombre"
                  item-value="idProducto"
                  label="Productos Asociados"
                  multiple
                  chips
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-menu')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import type { MenuRequestDTO } from '@/types/menu';
import { useProductoStore } from '@/stores/productoStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: MenuRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-menu']);

const productoStore = useProductoStore();

const formRef = ref<any>(null);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

onMounted(() => {
  productoStore.fetchProductos();
});
</script>
