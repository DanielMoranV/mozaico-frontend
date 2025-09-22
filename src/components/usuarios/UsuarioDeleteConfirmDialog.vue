<template>
  <v-dialog :model-value="props.mostrar" @update:model-value="$emit('update:mostrar', $event)" max-width="400px">
    <v-card>
      <v-card-title>Confirmar eliminación</v-card-title>
      <v-card-text>
        ¿Estás seguro de que quieres eliminar al usuario
        {{ props.usuarioAEliminar?.nombre }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="$emit('update:mostrar', false)">
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="$emit('eliminar-confirmado')"
          :loading="props.loading"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false,
  },
  usuarioAEliminar: {
    type: Object as () => any | null,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:mostrar', 'eliminar-confirmado']);
</script>
