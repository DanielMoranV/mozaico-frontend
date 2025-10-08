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
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="titulo-section">
            <h1 class="titulo-principal">Nuestra Carta Digital</h1>
            <p class="subtitulo">Descubre nuestros deliciosos productos</p>
          </div>

          <!-- QR Code -->
          <div v-if="qrUrl" class="qr-section">
            <v-card elevation="2" class="qr-card">
              <v-card-text class="text-center">
                <p class="qr-titulo">Comparte nuestra carta</p>
                <v-img
                  :src="qrUrl"
                  alt="QR Code de la Carta"
                  width="160"
                  height="160"
                  class="qr-image mx-auto"
                />
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  @click="compartirCarta"
                  prepend-icon="mdi-share-variant"
                  class="mt-2"
                >
                  Compartir
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </header>

      <!-- Buscador -->
      <div class="buscador-section">
        <v-text-field
          v-model="busqueda"
          placeholder="Buscar productos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          class="buscador-input"
        />
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
import { useCartaApi } from '@/composables/useCartaApi';
import ProductoCard from '@/components/carta/ProductoCard.vue';
import FiltrosCategorias from '@/components/carta/FiltrosCategorias.vue';
import type { ProductoCartaDTO, ProductosPorCategoria } from '@/types/cartaPublica';

const route = useRoute();
const { loading, error, obtenerCartaPorCategoria, obtenerUrlQR } = useCartaApi();

const productos = ref<ProductoCartaDTO[]>([]);
const categoriaSeleccionada = ref<number | 'todas'>('todas');
const busqueda = ref('');
const slug = ref('');

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
  background: linear-gradient(to bottom, #f5f5f5 0%, #ffffff 300px);
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
  padding: 2rem 1rem;
}

/* Header */
.header {
  margin-bottom: 2rem;
}

.header-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
}

.titulo-section {
  text-align: left;
}

.titulo-principal {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.subtitulo {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.qr-section {
  display: flex;
  justify-content: center;
}

.qr-card {
  border-radius: 12px;
}

.qr-titulo {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.qr-image {
  border-radius: 8px;
}

/* Buscador */
.buscador-section {
  margin-bottom: 1.5rem;
}

.buscador-input {
  max-width: 600px;
}

/* Categorías */
.categoria-section {
  margin-bottom: 3rem;
}

.categoria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #1976d2;
}

.categoria-titulo {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.categoria-descripcion {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Grid de Productos */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Sin resultados */
.sin-resultados {
  text-align: center;
  padding: 4rem 2rem;
}

.sin-resultados h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.sin-resultados p {
  color: #666;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .titulo-section {
    text-align: center;
  }

  .titulo-principal {
    font-size: 2rem;
  }

  .productos-grid {
    grid-template-columns: 1fr;
  }

  .categoria-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .categoria-titulo {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .titulo-principal {
    font-size: 1.75rem;
  }

  .contenido {
    padding: 1rem 0.5rem;
  }
}
</style>
