<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Gestión de Categorías ({{ store.totalCategorias }})</span>
        <v-btn color="primary" @click="abrirDialogoCrear">
          <v-icon left>mdi-plus</v-icon>
          Nueva Categoría
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="store.categorias"
          :loading="store.loading"
          loading-text="Cargando categorías..."
          no-data-text="No se encontraron categorías"
          items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon size="small" variant="text" @click="editarCategoria(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="error" @click="confirmarEliminar(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialogo.mostrar" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogo.editando ? 'Editar Categoría' : 'Nueva Categoría' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.nombre"
                  label="Nombre *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido as any]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formulario.descripcion"
                  label="Descripción"
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="guardarCategoria" :loading="store.loading">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmarDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar la categoría "{{ categoriaAEliminar?.nombre }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmarDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="eliminarCategoriaConfirmado" :loading="store.loading">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { CategoriaRequestDTO, CategoriaResponseDTO } from '@/types/categoria';

const store = useCategoriaStore();

const headers = [
  { title: 'ID', key: 'idCategoria', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Descripción', key: 'descripcion', sortable: false },
  { title: 'Fecha Creación', key: 'fechaCreacion', sortable: true },
  { title: 'Fecha Actualización', key: 'fechaActualizacion', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<CategoriaRequestDTO>({
  nombre: '',
  descripcion: '',
});

const categoriaIdActual = ref<number | null>(null);
const confirmarDialog = ref(false);
const categoriaAEliminar = ref<CategoriaResponseDTO | null>(null);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: string) => !!v || 'Este campo es requerido',
};

const cargarCategorias = async () => {
  await store.fetchCategorias();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarCategoria = (categoria: CategoriaResponseDTO) => {
  categoriaIdActual.value = categoria.idCategoria;
  formulario.nombre = categoria.nombre;
  formulario.descripcion = categoria.descripcion;
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarCategoria = async () => {
  let resultado;
  if (dialogo.editando && categoriaIdActual.value) {
    resultado = await store.actualizarCategoria(categoriaIdActual.value, formulario);
  } else {
    resultado = await store.crearCategoria(formulario);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente',
      'success'
    );
    cerrarDialogo();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar categoría', 'error');
  }
};

const confirmarEliminar = (categoria: CategoriaResponseDTO) => {
  categoriaAEliminar.value = categoria;
  confirmarDialog.value = true;
};

const eliminarCategoriaConfirmado = async () => {
  if (categoriaAEliminar.value) {
    const resultado = await store.eliminarCategoria(categoriaAEliminar.value.idCategoria);
    if (resultado.success) {
      mostrarSnackbar('Categoría eliminada exitosamente', 'success');
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar categoría', 'error');
    }
  }
  confirmarDialog.value = false;
  categoriaAEliminar.value = null;
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  categoriaIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  formulario.nombre = '';
  formulario.descripcion = '';
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  cargarCategorias();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
