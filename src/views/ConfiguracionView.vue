<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-2">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
              Configuración de Empresa
            </h1>
            <p class="text-grey mb-0">Gestiona la información y configuración de tu empresa</p>
          </div>

          <!-- Botón Ver Carta Digital -->
          <v-btn
            v-if="empresa?.slug"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-qrcode-scan"
            :href="`/carta/${empresa.slug}`"
            target="_blank"
            class="mb-4"
          >
            Ver Carta Digital
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Estado de carga -->
    <v-row v-if="loading && !empresa">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="text-grey mt-4">Cargando información...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contenido principal -->
    <template v-else-if="empresa">
      <v-row>
        <!-- Información de Empresa -->
        <v-col cols="12" lg="8">
          <EmpresaInfoCard
            :empresa="empresa"
            :can-edit="canEdit"
            :can-change-state="canChangeState"
            @editar="openEditDialog"
            @cambiar-logo="openLogoDialog"
            @cambiar-slug="openSlugDialog"
            @cambiar-estado="handleCambiarEstado"
          />
        </v-col>

        <!-- Estadísticas -->
        <v-col cols="12" lg="4">
          <EmpresaStatsCard v-if="estadisticas" :estadisticas="estadisticas" />
          <v-card v-else>
            <v-card-text class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-box-outline</v-icon>
              <p class="text-grey mt-2">No hay estadísticas disponibles</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Card de Carta Digital -->
      <v-row v-if="empresa?.slug" class="mt-4">
        <v-col cols="12">
          <v-card color="primary" variant="tonal">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-qrcode</v-icon>
              Carta Digital Pública
            </v-card-title>
            <v-card-text>
              <p class="mb-3">
                Tu carta digital está disponible en:
              </p>
              <v-chip
                :text="cartaUrl"
                prepend-icon="mdi-link"
                color="primary"
                variant="elevated"
                class="mb-3"
                @click="copiarEnlaceCarta"
              />
              <v-divider class="my-3" />
              <div class="d-flex gap-2 flex-wrap">
                <v-btn
                  :href="`/carta/${empresa.slug}`"
                  target="_blank"
                  variant="elevated"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                  size="small"
                >
                  Abrir Carta
                </v-btn>
                <v-btn
                  @click="copiarEnlaceCarta"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-content-copy"
                  size="small"
                >
                  Copiar Enlace
                </v-btn>
                <v-btn
                  @click="showQRPrintDialog = true"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-printer"
                  size="small"
                >
                  Imprimir QR
                </v-btn>
                <v-btn
                  :href="qrCodeUrl"
                  target="_blank"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-qrcode"
                  size="small"
                >
                  Descargar QR
                </v-btn>
              </div>
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                class="mt-3"
                icon="mdi-information"
              >
                Comparte este enlace o QR con tus clientes para que vean tu menú sin necesidad de registro
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Estado de error -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" variant="tonal">
          <v-alert-title>Error al cargar información</v-alert-title>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <EmpresaEditDialog
      v-if="empresa"
      v-model="showEditDialog"
      :empresa="empresa"
      :loading="loading"
      @guardar="handleGuardar"
    />

    <LogoUploadDialog
      v-model="showLogoDialog"
      :logo-actual="empresa?.logoUrl"
      :loading="loading"
      @subir="handleSubirLogo"
    />

    <SlugChangeDialog
      v-model="showSlugDialog"
      :slug-actual="empresa?.slug"
      :loading="loading"
      @cambiar="handleCambiarSlug"
    />

    <QRPrintDialog
      v-model="showQRPrintDialog"
      :empresa="empresa"
      :qr-url="qrCodeUrl"
    />

    <!-- Snackbar de notificaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top right"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSnackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEmpresaStore } from '@/stores/empresaStore';
import { useAuthStore } from '@/stores/authStore';
import EmpresaInfoCard from '@/components/empresa/EmpresaInfoCard.vue';
import EmpresaStatsCard from '@/components/empresa/EmpresaStatsCard.vue';
import EmpresaEditDialog from '@/components/empresa/EmpresaEditDialog.vue';
import LogoUploadDialog from '@/components/empresa/LogoUploadDialog.vue';
import SlugChangeDialog from '@/components/empresa/SlugChangeDialog.vue';
import QRPrintDialog from '@/components/empresa/QRPrintDialog.vue';
import type { EmpresaUpdateDTO } from '@/types/empresa';

const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

// Estado
const showEditDialog = ref(false);
const showLogoDialog = ref(false);
const showSlugDialog = ref(false);
const showQRPrintDialog = ref(false);
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref<'success' | 'error' | 'info'>('success');

// Getters de la store
const empresa = computed(() => empresaStore.empresa);
const estadisticas = computed(() => empresaStore.estadisticas);
const loading = computed(() => empresaStore.loading);
const error = computed(() => empresaStore.error);

// Permisos
const canEdit = computed(() => {
  const tipoUsuario = authStore.user?.tipoUsuario;
  return tipoUsuario === 'ADMIN' || tipoUsuario === 'SUPER_ADMIN';
});

const canChangeState = computed(() => {
  const tipoUsuario = authStore.user?.tipoUsuario;
  return tipoUsuario === 'SUPER_ADMIN';
});

// Métodos
const loadData = async () => {
  try {
    await Promise.all([
      empresaStore.fetchEmpresa(),
      empresaStore.fetchEstadisticas()
    ]);
  } catch (err) {
    showNotification('Error al cargar los datos', 'error');
  }
};

const openEditDialog = () => {
  showEditDialog.value = true;
};

const openLogoDialog = () => {
  showLogoDialog.value = true;
};

const openSlugDialog = () => {
  showSlugDialog.value = true;
};

const handleGuardar = async (data: EmpresaUpdateDTO) => {
  const success = await empresaStore.updateEmpresa(data);
  if (success) {
    showEditDialog.value = false;
    showNotification('Información actualizada correctamente', 'success');
  } else {
    showNotification('Error al actualizar la información', 'error');
  }
};

const handleSubirLogo = async (file: File) => {
  const success = await empresaStore.updateLogo(file);
  if (success) {
    showLogoDialog.value = false;
    showNotification('Logo actualizado correctamente', 'success');
  } else {
    showNotification('Error al actualizar el logo', 'error');
  }
};

const handleCambiarSlug = async (nuevoSlug: string) => {
  try {
    const success = await empresaStore.cambiarSlug(nuevoSlug);
    if (success) {
      showSlugDialog.value = false;
      showNotification(`Slug actualizado correctamente a: ${nuevoSlug}`, 'success');

      // Recargar para actualizar la URL de la carta
      await loadData();
    } else {
      const errorMsg = empresaStore.error || 'Error al actualizar el slug';
      showNotification(errorMsg, 'error');
    }
  } catch (error: any) {
    // Mostrar mensaje de error específico del backend
    let errorMessage = 'Error al actualizar el slug';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showNotification(errorMessage, 'error');
  }
};

const handleCambiarEstado = async (activa: boolean) => {
  const mensaje = activa ? '¿Activar la empresa?' : '¿Desactivar la empresa?';
  const confirmar = confirm(mensaje);

  if (confirmar) {
    const success = await empresaStore.cambiarEstado(activa);
    if (success) {
      showNotification(
        `Empresa ${activa ? 'activada' : 'desactivada'} correctamente`,
        'success'
      );
    } else {
      showNotification('Error al cambiar el estado', 'error');
    }
  }
};

const showNotification = (message: string, color: 'success' | 'error' | 'info') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  showSnackbar.value = true;
};

// Carta Digital
const cartaUrl = computed(() => {
  if (!empresa.value?.slug) return '';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/carta/${empresa.value.slug}`;
  }
  return `/carta/${empresa.value.slug}`;
});

const qrCodeUrl = computed(() => {
  if (!empresa.value?.slug) return '';
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8091/api/v1';
  return `${apiUrl}/carta-qr/public/${empresa.value.slug}`;
});

const copiarEnlaceCarta = async () => {
  if (!empresa.value?.slug) return;

  try {
    await navigator.clipboard.writeText(cartaUrl.value);
    showNotification('Enlace copiado al portapapeles', 'success');
  } catch (err) {
    showNotification('Error al copiar el enlace', 'error');
  }
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>
