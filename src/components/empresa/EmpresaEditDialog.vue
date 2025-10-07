<template>
  <v-dialog v-model="isOpen" max-width="800px" persistent>
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white">
        <v-icon class="mr-2">mdi-pencil</v-icon>
        <span>Editar Información de Empresa</span>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="guardar">
          <v-row>
            <!-- Nombre -->
            <v-col cols="12">
              <v-text-field
                v-model="form.nombre"
                label="Nombre de la Empresa *"
                prepend-inner-icon="mdi-office-building"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                required
              />
            </v-col>

            <!-- Descripción -->
            <v-col cols="12">
              <v-textarea
                v-model="form.descripcion"
                label="Descripción"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                density="comfortable"
                rows="3"
                hint="Descripción breve de tu empresa"
                persistent-hint
              />
            </v-col>

            <!-- Dirección -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.direccion"
                label="Dirección"
                prepend-inner-icon="mdi-map-marker"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Teléfono -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.telefono"
                label="Teléfono"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="comfortable"
                type="tel"
              />
            </v-col>

            <!-- Email -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                type="email"
                :rules="[rules.email]"
              />
            </v-col>

            <!-- Página Web -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.paginaWeb"
                label="Página Web"
                prepend-inner-icon="mdi-web"
                variant="outlined"
                density="comfortable"
                placeholder="www.ejemplo.com"
              />
            </v-col>

            <v-col cols="12">
              <v-divider />
            </v-col>

            <!-- Configuración Fiscal -->
            <v-col cols="12">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                <v-icon class="mr-2">mdi-receipt-text</v-icon>
                Configuración Fiscal
              </h3>
            </v-col>

            <!-- Tipo de Operación -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.tipoOperacion"
                label="Tipo de Operación *"
                :items="tiposOperacion"
                item-title="label"
                item-value="value"
                prepend-inner-icon="mdi-file-document"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                required
              />
            </v-col>

            <!-- Moneda -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.moneda"
                label="Moneda"
                :items="monedas"
                prepend-inner-icon="mdi-currency-usd"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Aplica IGV -->
            <v-col cols="12" md="6">
              <v-checkbox
                v-model="form.aplicaIgv"
                label="¿Aplica IGV?"
                color="primary"
                hide-details
              />
            </v-col>

            <!-- Porcentaje IGV -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.porcentajeIgv"
                label="Porcentaje IGV"
                prepend-inner-icon="mdi-percent"
                variant="outlined"
                density="comfortable"
                type="number"
                step="0.01"
                min="0"
                max="100"
                suffix="%"
                :disabled="!form.aplicaIgv"
                hint="Ejemplo: 18 para 18%"
                persistent-hint
              />
            </v-col>

            <!-- Prefijo Ticket -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.prefijoTicket"
                label="Prefijo de Ticket"
                prepend-inner-icon="mdi-ticket"
                variant="outlined"
                density="comfortable"
                placeholder="MOZ"
                hint="Prefijo para numeración de tickets"
                persistent-hint
                counter="10"
                maxlength="10"
              />
            </v-col>
          </v-row>
        </v-form>
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
          @click="guardar"
          :loading="loading"
          :disabled="!valid"
          prepend-icon="mdi-content-save"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Empresa, EmpresaUpdateDTO, TipoOperacion } from '@/types/empresa';

interface Props {
  modelValue: boolean;
  empresa: Empresa;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'guardar': [data: EmpresaUpdateDTO];
}>();

const formRef = ref();
const valid = ref(false);

const form = ref<EmpresaUpdateDTO>({
  nombre: '',
  descripcion: '',
  direccion: '',
  telefono: '',
  email: '',
  paginaWeb: '',
  tipoOperacion: 'TICKET_SIMPLE',
  aplicaIgv: false,
  porcentajeIgv: 18,
  moneda: 'PEN',
  prefijoTicket: '',
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const tiposOperacion = [
  { label: 'Ticket Simple', value: 'TICKET_SIMPLE' },
  { label: 'Facturación Electrónica', value: 'FACTURA_ELECTRONICA' },
  { label: 'Boleta Manual', value: 'BOLETA_MANUAL' },
  { label: 'Mixto', value: 'MIXTO' },
];

const monedas = [
  'PEN',
  'USD',
  'EUR',
];

const rules = {
  required: (v: any) => !!v || 'Este campo es requerido',
  email: (v: string) => {
    if (!v) return true; // Email es opcional
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(v) || 'Email inválido';
  },
};

watch(() => props.empresa, (empresa) => {
  if (empresa) {
    form.value = {
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      paginaWeb: empresa.paginaWeb,
      tipoOperacion: empresa.tipoOperacion,
      aplicaIgv: empresa.aplicaIgv,
      porcentajeIgv: empresa.porcentajeIgv,
      moneda: empresa.moneda,
      prefijoTicket: empresa.prefijoTicket,
    };
  }
}, { immediate: true });

const guardar = async () => {
  const { valid: isValid } = await formRef.value.validate();
  if (isValid) {
    emit('guardar', form.value);
  }
};

const close = () => {
  emit('update:modelValue', false);
};
</script>
