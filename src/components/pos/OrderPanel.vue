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
        <v-avatar color="white" class="mr-2 d-none d-sm-flex" size="40">
          <v-icon color="primary">mdi-table-furniture</v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <v-toolbar-title class="text-h6 text-sm-h5"
            >Mesa #{{ selectedMesa.numeroMesa }}</v-toolbar-title
          >
          <div class="text-caption d-none d-sm-block">
            Capacidad: {{ selectedMesa.capacidad }} personas
          </div>
          <div v-if="selectedMesa.ubicacion" class="text-caption d-none d-sm-block">
            📍 {{ selectedMesa.ubicacion }}
          </div>
        </div>

        <!-- Indicador de estado del pedido -->
        <v-chip
          v-if="currentPedido"
          :color="
            currentPedido.idPedido === 0
              ? 'orange'
              : getPedidoEstadoColor(currentPedido.estado)
          "
          size="small"
          class="mr-2"
        >
          <span class="d-none d-sm-inline">
            {{
              currentPedido.idPedido === 0
                ? "Borrador"
                : getPedidoEstadoTexto(currentPedido.estado)
            }}
          </span>
          <span class="d-sm-none">
            {{
              currentPedido.idPedido === 0
                ? "Borr."
                : getPedidoEstadoTexto(currentPedido.estado).substring(0, 4)
            }}
          </span>
        </v-chip>

        <v-btn icon size="small" @click="closePanel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Loading overlay -->
      <v-overlay
        v-model="loading"
        contained
        class="d-flex align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-overlay>

      <v-card-text class="pa-0">
        <!-- Tabs solo en móvil -->
        <v-tabs
          v-if="isMobile"
          v-model="mobileTab"
          bg-color="primary"
          grow
          class="mobile-tabs"
        >
          <v-tab value="productos">
            <v-icon start>mdi-food</v-icon>
            Productos
            <v-badge
              v-if="hasItems"
              :content="currentPedido?.detalles?.length"
              color="error"
              inline
              class="ml-2"
            />
          </v-tab>
          <v-tab value="carrito">
            <v-icon start>mdi-cart</v-icon>
            Carrito
            <v-chip
              v-if="currentPedido?.total"
              size="small"
              color="white"
              class="ml-2"
            >
              S/{{ currentPedido.total.toFixed(2) }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <!-- Contenido con tabs en móvil -->
        <v-window v-if="isMobile" v-model="mobileTab" class="mobile-content">
          <!-- Tab: Productos -->
          <v-window-item value="productos" class="pa-3">
            <!-- Botón de búsqueda colapsable -->
            <v-expand-transition>
              <div v-if="showSearchMobile">
                <v-row class="mb-3">
                  <v-col cols="12">
                    <v-text-field
                      v-model="searchProduct"
                      label="Buscar producto"
                      prepend-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      clearable
                      hide-details
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
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
              </div>
            </v-expand-transition>

            <v-row v-if="filteredProducts.length > 0" class="product-grid-mobile">
              <v-col
                v-for="producto in filteredProducts"
                :key="producto.idProducto"
                cols="4"
              >
                <v-card
                  class="product-card-mobile"
                  :class="{
                    'product-selected': isProductInOrder(producto.idProducto),
                  }"
                  @click="addProductToOrder(producto)"
                  hover
                >
                  <v-card-text class="pa-2 text-center">
                    <v-avatar size="35" color="primary" class="mb-1">
                      <v-icon color="white" size="x-small">mdi-food-variant</v-icon>
                    </v-avatar>
                    <div class="product-name-mobile">
                      {{ producto.nombre }}
                    </div>
                    <div class="product-price-mobile">
                      S/{{ producto.precio.toFixed(2) }}
                    </div>
                    <v-chip
                      v-if="isProductInOrder(producto.idProducto)"
                      size="x-small"
                      color="primary"
                      class="mt-1"
                    >
                      {{ getProductQuantity(producto.idProducto) }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Empty state productos -->
            <v-card v-else class="text-center pa-6" variant="outlined">
              <v-icon size="48" color="grey-lighten-2">mdi-food-off</v-icon>
              <div class="text-body-2 mt-2 text-grey">
                No se encontraron productos
              </div>
            </v-card>
          </v-window-item>

          <!-- Tab: Carrito -->
          <v-window-item value="carrito" class="pa-3 carrito-tab">
            <!-- Selección de Cliente (Opcional) en móvil compacto -->
            <v-card variant="outlined" class="mb-3">
              <v-card-text class="pa-2">
                <v-autocomplete
                  v-model="selectedClienteId"
                  :items="clienteStore.clientesFormateados"
                  item-title="nombreCompleto"
                  item-value="idCliente"
                  label="Cliente (opcional)"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                >
                  <template v-slot:append-item>
                    <v-divider class="mb-1"></v-divider>
                    <v-list-item @click="showClienteDialog = true" density="compact">
                      <template v-slot:prepend>
                        <v-icon color="success" size="small">mdi-plus</v-icon>
                      </template>
                      <v-list-item-title class="text-success text-caption">
                        Nuevo cliente
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-card-text>
            </v-card>

            <!-- Lista de productos en el pedido - Móvil optimizado -->
            <v-card variant="outlined" class="order-items-mobile mb-3">
              <v-list v-if="currentPedido?.detalles?.length" density="compact">
                <v-list-item
                  v-for="(detalle, index) in currentPedido.detalles"
                  :key="detalle.idDetallePedido || index"
                  class="order-item-mobile"
                >
                  <div class="d-flex align-start">
                    <v-avatar size="32" color="primary" variant="tonal" class="mr-3 mt-1">
                      <v-icon size="small">mdi-food-variant</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-bold">{{ detalle.producto.nombre }}</div>
                      <div class="text-caption text-medium-emphasis">
                        <span>S/{{ detalle.precioUnitario.toFixed(2) }} c/u</span>
                        <v-chip
                          :color="getDetalleEstadoColor(detalle.estado)"
                          size="x-small"
                          variant="tonal"
                          class="ml-2"
                        >
                          {{ getDetalleEstadoTexto(detalle.estado) }}
                        </v-chip>
                      </div>
                      <div class="d-flex align-center justify-space-between mt-2">
                        <div class="d-flex align-center">
                          <v-btn
                            icon
                            size="x-small"
                            variant="tonal"
                            color="error"
                            @click="updateDetalleCantidad(detalle, -1)"
                            :disabled="loading"
                          >
                            <v-icon size="small">mdi-minus</v-icon>
                          </v-btn>
                          <div class="mx-2 text-body-1 font-weight-medium" style="min-width: 24px; text-align: center;">
                            {{ detalle.cantidad }}
                          </div>
                          <v-btn
                            icon
                            size="x-small"
                            variant="tonal"
                            color="success"
                            @click="updateDetalleCantidad(detalle, 1)"
                            :disabled="loading"
                          >
                            <v-icon size="small">mdi-plus</v-icon>
                          </v-btn>
                        </div>
                        <div class="text-body-1 font-weight-bold">
                          S/{{ (detalle.cantidad * detalle.precioUnitario).toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-list-item>
              </v-list>

              <!-- Empty state pedido -->
              <div v-else class="text-center pa-6">
                <v-icon size="40" color="grey-lighten-2">mdi-cart-outline</v-icon>
                <div class="text-body-2 mt-2 text-grey">Carrito vacío</div>
              </div>
            </v-card>

            <!-- Totales compactos -->
            <v-card variant="tonal" color="primary" class="totals-card-mobile mb-3">
              <v-card-text class="pa-3">
                <div class="d-flex justify-space-between text-caption mb-1">
                  <span>Subtotal:</span>
                  <span>S/{{ currentPedido?.subtotal?.toFixed(2) || "0.00" }}</span>
                </div>
                <div v-if="empresaStore.aplicaIgv" class="d-flex justify-space-between text-caption mb-1">
                  <span>IGV ({{ empresaStore.porcentajeIgv }}%):</span>
                  <span>S/{{ currentPedido?.impuestos?.toFixed(2) || "0.00" }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <div class="d-flex justify-space-between text-h6 font-weight-bold">
                  <span>Total:</span>
                  <span>S/{{ currentPedido?.total?.toFixed(2) || "0.00" }}</span>
                </div>
              </v-card-text>
            </v-card>

            <!-- Observaciones compactas -->
            <v-textarea
              v-model="orderObservaciones"
              label="Observaciones"
              variant="outlined"
              rows="2"
              density="compact"
              hide-details
            ></v-textarea>
          </v-window-item>
        </v-window>

        <!-- Layout desktop (columnas) -->
        <v-row v-else no-gutters class="order-content">
          <!-- Columna izquierda: Selección de productos -->
          <v-col cols="12" lg="7" class="product-selection">
            <div class="pa-4">
              <div class="d-flex align-center mb-4">
                <v-icon class="mr-2" color="primary">mdi-food</v-icon>
                <h3 class="text-h6">Añadir Productos</h3>
              </div>

              <!-- Búsqueda y filtros -->
              <v-row class="mb-3">
                <v-col cols="12" sm="8">
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
                <v-col cols="12" sm="4">
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
                    :class="{
                      'product-selected': isProductInOrder(producto.idProducto),
                    }"
                    @click="addProductToOrder(producto)"
                    hover
                  >
                    <v-card-text class="pa-2 pa-sm-3 text-center">
                      <v-avatar size="40" color="primary" class="mb-1 mb-sm-2">
                        <v-icon color="white" size="small">mdi-food-variant</v-icon>
                      </v-avatar>
                      <div class="text-caption text-sm-body-2 font-weight-bold mb-1 product-name">
                        {{ producto.nombre }}
                      </div>
                      <div class="text-body-2 text-sm-h6 text-primary">
                        S/{{ producto.precio.toFixed(2) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Empty state productos -->
              <v-card v-else class="text-center pa-8" variant="outlined">
                <v-icon size="64" color="grey-lighten-2">mdi-food-off</v-icon>
                <div class="text-h6 mt-4 text-grey">
                  No se encontraron productos
                </div>
                <div class="text-body-2 text-grey">
                  Prueba con otros términos de búsqueda
                </div>
              </v-card>
            </div>
          </v-col>

          <!-- Columna derecha: Resumen del pedido -->
          <v-col cols="12" lg="5" class="order-summary">
            <div class="pa-3 pa-sm-4 order-summary-content">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-2" color="primary" size="small">mdi-receipt</v-icon>
                <h3 class="text-subtitle-1 text-sm-h6">Detalle del Pedido</h3>
                <v-spacer></v-spacer>
                <v-chip
                  v-if="currentPedido?.detalles?.length"
                  size="small"
                  color="primary"
                >
                  {{ currentPedido.detalles.length }} items
                </v-chip>
              </div>

              <!-- Selección de Cliente (Opcional) -->
              <v-card variant="outlined" class="mb-4">
                <v-card-text class="pb-2">
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2">mdi-account</v-icon>
                    <span class="text-subtitle-2">Cliente (Opcional)</span>
                  </div>

                  <v-autocomplete
                    v-model="selectedClienteId"
                    :items="clienteStore.clientesFormateados"
                    item-title="nombreCompleto"
                    item-value="idCliente"
                    label="Buscar cliente"
                    placeholder="Escribe para buscar..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details="auto"
                    :loading="clienteStore.loading"
                    no-data-text="No se encontraron clientes"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.nombreCompleto"
                        :subtitle="getClienteSubtitle(item.raw)"
                      >
                        <template v-slot:prepend>
                          <v-avatar color="primary" size="32">
                            <v-icon size="small">{{ item.raw.tipoPersona === 'JURIDICA' ? 'mdi-domain' : 'mdi-account' }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>

                    <template v-slot:append-item>
                      <v-divider class="mb-2"></v-divider>
                      <v-list-item @click="showClienteDialog = true">
                        <template v-slot:prepend>
                          <v-avatar color="success" size="32">
                            <v-icon size="small">mdi-plus</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="text-success">
                          Crear nuevo cliente
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-autocomplete>

                  <!-- Información del cliente seleccionado -->
                  <v-chip
                    v-if="selectedCliente"
                    size="small"
                    color="primary"
                    variant="tonal"
                    class="mt-2"
                    prepend-icon="mdi-account-check"
                  >
                    {{ selectedCliente.nombre }} {{ selectedCliente.apellido }}
                  </v-chip>
                </v-card-text>
              </v-card>

              <!-- Lista de productos en el pedido -->
              <v-card variant="outlined" class="order-items mb-4">
                <v-list v-if="currentPedido?.detalles?.length">
                  <v-list-item
                    v-for="(detalle, index) in currentPedido.detalles"
                    :key="detalle.idDetallePedido || index"
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
                      <v-list-item-subtitle>
                        <v-chip
                          :color="getDetalleEstadoColor(detalle.estado)"
                          size="x-small"
                          variant="tonal"
                          class="mr-1"
                        >
                          {{ getDetalleEstadoTexto(detalle.estado) }}
                        </v-chip>
                        <span v-if="detalle.observaciones" class="text-caption">
                          💬 {{ detalle.observaciones }}
                        </span>
                      </v-list-item-subtitle>
                      <div class="text-caption text-primary">
                        S/{{ detalle.precioUnitario.toFixed(2) }} c/u
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
                          S/{{
                            (detalle.cantidad * detalle.precioUnitario).toFixed(
                              2
                            )
                          }}
                        </div>
                        <v-btn
                          icon
                          size="x-small"
                          :color="canRemoveDetalle(detalle) ? 'error' : 'grey'"
                          variant="text"
                          @click="confirmRemoveDetalle(detalle)"
                          :disabled="loading || !canRemoveDetalle(detalle)"
                        >
                          <v-icon>{{ canRemoveDetalle(detalle) ? 'mdi-delete' : 'mdi-lock' }}</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>

                <!-- Empty state pedido -->
                <div v-else class="text-center pa-8">
                  <v-icon size="48" color="grey-lighten-2"
                    >mdi-cart-outline</v-icon
                  >
                  <div class="text-body-1 mt-2 text-grey">Pedido vacío</div>
                  <div class="text-caption text-grey">
                    Selecciona productos para agregar
                  </div>
                </div>
              </v-card>

              <!-- Totales -->
              <v-card variant="tonal" color="primary" class="totals-card mb-4">
                <v-card-text>
                  <div class="d-flex justify-space-between mb-1">
                    <span>Subtotal:</span>
                    <span
                      >S/{{
                        currentPedido?.subtotal?.toFixed(2) || "0.00"
                      }}</span
                    >
                  </div>
                  <div v-if="empresaStore.aplicaIgv" class="d-flex justify-space-between mb-1">
                    <span>IGV ({{ empresaStore.porcentajeIgv }}%):</span>
                    <span
                      >S/{{
                        currentPedido?.impuestos?.toFixed(2) || "0.00"
                      }}</span
                    >
                  </div>
                  <div v-else class="d-flex justify-space-between mb-1">
                    <span class="text-medium-emphasis">IGV (No aplica):</span>
                    <span class="text-medium-emphasis">S/0.00</span>
                  </div>
                  <div
                    class="d-flex justify-space-between mb-1"
                    v-if="currentPedido?.descuento"
                  >
                    <span>Descuento:</span>
                    <span class="text-success"
                      >-S/{{ currentPedido.descuento.toFixed(2) }}</span
                    >
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div
                    class="d-flex justify-space-between text-h6 font-weight-bold"
                  >
                    <span>Total:</span>
                    <span
                      >S/{{ currentPedido?.total?.toFixed(2) || "0.00" }}</span
                    >
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
      <v-card-actions class="order-actions pa-3 pa-sm-4">
        <v-btn
          color="error"
          variant="outlined"
          size="small"
          @click="confirmCancelOrder"
          :disabled="loading"
          class="flex-grow-1 flex-sm-grow-0"
        >
          <v-icon class="d-sm-none">mdi-close</v-icon>
          <span class="d-none d-sm-inline">Cancelar</span>
        </v-btn>

        <v-spacer class="d-none d-sm-flex"></v-spacer>

        <!-- Botón para marcar como atendido (solo para pedidos abiertos) -->
        <v-btn
          v-if="
            currentPedido?.idPedido !== 0 &&
            currentPedido?.estado === EstadoPedido.ABIERTO
          "
          color="warning"
          variant="flat"
          size="small"
          @click="marcarComoAtendido"
          :disabled="loading || !hasItems"
          :loading="loading"
          class="flex-grow-1 flex-sm-grow-0"
        >
          <v-icon class="d-sm-none">mdi-account-check</v-icon>
          <span class="d-none d-sm-inline">Marcar Atendido</span>
        </v-btn>

        <!-- Botón para procesar pago (solo para pedidos atendidos) -->
        <v-btn
          v-if="
            currentPedido?.idPedido !== 0 &&
            currentPedido?.estado === EstadoPedido.ATENDIDO
          "
          color="success"
          variant="flat"
          size="small"
          @click="confirmarPago"
          :disabled="loading || !hasItems"
          :loading="loading"
          class="flex-grow-1 flex-sm-grow-0"
        >
          <v-icon class="d-sm-none">mdi-cash</v-icon>
          <span class="d-none d-sm-inline">Procesar Pago</span>
        </v-btn>

        <!-- Botón para crear/abrir pedido -->
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          @click="confirmFinalizeOrder"
          :disabled="loading || !hasItems"
          :loading="loading"
          class="flex-grow-1 flex-sm-grow-0"
        >
          <v-icon class="d-sm-none">mdi-plus</v-icon>
          <span class="d-none d-sm-inline">
            {{
              currentPedido?.idPedido === 0
                ? "Generar Pedido"
                : "Actualizar Pedido"
            }}
          </span>
          <span class="d-sm-none">
            {{
              currentPedido?.idPedido === 0
                ? "Generar"
                : "Actualizar"
            }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- FAB de búsqueda para móvil -->
    <v-fab
      v-if="isMobile && mobileTab === 'productos'"
      icon="mdi-magnify"
      color="primary"
      size="small"
      location="bottom end"
      class="fab-search-mobile"
      @click="showSearchMobile = !showSearchMobile"
    >
      <v-icon>{{ showSearchMobile ? 'mdi-close' : 'mdi-magnify' }}</v-icon>
    </v-fab>

    <!-- Diálogos de confirmación -->
    <ConfirmDialog
      v-model="showCancelDialog"
      title="Cancelar Pedido"
      message="¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
      @confirm="cancelOrder"
    />

    <ConfirmDialog
      v-model="showFinalizeDialog"
      :title="
        currentPedido?.idPedido === 0 ? 'Generar Pedido' : 'Actualizar Pedido'
      "
      :message="
        currentPedido?.idPedido === 0
          ? '¿Confirmas generar este pedido? La mesa quedará ocupada y se podrán agregar más productos.'
          : '¿Deseas actualizar este pedido? Se agregarán los nuevos productos y/o cantidades modificadas.'
      "
      @confirm="finalizeOrder"
    />

    <ConfirmDialog
      v-model="showRemoveItemDialog"
      title="Eliminar Producto"
      :message="`¿Eliminar ${itemToRemove?.producto?.nombre} del pedido?`"
      @confirm="removeDetalle"
    />

    <!-- Diálogo de selección de método de pago -->
    <PaymentMethodDialog
      v-model:visible="showPaymentDialog"
      :pedido="currentPedido"
      @pago-completado="onPagoCompletado"
      @pago-error="onPagoError"
    />

    <!-- Diálogo para crear nuevo cliente -->
    <v-dialog v-model="showClienteDialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-account-plus</v-icon>
          <span>Nuevo Cliente</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="showClienteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="clienteForm" @submit.prevent="crearCliente">
            <!-- Tipo de Persona -->
            <v-radio-group
              v-model="nuevoCliente.tipoPersona"
              inline
              hide-details
              class="mb-3"
            >
              <template v-slot:label>
                <span class="text-subtitle-2">Tipo de Persona *</span>
              </template>
              <v-radio label="Persona Natural" value="NATURAL"></v-radio>
              <v-radio label="Empresa" value="JURIDICA"></v-radio>
            </v-radio-group>

            <v-divider class="mb-3"></v-divider>

            <!-- Campos para Persona Natural -->
            <template v-if="nuevoCliente.tipoPersona === 'NATURAL'">
              <v-text-field
                v-model="nuevoCliente.nombre"
                label="Nombre *"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                :rules="[v => !!v || 'El nombre es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="nuevoCliente.apellido"
                label="Apellido *"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                class="mt-3"
                :rules="[v => !!v || 'El apellido es requerido']"
                required
              ></v-text-field>
            </template>

            <!-- Campos para Persona Jurídica -->
            <template v-else>
              <v-text-field
                v-model="nuevoCliente.razonSocial"
                label="Razón Social *"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                density="compact"
                hint="Nombre legal de la empresa"
                persistent-hint
                :rules="[v => !!v || 'La razón social es requerida']"
                required
              ></v-text-field>

              <v-text-field
                v-model="nuevoCliente.nombreComercial"
                label="Nombre Comercial"
                prepend-inner-icon="mdi-store"
                variant="outlined"
                density="compact"
                class="mt-3"
                hint="Nombre con el que opera"
                persistent-hint
              ></v-text-field>

              <v-text-field
                v-model="nuevoCliente.representanteLegal"
                label="Representante Legal"
                prepend-inner-icon="mdi-account-tie"
                variant="outlined"
                density="compact"
                class="mt-3"
              ></v-text-field>
            </template>

            <!-- Tipo y Número de Documento -->
            <v-select
              v-model="nuevoCliente.tipoDocumento"
              :items="tiposDocumento"
              label="Tipo de Documento"
              prepend-inner-icon="mdi-card-account-details"
              variant="outlined"
              density="compact"
              class="mt-3"
            ></v-select>

            <v-text-field
              v-model="nuevoCliente.numeroDocumento"
              label="Número de Documento"
              prepend-inner-icon="mdi-numeric"
              variant="outlined"
              density="compact"
              class="mt-3"
              :hint="getDocumentoHint()"
              persistent-hint
            ></v-text-field>

            <v-text-field
              v-model="nuevoCliente.telefono"
              label="Teléfono"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              density="compact"
              class="mt-3"
            ></v-text-field>

            <v-text-field
              v-model="nuevoCliente.email"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              density="compact"
              type="email"
              class="mt-3"
            ></v-text-field>

            <v-textarea
              v-model="nuevoCliente.direccion"
              label="Dirección"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              density="compact"
              rows="2"
              class="mt-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showClienteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="crearCliente"
            :loading="creandoCliente"
            prepend-icon="mdi-content-save"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="showNotification"
      :color="notificationColor"
      :timeout="3000"
      location="top"
    >
      {{ notificationMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showNotification = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useDisplay } from 'vuetify';
import { useMesaStore } from "@/stores/mesaStore";
import { usePedidoStore } from "@/stores/pedidoStore";
import { useProductoStore } from "@/stores/productoStore";
import { useCategoriaStore } from "@/stores/categoriaStore";
import { useEmpresaStore } from "@/stores/empresaStore";
import { useClienteStore } from "@/stores/clienteStore";
import type { Mesa } from "@/types/mesa";
import type { Pedido } from "@/types/pedido";
import type { Producto } from "@/types/producto";
import type { DetallePedido } from "@/types/detallePedido";
import { EstadoPedido, TipoServicio, EstadoMesa, EstadoDetallePedido } from "@/types/enums";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import PaymentMethodDialog from "@/components/pos/PaymentMethodDialog.vue";

interface Props {
  mesaId: number | null;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["close-panel", "order-updated"]);

// Vuetify display
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

// Stores
const mesaStore = useMesaStore();
const pedidoStore = usePedidoStore();
const productoStore = useProductoStore();
const categoriaStore = useCategoriaStore();
const empresaStore = useEmpresaStore();
const clienteStore = useClienteStore();

// State
const isVisible = ref(props.visible);
const currentPedido = ref<Pedido | null>(null);
const originalCantidades = ref<Map<number, number>>(new Map()); // Rastrear cantidades originales
const productosEliminados = ref<Set<number>>(new Set()); // Rastrear productos eliminados para persistir en "Actualizar Pedido"
const searchProduct = ref("");
const selectedCategory = ref<number | "all">("all");
const orderObservaciones = ref("");
const loading = ref(false);

// Mobile UI state
const mobileTab = ref<'productos' | 'carrito'>('productos');
const showSearchMobile = ref(false);

// Cliente state
const selectedClienteId = ref<number | null>(null);
const showClienteDialog = ref(false);
const creandoCliente = ref(false);
const clienteForm = ref<any>(null);
const nuevoCliente = ref({
  tipoPersona: 'NATURAL' as 'NATURAL' | 'JURIDICA',
  nombre: '',
  apellido: '',
  tipoDocumento: undefined as 'DNI' | 'RUC' | 'CARNET_EXTRANJERIA' | 'PASAPORTE' | 'SIN_DOCUMENTO' | undefined,
  numeroDocumento: '',
  telefono: '',
  email: '',
  direccion: '',
  // Persona Jurídica
  razonSocial: '',
  nombreComercial: '',
  representanteLegal: ''
});

const tiposDocumento = [
  { title: 'DNI', value: 'DNI' },
  { title: 'RUC', value: 'RUC' },
  { title: 'Carnet de Extranjería', value: 'CARNET_EXTRANJERIA' },
  { title: 'Pasaporte', value: 'PASAPORTE' },
  { title: 'Sin Documento', value: 'SIN_DOCUMENTO' }
];

// Dialog states
const showCancelDialog = ref(false);
const showFinalizeDialog = ref(false);
const showRemoveItemDialog = ref(false);
const showPaymentDialog = ref(false);
const itemToRemove = ref<DetallePedido | null>(null);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationColor = ref("success");

// Computed
const selectedMesa = computed<Mesa | undefined>(() => {
  return mesaStore.mesas.find((m) => m.idMesa === props.mesaId);
});

const categoryOptions = computed(() => [
  { title: "Todas las categorías", value: "all" },
  ...categoriaStore.categorias.map((cat) => ({
    title: cat.nombre,
    value: cat.idCategoria,
  })),
]);

const filteredProducts = computed(() => {
  let products = productoStore.productos;

  if (selectedCategory.value && selectedCategory.value !== "all") {
    products = products.filter(
      (p) => p.categoria.idCategoria === selectedCategory.value
    );
  }

  if (searchProduct.value) {
    const searchTerm = searchProduct.value.toLowerCase();
    products = products.filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm)
    );
  }

  return products;
});

const hasItems = computed(() => {
  return (currentPedido.value?.detalles?.length || 0) > 0;
});

const selectedCliente = computed(() => {
  if (!selectedClienteId.value) return null;
  return clienteStore.clientes.find(c => c.idCliente === selectedClienteId.value);
});

// Watch para sincronizar la visibilidad
watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal;
    if (newVal && props.mesaId) {
      loadPedidoForMesa(props.mesaId);
    } else {
      resetPanel();
    }
  }
);

// Watch para cerrar el panel cuando se cierre el diálogo de pago
// (después de que el usuario descargue el comprobante)
watch(showPaymentDialog, (newVal, oldVal) => {
  // Si el diálogo de pago se cierra después de estar abierto
  if (oldVal === true && newVal === false) {
    console.log('💳 [OrderPanel] Diálogo de pago cerrado, cerrando panel...');
    // Dar un pequeño delay para que se vea la transición
    setTimeout(() => {
      closePanel();
    }, 300);
  }
});

// Watch para cerrar búsqueda al cambiar de tab
watch(mobileTab, () => {
  showSearchMobile.value = false;
});

onMounted(async () => {
  productoStore.fetchProductos();
  categoriaStore.fetchCategorias();
  clienteStore.fetchClientes(); // Cargar lista de clientes
  // Cargar configuración de empresa
  try {
    await empresaStore.cargarValidacion();
    console.log('✅ Configuración de empresa cargada en OrderPanel');
  } catch (error) {
    console.error('❌ Error al cargar configuración de empresa:', error);
  }
});

// Methods
const loadPedidoForMesa = async (mesaId: number) => {
  if (!selectedMesa.value) return;

  console.log(
    "🔍 Loading pedido for mesa:",
    mesaId,
    selectedMesa.value.ultimoPedido
  );

  loading.value = true;
  try {
    // Verificar si la mesa ya tiene un pedido activo según la información detallada
    if (selectedMesa.value.ultimoPedido) {
      console.log(
        "✅ Mesa has active order, loading details for pedido ID:",
        selectedMesa.value.ultimoPedido.idPedido
      );

      // Cargar el pedido completo usando su ID
      const result = await pedidoStore.fetchPedidoPorId(
        selectedMesa.value.ultimoPedido.idPedido
      );

      if (result) {
        currentPedido.value = result as any;
        orderObservaciones.value = result.observaciones || "";

        // Guardar cantidades originales para detectar cambios
        originalCantidades.value.clear();
        productosEliminados.value.clear(); // Limpiar productos eliminados
        result.detalles?.forEach((detalle: any) => {
          // El backend devuelve idDetalle en DetallePedidoResponseDTO
          const detalleId = detalle.idDetalle || detalle.idDetallePedido;
          if (detalleId) {
            originalCantidades.value.set(detalleId, detalle.cantidad);
          }
        });

        console.log(
          "✅ Order loaded successfully with",
          result.detalles?.length || 0,
          "items"
        );
        console.log("📊 Cantidades originales guardadas:", originalCantidades.value);

        showSuccess("Pedido cargado exitosamente");
      } else {
        console.log("❌ Could not load order");
        showError("No se pudo cargar el pedido");
      }
    } else {
      console.log("ℹ️ No active order, initializing new...");
      // Si no hay pedido activo, inicializar uno nuevo para la UI
      initializeNewOrder();
    }
  } catch (error) {
    console.error("❌ Error loading order:", error);
    showError("Error al cargar información del pedido");
  } finally {
    loading.value = false;
  }
};

const initializeNewOrder = () => {
  console.log("🆕 [DEBUG] Inicializando nuevo pedido");
  console.log("🆕 [DEBUG] Mesa seleccionada:", selectedMesa.value);

  if (!selectedMesa.value) {
    console.log("❌ [DEBUG] No hay mesa seleccionada para inicializar");
    return;
  }

  currentPedido.value = {
    idPedido: 0, // Temporal, el backend asignará uno real
    mesa: {
      idMesa: selectedMesa.value.idMesa,
      numeroMesa: selectedMesa.value.numeroMesa,
      capacidad: selectedMesa.value.capacidad,
      estado: selectedMesa.value.estado,
      fechaCreacion: selectedMesa.value.fechaCreacion,
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
  orderObservaciones.value = "";

  console.log("🆕 [DEBUG] Pedido inicializado:", currentPedido.value);
};

const addProductToOrder = async (product: Producto) => {
  console.log("🛒 [DEBUG] Iniciando addProductToOrder");
  console.log("🛒 [DEBUG] Producto:", product);
  console.log("🛒 [DEBUG] currentPedido antes:", currentPedido.value);

  if (!currentPedido.value || !selectedMesa.value || loading.value) {
    console.log("❌ [DEBUG] Validación fallida en addProductToOrder");
    return;
  }

  // SIEMPRE agregar localmente, sin importar si es nuevo o existente
  // Verificar si el producto ya está en el pedido
  const existingDetalle = currentPedido.value.detalles?.find(
    (d) => d.producto.idProducto === product.idProducto
  );

  if (existingDetalle) {
    console.log("🔄 [DEBUG] Producto existe, incrementando cantidad");
    existingDetalle.cantidad += 1;
    console.log("🔄 [DEBUG] Nueva cantidad:", existingDetalle.cantidad);
    showSuccess(`Cantidad de ${product.nombre} aumentada`);
  } else {
    console.log("➕ [DEBUG] Producto nuevo, agregando al pedido");
    const newDetalle = {
      idDetallePedido: currentPedido.value.idPedido === 0 ? Date.now() : 0, // ID temporal para nuevos, 0 para existentes
      producto: {
        idProducto: product.idProducto,
        nombre: product.nombre,
      },
      cantidad: 1,
      precioUnitario: product.precio,
      observaciones: "",
      estado: "PEDIDO" as any,
    };

    console.log("➕ [DEBUG] Nuevo detalle:", newDetalle);

    if (!currentPedido.value.detalles) {
      currentPedido.value.detalles = [];
    }
    currentPedido.value.detalles.push(newDetalle);
    console.log(
      "➕ [DEBUG] Total productos en pedido:",
      currentPedido.value.detalles.length
    );
    showSuccess(`${product.nombre} agregado al carrito`);
  }

  // Recalcular totales localmente
  console.log("💰 [DEBUG] Recalculando totales");
  recalculateTotals();
  console.log(
    "💰 [DEBUG] Pedido después de recalcular:",
    currentPedido.value
  );

  // En móvil, cambiar brevemente al tab de carrito para feedback visual
  if (isMobile.value && !existingDetalle) {
    setTimeout(() => {
      mobileTab.value = 'carrito';
      setTimeout(() => {
        mobileTab.value = 'productos';
      }, 800);
    }, 100);
  }
};

const updateDetalleCantidad = async (
  detalle: DetallePedido,
  change: number
) => {
  if (!currentPedido.value) return;

  const newCantidad = detalle.cantidad + change;

  if (newCantidad <= 0) {
    confirmRemoveDetalle(detalle);
    return;
  }

  // Para pedidos temporales (idPedido === 0), actualizar localmente
  if (currentPedido.value.idPedido === 0) {
    detalle.cantidad = newCantidad;
    // detalle.subtotal = detalle.cantidad * detalle.precioUnitario; // Calculated dynamically
    recalculateTotals();
    return;
  }

  // Para pedidos existentes, usar API
  loading.value = true;
  try {
    // TODO: Implementar endpoint correcto para actualizar cantidad
    // Por ahora actualizamos localmente
    detalle.cantidad = newCantidad;
    // detalle.subtotal = detalle.cantidad * detalle.precioUnitario; // Calculated dynamically
    recalculateTotals();
    showSuccess("Cantidad actualizada");
  } catch (error) {
    showError("Error al actualizar cantidad");
  } finally {
    loading.value = false;
  }
};

const confirmRemoveDetalle = (detalle: DetallePedido) => {
  // Validar si el producto puede eliminarse según su estado
  if (!canRemoveDetalle(detalle)) {
    const estadoTexto = getDetalleEstadoTexto(detalle.estado);
    if (detalle.estado === EstadoDetallePedido.EN_PREPARACION) {
      showError(`No puedes eliminar "${detalle.producto.nombre}" porque está en cocina (${estadoTexto})`);
    } else if (detalle.estado === EstadoDetallePedido.SERVIDO) {
      showError(`No puedes eliminar "${detalle.producto.nombre}" porque ya fue servido (${estadoTexto})`);
    } else {
      showError(`No puedes eliminar "${detalle.producto.nombre}" en estado ${estadoTexto}`);
    }
    return;
  }

  itemToRemove.value = detalle;
  showRemoveItemDialog.value = true;
};

const removeDetalle = async () => {
  if (!currentPedido.value || !itemToRemove.value) return;

  const detalleId = (itemToRemove.value as any).idDetalle || itemToRemove.value.idDetallePedido;

  // Para pedidos temporales Y existentes, eliminar localmente (OPCIÓN A)
  // La persistencia se hará cuando se presione "Actualizar Pedido"
  currentPedido.value.detalles =
    currentPedido.value.detalles?.filter(
      (d) => {
        const currentDetalleId = (d as any).idDetalle || d.idDetallePedido;
        return currentDetalleId !== detalleId;
      }
    ) || [];

  // Si es un pedido existente con idDetalle real, marcar para eliminación
  if (currentPedido.value.idPedido !== 0 && detalleId && detalleId !== 0) {
    productosEliminados.value.add(detalleId);
    console.log(`🗑️ [DEBUG] Producto marcado para eliminación. ID: ${detalleId}`);
    console.log(`🗑️ [DEBUG] Total productos marcados para eliminar: ${productosEliminados.value.size}`);
  }

  recalculateTotals();
  showSuccess("Producto eliminado del carrito. Presiona 'Actualizar Pedido' para confirmar");
  showRemoveItemDialog.value = false;
  itemToRemove.value = null;
};

const recalculateTotals = () => {
  if (!currentPedido.value) return;

  let subtotal = 0;
  currentPedido.value.detalles?.forEach((d) => {
    subtotal += d.cantidad * d.precioUnitario;
  });

  // Usar configuración de empresa para calcular IGV
  let impuestos = 0;
  if (empresaStore.aplicaIgv) {
    impuestos = subtotal * (empresaStore.porcentajeIgv / 100);
  }

  const descuento = 0;
  const total = subtotal + impuestos - descuento;

  currentPedido.value.subtotal = subtotal;
  currentPedido.value.impuestos = impuestos;
  currentPedido.value.descuento = descuento;
  currentPedido.value.total = total;

  console.log('💰 Totales recalculados:', {
    subtotal,
    igv: impuestos,
    total,
    aplicaIgv: empresaStore.aplicaIgv,
    porcentajeIgv: empresaStore.porcentajeIgv
  });
};

const confirmFinalizeOrder = () => {
  console.log("🚀 [DEBUG] Iniciando confirmFinalizeOrder");
  console.log("🚀 [DEBUG] hasItems:", hasItems.value);
  console.log("🚀 [DEBUG] currentPedido:", currentPedido.value);

  if (!hasItems.value) {
    console.log("❌ [DEBUG] No hay items en el pedido");
    showError("Agrega productos antes de finalizar el pedido");
    return;
  }
  console.log("✅ [DEBUG] Mostrando diálogo de confirmación");
  showFinalizeDialog.value = true;
};

const finalizeOrder = async () => {
  console.log("🔥 [DEBUG] Iniciando finalizeOrder");
  console.log("🔥 [DEBUG] currentPedido:", currentPedido.value);
  console.log("🔥 [DEBUG] loading:", loading.value);

  if (!currentPedido.value || loading.value) {
    console.log("❌ [DEBUG] No hay pedido o está cargando, saliendo");
    return;
  }

  loading.value = true;
  console.log("🔥 [DEBUG] Loading activado");

  try {
    if (currentPedido.value.idPedido === 0) {
      console.log("🆕 [DEBUG] Creando pedido nuevo");
      // Si es un pedido nuevo, crearlo primero
      if (!selectedMesa.value) {
        console.log("❌ [DEBUG] No hay mesa seleccionada");
        return;
      }

      const pedidoCompleto: any = {
        idMesa: selectedMesa.value.idMesa,
        idEmpleado: 1, // TODO: Obtener del contexto de usuario logueado
        tipoServicio: "MESA",
        observaciones: orderObservaciones.value || "",
        detalles:
          currentPedido.value.detalles?.map((d) => ({
            idProducto: d.producto.idProducto,
            cantidad: d.cantidad,
            observaciones: d.observaciones || "",
          })) || [],
      };

      // Agregar cliente si está seleccionado
      if (selectedClienteId.value) {
        pedidoCompleto.idCliente = selectedClienteId.value;
        console.log("👤 [DEBUG] Cliente agregado al pedido:", selectedClienteId.value);
      }

      console.log("📋 [DEBUG] Datos del pedido a crear:", pedidoCompleto);
      console.log(
        "📋 [DEBUG] Número de productos:",
        pedidoCompleto.detalles.length
      );

      const result = await pedidoStore.crearPedidoCompleto(pedidoCompleto);
      console.log("📤 [DEBUG] Resultado de crearPedidoCompleto:", result);

      if (result.success) {
        console.log("✅ [DEBUG] Pedido creado exitosamente");
        showSuccess("Pedido creado exitosamente");
        emit("order-updated");
        closePanel();
      } else {
        console.log("❌ [DEBUG] Error al crear pedido:", result.error);
        showError(result.error || "Error al crear pedido");
      }
    } else {
      console.log("🔄 [DEBUG] Actualizando pedido existente");

      // 1. Identificar productos nuevos (idDetallePedido === 0)
      const productosNuevos = currentPedido.value.detalles?.filter(
        (d) => d.idDetallePedido === 0
      ) || [];

      // 2. Identificar productos con cantidades modificadas
      const productosConCantidadModificada = currentPedido.value.detalles?.filter(
        (d: any) => {
          const detalleId = d.idDetalle || d.idDetallePedido;
          if (!detalleId || detalleId === 0) return false;
          const cantidadOriginal = originalCantidades.value.get(detalleId);
          return cantidadOriginal !== undefined && cantidadOriginal !== d.cantidad;
        }
      ) || [];

      console.log("📋 [DEBUG] Productos nuevos a agregar:", productosNuevos.length);
      console.log("📋 [DEBUG] Productos con cantidades modificadas:", productosConCantidadModificada.length);
      console.log("🗑️ [DEBUG] Productos marcados para eliminar:", productosEliminados.value.size);

      if (productosNuevos.length === 0 && productosConCantidadModificada.length === 0 && productosEliminados.value.size === 0) {
        showError("No hay cambios para actualizar");
        return;
      }

      let todosExitosos = true;
      let contadorAgregados = 0;
      let contadorActualizados = 0;
      let contadorEliminados = 0;

      // 3. Eliminar productos marcados PRIMERO
      if (productosEliminados.value.size > 0) {
        for (const detalleId of productosEliminados.value) {
          console.log(`🗑️ [DEBUG] Eliminando producto con ID: ${detalleId}`);

          const result = await pedidoStore.eliminarProductoDePedido(
            currentPedido.value.idPedido,
            detalleId
          );

          if (result.success) {
            console.log(`✅ [DEBUG] Producto ${detalleId} eliminado exitosamente`);
            contadorEliminados++;
          } else {
            console.log(`❌ [DEBUG] Error al eliminar producto ${detalleId}:`, result.error);
            todosExitosos = false;
            showError(`Error al eliminar producto: ${result.error}`);
            break;
          }
        }
      }

      // 4. Agregar productos nuevos
      for (const detalle of productosNuevos) {
        console.log(`📤 [DEBUG] Agregando producto ${contadorAgregados + 1}/${productosNuevos.length}:`, detalle.producto.nombre);

        const result = await pedidoStore.agregarProductoAPedido(
          currentPedido.value.idPedido,
          {
            idProducto: detalle.producto.idProducto,
            cantidad: detalle.cantidad,
            observaciones: detalle.observaciones || "",
          }
        );

        if (result.success) {
          console.log(`✅ [DEBUG] Producto ${detalle.producto.nombre} agregado exitosamente`);
          contadorAgregados++;
        } else {
          console.log(`❌ [DEBUG] Error al agregar ${detalle.producto.nombre}:`, result.error);
          todosExitosos = false;
          showError(`Error al agregar ${detalle.producto.nombre}: ${result.error}`);
          break;
        }
      }

      // 5. Actualizar cantidades de productos existentes (solo si no hubo errores)
      if (todosExitosos && productosConCantidadModificada.length > 0) {
        for (const detalle of productosConCantidadModificada) {
          const detalleId = (detalle as any).idDetalle || (detalle as any).idDetallePedido;
          const cantidadOriginal = originalCantidades.value.get(detalleId!);
          console.log(`🔄 [DEBUG] Actualizando cantidad de ${detalle.producto.nombre}: ${cantidadOriginal} → ${detalle.cantidad}`);

          const result = await pedidoStore.actualizarCantidadProductoEnPedido(
            currentPedido.value.idPedido,
            detalleId!,
            detalle.cantidad
          );

          if (result.success) {
            console.log(`✅ [DEBUG] Cantidad de ${detalle.producto.nombre} actualizada exitosamente`);
            contadorActualizados++;
          } else {
            console.log(`❌ [DEBUG] Error al actualizar cantidad de ${detalle.producto.nombre}:`, result.error);
            todosExitosos = false;
            showError(`Error al actualizar ${detalle.producto.nombre}: ${result.error}`);
            break;
          }
        }
      }

      // 6. Mostrar resultado final
      if (todosExitosos) {
        const mensajes: string[] = [];
        if (contadorEliminados > 0) {
          mensajes.push(`${contadorEliminados} producto${contadorEliminados > 1 ? 's' : ''} eliminado${contadorEliminados > 1 ? 's' : ''}`);
        }
        if (contadorAgregados > 0) {
          mensajes.push(`${contadorAgregados} producto${contadorAgregados > 1 ? 's' : ''} agregado${contadorAgregados > 1 ? 's' : ''}`);
        }
        if (contadorActualizados > 0) {
          mensajes.push(`${contadorActualizados} cantidad${contadorActualizados > 1 ? 'es' : ''} actualizada${contadorActualizados > 1 ? 's' : ''}`);
        }

        // Limpiar productos eliminados después de persistir
        productosEliminados.value.clear();

        console.log(`✅ [DEBUG] Pedido actualizado: ${mensajes.join(', ')}`);
        showSuccess(`Pedido actualizado: ${mensajes.join(', ')}`);
        emit("order-updated");
        closePanel();
      } else {
        console.log(`⚠️ [DEBUG] Actualización parcial: ${contadorEliminados} eliminados, ${contadorAgregados} agregados, ${contadorActualizados} actualizados`);
      }
    }
  } catch (error) {
    console.error("💥 [DEBUG] Error en finalizeOrder:", error);
    showError("Error al finalizar pedido");
  } finally {
    console.log("🏁 [DEBUG] Finalizando finalizeOrder");
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
    const result = await pedidoStore.actualizarPedido(
      currentPedido.value.idPedido,
      {
        estado: EstadoPedido.CANCELADO,
      }
    );

    if (result.success) {
      showSuccess("Pedido cancelado");
      if (selectedMesa.value) {
        await mesaStore.cambiarEstadoMesa(
          selectedMesa.value.idMesa,
          EstadoMesa.DISPONIBLE
        );
      }
      emit("order-updated");
      closePanel();
    } else {
      showError(result.error || "Error al cancelar pedido");
    }
  } catch (error) {
    showError("Error al cancelar pedido");
  } finally {
    loading.value = false;
    showCancelDialog.value = false;
  }
};

const resetPanel = () => {
  currentPedido.value = null;
  orderObservaciones.value = "";
  searchProduct.value = "";
  selectedCategory.value = "all";
};

const closePanel = () => {
  isVisible.value = false;
  resetPanel();
  emit("close-panel");
};

// Utility methods
const isProductInOrder = (productId: number) => {
  return (
    currentPedido.value?.detalles?.some(
      (d) => d.producto.idProducto === productId
    ) || false
  );
};

const getProductQuantity = (productId: number): number => {
  const detalle = currentPedido.value?.detalles?.find(
    (d) => d.producto.idProducto === productId
  );
  return detalle?.cantidad || 0;
};

const getPedidoEstadoColor = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO:
      return "primary";
    case EstadoPedido.ATENDIDO:
      return "warning";
    case EstadoPedido.PAGADO:
      return "success";
    case EstadoPedido.CANCELADO:
      return "error";
    // Estados legacy
    case EstadoPedido.PENDIENTE:
      return "orange";
    case EstadoPedido.EN_PREPARACION:
      return "blue";
    case EstadoPedido.LISTO:
      return "green";
    case EstadoPedido.ENTREGADO:
      return "success";
    default:
      return "grey";
  }
};

const getPedidoEstadoTexto = (estado: EstadoPedido) => {
  switch (estado) {
    case EstadoPedido.ABIERTO:
      return "Mesa Abierta";
    case EstadoPedido.ATENDIDO:
      return "Atendido";
    case EstadoPedido.PAGADO:
      return "Pagado";
    case EstadoPedido.CANCELADO:
      return "Cancelado";
    // Estados legacy
    case EstadoPedido.PENDIENTE:
      return "Pendiente";
    case EstadoPedido.EN_PREPARACION:
      return "Preparando";
    case EstadoPedido.LISTO:
      return "Listo";
    case EstadoPedido.ENTREGADO:
      return "Entregado";
    default:
      return "Desconocido";
  }
};

// Funciones para estado de detalle de pedido
const getDetalleEstadoColor = (estado: EstadoDetallePedido) => {
  switch (estado) {
    case EstadoDetallePedido.PEDIDO:
      return 'info';
    case EstadoDetallePedido.EN_PREPARACION:
      return 'warning';
    case EstadoDetallePedido.SERVIDO:
      return 'success';
    case EstadoDetallePedido.CANCELADO:
      return 'error';
    // Estados legacy
    case EstadoDetallePedido.PENDIENTE:
      return 'orange';
    case EstadoDetallePedido.LISTO:
      return 'green';
    case EstadoDetallePedido.ENTREGADO:
      return 'success';
    default:
      return 'grey';
  }
};

const getDetalleEstadoTexto = (estado: EstadoDetallePedido) => {
  switch (estado) {
    case EstadoDetallePedido.PEDIDO:
      return 'Pedido';
    case EstadoDetallePedido.EN_PREPARACION:
      return 'En Cocina';
    case EstadoDetallePedido.SERVIDO:
      return 'Servido';
    case EstadoDetallePedido.CANCELADO:
      return 'Cancelado';
    // Estados legacy
    case EstadoDetallePedido.PENDIENTE:
      return 'Pendiente';
    case EstadoDetallePedido.LISTO:
      return 'Listo';
    case EstadoDetallePedido.ENTREGADO:
      return 'Entregado';
    default:
      return 'Desconocido';
  }
};

// Validar si un producto puede eliminarse según su estado
const canRemoveDetalle = (detalle: DetallePedido): boolean => {
  // Solo se pueden eliminar productos en estado PEDIDO
  return detalle.estado === EstadoDetallePedido.PEDIDO ||
         detalle.estado === EstadoDetallePedido.PENDIENTE; // legacy
};

const showSuccess = (message: string) => {
  notificationMessage.value = message;
  notificationColor.value = "success";
  showNotification.value = true;
};

const showError = (message: string) => {
  notificationMessage.value = message;
  notificationColor.value = "error";
  showNotification.value = true;
};

// Nuevos métodos para el flujo de restaurante
const marcarComoAtendido = async () => {
  if (!currentPedido.value || loading.value) return;

  // Validar que todos los productos estén en estado SERVIDO
  const todosServidos = currentPedido.value.detalles?.every(
    (detalle) => detalle.estado === EstadoDetallePedido.SERVIDO
  );

  if (!todosServidos) {
    // Contar cuántos productos faltan por servir
    const pendientesDeServir = currentPedido.value.detalles?.filter(
      (detalle) => detalle.estado !== EstadoDetallePedido.SERVIDO
    ) || [];

    const estadosCount = {
      PEDIDO: 0,
      EN_PREPARACION: 0,
      LISTO: 0,
      SERVIDO: 0,
    };

    pendientesDeServir.forEach((detalle) => {
      const estado = detalle.estado;
      if (estado === EstadoDetallePedido.PEDIDO) estadosCount.PEDIDO++;
      else if (estado === EstadoDetallePedido.EN_PREPARACION) estadosCount.EN_PREPARACION++;
      else if (estado === EstadoDetallePedido.LISTO) estadosCount.LISTO++;
    });

    const mensajes: string[] = [];
    if (estadosCount.PEDIDO > 0) mensajes.push(`${estadosCount.PEDIDO} pendiente${estadosCount.PEDIDO > 1 ? 's' : ''}`);
    if (estadosCount.EN_PREPARACION > 0) mensajes.push(`${estadosCount.EN_PREPARACION} en cocina`);
    if (estadosCount.LISTO > 0) mensajes.push(`${estadosCount.LISTO} listo${estadosCount.LISTO > 1 ? 's' : ''} para servir`);

    showError(
      `No se puede marcar como atendido. ${pendientesDeServir.length} producto${pendientesDeServir.length > 1 ? 's' : ''} sin servir: ${mensajes.join(', ')}`
    );
    return;
  }

  loading.value = true;
  try {
    const result = await pedidoStore.actualizarPedido(
      currentPedido.value.idPedido,
      {
        estado: EstadoPedido.ATENDIDO,
      }
    );

    if (result.success) {
      currentPedido.value.estado = EstadoPedido.ATENDIDO;
      showSuccess("Mesa marcada como atendida");
      emit("order-updated");
    } else {
      showError(result.error || "Error al marcar como atendido");
    }
  } catch (error) {
    showError("Error al marcar como atendido");
  } finally {
    loading.value = false;
  }
};

const confirmarPago = () => {
  if (!currentPedido.value || loading.value) return;

  // Verificar que el pedido tiene items
  if (!currentPedido.value.detalles || currentPedido.value.detalles.length === 0) {
    showError("No hay productos en el pedido para procesar el pago");
    return;
  }

  // Verificar que el pedido tiene total
  if (!currentPedido.value.total || currentPedido.value.total <= 0) {
    showError("El total del pedido debe ser mayor a 0");
    return;
  }

  // Mostrar el diálogo de selección de método de pago
  showPaymentDialog.value = true;
};

// Manejadores de eventos del diálogo de pago
const onPagoCompletado = (pagoResponse: any) => {
  console.log('✅ Pago completado:', pagoResponse);

  showSuccess(`Pago procesado exitosamente. Método: ${pagoResponse.metodoPago.nombre}`);

  // El backend automáticamente:
  // 1. Cambia el estado del pedido a PAGADO
  // 2. Libera la mesa si es de tipo MESA

  emit("order-updated");

  // NO cerrar el panel automáticamente para permitir descargar el comprobante
  // El usuario cerrará manualmente el diálogo de pago después de descargar
  // closePanel();
};

const onPagoError = (error: string) => {
  console.error('❌ Error en pago:', error);
  showError(error);
};

// Helper para hint de documento
const getDocumentoHint = () => {
  switch (nuevoCliente.value.tipoDocumento) {
    case 'DNI':
      return 'DNI: 8 dígitos';
    case 'RUC':
      return 'RUC: 11 dígitos';
    case 'CARNET_EXTRANJERIA':
      return 'Carnet de Extranjería';
    case 'PASAPORTE':
      return 'Número de Pasaporte';
    default:
      return 'Ingrese el número de documento';
  }
};

// Helper para subtitle del cliente en el autocomplete
const getClienteSubtitle = (cliente: any) => {
  const parts: string[] = [];

  // Agregar tipo de documento y número si existe
  if (cliente.tipoDocumento && cliente.numeroDocumento) {
    parts.push(`${cliente.tipoDocumento}: ${cliente.numeroDocumento}`);
  } else if (cliente.numeroDocumento) {
    parts.push(cliente.numeroDocumento);
  }

  // Agregar teléfono si existe
  if (cliente.telefono) {
    parts.push(cliente.telefono);
  }

  // Agregar email si existe y no hay otros datos
  if (cliente.email && parts.length === 0) {
    parts.push(cliente.email);
  }

  return parts.length > 0 ? parts.join(' • ') : 'Sin información adicional';
};

// Crear nuevo cliente
const crearCliente = async () => {
  // Validar según tipo de persona
  if (nuevoCliente.value.tipoPersona === 'NATURAL') {
    if (!nuevoCliente.value.nombre?.trim()) {
      showError('El nombre es requerido');
      return;
    }
    if (!nuevoCliente.value.apellido?.trim()) {
      showError('El apellido es requerido');
      return;
    }
  } else {
    // JURIDICA
    if (!nuevoCliente.value.razonSocial?.trim()) {
      showError('La razón social es requerida');
      return;
    }
  }

  creandoCliente.value = true;

  try {
    console.log('👤 [OrderPanel] Creando nuevo cliente:', nuevoCliente.value);

    // Preparar datos según tipo de persona
    const clienteData: any = {
      tipoPersona: nuevoCliente.value.tipoPersona,
      telefono: nuevoCliente.value.telefono?.trim() || undefined,
      email: nuevoCliente.value.email?.trim() || undefined,
      direccion: nuevoCliente.value.direccion?.trim() || undefined,
      tipoDocumento: nuevoCliente.value.tipoDocumento || undefined,
      numeroDocumento: nuevoCliente.value.numeroDocumento?.trim() || undefined
    };

    if (nuevoCliente.value.tipoPersona === 'NATURAL') {
      clienteData.nombre = nuevoCliente.value.nombre.trim();
      clienteData.apellido = nuevoCliente.value.apellido.trim();
    } else {
      // JURIDICA
      clienteData.nombre = nuevoCliente.value.razonSocial?.trim() || nuevoCliente.value.nombreComercial?.trim();
      clienteData.razonSocial = nuevoCliente.value.razonSocial.trim();
      clienteData.nombreComercial = nuevoCliente.value.nombreComercial?.trim() || undefined;
      clienteData.representanteLegal = nuevoCliente.value.representanteLegal?.trim() || undefined;
    }

    const result = await clienteStore.crearCliente(clienteData);

    if (result.success && result.data) {
      console.log('✅ [OrderPanel] Cliente creado exitosamente:', result.data);

      // Seleccionar el nuevo cliente automáticamente
      selectedClienteId.value = result.data.idCliente;

      // Limpiar formulario
      nuevoCliente.value = {
        tipoPersona: 'NATURAL',
        nombre: '',
        apellido: '',
        tipoDocumento: undefined,
        numeroDocumento: '',
        telefono: '',
        email: '',
        direccion: '',
        razonSocial: '',
        nombreComercial: '',
        representanteLegal: ''
      };

      // Cerrar diálogo
      showClienteDialog.value = false;

      showSuccess(`Cliente "${result.data.nombre}" creado exitosamente`);
    } else {
      // Mensaje de error mejorado
      const errorMsg = result.error || 'Error al crear el cliente';

      if (errorMsg.includes('403') || errorMsg.includes('Forbidden') || errorMsg.includes('Permisos')) {
        showError('⚠️ No tienes permisos para crear clientes. Contacta al administrador o selecciona un cliente existente.');
        console.error('❌ [OrderPanel] Error de permisos en backend. Verifica @PreAuthorize en ClienteController');
      } else {
        showError(errorMsg);
      }
    }
  } catch (error: any) {
    console.error('❌ [OrderPanel] Error al crear cliente:', error);

    // Mejorar mensaje de error
    if (error.response?.status === 403) {
      showError('⚠️ No tienes permisos para crear clientes. Por favor, selecciona un cliente existente de la lista.');
      console.error('❌ [OrderPanel] Error 403 del backend. Verifica la configuración de seguridad en ClienteController');
    } else {
      showError(error.message || 'Error inesperado al crear el cliente');
    }
  } finally {
    creandoCliente.value = false;
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

/* Mobile tabs styles */
.mobile-tabs {
  position: sticky;
  top: 0;
  z-index: 5;
}

.mobile-content {
  min-height: calc(100vh - 200px);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Mobile product grid */
.product-grid-mobile {
  margin: 0 -4px;
}

.product-card-mobile {
  cursor: pointer;
  transition: all 0.2s ease;
  height: 120px;
  border-radius: 12px !important;
}

.product-card-mobile:active {
  transform: scale(0.95);
}

.product-name-mobile {
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 4px 0;
  min-height: 28px;
}

.product-price-mobile {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

/* Mobile carrito tab */
.carrito-tab {
  padding-bottom: 80px !important;
}

.order-items-mobile {
  max-height: 45vh;
  overflow-y: auto;
}

.order-item-mobile {
  padding: 8px 12px !important;
  min-height: 60px;
}

.totals-card-mobile .v-card-text {
  padding: 12px !important;
}

/* FAB search button */
.fab-search-mobile {
  position: fixed !important;
  bottom: 80px !important;
  right: 16px !important;
  z-index: 100;
}

/* Responsive design */
@media (max-width: 1024px) {
  .product-selection {
    border-right: none;
    border-bottom: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
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

  .order-panel-card {
    min-height: 100vh;
  }

  .order-toolbar {
    padding: 8px 12px !important;
  }

  .product-selection {
    padding: 12px 8px !important;
  }

  .product-selection .pa-4 {
    padding: 12px !important;
  }

  .product-card {
    height: 110px;
  }

  .product-name {
    font-size: 0.7rem !important;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .order-items {
    max-height: 250px;
  }

  .order-actions {
    display: flex;
    gap: 6px;
    padding: 12px !important;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 10;
  }

  .order-actions .v-btn {
    min-width: 0 !important;
    padding: 0 8px !important;
  }

  .totals-card .v-card-text {
    padding: 12px !important;
    font-size: 0.875rem;
  }

  .totals-card .text-h6 {
    font-size: 1.1rem !important;
  }
}

@media (max-width: 400px) {
  .product-card {
    height: 100px;
  }

  .product-card-mobile {
    height: 110px;
  }

  .product-name {
    font-size: 0.65rem !important;
  }

  .product-name-mobile {
    font-size: 0.6rem !important;
  }

  .order-actions .v-btn {
    padding: 0 6px !important;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.order-item {
  animation: fadeIn 0.3s ease;
}
</style>
