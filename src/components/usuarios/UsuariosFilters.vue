<template>
  <v-card class="pa-4 mb-4" flat>
    <v-row align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchTerm"
          label="Búsqueda Global"
          placeholder="Buscar en nombre, username, email, documento..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          @keyup.enter="aplicarFiltros"
          @input="onSearchInput"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex justify-end align-center flex-wrap ga-2"
      >
        <v-btn
          color="info"
          variant="outlined"
          size="small"
          @click="toggleAdvancedFilters"
          :disabled="loading"
        >
          <v-icon size="16" class="mr-1">
            {{ showAdvancedFilters ? "mdi-chevron-up" : "mdi-chevron-down" }}
          </v-icon>
          {{ showAdvancedFilters ? "Ocultar" : "Filtros" }}
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          @click="aplicarFiltros"
          :loading="loading"
          :disabled="!hasFilters"
        >
          <v-icon size="16" class="mr-1">mdi-filter</v-icon>
          Aplicar
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          size="small"
          @click="limpiarFiltros"
          :disabled="loading || !hasAnyFilter"
        >
          <v-icon size="16" class="mr-1">mdi-filter-off</v-icon>
          Limpiar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Indicador de filtros activos -->
    <v-row v-if="hasActiveFilters && !showAdvancedFilters" class="mt-2">
      <v-col cols="12">
        <v-chip-group>
          <v-chip
            v-for="filter in activeFilters"
            :key="filter.key"
            closable
            color="primary"
            variant="outlined"
            size="small"
            @click:close="clearSpecificFilter(filter.key)"
          >
            {{ filter.label }}: {{ filter.value }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="showAdvancedFilters">
        <v-divider class="my-4"></v-divider>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.nombre"
              label="Nombre"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @input="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.username"
              label="Username"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @input="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.email"
              label="Email"
              type="email"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @input="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.tipoUsuario"
              :items="tiposUsuarioItems"
              label="Tipo de Usuario"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:model-value="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.estado"
              :items="estadosUsuarioItems"
              label="Estado"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:model-value="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.tipoDocumentoIdentidad"
              :items="tiposDocumentoIdentidadItems"
              label="Tipo Documento"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @update:model-value="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.numeroDocumento"
              label="Número Documento"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @input="onFilterChange"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-radio-group
              v-model="filters.logic"
              inline
              label="Lógica de combinación"
              hide-details
              @update:model-value="onFilterChange"
            >
              <v-radio label="AND" value="AND"></v-radio>
              <v-radio label="OR" value="OR"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center">
            <v-switch
              v-model="autoApplyFilters"
              label="Aplicar automáticamente"
              color="primary"
              hide-details
              density="compact"
            />
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useUsuarioStore } from "@/stores/usuarioStore";
import { TipoUsuario, EstadoUsuario, TipoDocumentoIdentidad } from "@/types";
// Implementación propia de debounce (sin dependencias externas)
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface Filters {
  nombre?: string;
  username?: string;
  email?: string;
  tipoUsuario?: TipoUsuario;
  estado?: EstadoUsuario;
  tipoDocumentoIdentidad?: TipoDocumentoIdentidad;
  numeroDocumento?: string;
  logic: "AND" | "OR";
}

// Props y emits
const emit = defineEmits<{
  filtersChanged: [filters: any];
  filtersApplied: [filters: any];
  filtersCleared: [];
}>();

// Store
const usuarioStore = useUsuarioStore();

// Estado reactivo
const searchTerm = ref<string>("");
const showAdvancedFilters = ref(false); // Inicializar como false por defecto
const autoApplyFilters = ref(false);
const loading = ref(false);

const filters = ref<Filters>({
  nombre: undefined,
  username: undefined,
  email: undefined,
  tipoUsuario: undefined,
  estado: undefined,
  tipoDocumentoIdentidad: undefined,
  numeroDocumento: undefined,
  logic: "AND",
});

// Items para selects
const tiposUsuarioItems = computed(() =>
  Object.values(TipoUsuario).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);

const estadosUsuarioItems = computed(() =>
  Object.values(EstadoUsuario).map((estado) => ({
    title: estado,
    value: estado,
  }))
);

const tiposDocumentoIdentidadItems = computed(() =>
  Object.values(TipoDocumentoIdentidad).map((tipo) => ({
    title: tipo,
    value: tipo,
  }))
);

// Computed properties
const hasFilters = computed(() => {
  return (
    searchTerm.value ||
    Object.values(filters.value).some(
      (value) => value !== undefined && value !== "" && value !== "AND"
    )
  );
});

const hasAnyFilter = computed(() => {
  return (
    searchTerm.value ||
    Object.values(filters.value).some(
      (value) => value !== undefined && value !== ""
    )
  );
});

const hasActiveFilters = computed(() => {
  return Object.entries(filters.value).some(
    ([key, value]) => key !== "logic" && value !== undefined && value !== ""
  );
});

const activeFilters = computed(() => {
  const active = [];

  if (searchTerm.value) {
    active.push({
      key: "searchTerm",
      label: "Búsqueda",
      value: searchTerm.value,
    });
  }

  Object.entries(filters.value).forEach(([key, value]) => {
    if (key !== "logic" && value !== undefined && value !== "") {
      const labels: Record<string, string> = {
        nombre: "Nombre",
        username: "Username",
        email: "Email",
        tipoUsuario: "Tipo Usuario",
        estado: "Estado",
        tipoDocumentoIdentidad: "Tipo Doc.",
        numeroDocumento: "N° Doc.",
      };

      active.push({
        key,
        label: labels[key] || key,
        value: value.toString(),
      });
    }
  });

  return active;
});

// Métodos
const initializeFilters = () => {
  const params = usuarioStore.busquedaParams;

  searchTerm.value = params.searchTerm || "";
  filters.value = {
    nombre: params.nombre,
    username: params.username,
    email: params.email,
    tipoUsuario: params.tipoUsuario,
    estado: params.estado,
    tipoDocumentoIdentidad: params.tipoDocumentoIdentidad,
    numeroDocumento: params.numeroDocumento,
    logic: params.logic || "AND",
  };

  // Solo mostrar filtros avanzados si hay filtros específicos activos
  const hasAdvancedFilters = Object.entries(filters.value).some(
    ([key, value]) => key !== "logic" && value !== undefined && value !== ""
  );

  showAdvancedFilters.value = hasAdvancedFilters;
};

const aplicarFiltros = async () => {
  loading.value = true;

  try {
    const params = {
      searchTerm: searchTerm.value || undefined,
      ...Object.fromEntries(
        Object.entries(filters.value).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ])
      ),
    };

    usuarioStore.setBusquedaParams(params);
    await usuarioStore.buscarUsuarios();

    emit("filtersApplied", params);
  } catch (error) {
    console.error("Error aplicando filtros:", error);
  } finally {
    loading.value = false;
  }
};

const limpiarFiltros = () => {
  searchTerm.value = "";
  filters.value = {
    nombre: undefined,
    username: undefined,
    email: undefined,
    tipoUsuario: undefined,
    estado: undefined,
    tipoDocumentoIdentidad: undefined,
    numeroDocumento: undefined,
    logic: "AND",
  };

  usuarioStore.setBusquedaParams({});
  usuarioStore.buscarUsuarios();
  showAdvancedFilters.value = false;

  emit("filtersCleared");
};

const clearSpecificFilter = (filterKey: string) => {
  if (filterKey === "searchTerm") {
    searchTerm.value = "";
  } else if (filterKey === "logic") {
    filters.value.logic = "AND"; // Reset logic to default
  } else {
    filters.value[filterKey as keyof Omit<Filters, 'logic'>] = undefined;
  }

  if (autoApplyFilters.value) {
    debouncedApplyFilters();
  }
};

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

// Debounced functions
const debouncedApplyFilters = debounce(() => {
  if (autoApplyFilters.value) {
    aplicarFiltros();
  }
}, 500);

const onSearchInput = () => {
  emit("filtersChanged", { searchTerm: searchTerm.value });

  if (autoApplyFilters.value) {
    debouncedApplyFilters();
  }
};

const onFilterChange = () => {
  emit("filtersChanged", filters.value);

  if (autoApplyFilters.value) {
    debouncedApplyFilters();
  }
};

// Watchers
watch(searchTerm, (newVal) => {
  if (autoApplyFilters.value && newVal !== undefined) {
    debouncedApplyFilters();
  }
});

// Lifecycle
onMounted(() => {
  initializeFilters();
});

// Exponer métodos para uso externo
defineExpose({
  aplicarFiltros,
  limpiarFiltros,
  hasActiveFilters,
});
</script>

<style scoped>
.v-chip-group {
  gap: 8px;
}

.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}
</style>
