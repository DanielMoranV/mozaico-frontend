<template>
  <v-card class="mx-auto" max-width="400" elevation="8">
    <v-card-title class="text-center bg-primary text-white pa-6">
      <div class="d-flex flex-column align-center">
        <v-icon size="48" class="mb-2">mdi-restaurant</v-icon>
        <span class="text-h5">Mozaico</span>
        <span class="text-subtitle-2 opacity-80">Sistema de Gestión</span>
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="credentials.username"
          label="Usuario"
          prepend-inner-icon="mdi-account"
          :rules="usernameRules"
          :error-messages="fieldErrors.username"
          variant="outlined"
          class="mb-3"
          :disabled="isLoading"
          @input="onUsernameInput"
          required
        />

        <v-text-field
          v-model="credentials.password"
          label="Contraseña"
          prepend-inner-icon="mdi-lock"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          :rules="passwordRules"
          :error-messages="fieldErrors.password"
          variant="outlined"
          class="mb-4"
          :disabled="isLoading"
          @input="onPasswordInput"
          required
        />

        <v-alert
          v-if="error"
          type="error"
          variant="outlined"
          class="mb-4"
          closable
          @click:close="clearError"
        >
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="isLoading"
          :disabled="!valid || isLoading"
          class="mb-3"
          @click="debugFormState"
        >
          <v-icon left>mdi-login</v-icon>
          Iniciar Sesión
        </v-btn>

        <div class="text-center">
          <span class="text-caption text-medium-emphasis">
            ¿Olvidaste tu contraseña? Contacta al administrador
          </span>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6 pt-0">
      <v-spacer />
      <div class="text-caption text-medium-emphasis">
        Mozaico v1.0 &copy; {{ new Date().getFullYear() }}
      </div>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../stores/authStore';

// Refs del template
const formRef = ref();
const valid = ref(false);
const showPassword = ref(false);

// Router
const router = useRouter();

// Store de autenticación
const { login, isLoading, error, clearError } = useAuth();

// Estado reactivo del formulario
const credentials = reactive({
  username: '',
  password: ''
});

// Errores específicos de campos
const fieldErrors = reactive({
  username: [] as string[],
  password: [] as string[]
});

// Reglas de validación
const usernameRules = [
  (value: string) => {
    if (!value) return 'El usuario es requerido';
    if (value.length < 3) return 'El usuario debe tener al menos 3 caracteres';
    if (value.length > 50) return 'El usuario no puede tener más de 50 caracteres';
    return true;
  }
];

const passwordRules = [
  (value: string) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return true;
  }
];

// Función para manejar el login
async function handleLogin() {
  if (!valid.value) {
    console.log('❌ LOGIN FORM - Formulario no válido');
    return;
  }

  console.log('🔄 LOGIN FORM - Iniciando login para:', credentials.username);

  // Limpiar errores previos
  fieldErrors.username = [];
  fieldErrors.password = [];
  clearError();

  try {
    console.log('🔄 LOGIN FORM - Llamando login store...');
    await login(credentials.username, credentials.password);
    console.log('✅ LOGIN FORM - Login exitoso, esperando redirección automática...');

    // El watch en App.vue manejará la redirección automáticamente
    // No hacer redirección manual aquí para evitar conflictos
  } catch (err: any) {
    console.error('❌ LOGIN FORM - Error en login:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });

    // Manejar errores específicos
    if (err.message.includes('Credenciales inválidas') || err.response?.status === 401) {
      fieldErrors.password = ['Usuario o contraseña incorrectos'];
      console.log('❌ LOGIN FORM - Credenciales incorrectas');
    } else if (err.message.includes('usuario') || err.message.includes('username')) {
      fieldErrors.username = [err.message];
    } else if (err.message.includes('contraseña') || err.message.includes('password')) {
      fieldErrors.password = [err.message];
    } else {
      // Error genérico
      console.log('❌ LOGIN FORM - Error genérico, mostrando en store');
    }
  }
}

// Función para limpiar errores
function clearFieldErrors() {
  fieldErrors.username = [];
  fieldErrors.password = [];
}

// Limpiar errores cuando el usuario empiece a escribir
function onUsernameInput() {
  console.log('🔄 LOGIN FORM - Usuario escribiendo en username');
  if (fieldErrors.username.length > 0) {
    fieldErrors.username = [];
    console.log('✅ LOGIN FORM - Errores de username limpiados');
  }
  clearError(); // También limpiar error general
}

function onPasswordInput() {
  console.log('🔄 LOGIN FORM - Usuario escribiendo en password');
  if (fieldErrors.password.length > 0) {
    fieldErrors.password = [];
    console.log('✅ LOGIN FORM - Errores de password limpiados');
  }
  clearError(); // También limpiar error general
}

// Debug form state
function debugFormState() {
  console.log('🔍 LOGIN FORM - Estado del formulario:', {
    valid: valid.value,
    isLoading: isLoading.value,
    buttonDisabled: !valid.value || isLoading.value,
    credentials: {
      username: credentials.username,
      password: credentials.password ? '***' : ''
    },
    fieldErrors: {
      username: fieldErrors.username,
      password: fieldErrors.password
    },
    error: error?.value || null
  });
}

// Watch form validity changes
watch([() => valid.value, () => isLoading.value], ([newValid, newLoading], [oldValid, oldLoading]) => {
  console.log('🔍 LOGIN FORM - Cambio de estado:', {
    valid: { old: oldValid, new: newValid },
    isLoading: { old: oldLoading, new: newLoading },
    buttonEnabled: newValid && !newLoading
  });
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.v-card {
  border-radius: 16px;
}

.v-card-title {
  border-radius: 16px 16px 0 0;
}
</style>