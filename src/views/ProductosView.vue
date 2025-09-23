<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Gestión de Productos ({{ store.totalProductos }})</span>
        <v-btn color="primary" @click="abrirDialogoCrear">
          <v-icon left>mdi-plus</v-icon>
          Nuevo Producto
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="store.productos"
          :loading="store.loading"
          loading-text="Cargando productos..."
          no-data-text="No se encontraron productos"
          items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.categoria.nombre="{ item }">
            {{ item.categoria.nombre }}
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip :color="getEstadoColor(item.estado)" size="small" variant="tonal">
              {{ item.estado }}
            </v-chip>
          </template>
          <template v-slot:item.disponible="{ item }">
            <v-icon :color="item.disponible ? 'success' : 'error'">
              {{ item.disponible ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </template>
          <template v-slot:item.requierePreparacion="{ item }">
            <v-icon :color="item.requierePreparacion ? 'success' : 'error'">
              {{ item.requierePreparacion ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </template>
          <template v-slot:item.esAlcoholico="{ item }">
            <v-icon :color="item.esAlcoholico ? 'success' : 'error'">
              {{ item.esAlcoholico ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon size="small" variant="text" @click="editarProducto(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="error" @click="confirmarEliminar(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="text" v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item v-if="item.estado !== 'ACTIVO'" @click="activarProducto(item.idProducto)">
                  <v-list-item-title>Activar</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="item.estado === 'ACTIVO'" @click="desactivarProducto(item.idProducto)">
                  <v-list-item-title>Desactivar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialogo.mostrar" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogo.editando ? 'Editar Producto' : 'Nuevo Producto' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formulario.nombre"
                  label="Nombre *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido as any]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formulario.precio"
                  label="Precio *"
                  variant="outlined"
                  type="number"
                  :rules="[reglasValidacion.requerido as any, reglasValidacion.numeroPositivo as any]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formulario.descripcion"
                  label="Descripción"
                  variant="outlined"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formulario.idCategoria"
                  :items="categoriaStore.categorias"
                  item-title="nombre"
                  item-value="idCategoria"
                  label="Categoría *"
                  variant="outlined"
                  :rules="[reglasValidacion.requerido as any]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formulario.tiempoPreparacion"
                  label="Tiempo de Preparación (min)"
                  variant="outlined"
                  type="number"
                  :rules="[reglasValidacion.numeroPositivoOpcional as any]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="formulario.disponible"
                  label="Disponible"
                  color="primary"
                  inset
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="formulario.requierePreparacion"
                  label="Requiere Preparación"
                  color="primary"
                  inset
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="formulario.esAlcoholico"
                  label="Es Alcohólico"
                  color="primary"
                  inset
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.imagenUrl"
                  label="URL de Imagen"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.ingredientes"
                  label="Ingredientes"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formulario.calorias"
                  label="Calorías"
                  variant="outlined"
                  type="number"
                  :rules="[reglasValidacion.numeroPositivoOpcional as any]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formulario.codigoBarras"
                  label="Código de Barras"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formulario.marca"
                  label="Marca"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formulario.presentacion"
                  label="Presentación"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="guardarProducto" :loading="store.loading">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmarDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar el producto "{{ productoAEliminar?.nombre }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="confirmarDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="eliminarProductoConfirmado" :loading="store.loading">Eliminar</v-btn>
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
import { useProductoStore } from '@/stores/productoStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { ProductoRequestDTO, ProductoResponseDTO, ProductoUpdateDTO, EstadoProducto } from '@/types/producto';

const store = useProductoStore();
const categoriaStore = useCategoriaStore();

const headers = [
  { title: 'ID', key: 'idProducto', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Categoría', key: 'categoria.nombre', sortable: true },
  { title: 'Precio', key: 'precio', sortable: true },
  { title: 'Disponible', key: 'disponible', sortable: true },
  { title: 'Requiere Prep.', key: 'requierePreparacion', sortable: true },
  { title: 'Es Alcohólico', key: 'esAlcoholico', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<ProductoRequestDTO>({
  nombre: '',
  descripcion: '',
  precio: 0,
  idCategoria: 0,
  tiempoPreparacion: undefined,
  disponible: true,
  imagenUrl: undefined,
  ingredientes: undefined,
  calorias: undefined,
  codigoBarras: undefined,
  marca: undefined,
  presentacion: undefined,
  requierePreparacion: false,
  esAlcoholico: false,
  estado: 'ACTIVO',
});

const productoIdActual = ref<number | null>(null);
const confirmarDialog = ref(false);
const productoAEliminar = ref<ProductoResponseDTO | null>(null);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  numeroPositivo: (v: number) => v > 0 || 'Debe ser un número positivo',
  numeroPositivoOpcional: (v: number | undefined) => {
    if (v === undefined || v === null) return true;
    return v >= 0 || 'Debe ser un número positivo o cero';
  },
};

const getEstadoColor = (estado: EstadoProducto) => {
  switch (estado) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'warning';
    default:
      return 'grey';
  }
};

const cargarProductos = async () => {
  await store.fetchProductos();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarProducto = (producto: ProductoResponseDTO) => {
  productoIdActual.value = producto.idProducto;
  formulario.nombre = producto.nombre;
  formulario.descripcion = producto.descripcion;
  formulario.precio = producto.precio;
  formulario.idCategoria = producto.categoria.idCategoria;
  formulario.tiempoPreparacion = producto.tiempoPreparacion;
  formulario.disponible = producto.disponible;
  formulario.imagenUrl = producto.imagenUrl;
  formulario.ingredientes = producto.ingredientes;
  formulario.calorias = producto.calorias;
  formulario.codigoBarras = producto.codigoBarras;
  formulario.marca = producto.marca;
  formulario.presentacion = producto.presentacion;
  formulario.requierePreparacion = producto.requierePreparacion;
  formulario.esAlcoholico = producto.esAlcoholico;
  formulario.estado = producto.estado;
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarProducto = async () => {
  let resultado;
  if (dialogo.editando && productoIdActual.value) {
    const payload: ProductoUpdateDTO = { ...formulario };
    // No es necesario eliminar el estado si se permite actualizarlo
    resultado = await store.actualizarProducto(productoIdActual.value, payload);
  } else {
    resultado = await store.crearProducto(formulario);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
      'success'
    );
    cerrarDialogo();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar producto', 'error');
  }
};

const confirmarEliminar = (producto: ProductoResponseDTO) => {
  productoAEliminar.value = producto;
  confirmarDialog.value = true;
};

const eliminarProductoConfirmado = async () => {
  if (productoAEliminar.value) {
    const resultado = await store.eliminarProducto(productoAEliminar.value.idProducto);
    if (resultado.success) {
      mostrarSnackbar('Producto eliminado exitosamente', 'success');
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar producto', 'error');
    }
  }
  confirmarDialog.value = false;
  productoAEliminar.value = null;
};

const activarProducto = async (id: number) => {
  const resultado = await store.activarProducto(id);
  if (resultado.success) {
    mostrarSnackbar('Producto activado exitosamente', 'success');
  } else {
    mostrarSnackbar(resultado.error || 'Error al activar producto', 'error');
  }
};

const desactivarProducto = async (id: number) => {
  const resultado = await store.desactivarProducto(id);
  if (resultado.success) {
    mostrarSnackbar('Producto desactivado exitosamente', 'success');
  } else {
    mostrarSnackbar(resultado.error || 'Error al desactivar producto', 'error');
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  productoIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  formulario.nombre = '';
  formulario.descripcion = '';
  formulario.precio = 0;
  formulario.idCategoria = 0;
  formulario.tiempoPreparacion = undefined;
  formulario.disponible = true;
  formulario.imagenUrl = undefined;
  formulario.ingredientes = undefined;
  formulario.calorias = undefined;
  formulario.codigoBarras = undefined;
  formulario.marca = undefined;
  formulario.presentacion = undefined;
  formulario.requierePreparacion = false;
  formulario.esAlcoholico = false;
  formulario.estado = 'ACTIVO';
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  cargarProductos();
  categoriaStore.fetchCategorias(); // Cargar categorías para el select
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
