<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Producto' : 'Nuevo Producto' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
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
            <v-col cols="12" md="6">
              <v-select
                v-model="form.idCategoria"
                :items="categoriaStore.categorias"
                item-title="nombre"
                item-value="idCategoria"
                label="Categoría *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.tiempoPreparacion"
                label="Tiempo de Preparación (min)"
                variant="outlined"
                type="number"
                :rules="[reglasValidacion.numeroPositivoOpcional]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.disponible" label="Disponible" color="primary" inset></v-switch>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.requierePreparacion" label="Requiere Preparación" color="primary" inset></v-switch>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch v-model="form.esAlcoholico" label="Es Alcohólico" color="primary" inset></v-switch>
            </v-col>
            
            <v-col v-if="editando && form.imagenUrl" cols="12">
              <p class="text-subtitle-1">Imagen Actual</p>
              <v-img :src="form.imagenUrl" max-height="200" contain class="mb-4"></v-img>
            </v-col>
            <v-col v-if="editando" cols="12">
              <v-file-input
                label="Subir nueva imagen"
                variant="outlined"
                accept="image/*"
                @change="$emit('subir-imagen', $event)"
                :loading="loading"
              ></v-file-input>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.imagenUrl" label="URL de Imagen" variant="outlined" readonly></v-text-field>
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-producto')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { ProductoRequestDTO } from '@/types/producto';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: ProductoRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-producto', 'subir-imagen']);

const categoriaStore = useCategoriaStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});
</script>
