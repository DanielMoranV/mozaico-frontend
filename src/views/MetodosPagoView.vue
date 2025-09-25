<template>
  <v-container fluid>
    <v-card>
      <MetodoPagoHeader
        @crear-metodo-pago="abrirDialogoCrear"
      />

      <v-card-text>
        <MetodoPagoTable
          :metodos-pago="store.metodosPago"
          :loading="store.loading"
          :headers="headers"
          @editar-metodo-pago="editarMetodoPago"
          @confirmar-eliminar="confirmarEliminar"
        />
      </v-card-text>
    </v-card>

    <MetodoPagoEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-metodo-pago="guardarMetodoPago"
    />

    <MetodoPagoDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :metodo-pago-a-eliminar="metodoPagoAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarMetodoPagoConfirmado"
    />

    <v-snackbar v-model="snackbar.mostrar" :color="snackbar.color" :timeout="3000">
      {{ snackbar.mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.mostrar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useMetodoPagoStore } from '@/stores/metodoPagoStore';
import type { MetodoPagoResponseDTO, MetodoPagoRequestDTO } from '@/types/metodoPago';
import MetodoPagoHeader from '@/components/metodos-pago/MetodoPagoHeader.vue';
import MetodoPagoTable from '@/components/metodos-pago/MetodoPagoTable.vue';
import MetodoPagoEditDialog from '@/components/metodos-pago/MetodoPagoEditDialog.vue';
import MetodoPagoDeleteConfirmDialog from '@/components/metodos-pago/MetodoPagoDeleteConfirmDialog.vue';

const store = useMetodoPagoStore();

const headers = [
  { title: 'ID', key: 'idMetodo', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Activo', key: 'activo', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<MetodoPagoRequestDTO>({
  nombre: '',
  activo: true,
});

const metodoPagoIdActual = ref<number | null>(null);
const metodoPagoAEliminar = ref<MetodoPagoResponseDTO | null>(null);
const confirmarDialog = ref(false);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
};

const cargarMetodosPago = async () => {
  await store.fetchMetodosPago();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarMetodoPago = (metodoPago: MetodoPagoResponseDTO) => {
  metodoPagoIdActual.value = metodoPago.idMetodo;
  Object.assign(formulario, {
    nombre: metodoPago.nombre,
    activo: metodoPago.activo,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarMetodoPago = async () => {
  let resultado;
  if (dialogo.editando && metodoPagoIdActual.value) {
    const payload: MetodoPagoRequestDTO = { ...formulario };
    resultado = await store.actualizarMetodoPago(metodoPagoIdActual.value, payload);
  } else {
    const payload: MetodoPagoRequestDTO = { ...formulario };
    resultado = await store.crearMetodoPago(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Método de pago actualizado exitosamente' : 'Método de pago creado exitosamente',
      'success'
    );
    cerrarDialogo();
    await cargarMetodosPago();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar método de pago', 'error');
  }
};

const confirmarEliminar = (metodoPago: MetodoPagoResponseDTO) => {
  metodoPagoAEliminar.value = metodoPago;
  confirmarDialog.value = true;
};

const eliminarMetodoPagoConfirmado = async () => {
  if (metodoPagoAEliminar.value) {
    const resultado = await store.eliminarMetodoPago(metodoPagoAEliminar.value.idMetodo);
    if (resultado.success) {
      mostrarSnackbar('Método de pago eliminado exitosamente', 'success');
      await cargarMetodosPago();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar método de pago', 'error');
    }
  }
  confirmarDialog.value = false;
  metodoPagoAEliminar.value = null;
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  metodoPagoIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    nombre: '',
    activo: true,
  });
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  cargarMetodosPago();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
