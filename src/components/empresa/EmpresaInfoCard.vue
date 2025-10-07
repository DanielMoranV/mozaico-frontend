<template>
  <v-card class="empresa-info-card">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-domain</v-icon>
        <span>Información de Empresa</span>
      </div>
      <v-chip
        :color="empresa.activa ? 'success' : 'error'"
        variant="flat"
        size="small"
      >
        <v-icon start size="small">
          {{ empresa.activa ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        {{ empresa.activa ? 'ACTIVA' : 'INACTIVA' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Logo de la empresa -->
        <v-col cols="12" md="4" class="text-center">
          <div class="logo-container">
            <v-avatar
              v-if="empresa.logoUrl"
              :image="empresa.logoUrl"
              size="150"
              class="mb-4"
            />
            <v-avatar
              v-else
              size="150"
              color="grey-lighten-2"
              class="mb-4"
            >
              <v-icon size="80" color="grey">mdi-domain</v-icon>
            </v-avatar>

            <div v-if="canEdit" class="mt-2">
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-camera"
                @click="$emit('cambiar-logo')"
              >
                Cambiar Logo
              </v-btn>
            </div>
          </div>
        </v-col>

        <!-- Información general -->
        <v-col cols="12" md="8">
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-office-building</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Nombre</v-list-item-title>
              <v-list-item-subtitle>{{ empresa.nombre }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-link</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Slug</v-list-item-title>
              <v-list-item-subtitle>
                <code class="slug-text">{{ empresa.slug }}</code>
                <v-btn
                  v-if="canEdit"
                  icon
                  size="x-small"
                  variant="text"
                  @click="$emit('cambiar-slug')"
                >
                  <v-icon size="16">mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="empresa.descripcion">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-text</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Descripción</v-list-item-title>
              <v-list-item-subtitle>{{ empresa.descripcion }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="empresa.direccion">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-map-marker</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Dirección</v-list-item-title>
              <v-list-item-subtitle>{{ empresa.direccion }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="empresa.telefono">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-phone</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Teléfono</v-list-item-title>
              <v-list-item-subtitle>{{ empresa.telefono }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="empresa.email">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-email</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Email</v-list-item-title>
              <v-list-item-subtitle>{{ empresa.email }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="empresa.paginaWeb">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-web</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">Página Web</v-list-item-title>
              <v-list-item-subtitle>
                <a :href="empresa.paginaWeb" target="_blank" class="text-decoration-none">
                  {{ empresa.paginaWeb }}
                </a>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4" />

          <!-- Configuración fiscal -->
          <div class="config-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon class="mr-2">mdi-receipt-text</v-icon>
              Configuración Fiscal
            </h3>

            <v-row dense>
              <v-col cols="6" md="4">
                <div class="config-item">
                  <span class="text-caption text-grey">Tipo Operación</span>
                  <v-chip :color="getTipoOperacionColor(empresa.tipoOperacion)" size="small" class="mt-1">
                    {{ getTipoOperacionLabel(empresa.tipoOperacion) }}
                  </v-chip>
                </div>
              </v-col>

              <v-col cols="6" md="4">
                <div class="config-item">
                  <span class="text-caption text-grey">IGV</span>
                  <v-chip :color="empresa.aplicaIgv ? 'success' : 'grey'" size="small" class="mt-1">
                    {{ empresa.aplicaIgv ? `${empresa.porcentajeIgv}%` : 'No aplica' }}
                  </v-chip>
                </div>
              </v-col>

              <v-col cols="6" md="4">
                <div class="config-item">
                  <span class="text-caption text-grey">Moneda</span>
                  <v-chip size="small" class="mt-1">
                    {{ empresa.moneda }}
                  </v-chip>
                </div>
              </v-col>

              <v-col v-if="empresa.prefijoTicket" cols="6" md="4">
                <div class="config-item">
                  <span class="text-caption text-grey">Prefijo Ticket</span>
                  <v-chip size="small" class="mt-1">
                    {{ empresa.prefijoTicket }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="canEdit || canChangeState">
      <v-spacer />

      <v-btn
        v-if="canChangeState"
        :color="empresa.activa ? 'error' : 'success'"
        variant="tonal"
        :prepend-icon="empresa.activa ? 'mdi-close-circle' : 'mdi-check-circle'"
        @click="$emit('cambiar-estado', !empresa.activa)"
      >
        {{ empresa.activa ? 'Desactivar Empresa' : 'Activar Empresa' }}
      </v-btn>

      <v-btn
        v-if="canEdit"
        color="primary"
        variant="elevated"
        prepend-icon="mdi-pencil"
        @click="$emit('editar')"
      >
        Editar Información
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Empresa, TipoOperacion } from '@/types/empresa';

interface Props {
  empresa: Empresa;
  canEdit?: boolean;
  canChangeState?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  canChangeState: false,
});

defineEmits<{
  editar: [];
  'cambiar-logo': [];
  'cambiar-slug': [];
  'cambiar-estado': [activa: boolean];
}>();

const getTipoOperacionColor = (tipo: TipoOperacion): string => {
  switch (tipo) {
    case 'TICKET_SIMPLE':
      return 'blue';
    case 'FACTURA_ELECTRONICA':
      return 'purple';
    case 'BOLETA_MANUAL':
      return 'orange';
    case 'MIXTO':
      return 'teal';
    default:
      return 'grey';
  }
};

const getTipoOperacionLabel = (tipo: TipoOperacion): string => {
  switch (tipo) {
    case 'TICKET_SIMPLE':
      return 'Ticket Simple';
    case 'FACTURA_ELECTRONICA':
      return 'Facturación Electrónica';
    case 'BOLETA_MANUAL':
      return 'Boleta Manual';
    case 'MIXTO':
      return 'Mixto';
    default:
      return tipo;
  }
};
</script>

<style scoped>
.empresa-info-card {
  height: 100%;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slug-text {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.config-section {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 16px;
  border-radius: 8px;
}

.config-item {
  display: flex;
  flex-direction: column;
}
</style>
