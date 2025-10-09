<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-palette</v-icon>
        <span>Apariencia</span>
      </div>
      <v-chip
        :color="empresa.activa ? 'success' : 'error'"
        variant="flat"
        size="small"
      >
        <v-icon start size="small">
          {{ empresa.activa ? "mdi-check-circle" : "mdi-close-circle" }}
        </v-icon>
        {{ empresa.activa ? "ACTIVA" : "INACTIVA" }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <!-- Logo de la empresa -->
      <div class="text-center mb-4">
        <v-avatar
          v-if="empresa.logoUrl"
          :image="empresa.logoUrl"
          :size="logoSize"
          class="mb-3 logo-avatar elevation-2"
        />
        <v-avatar v-else :size="logoSize" color="grey-lighten-2" class="mb-3">
          <v-icon :size="logoSize / 2" color="grey">mdi-domain</v-icon>
        </v-avatar>

        <div>
          <div class="text-h6 font-weight-bold">{{ empresa.nombre }}</div>
          <div v-if="empresa.slug" class="text-caption text-grey">
            <v-icon size="14">mdi-link</v-icon>
            <code class="slug-text ml-1">{{ empresa.slug }}</code>
          </div>
        </div>
      </div>

      <v-divider class="my-3" />

      <!-- Acciones -->
      <div class="d-flex flex-column gap-2">
        <v-btn
          v-if="canEdit"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-camera"
          block
          @click="$emit('cambiar-logo')"
        >
          Cambiar Logo
        </v-btn>

        <v-btn
          v-if="canEdit"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-link-variant"
          block
          @click="$emit('cambiar-slug')"
        >
          Cambiar Slug
        </v-btn>

        <v-btn
          v-if="canChangeState"
          :color="empresa.activa ? 'error' : 'success'"
          variant="outlined"
          :prepend-icon="
            empresa.activa ? 'mdi-close-circle' : 'mdi-check-circle'
          "
          block
          @click="$emit('cambiar-estado', !empresa.activa)"
        >
          {{ empresa.activa ? "Desactivar" : "Activar" }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Empresa } from "@/types/empresa";

interface Props {
  empresa: Empresa;
  canEdit?: boolean;
  canChangeState?: boolean;
}

withDefaults(defineProps<Props>(), {
  canEdit: false,
  canChangeState: false,
});

defineEmits<{
  "cambiar-logo": [];
  "cambiar-slug": [];
  "cambiar-estado": [activa: boolean];
}>();

// Logo size responsivo
const logoSize = computed(() => {
  if (typeof window !== "undefined") {
    return window.innerWidth < 600 ? 120 : 150;
  }
  return 150;
});
</script>

<style scoped>
.logo-avatar {
  border: 3px solid rgba(var(--v-theme-primary), 0.2);
}

.slug-text {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.gap-2 {
  gap: 8px;
}
</style>
