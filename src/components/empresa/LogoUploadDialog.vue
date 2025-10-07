<template>
  <v-dialog v-model="isOpen" max-width="500px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white">
        <v-icon class="mr-2">mdi-camera</v-icon>
        <span>Cambiar Logo de Empresa</span>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-6">
        <!-- Preview del logo actual -->
        <div v-if="logoActual" class="text-center mb-4">
          <div class="text-subtitle-2 text-grey mb-2">Logo Actual</div>
          <v-avatar :image="logoActual" size="120" />
        </div>

        <v-divider v-if="logoActual" class="my-4" />

        <!-- Área de carga -->
        <div class="upload-area">
          <v-file-input
            v-model="file"
            label="Seleccionar Logo"
            prepend-icon="mdi-camera"
            accept="image/png, image/jpeg, image/jpg"
            variant="outlined"
            density="comfortable"
            show-size
            :rules="[rules.required, rules.fileSize, rules.fileType]"
            @change="onFileChange"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary">mdi-image</v-icon>
            </template>
          </v-file-input>

          <!-- Preview del nuevo logo -->
          <div v-if="previewUrl" class="preview-container text-center mt-4">
            <div class="text-subtitle-2 text-grey mb-2">Vista Previa</div>
            <v-avatar :image="previewUrl" size="150" class="preview-avatar" />
          </div>

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
                <li>Formato: PNG o JPG</li>
                <li>Tamaño máximo: 2 MB</li>
                <li>Dimensiones recomendadas: 500x500 px</li>
                <li>Fondo transparente (PNG) para mejor visualización</li>
              </ul>
            </div>
          </v-alert>
        </div>
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
          @click="subirLogo"
          :loading="loading"
          :disabled="!file"
          prepend-icon="mdi-upload"
        >
          Subir Logo
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  modelValue: boolean;
  logoActual?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'subir': [file: File];
}>();

const file = ref<File[]>([]);
const previewUrl = ref<string | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const rules = {
  required: (v: File[]) => (v && v.length > 0) || 'Debe seleccionar un archivo',
  fileSize: (v: File[]) => {
    if (!v || v.length === 0) return true;
    const file = v[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB
    return file.size <= maxSize || 'El archivo debe ser menor a 2 MB';
  },
  fileType: (v: File[]) => {
    if (!v || v.length === 0) return true;
    const file = v[0];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return validTypes.includes(file.type) || 'El archivo debe ser PNG o JPG';
  },
};

const onFileChange = (event: Event) => {
  if (file.value && file.value.length > 0) {
    const selectedFile = file.value[0];

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  } else {
    previewUrl.value = null;
  }
};

const subirLogo = () => {
  if (file.value && file.value.length > 0) {
    emit('subir', file.value[0]);
  }
};

const close = () => {
  file.value = [];
  previewUrl.value = null;
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    // Limpiar cuando se cierra
    file.value = [];
    previewUrl.value = null;
  }
});
</script>

<style scoped>
.upload-area {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.preview-container {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  border: 2px dashed rgba(0, 0, 0, 0.12);
}

.preview-avatar {
  border: 3px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
