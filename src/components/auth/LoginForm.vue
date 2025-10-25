<template>
  <v-card class="mx-auto login-card" max-width="420" elevation="12">
    <v-card-title class="text-center card-header pa-4">
      <div class="d-flex flex-column align-center">
        <span class="text-h6 font-weight-bold text-white">Iniciar Sesión</span>
        <span class="text-caption text-white-70 mt-1">Ingresa tus credenciales</span>
      </div>
    </v-card-title>

    <v-card-text class="pa-5">
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="credentials.username"
          label="Usuario"
          prepend-inner-icon="mdi-account"
          :rules="usernameRules"
          :error-messages="fieldErrors.username"
          variant="outlined"
          density="comfortable"
          class="mb-2"
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
          density="comfortable"
          class="mb-3"
          :disabled="isLoading"
          @input="onPasswordInput"
          required
        />

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-3"
          closable
          @click:close="clearError"
        >
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          color="#D4A03E"
          size="large"
          block
          :loading="isLoading"
          :disabled="!valid || isLoading"
          class="mb-2 login-button"
          @click="debugFormState"
        >
          <v-icon start>mdi-login</v-icon>
          Iniciar Sesión
        </v-btn>

        <div class="text-center">
          <span class="text-caption text-medium-emphasis">
            ¿Olvidaste tu contraseña? Contacta al administrador
          </span>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
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
import { useAuth } from '../../stores/authStore';

// Refs del template
const formRef = ref();
const valid = ref(false);
const showPassword = ref(false);

// Router (no se usa directamente, la redirección la maneja App.vue)

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
.login-card {
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 15px 50px rgba(44, 62, 80, 0.15), 0 5px 15px rgba(44, 62, 80, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.card-header {
  background: linear-gradient(135deg, #2C3E50 0%, #3d566e 100%);
  border-radius: 0;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.text-white {
  color: white !important;
  position: relative;
  z-index: 1;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.8) !important;
  position: relative;
  z-index: 1;
}

.login-button {
  background: linear-gradient(135deg, #D4A03E 0%, #C9953B 100%) !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 25px rgba(212, 160, 62, 0.35) !important;
  transition: all 0.3s ease !important;
}

.login-button:hover:not(:disabled) {
  box-shadow: 0 12px 35px rgba(212, 160, 62, 0.45) !important;
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.6;
}

/* Input field focus color */
:deep(.v-field--focused) {
  border-color: #D4A03E !important;
}

:deep(.v-field--focused .v-label) {
  color: #D4A03E !important;
}

/* Mobile responsiveness */
@media (max-width: 959px) {
  .login-card {
    margin: 0 1rem;
  }

  .card-header {
    padding: 1rem !important;
  }

  :deep(.v-card-text) {
    padding: 1rem !important;
  }

  :deep(.v-card-actions) {
    padding: 0.75rem 1rem !important;
  }
}

@media (max-width: 599px) {
  .login-card {
    margin: 0 0.5rem;
  }

  .card-header {
    padding: 0.75rem !important;
  }

  :deep(.v-card-text) {
    padding: 0.75rem !important;
  }

  :deep(.v-card-actions) {
    padding: 0.5rem 0.75rem !important;
  }

  :deep(.v-field) {
    font-size: 0.9rem;
  }

  .login-button {
    font-size: 0.95rem !important;
  }
}

/* Height-based responsive */
@media (max-height: 700px) {
  .card-header {
    padding: 0.75rem !important;
  }

  :deep(.v-card-text) {
    padding: 1rem !important;
  }

  :deep(.v-card-actions) {
    padding: 0.5rem 1rem !important;
  }

  :deep(.v-field) {
    margin-bottom: 0.5rem !important;
  }
}

@media (max-height: 600px) {
  .card-header span:first-child {
    font-size: 1rem !important;
  }

  .card-header span:last-child {
    display: none;
  }

  :deep(.v-card-text) {
    padding: 0.75rem !important;
  }

  :deep(.v-card-actions) {
    display: none;
  }
}
</style>