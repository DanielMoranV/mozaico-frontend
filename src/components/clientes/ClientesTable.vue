<template>
  <v-data-table
    :headers="headers"
    :items="clientes"
    :loading="loading"
    loading-text="Cargando clientes..."
    no-data-text="No se encontraron clientes"
    items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:item.nombre="{ item }">
      <div class="d-flex align-center">
        <v-icon size="small" class="mr-2" :color="item.tipoPersona === 'JURIDICA' ? 'blue' : 'grey'">
          {{ item.tipoPersona === 'JURIDICA' ? 'mdi-domain' : 'mdi-account' }}
        </v-icon>
        <div>
          <div class="font-weight-medium">
            {{ item.nombre }} {{ item.apellido || '' }}
          </div>
          <div v-if="item.tipoPersona === 'JURIDICA' && item.razonSocial" class="text-caption text-grey">
            {{ item.razonSocial }}
          </div>
        </div>
      </div>
    </template>

    <template v-slot:item.documento="{ item }">
      <div v-if="item.numeroDocumento">
        <v-chip size="x-small" variant="tonal" :color="getDocumentoColor(item.tipoDocumento)">
          {{ item.tipoDocumento || 'DOC' }}
        </v-chip>
        <div class="text-caption mt-1">{{ item.numeroDocumento }}</div>
      </div>
      <span v-else class="text-grey">-</span>
    </template>

    <template v-slot:item.tipoPersona="{ item }">
      <v-chip
        size="small"
        variant="tonal"
        :color="item.tipoPersona === 'JURIDICA' ? 'blue' : 'green'"
      >
        {{ item.tipoPersona === 'JURIDICA' ? 'Empresa' : 'Natural' }}
      </v-chip>
    </template>

    <template v-slot:item.activo="{ item }">
      <v-chip :color="item.activo ? 'success' : 'error'" size="small" variant="tonal">
        {{ item.activo ? 'Activo' : 'Inactivo' }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" @click="emit('editar-cliente', item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" variant="text" color="error" @click="emit('confirmar-eliminar', item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-if="!item.activo" @click="emit('activar-cliente', item.idCliente)">
            <v-list-item-title>Activar</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item.activo" @click="emit('desactivar-cliente', item.idCliente)">
            <v-list-item-title>Desactivar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { ClienteResponseDTO } from '@/types/cliente';

defineProps<{
  clientes: ClienteResponseDTO[];
  loading: boolean;
  headers: any[];
}>();

const emit = defineEmits([
  'editar-cliente',
  'confirmar-eliminar',
  'activar-cliente',
  'desactivar-cliente',
]);

const getDocumentoColor = (tipoDocumento?: string) => {
  const colors: Record<string, string> = {
    'DNI': 'blue',
    'RUC': 'purple',
    'CARNET_EXTRANJERIA': 'orange',
    'PASAPORTE': 'green',
    'SIN_DOCUMENTO': 'grey'
  };
  return colors[tipoDocumento || ''] || 'grey';
};
</script>
