<template>
  <v-dialog :model-value="mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">
          {{ editando ? "Editar Usuario" : "Nuevo Usuario" }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.nombre"
                label="Nombre completo *"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.username"
                label="Username *"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formulario.email"
                label="Email *"
                type="email"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any, reglasValidacion.email as any]"
              />
            </v-col>
            <v-col cols="12" v-if="!editando">
              <v-text-field
                v-model="formulario.password"
                label="Contraseña *"
                type="password"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formulario.tipoUsuario"
                :items="tiposUsuarioItems"
                label="Tipo de Usuario *"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formulario.tipoDocumentoIdentidad"
                :items="tiposDocumentoItems"
                label="Tipo de Documento *"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formulario.numeroDocumento"
                label="Número de Documento *"
                variant="outlined"
                :rules="[reglasValidacion.requerido as any]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('guardar-usuario')"
          :loading="loading"
        >
          {{ editando ? "Actualizar" : "Crear" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { UsuarioRequestDTO } from "@/types";

defineProps({
  mostrar: {
    type: Boolean,
    default: false,
  },
  editando: {
    type: Boolean,
    default: false,
  },
  formulario: {
    type: Object as () => UsuarioRequestDTO,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tiposUsuarioItems: {
    type: Array as () => { title: string; value: string }[],
    default: () => [],
  },
  tiposDocumentoItems: {
    type: Array as () => { title: string; value: string }[],
    default: () => [],
  },
  reglasValidacion: {
    type: Object as () => { [key: string]: (v: string) => boolean | string },
    required: true,
  },
});

const emit = defineEmits(['update:mostrar', 'guardar-usuario']);
</script>
