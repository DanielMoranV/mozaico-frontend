<template>
  <v-container fluid>
    <v-card>
      <ProductosHeader
        :show-filters="showFilters"
        @crear-producto="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en nombre, descripción, código de barras..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <ProductosFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <ProductosTable
          :productos="store.productos"
          :loading="store.loading"
          :headers="headers"
          @editar-producto="editarProducto"
          @confirmar-eliminar="confirmarEliminar"
          @activar-producto="activarProducto"
          @desactivar-producto="desactivarProducto"
        />
      </v-card-text>
    </v-card>

    <ProductoEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-producto="guardarProducto"
      @subir-imagen="manejarSubidaImagen"
    />

    <ProductoDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :producto-a-eliminar="productoAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarProductoConfirmado"
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
import { useProductoStore } from '@/stores/productoStore';
import { useCategoriaStore } from '@/stores/categoriaStore';
import type { ProductoRequestDTO, ProductoResponseDTO, ProductoUpdateDTO, EstadoProducto, ProductoSearchCriteria } from '@/types/producto';
import ProductosHeader from '@/components/productos/ProductosHeader.vue';
import ProductosFilters from '@/components/productos/ProductosFilters.vue';
import ProductosTable from '@/components/productos/ProductosTable.vue';
import ProductoEditDialog from '@/components/productos/ProductoEditDialog.vue';
import ProductoDeleteConfirmDialog from '@/components/productos/ProductoDeleteConfirmDialog.vue';

const store = useProductoStore();
const categoriaStore = useCategoriaStore();

const headers = [
  { title: 'ID', key: 'idProducto', sortable: true },
  { title: 'Imagen', key: 'imagenUrl', sortable: false },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Categoría', key: 'categoria.nombre', sortable: true },
  { title: 'Precio', key: 'precio', sortable: true },
  { title: 'Disponible', key: 'disponible', sortable: true },
  { title: 'Requiere Prep.', key: 'requierePreparacion', sortable: true },
  { title: 'Es Alcohólico', key: 'esAlcoholico', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');

const searchCriteria = reactive<Omit<ProductoSearchCriteria, 'searchTerm'>>({
  nombre: '',
  idCategoria: undefined,
  disponible: undefined,
  estado: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<ProductoRequestDTO>({
  nombre: '',
  descripcion: undefined,
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

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

const cargarProductos = async () => {
  await store.fetchProductos();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const realizarBusqueda = async () => {
  const criteriaToSend: ProductoSearchCriteria = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarProductos();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    nombre: '',
    idCategoria: undefined,
    disponible: undefined,
    estado: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarProductos();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarProducto = (producto: ProductoResponseDTO) => {
  productoIdActual.value = producto.idProducto;
  Object.assign(formulario, {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    idCategoria: producto.categoria.idCategoria,
    tiempoPreparacion: producto.tiempoPreparacion,
    disponible: producto.disponible,
    imagenUrl: producto.imagenUrl,
    ingredientes: producto.ingredientes,
    calorias: producto.calorias,
    codigoBarras: producto.codigoBarras,
    marca: producto.marca,
    presentacion: producto.presentacion,
    requierePreparacion: producto.requierePreparacion,
    esAlcoholico: producto.esAlcoholico,
    estado: producto.estado,
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarProducto = async () => {
  let resultado;
  if (dialogo.editando && productoIdActual.value) {
    const payload: ProductoUpdateDTO = { ...formulario };
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
    await cargarProductos();
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
      await cargarProductos();
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
  Object.assign(formulario, {
    nombre: '',
    descripcion: undefined,
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
};

const manejarSubidaImagen = async (evento: Event) => {
  const target = evento.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file || !productoIdActual.value) {
    return;
  }

  const resultado = await store.uploadProductImage(productoIdActual.value, file);

  if (resultado?.success && resultado.data) {
    formulario.imagenUrl = resultado.data.imagenUrl; // Actualizar la URL en el formulario
    mostrarSnackbar('Imagen subida exitosamente', 'success');
  } else {
    mostrarSnackbar(resultado?.error || 'Error al subir la imagen', 'error');
  }
};

onMounted(() => {
  realizarBusqueda();
  categoriaStore.fetchCategorias(); // Cargar categorías para el select
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>