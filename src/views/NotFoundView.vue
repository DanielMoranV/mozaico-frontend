<template>
  <v-container fluid class="not-found-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-card elevation="4" class="pa-8">
          <v-icon size="120" color="error" class="mb-4">
            mdi-alert-circle-outline
          </v-icon>

          <h1 class="text-h3 text-error mb-4">404</h1>

          <h2 class="text-h5 mb-4">Página no encontrada</h2>

          <p class="text-body-1 text-medium-emphasis mb-6">
            La página que buscas no existe o has sido redirigido aquí debido a permisos insuficientes.
          </p>

          <div class="d-flex flex-column gap-3">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-home"
              @click="goToDashboard"
            >
              Ir al Dashboard
            </v-btn>

            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
            >
              Volver Atrás
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDashboard() {
  router.push('/dashboard');
}

function goBack() {
  router.go(-1);
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.fill-height {
  min-height: 100vh;
}

.gap-3 {
  gap: 12px;
}
</style>

