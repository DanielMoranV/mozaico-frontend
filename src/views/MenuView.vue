<template>
  <v-container fluid>
    <v-card>
      <MenuHeader
        :show-filters="showFilters"
        @crear-menu="abrirDialogoCrear"
        @toggle-filters="showFilters = !showFilters"
      />

      <v-card-text>
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar por nombre, descripción..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @keyup.enter="realizarBusqueda"
        />

        <MenuFilters
          v-model="searchCriteria"
          :show="showFilters"
          @buscar="realizarBusqueda"
          @limpiar="limpiarBusqueda"
        />

        <MenuTable
          :menus="store.menus"
          :loading="store.loading"
          :headers="headers"
          :selected-menu-id="selectedMenuId"
          @editar-menu="editarMenu"
          @confirmar-eliminar="confirmarEliminar"
          @toggle-expand="toggleExpand"
        />
      </v-card-text>
    </v-card>

    <MenuEditDialog
      :mostrar="dialogo.mostrar"
      @update:mostrar="dialogo.mostrar = $event"
      :editando="dialogo.editando"
      :formulario="formulario"
      :loading="store.loading"
      :reglas-validacion="reglasValidacion"
      @guardar-menu="guardarMenu"
    />

    <MenuDeleteConfirmDialog
      :mostrar="confirmarDialog"
      @update:mostrar="confirmarDialog = $event"
      :menu-a-eliminar="menuAEliminar"
      :loading="store.loading"
      @eliminar-confirmado="eliminarMenuConfirmado"
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
import { useMenuStore } from '@/stores/menuStore';
import type { MenuResponseDTO, MenuRequestDTO, MenuSearchParams } from '@/types/menu';
import MenuHeader from '@/components/menus/MenuHeader.vue';
import MenuFilters from '@/components/menus/MenuFilters.vue';
import MenuTable from '@/components/menus/MenuTable.vue';
import MenuEditDialog from '@/components/menus/MenuEditDialog.vue';
import MenuDeleteConfirmDialog from '@/components/menus/MenuDeleteConfirmDialog.vue';

const store = useMenuStore();

const headers = [
  { title: 'ID', key: 'idMenu', sortable: true },
  { title: '', key: 'data-table-expand', width: '40px' }, // Expand icon column
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Descripción', key: 'descripcion', sortable: true },
  { title: 'Precio', key: 'precio', sortable: true },
  { title: 'Disponible', key: 'disponible', sortable: true },
  { title: 'Fecha Inicio', key: 'fechaInicio', sortable: true },
  { title: 'Fecha Fin', key: 'fechaFin', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const showFilters = ref(false);
const searchTerm = ref('');
const selectedMenuId = ref<number | null>(null); // New ref for expanded row

const searchCriteria = reactive<Omit<MenuSearchParams, 'searchTerm'>>({
  nombre: '',
  disponible: undefined,
  fechaInicioDesde: undefined,
  fechaInicioHasta: undefined,
  fechaFinDesde: undefined,
  fechaFinHasta: undefined,
  logic: 'AND',
});

const dialogo = reactive({
  mostrar: false,
  editando: false,
});

const formulario = reactive<MenuRequestDTO>({
  nombre: '',
  descripcion: undefined,
  precio: 0,
  disponible: true,
  fechaInicio: undefined,
  fechaFin: undefined,
  productosIds: [],
});

const menuIdActual = ref<number | null>(null);
const menuAEliminar = ref<MenuResponseDTO | null>(null);
const confirmarDialog = ref(false);

const snackbar = reactive({
  mostrar: false,
  mensaje: '',
  color: 'success',
});

const reglasValidacion = {
  requerido: (v: any) => !!v || 'Este campo es requerido',
  numeroPositivo: (v: number) => v > 0 || 'Debe ser un número positivo',
};

const realizarBusqueda = async () => {
  const criteriaToSend: MenuSearchParams = {
    ...searchCriteria,
    searchTerm: searchTerm.value || undefined,
  };
  store.setBusquedaParams(criteriaToSend);
  await store.buscarMenus();
  if (store.error) {
    mostrarSnackbar(store.error, 'error');
  }
};

const limpiarBusqueda = async () => {
  searchTerm.value = '';
  Object.assign(searchCriteria, {
    nombre: '',
    disponible: undefined,
    fechaInicioDesde: undefined,
    fechaInicioHasta: undefined,
    fechaFinDesde: undefined,
    fechaFinHasta: undefined,
    logic: 'AND',
  });
  store.setBusquedaParams({});
  await store.buscarMenus();
};

const abrirDialogoCrear = () => {
  limpiarFormulario();
  dialogo.editando = false;
  dialogo.mostrar = true;
};

const editarMenu = (menu: MenuResponseDTO) => {
  menuIdActual.value = menu.idMenu;
  Object.assign(formulario, {
    nombre: menu.nombre,
    descripcion: menu.descripcion,
    precio: menu.precio,
    disponible: menu.disponible,
    fechaInicio: menu.fechaInicio,
    fechaFin: menu.fechaFin,
    productosIds: menu.productos.map(p => p.idProducto), // Map associated products
  });
  dialogo.editando = true;
  dialogo.mostrar = true;
};

const guardarMenu = async () => {
  let resultado;
  if (dialogo.editando && menuIdActual.value) {
    const payload: MenuRequestDTO = { ...formulario };
    resultado = await store.actualizarMenu(menuIdActual.value, payload);
  } else {
    const payload: MenuRequestDTO = { ...formulario };
    resultado = await store.crearMenu(payload);
  }

  if (resultado?.success) {
    mostrarSnackbar(
      dialogo.editando ? 'Menú actualizado exitosamente' : 'Menú creado exitosamente',
      'success'
    );
    cerrarDialogo();
    await realizarBusqueda();
  } else {
    mostrarSnackbar(resultado?.error || 'Error al guardar menú', 'error');
  }
};

const confirmarEliminar = (menu: MenuResponseDTO) => {
  menuAEliminar.value = menu;
  confirmarDialog.value = true;
};

const eliminarMenuConfirmado = async () => {
  if (menuAEliminar.value) {
    const resultado = await store.eliminarMenu(menuAEliminar.value.idMenu);
    if (resultado.success) {
      mostrarSnackbar('Menú eliminado exitosamente', 'success');
      await realizarBusqueda();
    } else {
      mostrarSnackbar(resultado.error || 'Error al eliminar menú', 'error');
    }
  }
  confirmarDialog.value = false;
  menuAEliminar.value = null;
};

const toggleExpand = async (menu: MenuResponseDTO) => {
  if (selectedMenuId.value === menu.idMenu) {
    selectedMenuId.value = null;
  } else {
    selectedMenuId.value = menu.idMenu;
    // No need to fetch details here, as products are already in menu.productos
  }
};

const cerrarDialogo = () => {
  dialogo.mostrar = false;
  menuIdActual.value = null;
  limpiarFormulario();
};

const limpiarFormulario = () => {
  Object.assign(formulario, {
    nombre: '',
    descripcion: undefined,
    precio: 0,
    disponible: true,
    fechaInicio: undefined,
    fechaFin: undefined,
    productosIds: [],
  });
};

const mostrarSnackbar = (mensaje: string, color: string) => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.mostrar = true;
};

onMounted(() => {
  realizarBusqueda();
});
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
