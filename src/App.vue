<template>
  <v-app>
    <!-- Loading state while checking authentication -->
    <template v-if="isCheckingAuth">
      <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          ></v-progress-circular>
          <h3 class="text-h6 mb-2">Cargando...</h3>
          <p class="text-body-2 text-medium-emphasis">Verificando autenticación</p>
        </div>
      </v-main>
    </template>

    <!-- Show router-view for public routes (no layout) -->
    <template v-else-if="isPublicRoute">
      <router-view />
    </template>

    <!-- Show LoginView if not authenticated -->
    <template v-else-if="!isAuthenticated">
      <router-view />
    </template>

    <!-- Show DashboardLayout if authenticated -->
    <template v-else>
      <DashboardLayout />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from './stores/authStore';
import DashboardLayout from './components/layout/DashboardLayout.vue';

// Router
const router = useRouter();
const route = useRoute();

// Check if current route is public (Landing, Login, Carta Digital)
const isPublicRoute = computed(() => {
  // Exact match for root and login, startsWith for carta (dynamic slug)
  return route.path === '/' || route.path === '/login' || route.path.startsWith('/carta/');
});

// Auth store
const { isAuthenticated, checkAuth } = useAuth();

console.log('🔍 APP SETUP - isAuthenticated:', {
  isAuthenticated: isAuthenticated?.value,
  checkAuth: typeof checkAuth
});

// Loading state
const isCheckingAuth = ref(true);

// Watch authentication changes for proper redirects
watch(() => isAuthenticated.value, async (newValue, oldValue) => {
  console.log('🔍 AUTH WATCHER:', {
    newValue,
    oldValue,
    isCheckingAuth: isCheckingAuth.value,
    currentPath: router.currentRoute.value.path
  });

  if (isCheckingAuth.value) {
    console.log('⏳ Skipping redirect - still checking auth');
    return; // Skip during initial load
  }

  await nextTick(); // Wait for Vue to update

  const currentPath = router.currentRoute.value.path;

  // Handle authentication state changes
  if (!newValue && currentPath !== '/login' && currentPath !== '/') {
    // User lost authentication and is not on login or landing
    console.log('🔄 AUTH LOST - Redirecting to login');
    router.push('/login');
  } else if (newValue && currentPath === '/login') {
    // User gained authentication and is on login page
    console.log('🔄 AUTH GAINED - Redirecting to dashboard');
    router.push('/dashboard');
  } else {
    console.log('✅ No redirect needed - currentPath:', currentPath, 'authenticated:', newValue);
  }
}, { immediate: false });

// Check authentication on mount
onMounted(async () => {
  console.log('🚀 APP MOUNT - Iniciando verificación de autenticación...');

  try {
    console.log('🔄 APP MOUNT - Llamando checkAuth...');
    await checkAuth();
    await nextTick(); // Wait for Vue to update

    const currentPath = router.currentRoute.value.path;

    console.log('🔍 APP MOUNT - Estado después de checkAuth:', {
      isAuthenticated: isAuthenticated.value,
      isAuthenticatedType: typeof isAuthenticated.value,
      currentPath
    });

    // Skip redirects for public routes
    if (isPublicRoute.value) {
      console.log('✅ APP MOUNT - Public route detected, no redirect needed');
      return;
    }

    // Redirect based on authentication state
    if (!isAuthenticated.value && currentPath !== '/login') {
      console.log('🔄 APP MOUNT - Redirección inicial a login - sin autenticación');
      router.push('/login');
    } else if (isAuthenticated.value && currentPath === '/login') {
      console.log('🔄 APP MOUNT - Redirección inicial a dashboard - ya autenticado');
      router.push('/dashboard');
    } else if (isAuthenticated.value) {
      console.log('✅ APP MOUNT - Usuario autenticado, mostrando dashboard layout');
    } else {
      console.log('❌ APP MOUNT - Usuario no autenticado, mostrando login');
    }
  } catch (error) {
    console.error('❌ APP MOUNT - Error durante verificación:', error);
  } finally {
    // Always stop loading after auth check
    console.log('🏁 APP MOUNT - Finalizando verificación, isCheckingAuth = false');
    isCheckingAuth.value = false;
  }
});
</script>