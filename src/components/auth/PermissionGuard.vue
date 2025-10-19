<template>
  <div v-if="shouldShow">
    <slot v-if="hasPermissions" />
    <slot v-else name="fallback">
      <div v-if="showFallback" class="permission-denied">
        <v-alert
          type="warning"
          variant="outlined"
          density="compact"
          :text="fallbackMessage"
        />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePermissions } from '../../composables/usePermissions';
import type { Permission } from '../../types/auth';

interface Props {
  /** Permisos requeridos (uno o varios) */
  permissions?: Permission | Permission[];
  /** Roles requeridos */
  roles?: string | string[];
  /** Acción específica a verificar */
  action?: string;
  /** Contexto para la acción */
  context?: any;
  /** Si debe requerir TODOS los permisos en lugar de AL MENOS UNO */
  requireAll?: boolean;
  /** Si debe mostrar mensaje de fallback cuando no tiene permisos */
  showFallback?: boolean;
  /** Mensaje personalizado de fallback */
  fallbackMessage?: string;
  /** Si debe ocultar completamente el componente cuando no tiene permisos */
  hideWhenDenied?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  permissions: () => [],
  roles: () => [],
  action: '',
  context: undefined,
  requireAll: false,
  showFallback: false,
  fallbackMessage: 'No tienes permisos suficientes para ver este contenido',
  hideWhenDenied: false
});

const {
  hasAnyPermission,
  hasAllPermissions,
  canPerformAction,
  isSuperAdmin,
  isAdmin,
  isGerente,
  isCajero,
  isMesero,
  isCocinero
} = usePermissions();

// Computed para verificar permisos
const hasPermissions = computed(() => {
  // Si es super admin, tiene todos los permisos
  if (isSuperAdmin.value) return true;

  // Verificar acción específica
  if (props.action) {
    return canPerformAction(props.action, props.context);
  }

  // Verificar roles
  if (props.roles && props.roles.length > 0) {
    const rolesArray = Array.isArray(props.roles) ? props.roles : [props.roles];
    const hasRole = rolesArray.some(role => {
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
    if (!hasRole) return false;
  }

  // Verificar permisos
  if (props.permissions && props.permissions.length > 0) {
    const permissionsArray = Array.isArray(props.permissions)
      ? props.permissions
      : [props.permissions];

    if (props.requireAll) {
      return hasAllPermissions(permissionsArray);
    } else {
      return hasAnyPermission(permissionsArray);
    }
  }

  // Si no se especificaron permisos, roles o acciones, permitir por defecto
  return true;
});

// Computed para determinar si debe mostrar el componente
const shouldShow = computed(() => {
  if (props.hideWhenDenied) {
    return hasPermissions.value;
  }
  return true;
});
</script>

<style scoped>
.permission-denied {
  opacity: 0.6;
}
</style>