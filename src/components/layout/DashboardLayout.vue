<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      app
      color="#f5f7fa"
      elevation="0"
      :height="isMobile ? '56' : '64'"
      class="app-bar-modern"
    >
      <v-btn icon @click="toggleDrawer" class="me-3" variant="text">
        <v-icon color="#2C3E50">mdi-menu</v-icon>
      </v-btn>

      <div class="d-flex align-center">
        <img
          src="/logo_mozaico.png"
          alt="Mozaico"
          class="app-bar-logo me-3"
        />
        <div>
          <v-app-bar-title class="text-h6 font-weight-bold app-bar-title"
            >Mozaico</v-app-bar-title
          >
          <div v-if="!isMobile" class="text-caption app-bar-subtitle">Gestión de Restaurante</div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Actions Bar -->
      <div class="d-flex align-center gap-2">
        <!-- Theme Toggle -->
        <v-btn icon variant="text" @click="toggleTheme">
          <v-icon color="#2C3E50">{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>

        <!-- User Menu -->
        <UserMenu />
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :rail="rail && !isMobile"
      rail-width="72"
      :permanent="!isMobile"
      :temporary="isMobile"
      class="navigation-drawer-modern"
      color="surface"
    >
      <!-- User Profile Section -->
      <div :class="isMobile ? 'pa-3' : 'pa-4'" class="user-profile-section">
        <v-card v-if="!rail || isMobile" flat color="#f5f7fa" :class="isMobile ? 'pa-2' : 'pa-3'" class="rounded-lg user-profile-card">
          <div class="d-flex align-center">
            <v-avatar class="me-3" color="#2C3E50" :size="isMobile ? '36' : '40'">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div :class="isMobile ? 'text-body-2' : 'text-subtitle2'" class="font-weight-bold user-name">{{ user?.nombre || 'Usuario' }}</div>
              <div v-if="!isMobile" class="text-caption user-email">{{ user?.email || '' }}</div>
            </div>
            <v-chip v-if="!isMobile" size="x-small" color="#6B8E5C" variant="flat">
              <v-icon start size="12">mdi-circle</v-icon>
              Online
            </v-chip>
          </div>
        </v-card>

        <div v-else class="d-flex justify-center">
          <v-avatar color="#2C3E50" size="40">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
        </div>
      </div>

      <v-divider class="mx-3"></v-divider>

      <!-- Navigation List -->
      <v-list density="compact" nav class="pa-2">
        <template v-for="(item, index) in menuItems" :key="`${item.title}-${index}`">
          <!-- Separador Visual -->
          <v-divider
            v-if="item.separator"
            class="my-3 mx-2"
            :thickness="1"
            opacity="0.3"
          ></v-divider>

          <!-- Group Items -->
          <v-list-group
            v-else-if="item.children"
            :value="item.title"
            fluid
            :class="[
              'nav-group',
              `priority-${item.priority}`,
              { 'mb-2': item.priority === 'high' }
            ]"
          >
            <template v-slot:activator="{ props }">
              <v-tooltip :text="item.title" location="end" :disabled="!rail">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="{ ...props, ...tooltipProps }"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    color="#2C3E50"
                    rounded="lg"
                    :class="[
                      'mb-1 nav-item nav-group-header',
                      `priority-${item.priority}`
                    ]"
                  >
                    <template v-if="item.badge" v-slot:append>
                      <v-chip
                        size="x-small"
                        :color="item.badgeColor || 'primary'"
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
                    color="#2C3E50"
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
          <v-tooltip
            v-else
            :text="item.title"
            location="end"
            :disabled="!rail"
          >
            <template v-slot:activator="{ props: tooltipProps }">
              <v-list-item
                v-bind="tooltipProps"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                color="#2C3E50"
                rounded="lg"
                :class="[
                  'mb-1 nav-item',
                  `priority-${item.priority}`,
                  { 'nav-item-important': item.priority === 'high' }
                ]"
              >
                <template v-if="item.badge" v-slot:append>
                  <v-chip
                    size="x-small"
                    :color="item.badgeColor || 'error'"
                    variant="flat"
                    :class="{ 'pulse-animation': item.priority === 'high' && item.badge }"
                  >
                    {{ item.badge }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-tooltip>
        </template>
      </v-list>

      <!-- Bottom Actions - Solo en desktop -->
      <template v-slot:append>
        <div v-if="!isMobile" class="pa-3">
          <!-- Rail Toggle - Solo en desktop -->
          <v-btn
            block
            @click="rail = !rail"
            :icon="rail"
            color="#2C3E50"
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

      <!-- Botón flotante del menú - Solo móviles -->
      <v-fab
        v-if="isMobile"
        icon="mdi-menu"
        color="#D4A03E"
        size="large"
        class="floating-menu-btn"
        @click="toggleDrawer"
        elevation="8"
      />
    </v-main>

    <!-- Footer - Oculto en móviles -->
    <v-footer v-if="!isMobile" app color="surface" border class="footer-modern px-4">
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-caption">
          &copy; {{ new Date().getFullYear() }} Mozaico - Sistema de Gestión Restaurante
        </span>
        <div class="d-flex align-center">
          <v-chip
            size="small"
            color="#6B8E5C"
            variant="flat"
            prepend-icon="mdi-wifi"
            class="me-2 status-chip"
          >
            <v-icon start size="12" class="pulse-dot">mdi-circle</v-icon>
            Online
          </v-chip>
          <v-chip
            size="small"
            color="#2C3E50"
            variant="outlined"
            class="me-2"
          >
            v2.1.0
          </v-chip>
          <v-chip
            size="small"
            color="#D4A03E"
            variant="text"
            prepend-icon="mdi-account-outline"
          >
            {{ new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) }}
          </v-chip>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { useRoute } from "vue-router";
import { useClienteStore } from "@/stores/clienteStore";
import { useAuth } from "@/stores/authStore";
import UserMenu from "@/components/auth/UserMenu.vue";

interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  badge?: string | null;
  badgeColor?: string;
  children?: MenuItem[];
  separator?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const theme = useTheme();
const { mobile } = useDisplay();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const clienteStore = useClienteStore();

// Autenticación
const { user, isAuthenticated } = useAuth();

const isDark = computed(() => theme.current.value.dark);
const isMobile = computed(() => mobile.value);

// Cerrar drawer automáticamente en móviles al cambiar de ruta
watch(() => route.path, () => {
  if (isMobile.value) {
    drawer.value = false;
  }
});

const toggleDrawer = () => {
  if (isMobile.value) {
    drawer.value = !drawer.value;
  } else if (rail.value) {
    rail.value = false;
  } else {
    drawer.value = !drawer.value;
  }
};

const toggleTheme = () => {
  theme.global.name.value = theme.current.value.dark ? "light" : "dark";
};

const menuItems = computed((): MenuItem[] => [
  // Dashboard
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-variant-outline",
    to: "/dashboard",
    priority: "high",
  },
  {
    title: "",
    icon: "",
    separator: true,
  },
  // Operaciones diarias
  {
    title: "Punto de Venta",
    icon: "mdi-point-of-sale",
    to: "/pos",
    badge: "LIVE",
    badgeColor: "error",
    priority: "high",
  },
  {
    title: "Cocina (KDS)",
    icon: "mdi-chef-hat",
    to: "/cocina",
    badge: "12",
    badgeColor: "info",
    priority: "high",
  },
  {
    title: "Pedidos Activos",
    icon: "mdi-clipboard-list-outline",
    to: "/pedidos",
    badge: "8",
    badgeColor: "warning",
    priority: "high",
  },
  {
    title: "Mesas",
    icon: "mdi-table-chair",
    to: "/mesas",
    badge: "12/20",
    badgeColor: "success",
    priority: "high",
  },
  {
    title: "Reservas",
    icon: "mdi-calendar-check-outline",
    to: "/reservas",
    badge: "5",
    badgeColor: "info",
    priority: "medium",
  },
  {
    title: "",
    icon: "",
    separator: true,
  },
  // Gestión de productos
  {
    title: "Catálogo de Productos",
    icon: "mdi-food-variant",
    priority: "medium",
    children: [
      {
        title: "Productos",
        icon: "mdi-food-apple-outline",
        to: "/productos",
        badge: "156",
        badgeColor: "info",
      },
      {
        title: "Categorías",
        icon: "mdi-shape-outline",
        to: "/categorias",
      },
      {
        title: "Menús Activos",
        icon: "mdi-book-open-page-variant-outline",
        to: "/menu",
        badge: "3",
        badgeColor: "success",
      },
    ],
  },
  // Inventario y compras
  {
    title: "Inventario",
    icon: "mdi-warehouse",
    priority: "medium",
    children: [
      {
        title: "Stock Actual",
        icon: "mdi-package-variant-closed",
        to: "/inventario",
        badge: "LOW",
        badgeColor: "error",
      },
      {
        title: "Órdenes de Compra",
        icon: "mdi-cart-plus",
        to: "/compras",
        badge: "3",
        badgeColor: "warning",
      },
      {
        title: "Proveedores",
        icon: "mdi-truck-delivery-outline",
        to: "/proveedores",
      },
    ],
  },
  // Gestión de clientes
  {
    title: "Clientes y CRM",
    icon: "mdi-account-group-outline",
    priority: "medium",
    children: [
      {
        title: "Base de Clientes",
        icon: "mdi-account-multiple-outline",
        to: "/clientes",
        badge: clienteStore.totalClientes.toString(),
        badgeColor: "info",
      },
    ],
  },
  // Finanzas y reportes
  {
    title: "Finanzas",
    icon: "mdi-cash-multiple",
    priority: "medium",
    children: [
      {
        title: "Caja y Transacciones",
        icon: "mdi-cash-register",
        to: "/pagos",
        badge: "HOY: S/1,250",
        badgeColor: "success",
      },
      {
        title: "Comprobantes",
        icon: "mdi-receipt-text",
        to: "/comprobantes",
      },
      {
        title: "Métodos de Pago",
        icon: "mdi-credit-card-multiple-outline",
        to: "/metodos-pago",
      },
      {
        title: "Reportes y Analytics",
        icon: "mdi-chart-line",
        to: "/reportes",
      },
    ],
  },
  {
    title: "",
    icon: "",
    separator: true,
  },
  // Administración del sistema
  {
    title: "Administración",
    icon: "mdi-shield-account-outline",
    priority: "low",
    children: [
      {
        title: "Usuarios del Sistema",
        icon: "mdi-account-tie-outline",
        to: "/usuarios",
        badge: "5",
        badgeColor: "info",
      },
      {
        title: "Configuración General",
        icon: "mdi-cog-outline",
        to: "/configuracion",
      },
    ],
  },
]);

// Cargar datos iniciales
onMounted(async () => {
  // Solo cargar datos si el usuario está autenticado
  if (isAuthenticated.value) {
    try {
      await clienteStore.fetchClientes();
    } catch (error) {
      console.warn('Error cargando datos iniciales:', error);
    }
  }
});
</script>

<style scoped>
/* App Bar Moderna */
.app-bar-modern {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(44, 62, 80, 0.08);
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.06) !important;
}

.app-bar-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(44, 62, 80, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(44, 62, 80, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  pointer-events: none;
}

.app-bar-title {
  color: #2C3E50 !important;
  letter-spacing: -0.5px;
}

.app-bar-subtitle {
  color: rgba(44, 62, 80, 0.7) !important;
}

.app-bar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.app-bar-logo:hover {
  transform: scale(1.05);
}

.gap-2 {
  gap: 8px;
}

/* Navigation Drawer */
.navigation-drawer-modern {
  border-right: 1px solid rgb(var(--v-theme-surface-variant));
}

.user-profile-section {
  background: linear-gradient(
    145deg,
    rgba(44, 62, 80, 0.03) 0%,
    rgba(212, 160, 62, 0.03) 100%
  );
}

.user-profile-card {
  border: 1px solid rgba(44, 62, 80, 0.08) !important;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.08) !important;
  transition: all 0.3s ease;
}

.user-profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.12) !important;
}

.user-name {
  color: #2C3E50 !important;
}

.user-email {
  color: rgba(44, 62, 80, 0.7) !important;
}

/* Navigation Items */
.nav-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-item:hover {
  transform: translateX(4px);
}

/* Priority-based styling */
.priority-high {
  font-weight: 600;
}

.priority-high .v-list-item__prepend .v-icon {
  color: #2C3E50 !important;
}

.nav-item-important {
  background: rgba(44, 62, 80, 0.04) !important;
  border: 1px solid rgba(44, 62, 80, 0.12);
}

.nav-item-important:hover {
  background: rgba(44, 62, 80, 0.08) !important;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.15);
}

/* Group headers */
.nav-group-header {
  font-weight: 500;
}

.nav-group-header .v-list-item__prepend .v-icon {
  opacity: 0.8;
}

.nav-group .priority-medium .nav-group-header {
  opacity: 0.9;
}

.nav-group .priority-low .nav-group-header {
  opacity: 0.7;
}

/* Sub Items */
.nav-sub-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  opacity: 0.85;
}

.nav-sub-item:hover {
  opacity: 1;
}

.nav-sub-item:before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: #2C3E50;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-sub-item.v-list-item--active:before {
  opacity: 1;
}

.sub-menu {
  position: relative;
  border-left: 1px solid rgba(var(--v-theme-surface-variant), 0.3);
  margin-left: 12px;
  padding-left: 8px;
}

/* Badge animations */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Badge colors by context */
.v-chip.text-caption {
  font-size: 0.65rem !important;
  font-weight: 600;
}

/* Spacing improvements */
.nav-group .mb-2 {
  margin-bottom: 16px;
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
  position: relative;
}

.content-wrapper {
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
}

/* Botón flotante del menú */
.floating-menu-btn {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  animation: fadeInUp 0.3s ease-out;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 50% !important;
  overflow: hidden;
}

.floating-menu-btn :deep(.v-btn__content) {
  border-radius: 50%;
}

.floating-menu-btn :deep(.v-btn__overlay),
.floating-menu-btn :deep(.v-ripple__container) {
  border-radius: 50% !important;
}

.floating-menu-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
}

.floating-menu-btn:active {
  transform: scale(0.95);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.footer-modern {
  backdrop-filter: blur(10px);
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
}

.status-chip {
  animation: subtle-pulse 3s infinite;
}

.pulse-dot {
  animation: pulse-dot 2s infinite;
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.8);
  }
}

/* Responsive */
@media (max-width: 959px) {
  .navigation-drawer-modern {
    z-index: 1005;
  }

  .content-wrapper {
    padding: 16px;
  }

  /* App bar más compacto en tablets */
  .app-bar-modern {
    height: 60px !important;
  }

  .app-bar-logo {
    width: 36px;
    height: 36px;
  }

  /* Ajustar tamaño de avatar */
  .user-profile-section .v-avatar {
    width: 36px !important;
    height: 36px !important;
  }
}

@media (max-width: 600px) {
  .content-wrapper {
    padding: 8px;
  }

  /* App bar más compacto en móviles */
  .app-bar-modern {
    height: 56px !important;
  }

  .app-bar-logo {
    width: 32px;
    height: 32px;
  }

  .app-bar-modern .v-toolbar__content {
    padding: 4px 8px !important;
  }

  /* Ajustar espaciado de botones en app bar */
  .app-bar-modern .v-btn {
    margin: 0 2px;
  }

  /* Hacer los items del menú más grandes para mejor touch */
  .nav-item,
  .nav-sub-item {
    min-height: 48px !important;
    padding: 8px 12px !important;
  }

  /* Reducir padding del drawer */
  .navigation-drawer-modern .v-list {
    padding: 8px 8px !important;
  }

  /* Chips más pequeños en móvil */
  .nav-item .v-chip,
  .nav-sub-item .v-chip {
    font-size: 0.6rem !important;
    height: 18px !important;
    min-width: 18px !important;
  }

  /* Ajustar divider */
  .user-profile-section + .v-divider {
    margin: 8px 12px !important;
  }

  /* Botón flotante en móviles */
  .floating-menu-btn {
    bottom: 20px !important;
    right: 20px !important;
  }
}

@media (max-width: 400px) {
  .content-wrapper {
    padding: 4px;
  }

  /* Ultra compacto para pantallas muy pequeñas */
  .app-bar-modern .me-3 {
    margin-right: 8px !important;
  }

  .app-bar-logo {
    width: 28px;
    height: 28px;
  }

  .app-bar-modern .v-avatar {
    width: 28px !important;
    height: 28px !important;
  }

  /* Botón flotante más cerca del borde en pantallas pequeñas */
  .floating-menu-btn {
    bottom: 16px !important;
    right: 16px !important;
    width: 56px !important;
    height: 56px !important;
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
  background: rgba(44, 62, 80, 0.12) !important;
  color: #2C3E50;
}

.v-list-item--active .v-icon {
  color: #2C3E50 !important;
}
</style>