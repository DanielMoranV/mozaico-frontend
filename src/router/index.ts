import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import type { Permission } from '../types/auth';
import { authService } from '../services/authService';

// Vistas de autenticación
import LoginView from '../views/LoginView.vue';

// Vista pública
import CartaDigitalView from '../views/CartaDigitalView.vue';

// Vistas principales
import DashboardView from '../views/DashboardView.vue';
import UsuariosView from '../views/UsuariosView.vue';
import MesasView from '../views/MesasView.vue';
import MenuView from '../views/MenuView.vue';
import PedidosView from '../views/PedidosView.vue';
import InventarioView from '../views/InventarioView.vue';
import ReportesView from '../views/ReportesView.vue';
import ClientesView from '../views/ClientesView.vue';
import ConfiguracionView from '../views/ConfiguracionView.vue';
import CategoriasView from '../views/CategoriasView.vue';
import ProductosView from '../views/ProductosView.vue';
import ComprasView from '../views/ComprasView.vue';
import MetodosPagoView from '../views/MetodosPagoView.vue';
import PagosView from '../views/PagosView.vue';
import ComprobantesView from '../views/ComprobantesView.vue';
import ProveedoresView from '../views/ProveedoresView.vue';
import ReservasView from '../views/ReservasView.vue';
import KitchenView from '../views/KitchenView.vue';

const routes: RouteRecordRaw[] = [
  // Ruta de login
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },

  // Carta Digital Pública (sin autenticación)
  {
    path: '/carta/:slug',
    name: 'CartaDigital',
    component: CartaDigitalView,
    meta: {
      requiresAuth: false,
      title: 'Carta Digital'
    }
  },

  // Redirección del root al dashboard
  {
    path: '/',
    redirect: '/dashboard'
  },

  // Dashboard - Acceso para todos los usuarios autenticados
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
  },

  // Gestión de usuarios - Solo Admin y Super Admin
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_USERS'],
      title: 'Gestión de Usuarios'
    }
  },

  // Categorías - Admin, Gerente
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Categorías'
    }
  },

  // Productos - Admin, Gerente
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Productos'
    }
  },

  // Compras - Admin, Gerente
  {
    path: '/compras',
    name: 'Compras',
    component: ComprasView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Compras'
    }
  },

  // Métodos de pago - Admin, Gerente, Cajero
  {
    path: '/metodos-pago',
    name: 'MetodosPago',
    component: MetodosPagoView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_PAYMENTS', 'ALL_PERMISSIONS'],
      title: 'Métodos de Pago'
    }
  },

  // Pagos - Admin, Gerente, Cajero
  {
    path: '/pagos',
    name: 'Pagos',
    component: PagosView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_PAYMENTS', 'ALL_PERMISSIONS'],
      title: 'Pagos'
    }
  },

  // Comprobantes - Admin, Gerente, Cajero
  {
    path: '/comprobantes',
    name: 'Comprobantes',
    component: ComprobantesView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_PAYMENTS', 'VIEW_REPORTS', 'ALL_PERMISSIONS'],
      title: 'Comprobantes'
    }
  },

  // Proveedores - Admin, Gerente
  {
    path: '/proveedores',
    name: 'Proveedores',
    component: ProveedoresView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Proveedores'
    }
  },

  // Reservas - Admin, Gerente, Mesero (ver), Admin/Gerente (gestionar)
  {
    path: '/reservas',
    name: 'Reservas',
    component: ReservasView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_RESERVATIONS', 'VIEW_RESERVATIONS', 'ALL_PERMISSIONS'],
      title: 'Reservas'
    }
  },

  // Mesas - Admin, Mesero
  {
    path: '/mesas',
    name: 'Mesas',
    component: MesasView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_TABLES', 'ALL_PERMISSIONS'],
      title: 'Mesas'
    }
  },

  // Menú - Admin, Gerente
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Menú'
    }
  },

  // Pedidos - Todos pueden ver, pero gestionar según permisos
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: PedidosView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_ORDERS', 'VIEW_ORDERS', 'ALL_PERMISSIONS'],
      title: 'Pedidos'
    }
  },

  // POS - Mesero, Cajero, Admin
  {
    path: '/pos',
    name: 'Pos',
    component: () => import('../views/PosView.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_ORDERS', 'MANAGE_CASH_REGISTER', 'ALL_PERMISSIONS'],
      title: 'Punto de Venta'
    }
  },

  // Cocina (KDS) - Cocinero, Admin
  {
    path: '/cocina',
    name: 'Cocina',
    component: KitchenView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_KITCHEN', 'ALL_PERMISSIONS'],
      title: 'Cocina - KDS'
    }
  },

  // Inventario - Admin, Gerente
  {
    path: '/inventario',
    name: 'Inventario',
    component: InventarioView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_INVENTORY', 'ALL_PERMISSIONS'],
      title: 'Inventario'
    }
  },

  // Reportes - Admin, Gerente
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReportesView,
    meta: {
      requiresAuth: true,
      permissions: ['VIEW_REPORTS', 'ALL_PERMISSIONS'],
      title: 'Reportes'
    }
  },

  // Clientes - Todos los autenticados
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView,
    meta: {
      requiresAuth: true,
      title: 'Clientes'
    }
  },

  // Configuración - Admin, Super Admin
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: ConfiguracionView,
    meta: {
      requiresAuth: true,
      permissions: ['MANAGE_COMPANY', 'ALL_PERMISSIONS'],
      title: 'Configuración'
    }
  },

  // Ruta 404 - Página no encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Página no encontrada'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de autenticación
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const requiresAuth = to.meta?.requiresAuth ?? true; // Por defecto requiere auth
  const requiredPermissions = to.meta?.permissions as Permission[] || [];

  // Si la ruta no requiere autenticación, permitir acceso
  if (!requiresAuth) {
    // Si está autenticado y va al login, redireccionar al dashboard
    if (to.name === 'Login' && isAuthenticated) {
      next('/dashboard');
      return;
    }
    next();
    return;
  }

  // Si requiere autenticación pero no está autenticado
  if (!isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // Guardar la ruta de destino
    });
    return;
  }

  // Si está autenticado pero no tiene permisos
  if (requiredPermissions.length > 0 && !authService.hasAnyPermission(requiredPermissions)) {
    console.warn(`Acceso denegado a ${to.path}. Permisos requeridos:`, requiredPermissions);

    // Redireccionar al dashboard con mensaje de error
    next({
      name: 'Dashboard',
      query: { error: 'access_denied' }
    });
    return;
  }

  // Todo está bien, continuar
  next();
});

// Guard para actualizar el título de la página
router.afterEach((to) => {
  const title = to.meta?.title as string;
  if (title) {
    document.title = `${title} - Mozaico`;
  } else {
    document.title = 'Mozaico - Sistema de Gestión';
  }
});

export default router;
