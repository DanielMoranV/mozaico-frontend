<template>
  <v-container fluid class="login-container">
    <!-- Background decoration -->
    <div class="bg-decoration bg-decoration-1"></div>
    <div class="bg-decoration bg-decoration-2"></div>
    <div class="bg-decoration bg-decoration-3"></div>

    <v-row justify="center" align="center" class="fill-height py-4">
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="5"
        xl="4"
        class="d-flex flex-column justify-center"
      >
        <!-- Logo Section -->
        <div class="text-center mb-6 logo-section">
          <v-img
            src="/logo_mozaico.png"
            :max-width="mdAndUp ? 200 : 160"
            class="mx-auto login-logo"
          />
        </div>

        <!-- Login Form -->
        <div class="form-wrapper">
          <LoginForm />
        </div>

        <!-- Footer Links -->
        <div class="text-center mt-3">
          <v-btn
            variant="text"
            color="#2C3E50"
            size="small"
            to="/"
            class="back-button"
          >
            <v-icon start size="small">mdi-arrow-left</v-icon>
            Volver al inicio
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useAuth } from "../stores/authStore";
import LoginForm from "../components/auth/LoginForm.vue";

const router = useRouter();
const { isAuthenticated } = useAuth();
const { mdAndUp } = useDisplay();

// Si el usuario ya está autenticado, redireccionar al dashboard
onMounted(() => {
  if (isAuthenticated) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #dce3eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Background grid pattern */
.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(44, 62, 80, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(44, 62, 80, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

/* Decorative background elements */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  z-index: 0;
}

.bg-decoration-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #d4a03e 0%, transparent 65%);
  top: -250px;
  right: -200px;
}

.bg-decoration-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c85a4a 0%, transparent 65%);
  bottom: -200px;
  left: -150px;
}

.bg-decoration-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6b8e5c 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fill-height {
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.logo-section {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.form-wrapper {
  flex-shrink: 0;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.login-logo {
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.12));
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.back-button {
  opacity: 0.8;
  transition: all 0.3s ease;
  font-weight: 600;
}

.back-button:hover {
  opacity: 1;
  transform: translateX(-3px);
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .fill-height {
    padding: 1rem 0;
  }

  .login-logo {
    animation: none;
  }

  .form-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 599px) {
  .login-logo {
    max-width: 140px !important;
  }

  .logo-section {
    margin-bottom: 1.5rem !important;
  }

  .bg-decoration-1,
  .bg-decoration-2,
  .bg-decoration-3 {
    display: none;
  }

  .back-button {
    font-size: 0.8rem;
  }
}

@media (max-height: 700px) {
  .login-logo {
    max-width: 140px !important;
    animation: none;
  }

  .logo-section {
    margin-bottom: 1rem !important;
  }

  .fill-height {
    padding: 0.5rem 0;
  }
}

@media (max-height: 600px) {
  .login-logo {
    max-width: 120px !important;
  }

  .logo-section {
    margin-bottom: 0.75rem !important;
  }
}
</style>
