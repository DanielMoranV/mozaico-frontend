import { computed, type ComputedRef } from 'vue';
import { usePermissions } from './usePermissions';
import type { Permission } from '../types/auth';

/**
 * Composable para renderizado condicional basado en permisos
 */
export function useConditionalRender() {
  const {
    hasPermission,
    hasAnyPermission,
    canPerformAction,
    isSuperAdmin,
    isAdmin,
    isGerente,
    isCajero,
    isMesero,
    isCocinero
  } = usePermissions();

  /**
   * Verifica si debe mostrar un elemento basado en permisos
   */
  function shouldShow(permissions: Permission | Permission[] = []): ComputedRef<boolean> {
    return computed(() => {
      if (Array.isArray(permissions)) {
        return permissions.length === 0 || hasAnyPermission(permissions);
      }
      return hasPermission(permissions);
    });
  }

  /**
   * Verifica si debe mostrar un elemento basado en roles específicos
   */
  function shouldShowForRoles(roles: string | string[] = []): ComputedRef<boolean> {
    return computed(() => {
      if (Array.isArray(roles)) {
        return roles.length === 0 || roles.some(role => {
          switch (role) {
            case 'SUPER_ADMIN': return isSuperAdmin.value;
            case 'ADMIN': return isAdmin.value;
            case 'GERENTE': return isGerente.value;
            case 'CAJERO': return isCajero.value;
            case 'MESERO': return isMesero.value;
            case 'COCINERO': return isCocinero.value;
            default: return false;
          }
        });
      }
      switch (roles) {
        case 'SUPER_ADMIN': return isSuperAdmin.value;
        case 'ADMIN': return isAdmin.value;
        case 'GERENTE': return isGerente.value;
        case 'CAJERO': return isCajero.value;
        case 'MESERO': return isMesero.value;
        case 'COCINERO': return isCocinero.value;
        default: return false;
      }
    });
  }

  /**
   * Verifica si debe mostrar un elemento basado en una acción específica
   */
  function shouldShowForAction(action: string, context?: any): ComputedRef<boolean> {
    return computed(() => canPerformAction(action, context));
  }

  /**
   * Verifica si debe deshabilitar un elemento basado en permisos
   */
  function shouldDisable(permissions: Permission | Permission[] = []): ComputedRef<boolean> {
    const show = shouldShow(permissions);
    return computed(() => !show.value);
  }

  /**
   * Obtiene el estado de un botón (visible/deshabilitado) basado en permisos
   */
  function getButtonState(permissions: Permission | Permission[] = []) {
    const show = shouldShow(permissions);
    return {
      visible: show,
      disabled: computed(() => !show.value)
    };
  }

  /**
   * Wrapper para mostrar/ocultar elementos de menú
   */
  function getMenuItemVisibility(routeName: string): ComputedRef<boolean> {
    return computed(() => {
      switch (routeName) {
        case 'usuarios':
          return hasPermission('MANAGE_USERS');
        case 'categorias':
        case 'productos':
        case 'compras':
        case 'inventario':
        case 'proveedores':
        case 'menu':
          return hasPermission('MANAGE_INVENTORY');
        case 'metodos-pago':
        case 'pagos':
          return hasPermission('MANAGE_PAYMENTS');
        case 'reservas':
          return hasAnyPermission(['MANAGE_RESERVATIONS', 'VIEW_RESERVATIONS']);
        case 'mesas':
          return hasPermission('MANAGE_TABLES');
        case 'pedidos':
          return hasAnyPermission(['MANAGE_ORDERS', 'VIEW_ORDERS']);
        case 'pos':
          return hasAnyPermission(['MANAGE_ORDERS', 'MANAGE_CASH_REGISTER']);
        case 'reportes':
          return hasPermission('VIEW_REPORTS');
        case 'configuracion':
          return hasPermission('MANAGE_COMPANY');
        case 'dashboard':
        case 'clientes':
        default:
          return true; // Siempre visible para usuarios autenticados
      }
    });
  }

  /**
   * Obtiene la visibilidad de botones de acción en tablas
   */
  function getTableActionVisibility(action: string, entity: string) {
    return computed(() => {
      switch (action) {
        case 'create':
        case 'add':
          switch (entity) {
            case 'user': return hasPermission('MANAGE_USERS');
            case 'order': return hasPermission('MANAGE_ORDERS');
            case 'payment': return hasPermission('MANAGE_PAYMENTS');
            case 'inventory': return hasPermission('MANAGE_INVENTORY');
            case 'reservation': return hasPermission('MANAGE_RESERVATIONS');
            default: return false;
          }

        case 'edit':
        case 'update':
          switch (entity) {
            case 'user': return hasPermission('MANAGE_USERS');
            case 'order': return hasPermission('MANAGE_ORDERS');
            case 'payment': return hasPermission('MANAGE_PAYMENTS');
            case 'inventory': return hasPermission('MANAGE_INVENTORY');
            case 'reservation': return hasPermission('MANAGE_RESERVATIONS');
            default: return false;
          }

        case 'delete':
        case 'remove':
          switch (entity) {
            case 'user': return hasPermission('MANAGE_USERS');
            case 'order': return hasPermission('MANAGE_ORDERS');
            case 'payment': return hasPermission('MANAGE_PAYMENTS');
            case 'inventory': return hasPermission('MANAGE_INVENTORY');
            case 'reservation': return hasPermission('MANAGE_RESERVATIONS');
            default: return false;
          }

        case 'view':
        case 'details':
          switch (entity) {
            case 'order': return hasAnyPermission(['MANAGE_ORDERS', 'VIEW_ORDERS']);
            case 'reservation': return hasAnyPermission(['MANAGE_RESERVATIONS', 'VIEW_RESERVATIONS']);
            case 'report': return hasPermission('VIEW_REPORTS');
            default: return true; // Por defecto, permitir ver
          }

        case 'status':
        case 'change_status':
          switch (entity) {
            case 'order': return hasPermission('UPDATE_ORDER_STATUS');
            case 'user': return hasPermission('MANAGE_USERS');
            default: return false;
          }

        default:
          return false;
      }
    });
  }

  return {
    // Funciones principales
    shouldShow,
    shouldShowForRoles,
    shouldShowForAction,
    shouldDisable,
    getButtonState,

    // Funciones específicas
    getMenuItemVisibility,
    getTableActionVisibility
  };
}