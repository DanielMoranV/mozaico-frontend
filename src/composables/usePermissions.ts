import { computed } from 'vue';
import { useAuth } from '../stores/authStore';
import type { Permission } from '../types/auth';

/**
 * Composable para manejo de permisos de usuario
 */
export function usePermissions() {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  // Computed properties para verificación de permisos específicos
  const canManageUsers = computed(() => hasPermission('MANAGE_USERS'));
  const canManageCompany = computed(() => hasPermission('MANAGE_COMPANY'));
  const canViewReports = computed(() => hasPermission('VIEW_REPORTS'));
  const canManagePayments = computed(() => hasPermission('MANAGE_PAYMENTS'));
  const canManageOrders = computed(() => hasPermission('MANAGE_ORDERS'));
  const canViewOrders = computed(() => hasPermission('VIEW_ORDERS'));
  const canManageReservations = computed(() => hasPermission('MANAGE_RESERVATIONS'));
  const canViewReservations = computed(() => hasPermission('VIEW_RESERVATIONS'));
  const canManageInventory = computed(() => hasPermission('MANAGE_INVENTORY'));
  const canManageTables = computed(() => hasPermission('MANAGE_TABLES'));
  const canManageCashRegister = computed(() => hasPermission('MANAGE_CASH_REGISTER'));
  const canManageKitchen = computed(() => hasPermission('MANAGE_KITCHEN'));
  const canUpdateOrderStatus = computed(() => hasPermission('UPDATE_ORDER_STATUS'));

  // Computed properties para verificación de roles
  const isSuperAdmin = computed(() => user.value?.tipoUsuario === 'SUPER_ADMIN');
  const isAdmin = computed(() => user.value?.tipoUsuario === 'ADMIN');
  const isGerente = computed(() => user.value?.tipoUsuario === 'GERENTE');
  const isCajero = computed(() => user.value?.tipoUsuario === 'CAJERO');
  const isMesero = computed(() => user.value?.tipoUsuario === 'MESERO');
  const isCocinero = computed(() => user.value?.tipoUsuario === 'COCINERO');

  // Computed properties para grupos de permisos comunes
  const canAccessAdminPanel = computed(() =>
    hasAnyPermission(['MANAGE_USERS', 'MANAGE_COMPANY', 'ALL_PERMISSIONS'])
  );

  const canAccessReports = computed(() =>
    hasAnyPermission(['VIEW_REPORTS', 'ALL_PERMISSIONS'])
  );

  const canAccessInventoryManagement = computed(() =>
    hasAnyPermission(['MANAGE_INVENTORY', 'ALL_PERMISSIONS'])
  );

  const canAccessOrderManagement = computed(() =>
    hasAnyPermission(['MANAGE_ORDERS', 'VIEW_ORDERS', 'ALL_PERMISSIONS'])
  );

  const canAccessPaymentManagement = computed(() =>
    hasAnyPermission(['MANAGE_PAYMENTS', 'ALL_PERMISSIONS'])
  );

  const canAccessReservationManagement = computed(() =>
    hasAnyPermission(['MANAGE_RESERVATIONS', 'VIEW_RESERVATIONS', 'ALL_PERMISSIONS'])
  );

  // Funciones de utilidad
  function requirePermission(permission: Permission): boolean {
    const allowed = hasPermission(permission);
    if (!allowed) {
      console.warn(`Permiso requerido: ${permission}`);
    }
    return allowed;
  }

  function requireAnyPermission(permissions: Permission[]): boolean {
    const allowed = hasAnyPermission(permissions);
    if (!allowed) {
      console.warn(`Se requiere al menos uno de estos permisos: ${permissions.join(', ')}`);
    }
    return allowed;
  }

  function requireAllPermissions(permissions: Permission[]): boolean {
    const allowed = hasAllPermissions(permissions);
    if (!allowed) {
      console.warn(`Se requieren todos estos permisos: ${permissions.join(', ')}`);
    }
    return allowed;
  }

  /**
   * Verifica si el usuario puede realizar una acción específica
   */
  function canPerformAction(action: string, _context?: any): boolean {
    switch (action) {
      case 'create_user':
      case 'edit_user':
      case 'delete_user':
        return canManageUsers.value;

      case 'create_order':
      case 'edit_order':
        return canManageOrders.value;

      case 'view_order':
        return canViewOrders.value || canManageOrders.value;

      case 'process_payment':
        return canManagePayments.value;

      case 'manage_inventory':
        return canManageInventory.value;

      case 'view_reports':
        return canViewReports.value;

      case 'manage_reservations':
        return canManageReservations.value;

      case 'view_reservations':
        return canViewReservations.value || canManageReservations.value;

      case 'manage_tables':
        return canManageTables.value;

      case 'update_order_status':
        return canUpdateOrderStatus.value;

      case 'access_kitchen':
        return canManageKitchen.value;

      case 'access_pos':
        return hasAnyPermission(['MANAGE_ORDERS', 'MANAGE_CASH_REGISTER']);

      default:
        console.warn(`Acción no reconocida: ${action}`);
        return false;
    }
  }

  /**
   * Obtiene las rutas accesibles para el usuario actual
   */
  function getAccessibleRoutes(): string[] {
    const routes: string[] = ['/dashboard', '/clientes'];

    if (canManageUsers.value) routes.push('/usuarios');
    if (canManageInventory.value) routes.push('/categorias', '/productos', '/compras', '/inventario', '/proveedores', '/menu');
    if (canManagePayments.value) routes.push('/metodos-pago', '/pagos');
    if (canAccessReservationManagement.value) routes.push('/reservas');
    if (canManageTables.value) routes.push('/mesas');
    if (canAccessOrderManagement.value) routes.push('/pedidos');
    if (hasAnyPermission(['MANAGE_ORDERS', 'MANAGE_CASH_REGISTER'])) routes.push('/pos');
    if (canViewReports.value) routes.push('/reportes');
    if (canManageCompany.value) routes.push('/configuracion');

    return routes;
  }

  /**
   * Obtiene las acciones disponibles para una entidad específica
   */
  function getAvailableActions(entity: string): string[] {
    const actions: string[] = [];

    switch (entity) {
      case 'user':
        if (canManageUsers.value) {
          actions.push('create', 'edit', 'delete', 'activate', 'deactivate');
        }
        break;

      case 'order':
        if (canViewOrders.value) actions.push('view');
        if (canManageOrders.value) actions.push('create', 'edit', 'cancel');
        if (canUpdateOrderStatus.value) actions.push('update_status');
        break;

      case 'payment':
        if (canManagePayments.value) {
          actions.push('create', 'view', 'edit', 'refund');
        }
        break;

      case 'inventory':
        if (canManageInventory.value) {
          actions.push('create', 'edit', 'delete', 'adjust_stock');
        }
        break;

      case 'reservation':
        if (canViewReservations.value) actions.push('view');
        if (canManageReservations.value) actions.push('create', 'edit', 'cancel');
        break;

      default:
        console.warn(`Entidad no reconocida: ${entity}`);
    }

    return actions;
  }

  return {
    // Permisos específicos
    canManageUsers,
    canManageCompany,
    canViewReports,
    canManagePayments,
    canManageOrders,
    canViewOrders,
    canManageReservations,
    canViewReservations,
    canManageInventory,
    canManageTables,
    canManageCashRegister,
    canManageKitchen,
    canUpdateOrderStatus,

    // Verificación de roles
    isSuperAdmin,
    isAdmin,
    isGerente,
    isCajero,
    isMesero,
    isCocinero,

    // Grupos de permisos
    canAccessAdminPanel,
    canAccessReports,
    canAccessInventoryManagement,
    canAccessOrderManagement,
    canAccessPaymentManagement,
    canAccessReservationManagement,

    // Funciones de verificación
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,

    // Funciones de utilidad
    canPerformAction,
    getAccessibleRoutes,
    getAvailableActions
  };
}