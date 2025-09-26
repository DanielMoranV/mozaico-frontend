<template>
  <v-bottom-sheet
    v-model="isVisible"
    :fullscreen="$vuetify.display.mobile"
    max-width="800px"
    content-class="order-panel-sheet"
    persistent
  >
    <v-card v-if="selectedMesa">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Pedido para Mesa #{{ selectedMesa.numeroMesa }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closePanel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <!-- Columna para el resumen del pedido -->
          <v-col cols="12" md="6">
            <h2 class="text-h6 mb-3">Detalle del Pedido</h2>
            <v-list dense>
              <v-list-item v-if="currentPedido && currentPedido.detalles && currentPedido.detalles.length > 0">
                <v-row align="center" no-gutters>
                  <v-col cols="6"><span class="font-weight-bold">Producto</span></v-col>
                  <v-col cols="3" class="text-center"><span class="font-weight-bold">Cant.</span></v-col>
                  <v-col cols="3" class="text-right"><span class="font-weight-bold">Subtotal</span></v-col>
                </v-row>
              </v-list-item>

              <v-list-item
                v-for="detalle in currentPedido?.detalles"
                :key="detalle.idDetallePedido"
              >
                <v-row align="center" no-gutters>
                  <v-col cols="6">
                    <v-list-item-title>{{ detalle.producto.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ detalle.observaciones }}
                    </v-list-item-subtitle>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center justify-center">
                    <v-btn icon size="x-small" variant="text" @click="updateDetalleCantidad(detalle, -1)">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-1">{{ detalle.cantidad }}</span>
                    <v-btn icon size="x-small" variant="text" @click="updateDetalleCantidad(detalle, 1)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="3" class="text-right d-flex align-center justify-end">
                    <span class="mr-2">${{ (detalle.cantidad * detalle.precioUnitario).toFixed(2) }}</span>
                    <v-btn icon size="x-small" color="error" variant="text" @click="removeDetalle(detalle.idDetallePedido)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item v-if="!currentPedido || !currentPedido.detalles || currentPedido.detalles.length === 0">
                <v-list-item-title>No hay productos en este pedido.</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider class="my-3"></v-divider>

            <div class="text-right text-h6">
              <p>Subtotal: ${{ currentPedido?.subtotal?.toFixed(2) || '0.00' }}</p>
              <p>Impuestos: ${{ currentPedido?.impuestos?.toFixed(2) || '0.00' }}</p>
              <p>Descuento: ${{ currentPedido?.descuento?.toFixed(2) || '0.00' }}</p>
              <p class="font-weight-bold">Total: ${{ currentPedido?.total?.toFixed(2) || '0.00' }}</p>
            </div>
          </v-col>

          <!-- Columna para la selección de productos -->
          <v-col cols="12" md="6">
            <h2 class="text-h6 mb-3">Añadir Productos</h2>
            <v-text-field
              v-model="searchProduct"
              label="Buscar producto"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-chip-group
              v-model="selectedCategory"
              column
              show-arrows
              class="mb-3"
            >
              <v-chip
                filter
                variant="outlined"
                value="all"
              >
                Todas
              </v-chip>
              <v-chip
                v-for="category in categoriaStore.categorias"
                :key="category.idCategoria"
                filter
                variant="outlined"
                :value="category.idCategoria"
              >
                {{ category.nombre }}
              </v-chip>
            </v-chip-group>

            <v-list dense class="product-list">
              <v-list-item
                v-for="producto in filteredProducts"
                :key="producto.idProducto"
              >
                <v-row align="center" no-gutters>
                  <v-col cols="8">
                    <v-list-item-title>{{ producto.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>${{ producto.precio.toFixed(2) }}</v-list-item-subtitle>
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-btn icon size="small" color="primary" @click="addProductToOrder(producto)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item v-if="filteredProducts.length === 0">
                <v-list-item-title>No se encontraron productos.</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-end pa-4">
        <v-btn color="error" variant="outlined" @click="cancelOrder">Cancelar Pedido</v-btn>
        <v-btn color="warning" variant="flat" @click="saveOrder">Guardar Pedido</v-btn>
        <v-btn color="success" variant="flat" @click="finalizeOrder">Cerrar Pedido</v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useMesaStore } from '@/stores/mesaStore';
import { usePedidoStore } from '@/stores/pedidoStore';
import { useProductoStore } from '@/stores/productoStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { Mesa } from '@/types/mesa';
import type { Pedido, PedidoRequestDTO } from '@/types/pedido';
import type { Producto } from '@/types/producto';
import type { DetallePedido, DetallePedidoRequestDTO } from '@/types/detallePedido';
import { EstadoPedido, TipoServicio, EstadoMesa } from '@/types/enums';

interface Props {
  mesaId: number | null;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close-panel', 'order-updated']);

const mesaStore = useMesaStore();
const pedidoStore = usePedidoStore();
const productoStore = useProductoStore();
const categoriaStore = useCategoriaStore();

const isVisible = ref(props.visible);
const currentPedido = ref<Pedido | null>(null);
const searchProduct = ref('');
const selectedCategory = ref<number | 'all'>('all');

const selectedMesa = computed<Mesa | undefined>(() => {
  return mesaStore.mesas.find(m => m.idMesa === props.mesaId);
});

const filteredProducts = computed(() => {
  let products = productoStore.productos;

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    products = products.filter(p => p.categoria.idCategoria === selectedCategory.value);
  }

  if (searchProduct.value) {
    const searchTerm = searchProduct.value.toLowerCase();
    products = products.filter(p => p.nombre.toLowerCase().includes(searchTerm));
  }

  return products;
});

// Watch para sincronizar la visibilidad del v-bottom-sheet
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
  if (newVal && props.mesaId) {
    loadPedidoForMesa(props.mesaId);
  } else {
    currentPedido.value = null; // Limpiar el pedido al cerrar
  }
});

onMounted(() => {
  productoStore.fetchProductos();
  categoriaStore.fetchCategorias();
});

const loadPedidoForMesa = async (mesaId: number) => {
  if (!selectedMesa.value) return;

  const result = await pedidoStore.fetchPedidoActivoPorMesa(mesaId);

  if (result) {
    currentPedido.value = result;
  } else {
    // Si no hay pedido activo, inicializar uno nuevo para la UI
    currentPedido.value = {
      idPedido: 0, // Temporal, el backend asignará uno real
      mesa: selectedMesa.value,
      fechaPedido: new Date().toISOString(),
      estado: EstadoPedido.PENDIENTE,
      tipoServicio: TipoServicio.MESA,
      subtotal: 0,
      impuestos: 0,
      descuento: 0,
      total: 0,
      detalles: [],
    } as Pedido;
  }
  calculateTotals();
};

const addProductToOrder = async (product: Producto) => {
  if (!currentPedido.value || !selectedMesa.value) return;

  const detalleRequest: DetallePedidoRequestDTO = {
    idProducto: product.idProducto,
    cantidad: 1,
    observaciones: '',
  };

  if (currentPedido.value.idPedido === 0) {
    // Si es un pedido nuevo (idPedido === 0), lo creamos con el primer producto
    const pedidoRequest: PedidoRequestDTO = {
      idMesa: selectedMesa.value.idMesa,
      estado: EstadoPedido.PENDIENTE,
      tipoServicio: TipoServicio.MESA,
    };
    const result = await pedidoStore.crearOActualizarPedidoConDetalles(pedidoRequest, [detalleRequest]);
    if (result.success && result.data) {
      currentPedido.value = result.data;
    }
  } else {
    // Si el pedido ya existe, agregamos el producto
    const existingDetalle = currentPedido.value.detalles?.find(d => d.producto.idProducto === product.idProducto);
    if (existingDetalle) {
      await updateDetalleCantidad(existingDetalle, 1);
    } else {
      const result = await pedidoStore.agregarProductoAPedido(currentPedido.value.idPedido, detalleRequest);
      if (result.success && result.data) {
        currentPedido.value = result.data;
      }
    }
  }
  calculateTotals();
};

const updateDetalleCantidad = async (detalle: DetallePedido, change: number) => {
  if (!currentPedido.value || !currentPedido.value.detalles) return;

  const newCantidad = detalle.cantidad + change;

  if (newCantidad <= 0) {
    await removeDetalle(detalle.idDetallePedido);
  } else {
    const result = await pedidoStore.actualizarCantidadProductoEnPedido(
      currentPedido.value.idPedido,
      detalle.idDetallePedido,
      newCantidad
    );
    if (result.success && result.data) {
      const index = currentPedido.value.detalles.findIndex(d => d.idDetallePedido === detalle.idDetallePedido);
      if (index !== -1) {
        currentPedido.value.detalles[index] = result.data;
      }
    }
  }
  calculateTotals();
};

const removeDetalle = async (idDetallePedido: number) => {
  if (!currentPedido.value || !currentPedido.value.detalles) return;

  const result = await pedidoStore.eliminarProductoDePedido(currentPedido.value.idPedido, idDetallePedido);
  if (result.success) {
    currentPedido.value.detalles = currentPedido.value.detalles.filter(d => d.idDetallePedido !== idDetallePedido);
  }
  calculateTotals();
};

const calculateTotals = () => {
  if (!currentPedido.value) return;

  let subtotal = 0;
  currentPedido.value.detalles?.forEach(d => {
    subtotal += d.cantidad * d.precioUnitario;
  });

  // Estos valores deberían venir del backend después de cada operación
  // Por ahora, los calculamos en el frontend para la visualización inmediata
  currentPedido.value.subtotal = subtotal;
  currentPedido.value.impuestos = subtotal * 0.18; // Ejemplo: 18% de impuestos
  currentPedido.value.descuento = 0; // Por ahora, sin descuento
  currentPedido.value.total = subtotal + currentPedido.value.impuestos - currentPedido.value.descuento;
};

const saveOrder = async () => {
  if (!currentPedido.value || !selectedMesa.value) return;

  const pedidoRequest: PedidoRequestDTO = {
    idMesa: selectedMesa.value.idMesa,
    estado: currentPedido.value.estado,
    tipoServicio: currentPedido.value.tipoServicio,
    // Otros campos si son necesarios
  };

  const detallesRequest: DetallePedidoRequestDTO[] = currentPedido.value.detalles?.map(d => ({
    idProducto: d.producto.idProducto,
    cantidad: d.cantidad,
    observaciones: d.observaciones,
  })) || [];

  const result = await pedidoStore.crearOActualizarPedidoConDetalles(
    pedidoRequest,
    detallesRequest,
    currentPedido.value.idPedido !== 0 ? currentPedido.value.idPedido : undefined
  );

  if (result.success) {
    console.log('Pedido guardado/actualizado:', result.data);
    emit('order-updated');
    closePanel();
  } else {
    console.error('Error al guardar pedido:', result.error);
    // Mostrar notificación de error
  }
};

const finalizeOrder = async () => {
  if (!currentPedido.value) return;

  // Aquí se podría abrir un diálogo de pago para seleccionar método y cliente
  const metodoPago = 'EFECTIVO'; // Ejemplo
  const clienteId = undefined; // Ejemplo

  const result = await pedidoStore.finalizarPedido(currentPedido.value.idPedido, metodoPago, clienteId);

  if (result.success) {
    console.log('Pedido finalizado:', result.data);
    // Actualizar el estado de la mesa a DISPONIBLE o LIMPIEZA si es necesario
    if (selectedMesa.value) {
      await mesaStore.cambiarEstadoMesa(selectedMesa.value.idMesa, EstadoMesa.DISPONIBLE);
    }
    emit('order-updated');
    closePanel();
  } else {
    console.error('Error al finalizar pedido:', result.error);
    // Mostrar notificación de error
  }
};

const cancelOrder = async () => {
  if (!currentPedido.value) {
    closePanel();
    return;
  }

  // Si el pedido es nuevo (idPedido === 0) simplemente lo descartamos
  if (currentPedido.value.idPedido === 0) {
    currentPedido.value = null;
    emit('order-updated');
    closePanel();
    return;
  }

  // Si el pedido ya existe, lo marcamos como CANCELADO
  const result = await pedidoStore.actualizarPedido(currentPedido.value.idPedido, { estado: EstadoPedido.CANCELADO });

  if (result.success) {
    console.log('Pedido cancelado:', result.data);
    // Actualizar el estado de la mesa a DISPONIBLE si es necesario
    if (selectedMesa.value) {
      await mesaStore.cambiarEstadoMesa(selectedMesa.value.idMesa, EstadoMesa.DISPONIBLE);
    }
    currentPedido.value = null;
    emit('order-updated');
    closePanel();
  } else {
    console.error('Error al cancelar pedido:', result.error);
    // Mostrar notificación de error
  }
};

const closePanel = () => {
  isVisible.value = false;
  emit('close-panel');
};
</script>

<style scoped>
.order-panel-sheet {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.product-list {
  max-height: 400px; /* Ajusta según sea necesario */
  overflow-y: auto;
}

/* Estilos para pantallas más grandes */
@media (min-width: 960px) {
  .order-panel-sheet {
    border-radius: 16px;
  }
}
</style>