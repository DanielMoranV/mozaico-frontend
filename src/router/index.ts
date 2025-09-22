import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import UsuariosView from '../views/UsuariosView.vue';
import MesasView from '../views/MesasView.vue';
import MenuView from '../views/MenuView.vue';
import PedidosView from '../views/PedidosView.vue';
import InventarioView from '../views/InventarioView.vue';
import ReportesView from '../views/ReportesView.vue';
import ClientesView from '../views/ClientesView.vue';
import ConfiguracionView from '../views/ConfiguracionView.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
  },
  {
    path: '/mesas',
    name: 'Mesas',
    component: MesasView,
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView,
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: PedidosView,
  },
  {
    path: '/inventario',
    name: 'Inventario',
    component: InventarioView,
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReportesView,
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView,
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: ConfiguracionView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
