<template>
  <v-container fluid class="login-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <LoginForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/authStore';
import LoginForm from '../components/auth/LoginForm.vue';

const router = useRouter();
const { isAuthenticated } = useAuth();

// Si el usuario ya está autenticado, redireccionar al dashboard
onMounted(() => {
  if (isAuthenticated) {
    router.push('/dashboard');
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fill-height {
  min-height: 100vh;
}
</style>