<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary" color="white" grow>
      <v-tab value="general">
        <v-icon class="mr-2">mdi-information</v-icon>
        General
      </v-tab>
      <v-tab value="carta">
        <v-icon class="mr-2">mdi-qrcode</v-icon>
        Carta Digital
      </v-tab>
      <v-tab value="fiscal">
        <v-icon class="mr-2">mdi-receipt-text</v-icon>
        Fiscal
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Tab: Información General -->
      <v-window-item value="general">
        <v-card-text>
          <v-expansion-panels variant="accordion">
            <!-- Información Básica -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <v-icon class="mr-3" color="primary"
                    >mdi-office-building</v-icon
                  >
                  <div>
                    <div class="font-weight-bold">Información Básica</div>
                    <div class="text-caption text-grey">
                      Nombre, descripción y datos principales
                    </div>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="comfortable">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-office-building</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Nombre</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      empresa.nombre
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-link</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Slug</v-list-item-title
                    >
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
                    <v-list-item-title class="font-weight-medium"
                      >Descripción</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      empresa.descripcion
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Información de Contacto -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <v-icon class="mr-3" color="primary"
                    >mdi-card-account-details</v-icon
                  >
                  <div>
                    <div class="font-weight-bold">Información de Contacto</div>
                    <div class="text-caption text-grey">
                      Dirección, teléfono, email y web
                    </div>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="comfortable">
                  <v-list-item v-if="empresa.direccion">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Dirección</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      empresa.direccion
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="empresa.telefono">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-phone</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Teléfono</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      empresa.telefono
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="empresa.email">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-email</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Email</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      empresa.email
                    }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="empresa.paginaWeb">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-web</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium"
                      >Página Web</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      <a
                        :href="empresa.paginaWeb"
                        target="_blank"
                        class="text-decoration-none"
                      >
                        {{ empresa.paginaWeb }}
                      </a>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="mt-4 d-flex justify-end gap-2 flex-wrap">
            <v-btn
              v-if="canEdit"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-pencil"
              @click="$emit('editar')"
            >
              Editar Información
            </v-btn>
          </div>
        </v-card-text>
      </v-window-item>

      <!-- Tab: Carta Digital -->
      <v-window-item value="carta">
        <v-card-text>
          <div v-if="empresa.slug">
            <div class="text-center mb-6">
              <v-avatar size="200" rounded="lg" class="qr-preview elevation-4">
                <v-img :src="qrCodeUrl" alt="QR Code" />
              </v-avatar>
            </div>

            <v-card variant="tonal" color="primary" class="mb-4">
              <v-card-text>
                <div class="text-subtitle-1 font-weight-bold mb-2">
                  <v-icon class="mr-2">mdi-link</v-icon>
                  URL de tu Carta Digital
                </div>
                <div class="d-flex align-center flex-wrap gap-2">
                  <v-chip
                    :text="cartaUrl"
                    prepend-icon="mdi-link-variant"
                    color="primary"
                    variant="elevated"
                    class="flex-grow-1"
                    style="max-width: 100%"
                  />
                </div>
              </v-card-text>
            </v-card>

            <v-row dense>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  :href="`/carta/${empresa.slug}`"
                  target="_blank"
                  block
                  variant="elevated"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                >
                  Abrir Carta
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  @click="$emit('copiar-enlace')"
                  block
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-content-copy"
                >
                  Copiar Enlace
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  @click="$emit('imprimir-qr')"
                  block
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-printer"
                >
                  Imprimir QR
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  :href="qrCodeUrl"
                  target="_blank"
                  block
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-download"
                >
                  Descargar QR
                </v-btn>
              </v-col>
            </v-row>

            <v-alert
              type="info"
              variant="tonal"
              density="comfortable"
              class="mt-4"
              icon="mdi-information"
            >
              Comparte este enlace o código QR con tus clientes para que vean tu
              menú sin necesidad de registro
            </v-alert>
          </div>

          <v-alert v-else type="warning" variant="tonal" icon="mdi-alert">
            Necesitas configurar un slug para tu empresa antes de poder usar la
            carta digital
          </v-alert>
        </v-card-text>
      </v-window-item>

      <!-- Tab: Configuración Fiscal -->
      <v-window-item value="fiscal">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <v-card variant="tonal" color="blue">
                <v-card-text>
                  <div class="text-caption text-grey-darken-1 mb-1">
                    Tipo de Operación
                  </div>
                  <v-chip
                    :color="getTipoOperacionColor(empresa.tipoOperacion)"
                    variant="elevated"
                    size="small"
                  >
                    {{ getTipoOperacionLabel(empresa.tipoOperacion) }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card
                variant="tonal"
                :color="empresa.aplicaIgv ? 'success' : 'grey'"
              >
                <v-card-text>
                  <div class="text-caption text-grey-darken-1 mb-1">IGV</div>
                  <v-chip
                    :color="empresa.aplicaIgv ? 'success' : 'grey'"
                    variant="elevated"
                    size="small"
                  >
                    {{
                      empresa.aplicaIgv
                        ? `${empresa.porcentajeIgv}%`
                        : "No aplica"
                    }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card variant="tonal" color="amber">
                <v-card-text>
                  <div class="text-caption text-grey-darken-1 mb-1">Moneda</div>
                  <v-chip variant="elevated" size="small">
                    {{ empresa.moneda }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="empresa.prefijoTicket" cols="12" sm="6" md="4">
              <v-card variant="tonal" color="purple">
                <v-card-text>
                  <div class="text-caption text-grey-darken-1 mb-1">
                    Prefijo Ticket
                  </div>
                  <v-chip variant="elevated" size="small">
                    {{ empresa.prefijoTicket }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <v-alert
            type="info"
            variant="tonal"
            density="comfortable"
            icon="mdi-information"
          >
            <div class="text-body-2">
              <strong>Configuración Fiscal:</strong>
              <p class="mt-2 mb-0">
                Esta configuración determina cómo se procesan las transacciones
                y comprobantes en el sistema. Para modificar estos datos, edita
                la información de la empresa.
              </p>
            </div>
          </v-alert>

          <div class="mt-4 d-flex justify-end">
            <v-btn
              v-if="canEdit"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-pencil"
              @click="$emit('editar')"
            >
              Editar Configuración
            </v-btn>
          </div>
        </v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Empresa, TipoOperacion } from "@/types/empresa";

interface Props {
  empresa: Empresa;
  canEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
});

defineEmits<{
  editar: [];
  "cambiar-slug": [];
  "copiar-enlace": [];
  "imprimir-qr": [];
}>();

const tab = ref("general");

const cartaUrl = computed(() => {
  if (!props.empresa?.slug) return "";
  if (typeof window !== "undefined") {
    return `${window.location.origin}/carta/${props.empresa.slug}`;
  }
  return `/carta/${props.empresa.slug}`;
});

const qrCodeUrl = computed(() => {
  if (!props.empresa?.slug) return "";
  const apiUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8091/api/v1";
  return `${apiUrl}/carta-qr/public/${props.empresa.slug}`;
});

const getTipoOperacionColor = (tipo: TipoOperacion): string => {
  switch (tipo) {
    case "TICKET_SIMPLE":
      return "blue";
    case "FACTURA_ELECTRONICA":
      return "purple";
    case "BOLETA_MANUAL":
      return "orange";
    case "MIXTO":
      return "teal";
    default:
      return "grey";
  }
};

const getTipoOperacionLabel = (tipo: TipoOperacion): string => {
  switch (tipo) {
    case "TICKET_SIMPLE":
      return "Ticket Simple";
    case "FACTURA_ELECTRONICA":
      return "Facturación Electrónica";
    case "BOLETA_MANUAL":
      return "Boleta Manual";
    case "MIXTO":
      return "Mixto";
    default:
      return tipo;
  }
};
</script>

<style scoped>
.slug-text {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.qr-preview {
  border: 4px solid rgb(var(--v-theme-primary));
  background: white;
}

.gap-2 {
  gap: 8px;
}
</style>
