<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2">
          <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
          Configuración de Empresa
        </h1>
        <p class="text-grey mb-6">Gestiona la información y configuración de tu empresa</p>
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
import type { EmpresaUpdateDTO } from '@/types/empresa';

const empresaStore = useEmpresaStore();
const authStore = useAuthStore();

// Estado
const showEditDialog = ref(false);
const showLogoDialog = ref(false);
const showSlugDialog = ref(false);
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
  const roles = authStore.user?.roles || [];
  return roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
});

const canChangeState = computed(() => {
  const roles = authStore.user?.roles || [];
  return roles.includes('SUPER_ADMIN');
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
  const success = await empresaStore.cambiarSlug(nuevoSlug);
  if (success) {
    showSlugDialog.value = false;
    showNotification('Slug actualizado correctamente', 'success');
  } else {
    showNotification('Error al actualizar el slug', 'error');
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

// Lifecycle
onMounted(() => {
  loadData();
});
</script>
