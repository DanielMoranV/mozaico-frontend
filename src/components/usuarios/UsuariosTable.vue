<template>
  <v-card>
    <v-card-title>
      <div class="d-flex align-center justify-space-between w-100">
        <span>Usuarios ({{ totalUsuarios }})</span>
        <v-btn icon variant="text" @click="$emit('cargar-usuarios')" :loading="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="usuarios"
      :loading="loading"
      loading-text="Cargando usuarios..."
      no-data-text="No se encontraron usuarios"
      items-per-page="10"
      class="elevation-0"
    >
      <template v-slot:item.tipoUsuario="{ item }">
        <v-chip
          :color="getTipoUsuarioColor(item.tipoUsuario)"
          size="small"
          variant="tonal"
        >
          {{ item.tipoUsuario }}
        </v-chip>
      </template>

      <template v-slot:item.estado="{ item }">
        <v-chip
          :color="getEstadoColor(item.estado)"
          size="small"
          variant="tonal"
        >
          {{ item.estado }}
        </v-chip>
      </template>

      <template v-slot:item.fechaCreacion="{ item }">
        {{ formatearFecha(item.fechaCreacion) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" variant="text" @click="$emit('ver-usuario', item)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" @click="$emit('editar-usuario', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          color="error"
          @click="$emit('confirmar-eliminar', item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type { UsuarioResponseDTO } from "@/types";

defineProps({
  usuarios: {
    type: Array as () => UsuarioResponseDTO[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalUsuarios: {
    type: Number,
    default: 0,
  },
  headers: {
    type: Array as () => any[],
    default: () => [],
  },
});

const emit = defineEmits([
  'cargar-usuarios',
  'ver-usuario',
  'editar-usuario',
  'confirmar-eliminar',
]);

const getTipoUsuarioColor = (tipo: string) => {
  switch (tipo) {
    case "ADMIN":
      return "primary";
    case "CLIENTE":
      return "success";
    default:
      return "grey";
  }
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "ACTIVO":
      return "success";
    case "INACTIVO":
      return "warning";
    case "BLOQUEADO":
      return "error";
    default:
      return "grey";
  }
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
