<template>
  <div class="carta-digital-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="loading-text">Cargando carta digital...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-icon size="100" color="error">mdi-alert-circle-outline</v-icon>
      <h2>¡Oops! Algo salió mal</h2>
      <p>{{ error }}</p>
      <v-btn
        color="primary"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="cargarCarta"
      >
        Reintentar
      </v-btn>
    </div>

    <!-- Contenido Principal -->
    <div v-else-if="productos.length > 0" class="contenido">
      <!-- Header mejorado -->
      <header class="header">
        <div class="header-content">
          <div class="titulo-section">
            <h1 class="titulo-principal">Nuestra Carta Digital</h1>
            <p class="subtitulo">Descubre nuestros deliciosos productos</p>
          </div>

          <!-- QR Code optimizado para móvil -->
          <div v-if="qrUrl" class="qr-section">
            <v-card elevation="4" class="qr-card">
              <v-card-text class="qr-card-content">
                <div class="qr-header">
                  <v-icon color="primary" size="20">mdi-qrcode</v-icon>
                  <span class="qr-titulo">Comparte nuestra carta</span>
                </div>
                <v-img
                  :src="qrUrl"
                  alt="QR Code de la Carta"
                  :width="qrImageSize"
                  :height="qrImageSize"
                  class="qr-image"
                />
                <v-btn
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="compartirCarta"
                  prepend-icon="mdi-share-variant"
                  block
                  class="qr-btn"
                >
                  Compartir
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </header>

      <!-- Buscador mejorado -->
      <div class="buscador-section">
        <v-text-field
          v-model="busqueda"
          placeholder="Buscar productos, ingredientes..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          class="buscador-input"
          :class="{ 'buscador-activo': busqueda }"
        >
          <template v-slot:append-inner v-if="busqueda">
            <v-chip size="x-small" color="primary" variant="tonal">
              {{ productosFiltrados.reduce((acc, g) => acc + g.productos.length, 0) }}
            </v-chip>
          </template>
        </v-text-field>
      </div>

      <!-- Filtros por Categorías -->
      <FiltrosCategorias
        v-if="categoriasConConteo.length > 0"
        :categorias="categoriasConConteo"
        :categoria-seleccionada="categoriaSeleccionada"
        :total-productos="productos.length"
        @update:categoria-seleccionada="categoriaSeleccionada = $event"
      />

      <!-- Productos Agrupados por Categoría -->
      <div class="productos-container">
        <div
          v-for="grupo in productosFiltrados"
          :key="grupo.categoria.idCategoria"
          class="categoria-section"
        >
          <div class="categoria-header">
            <h2 class="categoria-titulo">
              <v-icon color="primary" class="mr-2">mdi-food</v-icon>
              {{ grupo.categoria.nombre }}
            </h2>
            <v-chip size="small" color="primary" variant="tonal">
              {{ grupo.productos.length }} productos
            </v-chip>
          </div>

          <p v-if="grupo.categoria.descripcion" class="categoria-descripcion">
            {{ grupo.categoria.descripcion }}
          </p>

          <!-- Grid de Productos -->
          <div class="productos-grid">
            <ProductoCard
              v-for="producto in grupo.productos"
              :key="producto.idProducto"
              :producto="producto"
            />
          </div>
        </div>

        <!-- Sin resultados de búsqueda -->
        <div v-if="productosFiltrados.length === 0" class="sin-resultados">
          <v-icon size="100" color="grey-lighten-1">mdi-file-search-outline</v-icon>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros términos de búsqueda o selecciona otra categoría</p>
          <v-btn
            color="primary"
            variant="text"
            @click="limpiarFiltros"
          >
            Limpiar filtros
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <v-icon size="120" color="grey-lighten-1">mdi-food-off</v-icon>
      <h2>No hay productos disponibles</h2>
      <p>Por el momento no hay productos en nuestro menú</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useCartaApi } from '@/composables/useCartaApi';
import ProductoCard from '@/components/carta/ProductoCard.vue';
import FiltrosCategorias from '@/components/carta/FiltrosCategorias.vue';
import type { ProductoCartaDTO, ProductosPorCategoria } from '@/types/cartaPublica';

const route = useRoute();
const { mobile } = useDisplay();
const { loading, error, obtenerCartaPorCategoria, obtenerUrlQR } = useCartaApi();

const productos = ref<ProductoCartaDTO[]>([]);
const categoriaSeleccionada = ref<number | 'todas'>('todas');
const busqueda = ref('');
const slug = ref('');

// Tamaño del QR responsive
const qrImageSize = computed(() => mobile.value ? 140 : 160);

// Computed: Agrupar productos por categoría
const productosPorCategoria = computed<ProductosPorCategoria[]>(() => {
  const grupos = new Map<number, ProductosPorCategoria>();

  productos.value.forEach(producto => {
    const catId = producto.categoria.idCategoria;

    if (!grupos.has(catId)) {
      grupos.set(catId, {
        categoria: producto.categoria,
        productos: []
      });
    }

    grupos.get(catId)!.productos.push(producto);
  });

  return Array.from(grupos.values());
});

// Computed: Categorías con conteo
const categoriasConConteo = computed(() => {
  return productosPorCategoria.value.map(grupo => ({
    ...grupo.categoria,
    count: grupo.productos.length
  }));
});

// Computed: Productos filtrados
const productosFiltrados = computed(() => {
  let grupos = productosPorCategoria.value;

  // Filtrar por categoría
  if (categoriaSeleccionada.value !== 'todas') {
    grupos = grupos.filter(
      g => g.categoria.idCategoria === categoriaSeleccionada.value
    );
  }

  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase().trim();
    grupos = grupos.map(grupo => ({
      ...grupo,
      productos: grupo.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion?.toLowerCase().includes(termino) ||
        producto.ingredientes?.toLowerCase().includes(termino)
      )
    })).filter(grupo => grupo.productos.length > 0);
  }

  return grupos;
});

// Computed: URL del QR
const qrUrl = computed(() => {
  return slug.value ? obtenerUrlQR(slug.value) : null;
});

// Cargar carta al montar
onMounted(() => {
  cargarCarta();
});

async function cargarCarta() {
  slug.value = route.params.slug as string;

  if (!slug.value) {
    error.value = 'No se proporcionó un slug válido en la URL';
    return;
  }

  try {
    productos.value = await obtenerCartaPorCategoria(slug.value);
  } catch (err) {
    console.error('Error al cargar la carta:', err);
  }
}

function limpiarFiltros() {
  categoriaSeleccionada.value = 'todas';
  busqueda.value = '';
}

async function compartirCarta() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Nuestra Carta Digital',
        text: 'Descubre nuestros productos',
        url: url
      });
    } catch (err) {
      console.log('Error al compartir:', err);
    }
  } else {
    // Fallback: copiar al portapapeles
    navigator.clipboard.writeText(url);
    alert('Enlace copiado al portapapeles');
  }
}
</script>

<style scoped>
.carta-digital-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 400px);
  position: relative;
}

/* Patrón de fondo sutil */
.carta-digital-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(25, 118, 210, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.carta-digital-view > * {
  position: relative;
  z-index: 1;
}

/* Loading y Error States */
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #666;
}

.error-container h2,
.empty-state h2 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.error-container p,
.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

/* Contenido */
.contenido {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Header mejorado */
.header {
  margin-bottom: 2.5rem;
}

.header-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
}

.titulo-section {
  text-align: left;
}

.titulo-principal {
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.subtitulo {
  font-size: 1.15rem;
  color: #5f6368;
  margin: 0;
  font-weight: 400;
}

.qr-section {
  display: flex;
  justify-content: center;
}

.qr-card {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.qr-card-content {
  padding: 20px !important;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.qr-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.qr-titulo {
  font-size: 0.95rem;
  color: #5f6368;
  font-weight: 600;
}

.qr-image {
  border-radius: 12px;
  border: 3px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-btn {
  margin-top: 4px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Buscador mejorado */
.buscador-section {
  margin-bottom: 1.5rem;
  animation: slideDown 0.4s ease-out;
}

.buscador-input {
  max-width: 700px;
  transition: all 0.3s ease;
}

.buscador-input:deep(.v-field) {
  border-radius: 28px;
  font-size: 1rem;
}

.buscador-activo:deep(.v-field) {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

/* Categorías mejoradas */
.categoria-section {
  margin-bottom: 3.5rem;
  scroll-margin-top: 100px;
}

.categoria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid transparent;
  background: linear-gradient(to right, #1976d2, transparent) bottom;
  background-size: 100% 3px;
  background-repeat: no-repeat;
}

.categoria-titulo {
  font-size: 1.85rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.categoria-descripcion {
  color: #5f6368;
  font-size: 1rem;
  margin-bottom: 1.75rem;
  line-height: 1.6;
  font-weight: 400;
}

/* Grid de Productos mejorado */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Sin resultados mejorado */
.sin-resultados {
  text-align: center;
  padding: 5rem 2rem;
  animation: fadeIn 0.5s ease-out;
}

.sin-resultados h3 {
  margin: 1.5rem 0 0.75rem;
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 700;
}

.sin-resultados p {
  color: #5f6368;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

/* Animaciones */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive optimizado */
@media (max-width: 960px) {
  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .titulo-section {
    text-align: center;
  }

  .titulo-principal {
    font-size: 2.25rem;
  }

  .subtitulo {
    font-size: 1rem;
  }

  .qr-section {
    order: -1;
  }

  .contenido {
    padding: 1.5rem 1rem;
  }

  .buscador-input {
    max-width: 100%;
  }

  .productos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .categoria-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .categoria-titulo {
    font-size: 1.5rem;
  }

  .categoria-descripcion {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .header {
    margin-bottom: 2rem;
  }

  .titulo-principal {
    font-size: 1.85rem;
    letter-spacing: -0.3px;
  }

  .subtitulo {
    font-size: 0.95rem;
  }

  .contenido {
    padding: 1rem 0.75rem;
  }

  .categoria-section {
    margin-bottom: 2.5rem;
  }

  .sin-resultados {
    padding: 3rem 1.5rem;
  }

  .sin-resultados h3 {
    font-size: 1.25rem;
  }

  .sin-resultados p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .titulo-principal {
    font-size: 1.65rem;
  }

  .contenido {
    padding: 1rem 0.5rem;
  }

  .qr-card-content {
    padding: 16px !important;
  }

  .buscador-section {
    margin-bottom: 1rem;
  }
}

/* Mejora de accesibilidad táctil en móviles */
@media (hover: none) and (pointer: coarse) {
  .categoria-chip,
  .qr-btn,
  .buscador-input {
    min-height: 44px;
  }
}
</style>
