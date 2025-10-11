<template>
  <div class="filtros-wrapper">
    <div class="filtros-categorias">
      <!-- Indicador de scroll izquierdo -->
      <div class="scroll-indicator left" :class="{ visible: showLeftScroll }">
        <v-icon>mdi-chevron-left</v-icon>
      </div>

      <v-chip-group
        ref="chipGroup"
        :model-value="categoriaSeleccionada"
        @update:model-value="emit('update:categoriaSeleccionada', $event)"
        selected-class="categoria-activa"
        mandatory
        class="categorias-chips"
        @scroll="handleScroll"
      >
        <v-chip
          value="todas"
          filter
          variant="elevated"
          size="large"
          class="categoria-chip"
        >
          <v-icon start size="20">mdi-view-grid-outline</v-icon>
          <span class="chip-text">Todas</span>
          <v-chip
            size="x-small"
            color="primary"
            variant="flat"
            class="count-badge"
          >
            {{ totalProductos }}
          </v-chip>
        </v-chip>

        <v-chip
          v-for="categoria in categorias"
          :key="categoria.idCategoria"
          :value="categoria.idCategoria"
          filter
          variant="elevated"
          size="large"
          class="categoria-chip"
        >
          <v-icon start size="20">mdi-food</v-icon>
          <span class="chip-text">{{ categoria.nombre }}</span>
          <v-chip
            size="x-small"
            color="primary"
            variant="flat"
            class="count-badge"
          >
            {{ categoria.count }}
          </v-chip>
        </v-chip>
      </v-chip-group>

      <!-- Indicador de scroll derecho -->
      <div class="scroll-indicator right" :class="{ visible: showRightScroll }">
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { CategoriaResponseDTO } from '@/types/cartaPublica';

interface CategoriaConConteo extends CategoriaResponseDTO {
  count: number;
}

interface Props {
  categorias: CategoriaConConteo[];
  categoriaSeleccionada: number | 'todas';
  totalProductos: number;
}

interface Emits {
  (e: 'update:categoriaSeleccionada', value: number | 'todas'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const chipGroup = ref<HTMLElement | null>(null);
const showLeftScroll = ref(false);
const showRightScroll = ref(false);

function checkScrollIndicators() {
  const container = chipGroup.value?.$el?.querySelector('.v-slide-group__content');
  if (!container) return;

  const { scrollLeft, scrollWidth, clientWidth } = container;

  showLeftScroll.value = scrollLeft > 10;
  showRightScroll.value = scrollLeft < scrollWidth - clientWidth - 10;
}

function handleScroll() {
  checkScrollIndicators();
}

onMounted(() => {
  setTimeout(checkScrollIndicators, 100);
  window.addEventListener('resize', checkScrollIndicators);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollIndicators);
});
</script>

<style scoped>
.filtros-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.filtros-categorias {
  position: relative;
  width: 100%;
  padding: 8px 0;
}

.categorias-chips {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
  padding: 4px 0 12px 0;
}

.categoria-chip {
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 24px;
  padding: 0 16px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.categoria-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chip-text {
  font-size: 0.95rem;
}

.count-badge {
  margin-left: 4px;
  min-width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
}

/* Chip activo */
:deep(.categoria-activa) {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4) !important;
  transform: scale(1.02);
}

:deep(.categoria-activa .v-icon) {
  color: white !important;
}

:deep(.categoria-activa .count-badge) {
  background-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

/* Indicadores de scroll */
.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.scroll-indicator.left {
  left: 0;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent);
}

.scroll-indicator.right {
  right: 0;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.95), transparent);
}

.scroll-indicator.visible {
  opacity: 1;
}

.scroll-indicator .v-icon {
  color: #1976d2;
  font-weight: bold;
}

/* Scrollbar personalizado para webkit */
.categorias-chips::-webkit-scrollbar {
  height: 6px;
}

.categorias-chips::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.categorias-chips::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
  transition: background 0.2s;
}

.categorias-chips::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .categoria-chip {
    height: 40px;
    padding: 0 12px;
    font-size: 0.85rem;
  }

  .chip-text {
    font-size: 0.85rem;
  }

  .count-badge {
    min-width: 20px;
    height: 18px;
    font-size: 0.7rem;
  }

  .scroll-indicator {
    width: 32px;
    height: 32px;
  }

  .categorias-chips {
    gap: 8px;
    padding: 4px 0 10px 0;
  }

  /* Ocultar scrollbar en móviles pero mantener funcionalidad */
  .categorias-chips::-webkit-scrollbar {
    height: 0;
  }

  .categorias-chips {
    scrollbar-width: none;
  }
}

/* Animación de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filtros-wrapper {
  animation: fadeIn 0.5s ease-out;
}
</style>
