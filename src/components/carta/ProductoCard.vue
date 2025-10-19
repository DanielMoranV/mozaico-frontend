<template>
  <v-card class="producto-card" elevation="3" :class="{ 'no-disponible': !producto.disponible }">
    <!-- Imagen del producto -->
    <div class="producto-imagen-container">
      <v-img
        v-if="producto.imagenUrl && imagenUrl"
        :src="imagenUrl"
        :alt="producto.nombre"
        :aspect-ratio="16/9"
        cover
        class="producto-imagen"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>
        </template>
      </v-img>
      <div v-else class="sin-imagen">
        <v-icon size="64" color="grey-lighten-1">mdi-silverware-fork-knife</v-icon>
      </div>

      <!-- Overlay de no disponible -->
      <div v-if="!producto.disponible" class="overlay-no-disponible">
        <v-chip color="error" variant="flat" size="large" class="chip-no-disponible">
          <v-icon start>mdi-close-circle</v-icon>
          No disponible
        </v-chip>
      </div>

      <!-- Badges superiores -->
      <div class="badges-container">
        <v-chip
          v-if="producto.esAlcoholico"
          size="small"
          color="orange-darken-2"
          variant="flat"
          class="badge"
        >
          <v-icon start size="16">mdi-glass-wine</v-icon>
          +18
        </v-chip>
      </div>
    </div>

    <!-- Contenido -->
    <v-card-text class="producto-info">
      <!-- Nombre y Precio en la parte superior -->
      <div class="header-info">
        <h3 class="producto-nombre">{{ producto.nombre }}</h3>
        <div class="precio">S/ {{ formatoPrecio(producto.precio) }}</div>
      </div>

      <!-- Descripción -->
      <p v-if="producto.descripcion" class="producto-descripcion">
        {{ producto.descripcion }}
      </p>

      <!-- Ingredientes -->
      <div v-if="producto.ingredientes" class="ingredientes-section">
        <v-icon size="16" color="primary">mdi-food-variant</v-icon>
        <span class="ingredientes-texto">{{ producto.ingredientes }}</span>
      </div>

      <!-- Metadata y presentación -->
      <div class="footer-info">
        <div class="metadata-container">
          <v-chip
            v-if="producto.tiempoPreparacion"
            size="x-small"
            variant="tonal"
            color="primary"
            class="metadata-chip"
          >
            <v-icon start size="14">mdi-clock-outline</v-icon>
            {{ producto.tiempoPreparacion }} min
          </v-chip>
          <v-chip
            v-if="producto.calorias"
            size="x-small"
            variant="tonal"
            color="orange"
            class="metadata-chip"
          >
            <v-icon start size="14">mdi-fire</v-icon>
            {{ producto.calorias }} kcal
          </v-chip>
        </div>
        <div v-if="producto.presentacion" class="presentacion">
          <v-icon size="14" color="grey">mdi-package-variant</v-icon>
          {{ producto.presentacion }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProductoCartaDTO } from "@/types/cartaPublica";
import { useCartaApi } from "@/composables/useCartaApi";

interface Props {
  producto: ProductoCartaDTO;
}

const props = defineProps<Props>();
const { obtenerUrlImagen } = useCartaApi();

const imagenUrl = computed(() => props.producto.imagenUrl ? obtenerUrlImagen(props.producto.imagenUrl) : undefined);

function formatoPrecio(precio: number): string {
  return precio.toFixed(2);
}
</script>

<style scoped>
.producto-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
}

.producto-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
}

.producto-card.no-disponible {
  opacity: 0.85;
}

.producto-imagen-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.producto-imagen {
  transition: transform 0.3s ease;
}

.producto-card:hover .producto-imagen {
  transform: scale(1.05);
}

.sin-imagen {
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-no-disponible {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 2;
}

.chip-no-disponible {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.badges-container {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
}

.badge {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px !important;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.producto-nombre {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.precio {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1976d2;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
}

.producto-descripcion {
  color: #5f6368;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ingredientes-section {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.06) 0%, rgba(25, 118, 210, 0.02) 100%);
  border-left: 3px solid rgba(25, 118, 210, 0.4);
  border-radius: 6px;
}

.ingredientes-texto {
  font-size: 0.8rem;
  color: #5f6368;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer-info {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metadata-container {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.metadata-chip {
  font-size: 0.7rem;
  font-weight: 600;
}

.presentacion {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #80868b;
  font-weight: 500;
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .producto-card {
    border-radius: 12px;
  }

  .producto-info {
    padding: 12px !important;
    gap: 10px;
  }

  .producto-nombre {
    font-size: 1rem;
  }

  .precio {
    font-size: 1.3rem;
  }

  .producto-descripcion {
    font-size: 0.8rem;
  }

  .ingredientes-section {
    padding: 8px 10px;
  }

  .ingredientes-texto {
    font-size: 0.75rem;
  }

  .badges-container {
    top: 8px;
    right: 8px;
  }
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.producto-card {
  animation: fadeInUp 0.4s ease-out;
}
</style>
