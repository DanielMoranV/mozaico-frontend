<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-btn icon @click="toggleDrawer" class="me-3">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-app-bar-title>Mozaico - Gestión de Restaurante</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      :rail="rail"
      rail-width="72"
      permanent
    >
      <div class="pa-2">
        <div v-if="!rail" class="d-flex align-center">
          <v-avatar class="me-3" color="primary">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6">Administrador</div>
            <div class="text-caption text-medium-emphasis">admin@mozaico.com</div>
          </div>
        </div>
        <div v-else class="d-flex justify-center">
          <v-avatar color="primary">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
        </div>
      </div>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <template v-for="item in menuItems" :key="item.title">
          <v-list-group v-if="item.children" :value="item.title">
            <template v-slot:activator="{ props }">
              <v-tooltip :text="item.title" location="right" :disabled="!rail">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-list-item
                    v-bind="{ ...props, ...tooltipProps }"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    color="primary"
                    rounded="xl"
                    class="ma-2"
                  ></v-list-item>
                </template>
              </v-tooltip>
            </template>
            <v-tooltip v-for="subItem in item.children" :key="subItem.title" :text="subItem.title" location="right" :disabled="!rail">
              <template v-slot:activator="{ props: tooltipProps }">
                <v-list-item
                  v-bind="tooltipProps"
                  :to="subItem.to"
                  :prepend-icon="subItem.icon"
                  :title="subItem.title"
                  color="primary"
                  rounded="xl"
                  class="ma-2 ps-8"
                ></v-list-item>
              </template>
            </v-tooltip>
          </v-list-group>
          <v-tooltip v-else :text="item.title" location="right" :disabled="!rail">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-list-item
                v-bind="tooltipProps"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                color="primary"
                rounded="xl"
                class="ma-2"
              >
              </v-list-item>
            </template>
          </v-tooltip>
        </template>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            @click="rail = !rail"
            :icon="rail"
            color="primary"
            variant="tonal"
          >
            <v-icon>{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
            <span v-if="!rail" class="ms-2">Contraer</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Gestión de Restaurantes</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
const rail = ref(false);

const toggleDrawer = () => {
  if (rail.value) {
    rail.value = false;
  } else {
    drawer.value = !drawer.value;
  }
};

const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/'
  },
  {
    title: 'Gestión de Usuarios',
    icon: 'mdi-account-group',
    children: [
      {
        title: 'Usuarios',
        icon: 'mdi-account-group',
        to: '/usuarios'
      },
      {
        title: 'Clientes',
        icon: 'mdi-account-tie',
        to: '/clientes'
      },
      {
        title: 'Reservas',
        icon: 'mdi-calendar-check',
        to: '/reservas'
      },
    ]
  },
  {
    title: 'Gestión de Productos',
    icon: 'mdi-food-apple',
    children: [
      {
        title: 'Categorías',
        icon: 'mdi-shape',
        to: '/categorias'
      },
      {
        title: 'Productos',
        icon: 'mdi-food-apple',
        to: '/productos'
      },
      {
        title: 'Menú',
        icon: 'mdi-food',
        to: '/menu'
      },
    ]
  },
  {
    title: 'Gestión de Operaciones',
    icon: 'mdi-table-chair',
    children: [
      {
        title: 'Mesas',
        icon: 'mdi-table-chair',
        to: '/mesas'
      },
      {
        title: 'Pedidos',
        icon: 'mdi-clipboard-list',
        to: '/pedidos'
      },
    ]
  },
  {
    title: 'Gestión de Inventario y Compras',
    icon: 'mdi-package-variant',
    children: [
      {
        title: 'Inventario',
        icon: 'mdi-package-variant',
        to: '/inventario'
      },
      {
        title: 'Compras',
        icon: 'mdi-cart-outline',
        to: '/compras'
      },
      {
        title: 'Proveedores',
        icon: 'mdi-truck-delivery-outline',
        to: '/proveedores'
      },
    ]
  },
  {
    title: 'Gestión Financiera',
    icon: 'mdi-cash-multiple',
    children: [
      {
        title: 'Métodos de Pago',
        icon: 'mdi-credit-card-outline',
        to: '/metodos-pago'
      },
      {
        title: 'Pagos',
        icon: 'mdi-cash-multiple',
        to: '/pagos'
      },
    ]
  },
  {
    title: 'Reportes',
    icon: 'mdi-chart-bar',
    to: '/reportes'
  },
  {
    title: 'Configuración',
    icon: 'mdi-cog',
    to: '/configuracion'
  }
];
</script>

<style>
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.08) !important;
}

.v-app-bar {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12) !important;
}

@media (max-width: 959px) {
  .v-navigation-drawer {
    z-index: 1005;
  }
}
</style>