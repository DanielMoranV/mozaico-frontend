<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        class="text-none"
        prepend-icon="mdi-account-circle"
      >
        <span class="d-none d-sm-inline">{{ user?.nombre }}</span>
        <v-icon class="d-sm-none">mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <v-card min-width="300">
      <v-card-title class="bg-primary text-white">
        <div class="d-flex align-center">
          <v-avatar color="white" class="mr-3">
            <v-icon color="primary">mdi-account</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6">{{ user?.nombre }}</div>
            <div class="text-caption opacity-80">{{ user?.email }}</div>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-list density="compact" class="pa-0">
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">
              Usuario
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2">
              {{ user?.username }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">
              Rol
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2">
              <v-chip size="small" :color="getRoleColor(user?.tipoUsuario)">
                {{ user?.tipoUsuarioDisplayName }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">
              Empresa
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2">
              {{ user?.empresaNombre }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">
              Permisos principales
            </v-list-item-title>
            <v-list-item-subtitle>
              <div class="d-flex flex-wrap gap-1 mt-1">
                <v-chip
                  v-for="permission in getMainPermissions(user?.permissions || [])"
                  :key="permission"
                  size="x-small"
                  variant="outlined"
                  :title="getPermissionDescription(permission)"
                >
                  {{ getPermissionShortName(permission) }}
                </v-chip>
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-btn
          variant="outlined"
          size="small"
          prepend-icon="mdi-account-cog"
          @click="showProfile"
          block
        >
          Mi Perfil
        </v-btn>
      </v-card-actions>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          color="error"
          variant="outlined"
          size="small"
          prepend-icon="mdi-logout"
          :loading="isLoading"
          @click="handleLogout"
          block
        >
          Cerrar Sesión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

  <!-- Dialog de confirmación de logout -->
  <v-dialog v-model="showLogoutDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Confirmar Cierre de Sesión
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que deseas cerrar sesión?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="showLogoutDialog = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          :loading="isLoading"
          @click="confirmLogout"
        >
          Cerrar Sesión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../stores/authStore';
import type { Permission } from '../../types/auth';
import type { TipoUsuario } from '../../types/enums';
import { PERMISSION_DISPLAY } from '../../types/auth';

const router = useRouter();
const { user, logout, isLoading } = useAuth();

const showLogoutDialog = ref(false);

// Función para obtener color del rol
function getRoleColor(role?: TipoUsuario): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'purple';
    case 'ADMIN':
      return 'red';
    case 'GERENTE':
      return 'orange';
    case 'CAJERO':
      return 'green';
    case 'MESERO':
      return 'blue';
    case 'COCINERO':
      return 'brown';
    default:
      return 'grey';
  }
}

// Función para obtener permisos principales (máximo 4)
function getMainPermissions(permissions: Permission[]): Permission[] {
  const mainPerms = permissions.filter(p => p !== 'ALL_PERMISSIONS').slice(0, 4);
  if (permissions.includes('ALL_PERMISSIONS')) {
    return ['ALL_PERMISSIONS'];
  }
  return mainPerms;
}

// Función para obtener nombre corto del permiso
function getPermissionShortName(permission: Permission): string {
  const shortNames: Record<Permission, string> = {
    'ALL_PERMISSIONS': 'TODO',
    'MANAGE_USERS': 'USUARIOS',
    'MANAGE_COMPANY': 'EMPRESA',
    'VIEW_REPORTS': 'REPORTES',
    'MANAGE_PAYMENTS': 'PAGOS',
    'MANAGE_ORDERS': 'PEDIDOS',
    'VIEW_ORDERS': 'VER_PEDIDOS',
    'MANAGE_RESERVATIONS': 'RESERVAS',
    'VIEW_RESERVATIONS': 'VER_RESERVAS',
    'MANAGE_INVENTORY': 'INVENTARIO',
    'MANAGE_TABLES': 'MESAS',
    'MANAGE_CASH_REGISTER': 'CAJA',
    'MANAGE_KITCHEN': 'COCINA',
    'UPDATE_ORDER_STATUS': 'ESTADOS'
  };
  return shortNames[permission] || permission;
}

// Función para obtener descripción del permiso
function getPermissionDescription(permission: Permission): string {
  return PERMISSION_DISPLAY[permission] || permission;
}

// Función para mostrar perfil (a implementar)
function showProfile() {
  // TODO: Implementar vista de perfil de usuario
  console.log('Mostrar perfil del usuario');
}

// Función para manejar logout
function handleLogout() {
  showLogoutDialog.value = true;
}

// Función para confirmar logout
async function confirmLogout() {
  try {
    console.log('🔄 USER MENU - Iniciando logout...');
    await logout();
    showLogoutDialog.value = false;
    console.log('✅ USER MENU - Logout completado, esperando redirección automática...');
    // El watch en App.vue manejará la redirección automáticamente
  } catch (error) {
    console.error('❌ USER MENU - Error durante logout:', error);
    showLogoutDialog.value = false;
    // Forzar redirección en caso de error
    console.log('🔄 USER MENU - Forzando redirección por error...');
    await router.push('/login');
  }
}
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>