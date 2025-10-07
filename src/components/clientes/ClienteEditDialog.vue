<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="700px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Tipo de Persona -->
            <v-col cols="12">
              <v-btn-toggle
                v-model="form.tipoPersona"
                mandatory
                divided
                color="primary"
                class="mb-2"
              >
                <v-btn value="NATURAL">
                  <v-icon left>mdi-account</v-icon>
                  Persona Natural
                </v-btn>
                <v-btn value="JURIDICA">
                  <v-icon left>mdi-domain</v-icon>
                  Persona Jurídica
                </v-btn>
              </v-btn-toggle>
            </v-col>

            <!-- Campos para Persona Natural -->
            <template v-if="form.tipoPersona === 'NATURAL'">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombre"
                  label="Nombre *"
                  variant="outlined"
                  density="compact"
                  :rules="[reglasValidacion.requerido]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.apellido"
                  label="Apellido"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.fechaNacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </template>

            <!-- Campos para Persona Jurídica -->
            <template v-if="form.tipoPersona === 'JURIDICA'">
              <v-col cols="12">
                <v-text-field
                  v-model="form.razonSocial"
                  label="Razón Social *"
                  variant="outlined"
                  density="compact"
                  :rules="[reglasValidacion.requerido]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombreComercial"
                  label="Nombre Comercial"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.representanteLegal"
                  label="Representante Legal"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombre"
                  label="Nombre de Contacto *"
                  variant="outlined"
                  density="compact"
                  :rules="[reglasValidacion.requerido]"
                ></v-text-field>
              </v-col>
            </template>

            <!-- Documento (común para ambos) -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.tipoDocumento"
                :items="tiposDocumento"
                label="Tipo de Documento"
                variant="outlined"
                density="compact"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.numeroDocumento"
                label="Número de Documento"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>

            <!-- Contacto (común para ambos) -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.telefono"
                label="Teléfono"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                variant="outlined"
                density="compact"
                :rules="[reglasValidacion.email]"
              ></v-text-field>
            </v-col>

            <!-- Dirección (común para ambos) -->
            <v-col cols="12">
              <v-text-field
                v-model="form.direccion"
                label="Dirección"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>

            <!-- Preferencias Alimentarias (solo para Natural) -->
            <v-col v-if="form.tipoPersona === 'NATURAL'" cols="12">
              <v-textarea
                v-model="form.preferenciasAlimentarias"
                label="Preferencias Alimentarias"
                variant="outlined"
                density="compact"
                rows="2"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="$emit('guardar-cliente')" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { ClienteRequestDTO } from '@/types/cliente';

const props = defineProps<{
  mostrar: boolean;
  editando: boolean;
  formulario: ClienteRequestDTO;
  loading: boolean;
  reglasValidacion: any;
}>();

const emit = defineEmits(['update:mostrar', 'update:formulario', 'guardar-cliente']);

const form = computed({
  get: () => props.formulario,
  set: (value) => emit('update:formulario', value),
});

const tiposDocumento = [
  { title: 'DNI', value: 'DNI' },
  { title: 'RUC', value: 'RUC' },
  { title: 'Carnet de Extranjería', value: 'CARNET_EXTRANJERIA' },
  { title: 'Pasaporte', value: 'PASAPORTE' },
  { title: 'Sin Documento', value: 'SIN_DOCUMENTO' },
];
</script>
