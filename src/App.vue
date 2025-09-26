<template>
  <v-app>
    <!-- App Bar Mejorada -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="0"
      height="64"
      class="app-bar-modern"
    >
      <v-btn icon @click="toggleDrawer" class="me-3" variant="text">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <div class="d-flex align-center">
        <v-avatar size="32" class="me-3" color="white">
          <v-icon color="primary">mdi-silverware-fork-knife</v-icon>
        </v-avatar>
        <div>
          <v-app-bar-title class="text-h6 font-weight-bold"
            >Mozaico</v-app-bar-title
          >
          <div class="text-caption text-white-70">Gestión de Restaurante</div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Breadcrumbs para contexto -->
      <v-breadcrumbs
        v-if="!$vuetify.display.mobile"
        :items="breadcrumbs"
        class="pa-0"
        color="white"
        divider="/"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :to="item.to"
            :disabled="item.disabled"
            class="text-white-70"
          >
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <!-- Actions Bar -->
      <div class="d-flex align-center">
        <!-- Search -->
        <v-btn icon variant="text" class="me-2">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <!-- Notifications with badge -->
        <v-btn icon variant="text" class="me-2">
          <v-badge color="error" content="3" offset-x="10" offset-y="10">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>

        <!-- User Menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props">
              <v-avatar size="32" color="secondary">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list min-width="200">
            <v-list-item prepend-icon="mdi-account-outline">
              <v-list-item-title>Mi Perfil</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline">
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-logout" class="text-error">
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer Mejorado -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :rail="rail"
      rail-width="72"
      permanent
      class="navigation-drawer-modern"
      color="surface"
    >
      <!-- User Profile Section -->
      <div class="pa-4 user-profile-section">
        <v-card v-if="!rail" flat color="primary" class="pa-3 rounded-lg" dark>
          <div class="d-flex align-center">
            <v-avatar class="me-3" color="white" size="40">
              <v-icon color="primary">mdi-account</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle2 font-weight-bold">Admin Usuario</div>
              <div class="text-caption text-white-70">admin@mozaico.com</div>
            </div>
            <v-chip size="x-small" color="success" variant="flat">
              <v-icon start size="12">mdi-circle</v-icon>
              Online
            </v-chip>
          </div>
        </v-card>

        <div v-else class="d-flex justify-center">
          <v-avatar color="primary" size="40">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
        </div>
      </div>

      <!-- Quick Stats (solo modo expandido) -->
      <div v-if="!rail" class="pa-4 pt-0">
        <v-row dense>
          <v-col cols="6">
            <v-card
              flat
              color="success"
              variant="tonal"
              class="pa-2 text-center"
            >
              <div class="text-h6 font-weight-bold">24</div>
              <div class="text-caption">Pedidos Hoy</div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              flat
              color="warning"
              variant="tonal"
              class="pa-2 text-center"
            >
              <div class="text-h6 font-weight-bold">12</div>
              <div class="text-caption">Mesas Activas</div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mx-3"></v-divider>

      <!-- Navigation List -->
      <v-list density="compact" nav class="pa-2">
        <template v-for="item in menuItems" :key="item.title">
          <!-- Group Items -->
          <v-list-group v-if="item.children" :value="item.title" fluid>
            <template v-slot:activator="{ props }">
              <v-tooltip :text="item.title" location="end" :disabled="!rail">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="{ ...props, ...tooltipProps }"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    color="primary"
                    rounded="lg"
                    class="mb-1 nav-item"
                  >
                    <template v-if="item.badge" v-slot:append>
                      <v-chip
                        size="x-small"
                        color="error"
                        variant="flat"
                        class="text-caption"
                      >
                        {{ item.badge }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-tooltip>
            </template>

            <!-- Sub Items -->
            <div class="sub-menu">
              <v-tooltip
                v-for="subItem in item.children"
                :key="subItem.title"
                :text="subItem.title"
                location="end"
                :disabled="!rail"
              >
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="tooltipProps"
                    :to="subItem.to"
                    :prepend-icon="subItem.icon"
                    :title="subItem.title"
                    color="primary"
                    rounded="lg"
                    class="mb-1 ms-4 nav-sub-item"
                  >
                    <template v-if="subItem.badge" v-slot:append>
                      <v-chip
                        size="x-small"
                        :color="subItem.badgeColor || 'primary'"
                        variant="flat"
                      >
                        {{ subItem.badge }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-tooltip>
            </div>
          </v-list-group>

          <!-- Single Items -->
          <v-tooltip v-else :text="item.title" location="end" :disabled="!rail">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-list-item
                v-bind="tooltipProps"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                color="primary"
                rounded="lg"
                class="mb-1 nav-item"
              >
                <template v-if="item.badge" v-slot:append>
                  <v-chip
                    size="x-small"
                    :color="item.badgeColor || 'error'"
                    variant="flat"
                  >
                    {{ item.badge }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-tooltip>
        </template>
      </v-list>

      <!-- Bottom Actions -->
      <template v-slot:append>
        <div class="pa-3">
          <!-- Theme Toggle -->
          <v-btn
            v-if="!rail"
            block
            variant="text"
            prepend-icon="mdi-theme-light-dark"
            class="mb-2 justify-start"
            @click="toggleTheme"
          >
            Tema {{ isDark ? "Claro" : "Oscuro" }}
          </v-btn>

          <!-- Rail Toggle -->
          <v-btn
            block
            @click="rail = !rail"
            :icon="rail"
            color="primary"
            variant="tonal"
            class="rail-toggle-btn"
          >
            <v-icon>{{
              rail ? "mdi-chevron-right" : "mdi-chevron-left"
            }}</v-icon>
            <span v-if="!rail" class="ms-2">Contraer Menú</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </v-main>

    <!-- Footer Mejorado -->
    <v-footer app color="surface" border class="footer-modern px-4">
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-caption">
          &copy; {{ new Date().getFullYear() }} Mozaico - Gestión de
          Restaurantes
        </span>
        <div class="d-flex align-center">
          <v-chip
            size="small"
            color="success"
            variant="flat"
            prepend-icon="mdi-wifi"
            class="me-2"
          >
            Conectado
          </v-chip>
          <span class="text-caption">v2.1.0</span>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import { useClienteStore } from "@/stores/clienteStore";

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  badge?: string | null;
  badgeColor?: string;
  children?: MenuItem[];
}

const theme = useTheme();
const drawer = ref(true);
const rail = ref(false);
const clienteStore = useClienteStore();

const isDark = computed(() => theme.current.value.dark);

const toggleDrawer = () => {
  if (rail.value) {
    rail.value = false;
  } else {
    drawer.value = !drawer.value;
  }
};

const toggleTheme = () => {
  theme.global.name.value = theme.current.value.dark ? "light" : "dark";
};

// Breadcrumbs dinámicos (puedes conectar con Vue Router)
const breadcrumbs = ref([
  { title: "Dashboard", to: "/", disabled: false },
  { title: "Gestión", disabled: true },
]);

const menuItems = computed((): MenuItem[] => [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    to: "/",
    badge: null,
  },
  {
    title: "Gestión de Usuarios",
    icon: "mdi-account-group-outline",
    children: [
      {
        title: "Usuarios",
        icon: "mdi-account-outline",
        to: "/usuarios",
      },
      {
        title: "Clientes",
        icon: "mdi-account-tie-outline",
        to: "/clientes",
        badge: clienteStore.totalClientes.toString(),
        badgeColor: "info",
      },
      {
        title: "Reservas",
        icon: "mdi-calendar-check-outline",
        to: "/reservas",
        badge: "5",
        badgeColor: "warning",
      },
    ],
  },
  {
    title: "Gestión de Productos",
    icon: "mdi-food-apple-outline",
    children: [
      {
        title: "Categorías",
        icon: "mdi-shape-outline",
        to: "/categorias",
      },
      {
        title: "Productos",
        icon: "mdi-food-apple-outline",
        to: "/productos",
      },
      {
        title: "Menú",
        icon: "mdi-food-outline",
        to: "/menu",
      },
    ],
  },
  {
    title: "Operaciones",
    icon: "mdi-table-chair",
    badge: "3",
    children: [
      {
        title: "Mesas",
        icon: "mdi-table-chair",
        to: "/mesas",
        badge: "12",
        badgeColor: "success",
      },
      {
        title: "Pedidos",
        icon: "mdi-clipboard-list-outline",
        to: "/pedidos",
        badge: "8",
        badgeColor: "error",
      },
      {
        title: "Punto de Venta (POS)",
        icon: "mdi-point-of-sale",
        to: "/pos",
      },
    ],
  },
  {
    title: "Inventario y Compras",
    icon: "mdi-package-variant-closed",
    children: [
      {
        title: "Inventario",
        icon: "mdi-package-variant-closed",
        to: "/inventario",
      },
      {
        title: "Compras",
        icon: "mdi-cart-outline",
        to: "/compras",
      },
      {
        title: "Proveedores",
        icon: "mdi-truck-delivery-outline",
        to: "/proveedores",
      },
    ],
  },
  {
    title: "Finanzas",
    icon: "mdi-cash-multiple",
    children: [
      {
        title: "Métodos de Pago",
        icon: "mdi-credit-card-outline",
        to: "/metodos-pago",
      },
      {
        title: "Transacciones",
        icon: "mdi-cash-multiple",
        to: "/pagos",
      },
    ],
  },
  {
    title: "Reportes",
    icon: "mdi-chart-line",
    to: "/reportes",
  },
  {
    title: "Configuración",
    icon: "mdi-cog-outline",
    to: "/configuracion",
  },
]);

// Cargar datos iniciales
onMounted(async () => {
  await clienteStore.fetchClientes();
});
</script>

<style scoped>
/* App Bar Moderna */
.app-bar-modern {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Navigation Drawer */
.navigation-drawer-modern {
  border-right: 1px solid rgb(var(--v-theme-surface-variant));
}

.user-profile-section {
  background: linear-gradient(
    145deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-secondary), 0.05) 100%
  );
}

/* Navigation Items */
.nav-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-item:hover {
  transform: translateX(4px);
}

.nav-sub-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.nav-sub-item:before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: rgb(var(--v-theme-primary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-sub-item.v-list-item--active:before {
  opacity: 1;
}

.sub-menu {
  position: relative;
}

/* Rail Toggle Button */
.rail-toggle-btn {
  transition: all 0.3s ease;
}

.rail-toggle-btn:hover {
  transform: scale(1.05);
}

/* Main Content */
.main-content {
  background: linear-gradient(
    145deg,
    rgba(var(--v-theme-surface), 1) 0%,
    rgba(var(--v-theme-background), 1) 100%
  );
}

.content-wrapper {
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
}

/* Footer */
.footer-modern {
  backdrop-filter: blur(10px);
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
}

/* Responsive */
@media (max-width: 959px) {
  .navigation-drawer-modern {
    z-index: 1005;
  }

  .content-wrapper {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .content-wrapper {
    padding: 12px;
  }
}

/* Smooth animations */
.v-list-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-navigation-drawer {
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Active states */
.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary));
}

.v-list-item--active .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
