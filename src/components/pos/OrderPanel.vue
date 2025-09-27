<template>
  <v-bottom-sheet
    v-model="isVisible"
    :fullscreen="$vuetify.display.mobile"
    max-width="1200px"
    content-class="order-panel-sheet"
    persistent
  >
    <v-card v-if="selectedMesa" class="order-panel-card">
      <!-- Header mejorado -->
      <v-toolbar color="primary" dark class="order-toolbar">
        <v-avatar color="white" class="mr-3">
          <v-icon color="primary">mdi-table-furniture</v-icon>
        </v-avatar>
        <div>
          <v-toolbar-title class="text-h6">Mesa #{{ selectedMesa.numeroMesa }}</v-toolbar-title>
          <div class="text-caption">Capacidad: {{ selectedMesa.capacidad }} personas</div>
          <div v-if="selectedMesa.ubicacion" class="text-caption">📍 {{ selectedMesa.ubicacion }}</div>
        </div>
        <v-spacer></v-spacer>

        <!-- Indicador de estado del pedido -->
        <v-chip
          v-if="currentPedido"
          :color="currentPedido.idPedido === 0 ? 'orange' : getPedidoEstadoColor(currentPedido.estado)"
          size="small"
          class="mr-3"
        >
          {{ currentPedido.idPedido === 0 ? 'Borrador' : getPedidoEstadoTexto(currentPedido.estado) }}
        </v-chip>

        <v-btn icon @click="closePanel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading overlay -->
      <v-overlay v-model="loading" contained class="d-flex align-center justify-center">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      </v-overlay>

      <v-card-text class="pa-0">
        <v-row no-gutters class="order-content">
          <!-- Columna izquierda: Selección de productos -->
          <v-col cols="12" lg="7" class="product-selection">
            <div class="pa-4">
              <div class="d-flex align-center mb-4">
                <v-icon class="mr-2" color="primary">mdi-food</v-icon>
                <h3 class="text-h6">Añadir Productos</h3>
              </div>

              <!-- Búsqueda y filtros -->
              <v-row class="mb-4">
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="searchProduct"
                    label="Buscar producto"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedCategory"
                    :items="categoryOptions"
                    label="Categoría"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Grid de productos -->
              <v-row v-if="filteredProducts.length > 0" class="product-grid">
                <v-col
                  v-for="producto in filteredProducts"
                  :key="producto.idProducto"
                  cols="6"
                  sm="4"
                  md="3"
                >
                  <v-card
                    class="product-card"
                    :class="{ 'product-selected': isProductInOrder(producto.idProducto) }"
                    @click="addProductToOrder(producto)"
                    hover
                  >
                    <v-card-text class="pa-3 text-center">
                      <v-avatar size="50" color="primary" class="mb-2">
                        <v-icon color="white">mdi-food-variant</v-icon>
                      </v-avatar>
                      <div class="text-body-2 font-weight-bold mb-1">{{ producto.nombre }}</div>
                      <div class="text-h6 text-primary">${{ producto.precio.toFixed(2) }}</div>
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="elevated"
                        class="mt-2"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Empty state productos -->
              <v-card v-else class="text-center pa-8" variant="outlined">
                <v-icon size="64" color="grey-lighten-2">mdi-food-off</v-icon>
                <div class="text-h6 mt-4 text-grey">No se encontraron productos</div>
                <div class="text-body-2 text-grey">Prueba con otros términos de búsqueda</div>
              </v-card>
            </div>
          </v-col>

          <!-- Columna derecha: Resumen del pedido -->
          <v-col cols="12" lg="5" class="order-summary">
            <div class="pa-4 order-summary-content">
              <div class="d-flex align-center mb-4">
                <v-icon class="mr-2" color="primary">mdi-receipt</v-icon>
                <h3 class="text-h6">Detalle del Pedido</h3>
                <v-spacer></v-spacer>
                <v-chip v-if="currentPedido?.detalles?.length" size="small" color="primary">
                  {{ currentPedido.detalles.length }} items
                </v-chip>
              </div>

              <!-- Lista de productos en el pedido -->
              <v-card variant="outlined" class="order-items mb-4">
                <v-list v-if="currentPedido?.detalles?.length">
                  <v-list-item
                    v-for="(detalle, index) in currentPedido.detalles"
                    :key="detalle.idDetalle || index"
                    class="order-item"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="40" color="primary" variant="tonal">
                        <v-icon>mdi-food-variant</v-icon>
                      </v-avatar>
                    </template>

                    <div class="flex-grow-1">
                      <v-list-item-title class="font-weight-bold">
                        {{ detalle.producto.nombre }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="detalle.observaciones">
                        💬 {{ detalle.observaciones }}
                      </v-list-item-subtitle>
                      <div class="text-caption text-primary">
                        ${{ detalle.precioUnitario.toFixed(2) }} c/u
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <!-- Controles de cantidad -->
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click="updateDetalleCantidad(detalle, -1)"
                        :disabled="loading"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>

                      <v-chip class="mx-2" size="small" color="primary">
                        {{ detalle.cantidad }}
                      </v-chip>

                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click="updateDetalleCantidad(detalle, 1)"
                        :disabled="loading"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>

                      <!-- Subtotal y eliminar -->
                      <div class="ml-3 text-right">
                        <div class="text-body-2 font-weight-bold">
                          ${{ detalle.subtotal.toFixed(2) }}
                        </div>
                        <v-btn
                          icon
                          size="x-small"
                          color="error"
                          variant="text"
                          @click="confirmRemoveDetalle(detalle)"
                          :disabled="loading"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>

                <!-- Empty state pedido -->
                <div v-else class="text-center pa-8">
                  <v-icon size="48" color="grey-lighten-2">mdi-cart-outline</v-icon>
                  <div class="text-body-1 mt-2 text-grey">Pedido vacío</div>
                  <div class="text-caption text-grey">Selecciona productos para agregar</div>
                </div>
              </v-card>

              <!-- Totales -->
              <v-card variant="tonal" color="primary" class="totals-card mb-4">
                <v-card-text>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Subtotal:</span>
                    <span>${{ currentPedido?.subtotal?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Impuestos (10%):</span>
                    <span>${{ currentPedido?.impuestos?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-1" v-if="currentPedido?.descuento">
                    <span>Descuento:</span>
                    <span class="text-success">-${{ currentPedido.descuento.toFixed(2) }}</span>
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex justify-space-between text-h6 font-weight-bold">
                    <span>Total:</span>
                    <span>${{ currentPedido?.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Observaciones -->
              <v-textarea
                v-model="orderObservaciones"
                label="Observaciones del pedido"
                variant="outlined"
                rows="2"
                density="compact"
                hide-details
                class="mb-4"
              ></v-textarea>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Footer con acciones -->
      <v-card-actions class="order-actions pa-4">
        <v-btn
          color="error"
          variant="outlined"
          @click="confirmCancelOrder"
          :disabled="loading"
          prepend-icon="mdi-close"
        >
          Cancelar
        </v-btn>

        <v-spacer></v-spacer>

        <!-- Botón para marcar como atendido (solo para pedidos abiertos) -->
        <v-btn
          v-if="currentPedido?.idPedido !== 0 && currentPedido?.estado === EstadoPedido.ABIERTO"
          color="warning"
          variant="flat"
          @click="marcarComoAtendido"
          :disabled="loading || !hasItems"
          :loading="loading"
          prepend-icon="mdi-account-check"
          class="mr-2"
        >
          Marcar Atendido
        </v-btn>

        <!-- Botón para procesar pago (solo para pedidos atendidos) -->
        <v-btn
          v-if="currentPedido?.idPedido !== 0 && currentPedido?.estado === EstadoPedido.ATENDIDO"
          color="success"
          variant="flat"
          @click="confirmarPago"
          :disabled="loading || !hasItems"
          :loading="loading"
          prepend-icon="mdi-cash"
          class="mr-2"
        >
          Procesar Pago
        </v-btn>

        <!-- Botón para crear/abrir pedido -->
        <v-btn
          color="primary"
          variant="flat"
          @click="confirmFinalizeOrder"
          :disabled="loading || !hasItems"
          :loading="loading"
          prepend-icon="mdi-plus"
        >
          {{ currentPedido?.idPedido === 0 ? 'Abrir Mesa' : 'Agregar Productos' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Diálogos de confirmación -->
    <ConfirmDialog
      v-model="showCancelDialog"
      title="Cancelar Pedido"
      message="¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
      @confirm="cancelOrder"
    />

    <ConfirmDialog
      v-model="showFinalizeDialog"
      title="Finalizar Pedido"
      message="¿Deseas finalizar este pedido? Se procesará el pago y se marcará como completado."
      @confirm="finalizeOrder"
    />

    <ConfirmDialog
      v-model="showRemoveItemDialog"
      title="Eliminar Producto"
      :message="`¿Eliminar ${itemToRemove?.producto?.nombre} del pedido?`"
      @confirm="removeDetalle"
    />

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="showNotification"
      :color="notificationColor"
      :timeout="3000"
      location="top"
    >
      {{ notificationMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showNotification = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useMesaStore } from '@/stores/mesaStore';
import { usePedidoStore } from '@/stores/pedidoStore';
import { useProductoStore } from '@/stores/productoStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { Mesa } from '@/types/mesa';
import type { Pedido } from '@/types/pedido';
import type { Producto } from '@/types/producto';
import type { DetallePedido, DetallePedidoRequestDTO } from '@/types/detallePedido';
import { EstadoPedido, TipoServicio, EstadoMesa } from '@/types/enums';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

interface Props {
  mesaId: number | null;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close-panel', 'order-updated']);

// Stores
const mesaStore = useMesaStore();
const pedidoStore = usePedidoStore();
const productoStore = useProductoStore();
const categoriaStore = useCategoriaStore();

// State
const isVisible = ref(props.visible);
const currentPedido = ref<Pedido | null>(null);
const searchProduct = ref('');
const selectedCategory = ref<number | 'all'>('all');
const orderObservaciones = ref('');
const loading = ref(false);

// Dialog states
const showCancelDialog = ref(false);
const showFinalizeDialog = ref(false);
const showRemoveItemDialog = ref(false);
const itemToRemove = ref<DetallePedido | null>(null);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationColor = ref('success');

// Computed
const selectedMesa = computed<Mesa | undefined>(() => {
  return mesaStore.mesas.find(m => m.idMesa === props.mesaId);
});

const categoryOptions = computed(() => [
  { title: 'Todas las categorías', value: 'all' },
  ...categoriaStore.categorias.map(cat => ({
    title: cat.nombre,
    value: cat.idCategoria
  }))
]);

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

const hasItems = computed(() => {
  return currentPedido.value?.detalles?.length > 0;
});

// Watch para sincronizar la visibilidad
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
  if (newVal && props.mesaId) {
    loadPedidoForMesa(props.mesaId);
  } else {
    resetPanel();
  }
});

onMounted(() => {
  productoStore.fetchProductos();
  categoriaStore.fetchCategorias();
});

// Methods
const loadPedidoForMesa = async (mesaId: number) => {
  if (!selectedMesa.value) return;

  console.log('🔍 Loading pedido for mesa:', mesaId, selectedMesa.value.ultimoPedido);

  loading.value = true;
  try {
    // Verificar si la mesa ya tiene un pedido activo según la información detallada
    if (selectedMesa.value.ultimoPedido) {
      console.log('✅ Mesa has active order, loading details for pedido ID:', selectedMesa.value.ultimoPedido.idPedido);

      // Cargar el pedido completo usando su ID
      const result = await pedidoStore.fetchPedidoPorId(selectedMesa.value.ultimoPedido.idPedido);

      if (result) {
        currentPedido.value = result;
        orderObservaciones.value = result.observaciones || '';
        console.log('✅ Order loaded successfully with', result.detalles?.length || 0, 'items');
        showSuccess('Pedido cargado exitosamente');
      } else {
        console.log('❌ Could not load order');
        showError('No se pudo cargar el pedido');
      }
    } else {
      console.log('ℹ️ No active order, initializing new...');
      // Si no hay pedido activo, inicializar uno nuevo para la UI
      initializeNewOrder();
    }
  } catch (error) {
    console.error('❌ Error loading order:', error);
    showError('Error al cargar información del pedido');
  } finally {
    loading.value = false;
  }
};

const initializeNewOrder = () => {
  if (!selectedMesa.value) return;

  currentPedido.value = {
    idPedido: 0, // Temporal, el backend asignará uno real
    mesa: {
      idMesa: selectedMesa.value.idMesa,
      numeroMesa: selectedMesa.value.numeroMesa
    },
    fechaPedido: new Date().toISOString(),
    estado: EstadoPedido.ABIERTO, // Nuevo estado inicial para restaurante
    tipoServicio: TipoServicio.MESA,
    subtotal: 0,
    impuestos: 0,
    descuento: 0,
    total: 0,
    detalles: [],
  } as Pedido;
  orderObservaciones.value = '';
};

const addProductToOrder = async (product: Producto) => {
  if (!currentPedido.value || !selectedMesa.value || loading.value) return;

  // Para pedidos temporales (idPedido === 0), manejar en frontend hasta crear
  if (currentPedido.value.idPedido === 0) {
    // Verificar si el producto ya está en el pedido temporal
    const existingDetalle = currentPedido.value.detalles?.find(
      d => d.producto.idProducto === product.idProducto
    );

    if (existingDetalle) {
      // Si ya existe, incrementar cantidad localmente
      existingDetalle.cantidad += 1;
      existingDetalle.subtotal = existingDetalle.cantidad * existingDetalle.precioUnitario;
      showSuccess(`Cantidad de ${product.nombre} aumentada`);
    } else {
      // Si no existe, agregarlo al pedido temporal
      const newDetalle = {
        idDetalle: Date.now(), // ID temporal único
        producto: product,
        cantidad: 1,
        precioUnitario: product.precio,
        subtotal: product.precio,
        observaciones: '',
        estado: 'PENDIENTE'
      };

      if (!currentPedido.value.detalles) {
        currentPedido.value.detalles = [];
      }
      currentPedido.value.detalles.push(newDetalle);
      showSuccess(`${product.nombre} agregado al pedido`);
    }

    // Recalcular totales localmente
    recalculateTotals();
    return;
  }

  // Para pedidos existentes (idPedido > 0), usar el nuevo endpoint
  loading.value = true;
  try {
    // Verificar si el producto ya está en el pedido
    const existingDetalle = currentPedido.value.detalles?.find(
      d => d.producto.idProducto === product.idProducto
    );

    if (existingDetalle) {
      // Si ya existe, incrementar cantidad usando el nuevo endpoint
      const updateData = {
        idProducto: product.idProducto,
        cantidad: existingDetalle.cantidad + 1,
        observaciones: existingDetalle.observaciones || ''
      };

      const result = await pedidoStore.agregarProductoAPedido(currentPedido.value.idPedido, updateData);
      if (result.success && result.data) {
        currentPedido.value = result.data;
        showSuccess(`Cantidad de ${product.nombre} aumentada`);
      } else {
        showError(result.error || 'Error al actualizar producto');
      }
    } else {
      // Si no existe, agregarlo usando el nuevo endpoint
      const agregarData = {
        idProducto: product.idProducto,
        cantidad: 1,
        observaciones: ''
      };

      const result = await pedidoStore.agregarProductoAPedido(currentPedido.value.idPedido, agregarData);
      if (result.success && result.data) {
        currentPedido.value = result.data;
        showSuccess(`${product.nombre} agregado al pedido`);
      } else {
        showError(result.error || 'Error al agregar producto');
      }
    }
  } catch (error) {
    showError('Error al agregar producto al pedido');
  } finally {
    loading.value = false;
  }
};

const updateDetalleCantidad = async (detalle: DetallePedido, change: number) => {
  if (!currentPedido.value) return;

  const newCantidad = detalle.cantidad + change;

  if (newCantidad <= 0) {
    confirmRemoveDetalle(detalle);
    return;
  }

  // Para pedidos temporales (idPedido === 0), actualizar localmente
  if (currentPedido.value.idPedido === 0) {
    detalle.cantidad = newCantidad;
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
    recalculateTotals();
    return;
  }

  // Para pedidos existentes, usar API
  loading.value = true;
  try {
    // TODO: Implementar endpoint correcto para actualizar cantidad
    // Por ahora actualizamos localmente
    detalle.cantidad = newCantidad;
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
    recalculateTotals();
    showSuccess('Cantidad actualizada');
  } catch (error) {
    showError('Error al actualizar cantidad');
  } finally {
    loading.value = false;
  }
};

const confirmRemoveDetalle = (detalle: DetallePedido) => {
  itemToRemove.value = detalle;
  showRemoveItemDialog.value = true;
};

const removeDetalle = async () => {
  if (!currentPedido.value || !itemToRemove.value) return;

  // Para pedidos temporales (idPedido === 0), eliminar localmente
  if (currentPedido.value.idPedido === 0) {
    currentPedido.value.detalles = currentPedido.value.detalles?.filter(
      d => d.idDetalle !== itemToRemove.value?.idDetalle
    ) || [];
    recalculateTotals();
    showSuccess('Producto eliminado del pedido');
    showRemoveItemDialog.value = false;
    itemToRemove.value = null;
    return;
  }

  // Para pedidos existentes, usar API
  loading.value = true;
  try {
    // TODO: Implementar endpoint correcto para eliminar producto
    // Por ahora eliminamos localmente
    currentPedido.value.detalles = currentPedido.value.detalles?.filter(
      d => d.idDetalle !== itemToRemove.value?.idDetalle
    ) || [];
    recalculateTotals();
    showSuccess('Producto eliminado del pedido');
  } catch (error) {
    showError('Error al eliminar producto');
  } finally {
    loading.value = false;
    showRemoveItemDialog.value = false;
    itemToRemove.value = null;
  }
};

const recalculateTotals = () => {
  if (!currentPedido.value) return;

  let subtotal = 0;
  currentPedido.value.detalles?.forEach(d => {
    subtotal += d.subtotal;
  });

  currentPedido.value.subtotal = subtotal;
  currentPedido.value.impuestos = subtotal * 0.1; // 10% impuestos según documentación
  currentPedido.value.descuento = 0;
  currentPedido.value.total = subtotal + currentPedido.value.impuestos - currentPedido.value.descuento;
};

const saveOrder = async () => {
  if (!currentPedido.value || loading.value) return;

  loading.value = true;
  try {
    const result = await pedidoStore.actualizarPedido(currentPedido.value.idPedido, {
      observaciones: orderObservaciones.value,
    });

    if (result.success) {
      showSuccess('Pedido guardado exitosamente');
      emit('order-updated');
    } else {
      showError(result.error || 'Error al guardar pedido');
    }
  } catch (error) {
    showError('Error al guardar pedido');
  } finally {
    loading.value = false;
  }
};

const confirmFinalizeOrder = () => {
  if (!hasItems.value) {
    showError('Agrega productos antes de finalizar el pedido');
    return;
  }
  showFinalizeDialog.value = true;
};

const finalizeOrder = async () => {
  if (!currentPedido.value || loading.value) return;

  loading.value = true;
  try {
    if (currentPedido.value.idPedido === 0) {
      // Si es un pedido nuevo, crearlo primero
      if (!selectedMesa.value) return;

      const pedidoCompleto = {
        idMesa: selectedMesa.value.idMesa,
        idEmpleado: 1, // TODO: Obtener del contexto de usuario logueado
        tipoServicio: 'MESA',
        observaciones: orderObservaciones.value || '',
        detalles: currentPedido.value.detalles?.map(d => ({
          idProducto: d.producto.idProducto,
          cantidad: d.cantidad,
          observaciones: d.observaciones || ''
        })) || []
      };

      const result = await pedidoStore.crearPedidoCompleto(pedidoCompleto);
      if (result.success) {
        showSuccess('Pedido creado exitosamente');
        emit('order-updated');
        closePanel();
      } else {
        showError(result.error || 'Error al crear pedido');
      }
    } else {
      // TODO: Implementar finalización de pedido existente
      showError('Funcionalidad de finalización pendiente de implementar');
    }
  } catch (error) {
    showError('Error al finalizar pedido');
  } finally {
    loading.value = false;
    showFinalizeDialog.value = false;
  }
};

const confirmCancelOrder = () => {
  showCancelDialog.value = true;
};

const cancelOrder = async () => {
  if (!currentPedido.value) {
    closePanel();
    return;
  }

  if (currentPedido.value.idPedido === 0) {
    // Pedido nuevo, simplemente cerrar
    resetPanel();
    closePanel();
    return;
  }

  loading.value = true;
  try {
    const result = await pedidoStore.actualizarPedido(currentPedido.value.idPedido, {
      estado: EstadoPedido.CANCELADO
    });

    if (result.success) {
      showSuccess('Pedido cancelado');
      if (selectedMesa.value) {
        await mesaStore.cambiarEstadoMesa(selectedMesa.value.idMesa, EstadoMesa.DISPONIBLE);
      }
      emit('order-updated');
      closePanel();
    } else {
      showError(result.error || 'Error al cancelar pedido');
    }
  } catch (error) {
    showError('Error al cancelar pedido');
  } finally {
    loading.value = false;
    showCancelDialog.value = false;
  }
};

const resetPanel = () => {
  currentPedido.value = null;
  orderObservaciones.value = '';
  searchProduct.value = '';
  selectedCategory.value = 'all';
};

const closePanel = () => {
  isVisible.value = false;
  resetPanel();
  emit('close-panel');
};

// Utility methods
const isProductInOrder = (productId: number) => {
  return currentPedido.value?.detalles?.some(d => d.producto.idProducto === productId) || false;
};

const getPedidoEstadoColor = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO: return 'primary';
    case EstadoPedido.ATENDIDO: return 'warning';
    case EstadoPedido.PAGADO: return 'success';
    case EstadoPedido.CANCELADO: return 'error';
    // Estados legacy
    case EstadoPedido.PENDIENTE: return 'orange';
    case EstadoPedido.EN_PREPARACION: return 'blue';
    case EstadoPedido.LISTO: return 'green';
    case EstadoPedido.ENTREGADO: return 'success';
    default: return 'grey';
  }
};

const getPedidoEstadoTexto = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO: return 'Mesa Abierta';
    case EstadoPedido.ATENDIDO: return 'Atendido';
    case EstadoPedido.PAGADO: return 'Pagado';
    case EstadoPedido.CANCELADO: return 'Cancelado';
    // Estados legacy
    case EstadoPedido.PENDIENTE: return 'Pendiente';
    case EstadoPedido.EN_PREPARACION: return 'Preparando';
    case EstadoPedido.LISTO: return 'Listo';
    case EstadoPedido.ENTREGADO: return 'Entregado';
    default: return 'Desconocido';
  }
};

const showSuccess = (message: string) => {
  notificationMessage.value = message;
  notificationColor.value = 'success';
  showNotification.value = true;
};

const showError = (message: string) => {
  notificationMessage.value = message;
  notificationColor.value = 'error';
  showNotification.value = true;
};

// Nuevos métodos para el flujo de restaurante
const marcarComoAtendido = async () => {
  if (!currentPedido.value || loading.value) return;

  loading.value = true;
  try {
    const result = await pedidoStore.actualizarPedido(currentPedido.value.idPedido, {
      estado: EstadoPedido.ATENDIDO
    });

    if (result.success) {
      currentPedido.value.estado = EstadoPedido.ATENDIDO;
      showSuccess('Mesa marcada como atendida');
      emit('order-updated');
    } else {
      showError(result.error || 'Error al marcar como atendido');
    }
  } catch (error) {
    showError('Error al marcar como atendido');
  } finally {
    loading.value = false;
  }
};

const confirmarPago = async () => {
  if (!currentPedido.value || loading.value) return;

  loading.value = true;
  try {
    const result = await pedidoStore.actualizarPedido(currentPedido.value.idPedido, {
      estado: EstadoPedido.PAGADO
    });

    if (result.success) {
      showSuccess('Pago procesado. Mesa liberada');
      // La mesa se libera automáticamente en el backend
      emit('order-updated');
      closePanel();
    } else {
      showError(result.error || 'Error al procesar pago');
    }
  } catch (error) {
    showError('Error al procesar pago');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.order-panel-sheet {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.order-panel-card {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.order-toolbar {
  flex-shrink: 0;
}

.order-content {
  flex: 1;
  min-height: 0;
}

.product-selection {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.5);
}

.order-summary {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.order-summary-content {
  position: sticky;
  top: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.product-grid {
  max-height: 60vh;
  overflow-y: auto;
}

.product-card {
  cursor: pointer;
  transition: all 0.2s ease;
  height: 140px;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-selected {
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.order-item:last-child {
  border-bottom: none;
}

.totals-card {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

.order-actions {
  flex-shrink: 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.95);
}

/* Responsive design */
@media (max-width: 1024px) {
  .product-selection {
    border-right: none;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }

  .order-summary-content {
    position: static;
    max-height: none;
  }
}

@media (max-width: 600px) {
  .order-panel-sheet {
    border-radius: 0;
  }

  .product-card {
    height: 120px;
  }

  .order-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.order-item {
  animation: fadeIn 0.3s ease;
}
</style>