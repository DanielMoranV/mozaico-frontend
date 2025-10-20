<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Pedido' : 'Nuevo Pedido' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idCliente"
                :items="clienteStore.clientesFormateados"
                item-title="nombreCompleto"
                item-value="idCliente"
                label="Cliente"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idMesa"
                :items="mesaStore.mesas"
                item-title="numeroMesa"
                item-value="idMesa"
                label="Mesa"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model.number="form.idEmpleado"
                :items="usuarioStore.usuarios"
                item-title="nombre"
                item-value="idUsuario"
                label="Empleado"
                variant="outlined"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.tipoServicio"
                :items="tiposServicioItems"
                label="Tipo de Servicio *"
                variant="outlined"
                :rules="[reglasValidacion.requerido]"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.observaciones"
                label="Observaciones"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" v-if="form.tipoServicio === 'DELIVERY'">
              <v-text-field
                v-model="form.direccionDelivery"
                label="Dirección de Delivery *"
                variant="outlined"
                :rules="form.tipoServicio === 'DELIVERY' ? [reglasValidacion.requerido] : []"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Sección de Detalles del Pedido -->
          <v-row>
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Productos del Pedido</v-card-title>
                <v-card-text>
                  <!-- Lista de productos agregados -->
                  <v-table v-if="form.detalles.length > 0" density="compact">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detalle, index) in form.detalles" :key="index">
                        <td>{{ getProductoNombre(detalle.idProducto) }}</td>
                        <td>{{ detalle.cantidad }}</td>
                        <td>{{ detalle.observaciones || '-' }}</td>
                        <td>
                          <v-btn icon="mdi-pencil" size="small" variant="text" @click="editarDetalle(index)"></v-btn>
                          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="eliminarDetalle(index)"></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-alert v-else type="info" density="compact">
                    No hay productos agregados al pedido
                  </v-alert>

                  <!-- Formulario para agregar producto -->
                  <v-row class="mt-4">
                    <v-col cols="12" md="4">
                      <v-select
                        v-model.number="nuevoDetalle.idProducto"
                        :items="productoStore.productos"
                        item-title="nombre"
                        item-value="idProducto"
                        label="Producto *"
                        variant="outlined"
                        density="compact"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="nuevoDetalle.cantidad"
                        label="Cantidad *"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="nuevoDetalle.observaciones"
                        label="Observaciones"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-btn
                        color="primary"
                        variant="tonal"
                        @click="agregarDetalle"
                        :disabled="!nuevoDetalle.idProducto || !nuevoDetalle.cantidad"
                        block
                      >
                        {{ editandoDetalle !== null ? 'Actualizar' : 'Agregar' }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-pedido')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, onMounted, ref } from 'vue';
import { TipoServicio } from '@/types/enums';
import type { PedidoRequestDTO } from '@/types/pedido';
import type { DetallePedidoRequestDTO } from '@/types/detallePedido';
import { useClienteStore } from '@/stores/clienteStore';
import { useMesaStore } from '@/stores/mesaStore';
import { useUsuarioStore } from '@/stores/usuarioStore';
import { useProductoStore } from '@/stores/productoStore';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: PedidoRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-pedido']);

const clienteStore = useClienteStore();
const mesaStore = useMesaStore();
const usuarioStore = useUsuarioStore();
const productoStore = useProductoStore();

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

// Estado para manejo de detalles
const nuevoDetalle = ref<DetallePedidoRequestDTO>({
  idProducto: 0,
  cantidad: 1,
  observaciones: '',
});
const editandoDetalle = ref<number | null>(null);

// Removed estadosPedidoItems since estado field was removed from form

const tiposServicioItems = computed(() =>
  Object.values(TipoServicio).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);

// Métodos para manejo de detalles
const getProductoNombre = (idProducto: number) => {
  const producto = productoStore.productos.find(p => p.idProducto === idProducto);
  return producto?.nombre || 'Producto desconocido';
};

const agregarDetalle = () => {
  if (!nuevoDetalle.value.idProducto || !nuevoDetalle.value.cantidad) return;

  if (editandoDetalle.value !== null) {
    // Actualizar detalle existente
    form.value.detalles[editandoDetalle.value] = { ...nuevoDetalle.value };
    editandoDetalle.value = null;
  } else {
    // Agregar nuevo detalle
    form.value.detalles.push({ ...nuevoDetalle.value });
  }

  // Limpiar formulario
  nuevoDetalle.value = {
    idProducto: 0,
    cantidad: 1,
    observaciones: '',
  };
};

const editarDetalle = (index: number) => {
  const detalle = form.value.detalles[index];
  if (detalle) {
    nuevoDetalle.value = {
      idProducto: detalle.idProducto,
      cantidad: detalle.cantidad,
      observaciones: detalle.observaciones || '',
    };
    editandoDetalle.value = index;
  }
};

const eliminarDetalle = (index: number) => {
  form.value.detalles.splice(index, 1);
  if (editandoDetalle.value === index) {
    editandoDetalle.value = null;
    nuevoDetalle.value = {
      idProducto: 0,
      cantidad: 1,
      observaciones: '',
    };
  }
};

onMounted(() => {
  clienteStore.fetchClientes();
  mesaStore.fetchMesas();
  usuarioStore.fetchUsuarios();
  productoStore.fetchProductos();
});
</script>
