<template>
  <v-card class="producto-card" elevation="2" hover>
    <!-- Imagen del producto -->
    <div class="producto-imagen-container">
      <v-img
        v-if="producto.imagenUrl"
        :src="imagenUrl"
        :alt="producto.nombre"
        height="220"
        cover
        class="producto-imagen"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-img>
      <div v-else class="sin-imagen">
        <v-icon size="80" color="grey-lighten-1">mdi-silverware-fork-knife</v-icon>
      </div>

      <!-- Badges -->
      <div class="badges-container">
        <v-chip
          v-if="producto.esAlcoholico"
          size="small"
          color="orange"
          variant="flat"
          class="badge"
        >
          <v-icon start size="small">mdi-glass-wine</v-icon>
          +18
        </v-chip>
        <v-chip
          v-if="!producto.disponible"
          size="small"
          color="red"
          variant="flat"
          class="badge"
        >
          No disponible
        </v-chip>
      </div>
    </div>

    <!-- Contenido -->
    <v-card-text class="producto-info">
      <!-- Nombre -->
      <h3 class="producto-nombre">{{ producto.nombre }}</h3>

      <!-- Descripción -->
      <p v-if="producto.descripcion" class="producto-descripcion">
        {{ producto.descripcion }}
      </p>

      <!-- Ingredientes -->
      <div v-if="producto.ingredientes" class="ingredientes-section">
        <v-icon size="small" color="primary">mdi-food-variant</v-icon>
        <span class="ingredientes-texto">{{ producto.ingredientes }}</span>
      </div>

      <!-- Metadata -->
      <div class="metadata-container">
        <v-chip
          v-if="producto.tiempoPreparacion"
          size="small"
          variant="text"
          prepend-icon="mdi-clock-outline"
        >
          {{ producto.tiempoPreparacion }} min
        </v-chip>
        <v-chip
          v-if="producto.calorias"
          size="small"
          variant="text"
          prepend-icon="mdi-fire"
        >
          {{ producto.calorias }} kcal
        </v-chip>
      </div>

      <!-- Footer con precio -->
      <v-divider class="my-3" />

      <div class="footer-container">
        <div>
          <div class="precio">S/ {{ formatoPrecio(producto.precio) }}</div>
          <div v-if="producto.presentacion" class="presentacion">
            {{ producto.presentacion }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductoCartaDTO } from '@/types/cartaPublica';
import { useCartaApi } from '@/composables/useCartaApi';

interface Props {
  producto: ProductoCartaDTO;
}

const props = defineProps<Props>();
const { obtenerUrlImagen } = useCartaApi();

const imagenUrl = computed(() => obtenerUrlImagen(props.producto.imagenUrl));

function formatoPrecio(precio: number): string {
  return precio.toFixed(2);
}
</script>

<style scoped>
.producto-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;
  border-radius: 12px;
  overflow: hidden;
}

.producto-card:hover {
  transform: translateY(-4px);
}

.producto-imagen-container {
  position: relative;
  width: 100%;
  height: 220px;
}

.sin-imagen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.producto-imagen {
  border-radius: 0;
}

.badges-container {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.badge {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.producto-nombre {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.producto-descripcion {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ingredientes-section {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px;
  background-color: rgba(25, 118, 210, 0.05);
  border-radius: 6px;
}

.ingredientes-texto {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
  flex: 1;
}

.metadata-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.precio {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1976d2;
  line-height: 1;
}

.presentacion {
  font-size: 0.8rem;
  color: #888;
  margin-top: 4px;
}
</style>
