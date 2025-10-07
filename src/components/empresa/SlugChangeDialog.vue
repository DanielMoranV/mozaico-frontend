<template>
  <v-dialog v-model="isOpen" max-width="500px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white">
        <v-icon class="mr-2">mdi-link-variant</v-icon>
        <span>Cambiar Slug de Empresa</span>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-6">
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="text-caption">
            <strong>⚠️ Advertencia:</strong>
            Cambiar el slug afectará la URL de acceso a tu empresa. Asegúrate de actualizar cualquier referencia existente.
          </div>
        </v-alert>

        <v-form ref="formRef" v-model="valid">
          <!-- Slug Actual -->
          <div class="mb-4">
            <div class="text-caption text-grey mb-1">Slug Actual</div>
            <v-chip size="small" color="grey-lighten-2">
              <code>{{ slugActual }}</code>
            </v-chip>
          </div>

          <!-- Nuevo Slug -->
          <v-text-field
            v-model="nuevoSlug"
            label="Nuevo Slug *"
            prepend-inner-icon="mdi-link"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.slug]"
            placeholder="mi-empresa"
            hint="Solo letras minúsculas, números y guiones"
            persistent-hint
            counter="50"
            maxlength="50"
            @input="formatSlug"
          >
            <template v-slot:append-inner>
              <v-icon
                v-if="slugDisponible === true"
                color="success"
              >
                mdi-check-circle
              </v-icon>
              <v-icon
                v-else-if="slugDisponible === false"
                color="error"
              >
                mdi-close-circle
              </v-icon>
            </template>
          </v-text-field>

          <!-- Preview URL -->
          <div v-if="nuevoSlug" class="mt-2 pa-3 bg-grey-lighten-4 rounded">
            <div class="text-caption text-grey mb-1">Vista Previa de URL</div>
            <code class="text-body-2">{{ previewUrl }}</code>
          </div>
        </v-form>

        <!-- Información -->
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          <div class="text-caption">
            <strong>Recomendaciones:</strong>
            <ul class="ml-4 mt-2">
              <li>Usa un slug descriptivo y fácil de recordar</li>
              <li>Evita caracteres especiales y espacios</li>
              <li>Una vez cambiado, notifica a tus usuarios</li>
            </ul>
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="cambiar"
          :loading="loading"
          :disabled="!valid || !nuevoSlug || nuevoSlug === slugActual"
          prepend-icon="mdi-check"
        >
          Cambiar Slug
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  modelValue: boolean;
  slugActual?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'cambiar': [slug: string];
}>();

const formRef = ref();
const valid = ref(false);
const nuevoSlug = ref('');
const slugDisponible = ref<boolean | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const previewUrl = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/${nuevoSlug.value || 'mi-empresa'}`;
});

const rules = {
  required: (v: string) => !!v || 'El slug es requerido',
  slug: (v: string) => {
    if (!v) return true;
    const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return pattern.test(v) || 'Formato de slug inválido (solo letras minúsculas, números y guiones)';
  },
};

const formatSlug = () => {
  // Convertir a minúsculas y reemplazar espacios con guiones
  nuevoSlug.value = nuevoSlug.value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  // En una implementación real, aquí verificarías la disponibilidad con el backend
  if (nuevoSlug.value && nuevoSlug.value !== props.slugActual) {
    slugDisponible.value = true; // Simular disponibilidad
  } else {
    slugDisponible.value = null;
  }
};

const cambiar = async () => {
  const { valid: isValid } = await formRef.value.validate();
  if (isValid && nuevoSlug.value) {
    emit('cambiar', nuevoSlug.value);
  }
};

const close = () => {
  nuevoSlug.value = '';
  slugDisponible.value = null;
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    // Limpiar cuando se cierra
    nuevoSlug.value = '';
    slugDisponible.value = null;
  }
});
</script>

<style scoped>
code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
