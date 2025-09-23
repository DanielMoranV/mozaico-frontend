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
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          rounded="xl"
          class="ma-2"
        >
        </v-list-item>
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
    title: 'Usuarios',
    icon: 'mdi-account-group',
    to: '/usuarios'
  },
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
    title: 'Mesas',
    icon: 'mdi-table-chair',
    to: '/mesas'
  },
  {
    title: 'Menú',
    icon: 'mdi-food',
    to: '/menu'
  },
  {
    title: 'Pedidos',
    icon: 'mdi-clipboard-list',
    to: '/pedidos'
  },
  {
    title: 'Inventario',
    icon: 'mdi-package-variant',
    to: '/inventario'
  },
  {
    title: 'Reportes',
    icon: 'mdi-chart-bar',
    to: '/reportes'
  },
  {
    title: 'Clientes',
    icon: 'mdi-account-tie',
    to: '/clientes'
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