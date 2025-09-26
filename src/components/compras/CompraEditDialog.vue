<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="1000px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Compra' : 'Nueva Compra' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model.number="form.idProveedor"
                  :items="proveedorStore.proveedores"
                  item-title="nombre"
                  item-value="idProveedor"
                  label="Proveedor *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.fechaCompra"
                  label="Fecha de Compra *"
                  type="date"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.estado"
                  :items="estadosCompraItems"
                  label="Estado *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido]"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-2">Detalles de la Compra</h3>
            <v-row v-for="(detalle, index) in form.detalles" :key="index" class="align-center">
              <v-col cols="12" md="4">
                <v-select
                  v-model.number="detalle.idProducto"
                  :items="productoStore.productos"
                  item-title="nombre"
                  item-value="idProducto"
                  label="Producto *"
                  variant="outlined"
                  dense
                  :rules="[reglasValidacion.requerido]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="detalle.cantidad"
                  label="Cantidad *"
                  type="number"
                  variant="outlined"
                  dense
                  :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model.number="detalle.precioUnitario"
                  label="Precio Unitario *"
                  type="number"
                  variant="outlined"
                  dense
                  :rules="[reglasValidacion.requerido, reglasValidacion.numeroPositivo]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn icon color="error" variant="text" @click="removeDetalle(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" variant="outlined" @click="addDetalle">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Detalle
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-compra')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import { EstadoCompra } from '@/types/enums';
import type { CompraRequestDTO } from '@/types/compra';
import { useProveedorStore } from '@/stores/proveedorStore';
import { useProductoStore } from '@/stores/productoStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: CompraRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-compra']);

const proveedorStore = useProveedorStore();
const productoStore = useProductoStore();

const formRef = ref<any>(null);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const estadosCompraItems = computed(() =>
  Object.values(EstadoCompra).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

const addDetalle = () => {
  form.value.detalles.push({
    idProducto: 0,
    cantidad: 1,
    precioUnitario: 0,
  });
};

const removeDetalle = (index: number) => {
  form.value.detalles.splice(index, 1);
};

onMounted(() => {
  proveedorStore.fetchProveedores();
  productoStore.fetchProductos();
});
</script>
