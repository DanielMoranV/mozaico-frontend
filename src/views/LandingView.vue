<template>
  <v-app>
    <!-- Header -->
    <v-app-bar :elevation="2" scroll-behavior="elevate" color="white" height="70">
      <v-container class="d-flex align-center pa-0">
        <v-img
          src="/public/mozaico_horizontal.png"
          max-height="45"
          max-width="200"
          contain
          class="cursor-pointer"
          @click="scrollToTop"
        />

        <v-spacer />

        <v-btn
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          variant="text"
          class="d-none d-md-flex"
        >
          {{ link.text }}
        </v-btn>

        <v-btn
          v-if="isAuthenticated"
          color="primary"
          variant="flat"
          rounded="pill"
          class="ml-4"
          to="/dashboard"
        >
          Ir al Dashboard
        </v-btn>

        <v-btn
          v-else
          color="primary"
          variant="outlined"
          rounded="pill"
          class="ml-4 mr-2"
          to="/login"
        >
          Iniciar Sesión
        </v-btn>

        <v-btn
          v-if="!isAuthenticated"
          color="#C85A4A"
          variant="flat"
          rounded="pill"
          class="ml-2 beta-button"
          @click="scrollToSection('beta')"
        >
          Únete a la Beta
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container>
          <v-row align="center" class="py-16">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <v-chip
                color="#C85A4A"
                variant="flat"
                class="mb-6 beta-badge"
                size="small"
              >
                BETA DISPONIBLE
              </v-chip>

              <h1 class="hero-title mb-6">
                Gestiona tu restaurante desde un solo lugar
              </h1>

              <p class="hero-subtitle mb-8">
                La solución completa para llevar tu restaurante al siguiente nivel.
                POS, cocina, inventario, reservas y análisis en tiempo real.
              </p>

              <div class="d-flex flex-wrap ga-4 justify-center justify-md-start">
                <v-btn
                  color="#D4A03E"
                  size="x-large"
                  variant="flat"
                  rounded="pill"
                  @click="scrollToSection('beta')"
                  class="px-8 hero-cta-primary"
                >
                  Solicitar acceso Beta
                </v-btn>

                <v-btn
                  color="white"
                  size="x-large"
                  variant="outlined"
                  rounded="pill"
                  @click="scrollToSection('funcionalidades')"
                  class="px-8 hero-cta-secondary"
                >
                  Conocer más
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="text-center">
              <v-img
                src="/public/logo_mozaico.png"
                max-width="400"
                class="mx-auto floating-logo"
              />
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Section -->
      <section id="funcionalidades" class="py-16">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="section-title mb-4">
              Todo lo que necesitas en una sola plataforma
            </h2>
            <p class="section-subtitle">
              Diseñado específicamente para las necesidades de tu restaurante
            </p>
          </div>

          <v-row>
            <v-col
              v-for="feature in features"
              :key="feature.title"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                :elevation="4"
                class="feature-card h-100"
                hover
              >
                <v-card-text class="pa-8">
                  <div class="feature-icon mb-6">
                    {{ feature.icon }}
                  </div>
                  <h3 class="feature-title mb-4">{{ feature.title }}</h3>
                  <p class="feature-description">{{ feature.description }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Modules Section -->
      <section id="modulos" class="py-16 bg-grey-lighten-4">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="section-title mb-4">
              Módulos Completos de Gestión
            </h2>
            <p class="section-subtitle">
              Cada aspecto de tu restaurante bajo control
            </p>
          </div>

          <v-row>
            <v-col
              v-for="module in modules"
              :key="module.title"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                variant="flat"
                class="module-card h-100"
                hover
              >
                <v-card-text class="pa-6">
                  <h4 class="module-title mb-2">{{ module.icon }} {{ module.title }}</h4>
                  <p class="module-description">{{ module.description }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Tech Stack Section -->
      <section id="tecnologia" class="py-16">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="section-title mb-4">
              Tecnología de Vanguardia
            </h2>
            <p class="section-subtitle">
              Construido con las herramientas más modernas y confiables
            </p>
          </div>

          <v-row justify="center" class="mb-12">
            <v-col
              v-for="tech in technologies"
              :key="tech"
              cols="auto"
            >
              <v-chip
                size="large"
                variant="outlined"
                class="tech-chip"
              >
                {{ tech }}
              </v-chip>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
              <v-card elevation="4" class="tech-details-card">
                <v-card-text class="pa-8">
                  <h3 class="text-h5 mb-6 text-center">🚀 Stack Moderno y Escalable</h3>

                  <v-list lines="two" bg-color="transparent">
                    <v-list-item>
                      <v-list-item-title class="font-weight-bold mb-2">
                        Frontend
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Vue 3 con Composition API, TypeScript para type-safety y Vuetify 3 con Material Design 3
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title class="font-weight-bold mb-2">
                        State Management
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Pinia con stores modulares para cada funcionalidad
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title class="font-weight-bold mb-2">
                        Build Tool
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Vite 7 con optimización automática y hot module replacement
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title class="font-weight-bold mb-2">
                        Seguridad
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        JWT con tokens de acceso y refresh, control de permisos granular en 13 tipos
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-title class="font-weight-bold mb-2">
                        Performance
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Lazy loading, tree-shaking, code splitting y optimización de bundle
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CTA Section -->
      <section id="beta" class="cta-section py-16">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6" class="text-center">
              <h2 class="cta-title mb-6">
                Únete a la Beta de Mozaico
              </h2>
              <p class="cta-subtitle mb-8">
                Sé de los primeros en probar la plataforma que transformará tu restaurante
              </p>

              <v-form @submit.prevent="solicitarAcceso" class="mb-8">
                <v-row justify="center" no-gutters>
                  <v-col cols="12" sm="8" md="7">
                    <v-text-field
                      v-model="email"
                      type="email"
                      placeholder="Tu correo electrónico"
                      variant="solo"
                      rounded="pill"
                      hide-details
                      class="cta-input"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="4" md="auto" class="mt-4 mt-sm-0 ml-sm-4">
                    <v-btn
                      type="submit"
                      color="#2C3E50"
                      size="x-large"
                      variant="flat"
                      rounded="pill"
                      class="px-8 cta-submit-btn"
                    >
                      Solicitar Acceso
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <div class="cta-benefits">
                <p class="mb-2">✅ Acceso anticipado gratis</p>
                <p class="mb-2">✅ Soporte directo del equipo</p>
                <p>✅ Influye en el desarrollo del producto</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <v-footer class="bg-grey-darken-4 text-center py-8">
        <v-container>
          <v-img
            src="/public/mozaico_horizontal.png"
            max-width="200"
            class="mx-auto mb-6"
            style="opacity: 0.9"
          />
          <p class="text-grey-lighten-1 mb-2">
            &copy; 2025 Mozaico. Software de Gestión para Restaurantes.
          </p>
          <p class="text-grey-lighten-1" style="font-size: 0.9rem;">
            Transformando la administración de restaurantes con tecnología moderna.
          </p>
        </v-container>
      </v-footer>
    </v-main>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { authService } from '../services/authService';

// Check authentication
const isAuthenticated = computed(() => authService.isAuthenticated());

// Navigation
const navLinks = [
  { text: 'Funcionalidades', href: '#funcionalidades' },
  { text: 'Módulos', href: '#modulos' },
  { text: 'Tecnología', href: '#tecnologia' },
];

// Features
const features = [
  {
    icon: '🍽️',
    title: 'Punto de Venta Intuitivo',
    description: 'Gestiona pedidos y mesas en tiempo real con una interfaz moderna y fácil de usar. Reduce tiempos de espera y mejora la experiencia del cliente.'
  },
  {
    icon: '👨‍🍳',
    title: 'Sistema de Cocina (KDS)',
    description: 'Tablero Kanban para cocina con actualización automática cada 30 segundos. Organiza pedidos en Pendientes, En Preparación y Listos.'
  },
  {
    icon: '📅',
    title: 'Reservas Inteligentes',
    description: 'Validación automática de disponibilidad de mesas. Evita conflictos y optimiza la ocupación con sugerencias de mesas alternativas.'
  },
  {
    icon: '📦',
    title: 'Control de Inventario',
    description: 'Gestión completa de stock con alertas de inventario bajo. Vincula productos con proveedores y órdenes de compra automáticas.'
  },
  {
    icon: '📊',
    title: 'Dashboard Analítico',
    description: 'Gráficos interactivos con Chart.js. Visualiza ventas, estado de pedidos e inventario con selectores de período personalizables.'
  },
  {
    icon: '📱',
    title: 'Carta Digital Pública',
    description: 'Menú digital accesible por QR sin necesidad de registro. Tus clientes pueden ver tu carta desde cualquier dispositivo.'
  }
];

// Modules
const modules = [
  { icon: '🏪', title: 'Punto de Venta (POS)', description: 'Vista en grid o lista de mesas con estados en tiempo real y estadísticas de ocupación' },
  { icon: '📋', title: 'Gestión de Pedidos', description: 'Creación, edición y seguimiento de pedidos con estados: Abierto, Atendido, Pagado, Cancelado' },
  { icon: '🔪', title: 'Sistema KDS (Cocina)', description: 'Tablero Kanban optimizado para pantallas de cocina con auto-refresh configurable' },
  { icon: '📅', title: 'Reservas de Mesas', description: 'Dashboard de reservas del día con validación automática de disponibilidad' },
  { icon: '🪑', title: 'Gestión de Mesas', description: 'Control de estados: Disponible, Ocupada, Reservada, Mantenimiento' },
  { icon: '🍕', title: 'Catálogo de Productos', description: 'Productos con categorías, códigos de barras, información nutricional y alergénicos' },
  { icon: '📦', title: 'Control de Inventario', description: 'Ajuste de stock con entrada/salida y alertas de stock bajo configurables' },
  { icon: '🛒', title: 'Compras a Proveedores', description: 'Órdenes de compra con estados y gestión de proveedores integrada' },
  { icon: '👥', title: 'Base de Clientes', description: 'Historial completo de clientes con integración a pedidos y reservas' },
  { icon: '💳', title: 'Pagos y Métodos', description: 'Múltiples métodos de pago con trazabilidad completa y gestión de cajas' },
  { icon: '🧾', title: 'Comprobantes Fiscales', description: 'Tickets, boletas, facturas, notas de crédito y débito con impresión automática' },
  { icon: '📊', title: 'Reportes e Informes', description: 'Ventas resumidas, ventas por producto, items con bajo stock filtrados por período' },
  { icon: '👤', title: 'Gestión de Usuarios', description: '7 roles con permisos granulares: Admin, Mesero, Cocinero, Cajero, Gerente y más' },
  { icon: '🎨', title: 'Carta Digital Pública', description: 'Menú accesible por QR con filtros, búsqueda en tiempo real y diseño responsive' },
  { icon: '🏢', title: 'Configuración', description: 'Personalización de empresa, logo, información fiscal y slug de carta pública' },
  { icon: '📈', title: 'Dashboard Ejecutivo', description: 'Gráficos de ventas, pedidos e inventario con Chart.js y accesos rápidos' }
];

// Technologies
const technologies = ['Vue 3', 'TypeScript', 'Vuetify 3', 'Pinia', 'Vite', 'Chart.js'];

// Email form
const email = ref('');
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

// Methods
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const solicitarAcceso = () => {
  if (email.value && email.value.includes('@')) {
    snackbar.value = {
      show: true,
      message: `¡Gracias! Hemos recibido tu solicitud de acceso para ${email.value}. Te contactaremos pronto.`,
      color: 'success'
    };
    email.value = '';
  } else {
    snackbar.value = {
      show: true,
      message: 'Por favor, ingresa un correo electrónico válido.',
      color: 'error'
    };
  }
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2C3E50 0%, #3d566e 50%, #506680 100%);
  color: white;
  min-height: 650px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.7;
}

.beta-badge {
  animation: pulse 2s infinite;
  font-weight: 700;
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.beta-button {
  box-shadow: 0 4px 15px rgba(200, 90, 74, 0.3) !important;
  transition: all 0.3s ease !important;
}

.beta-button:hover {
  box-shadow: 0 6px 20px rgba(200, 90, 74, 0.4) !important;
  transform: translateY(-2px);
}

.hero-cta-primary {
  background: linear-gradient(135deg, #D4A03E 0%, #C9953B 100%) !important;
  box-shadow: 0 8px 25px rgba(212, 160, 62, 0.35) !important;
  font-weight: 700 !important;
}

.hero-cta-primary:hover {
  box-shadow: 0 12px 35px rgba(212, 160, 62, 0.45) !important;
  transform: translateY(-3px);
}

.hero-cta-secondary {
  border-width: 2px !important;
  font-weight: 700 !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05) !important;
}

.hero-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-3px);
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #e8edf2;
  font-weight: 400;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}

.floating-logo {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Section Titles */
.section-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #2C3E50;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #5a6c7d;
  font-weight: 400;
  line-height: 1.6;
}

/* Feature Cards */
.feature-card {
  transition: all 0.3s ease;
  border-radius: 20px !important;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #C85A4A 0%, #D67358 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 20px rgba(200, 90, 74, 0.3);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C3E50;
}

.feature-description {
  color: #7f8c8d;
  line-height: 1.7;
}

/* Module Cards */
.module-card {
  border-left: 4px solid #C85A4A;
  transition: all 0.3s ease;
  background: white;
}

.module-card:hover {
  transform: translateX(5px);
  border-left-color: #D67358;
  box-shadow: 0 4px 12px rgba(200, 90, 74, 0.15);
}

.module-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #2C3E50;
}

.module-description {
  color: #7f8c8d;
  font-size: 0.95rem;
}

/* Tech Section */
.tech-chip {
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.tech-chip:hover {
  transform: scale(1.1);
}

.tech-details-card {
  border-radius: 20px !important;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #D4A03E 0%, #C9953B 50%, #C17A4A 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  top: -300px;
  right: -200px;
}

.cta-section::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(44, 62, 80, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -250px;
  left: -150px;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.cta-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  opacity: 0.95;
  position: relative;
  z-index: 1;
}

.cta-benefits {
  font-size: 0.95rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.cta-input {
  position: relative;
  z-index: 1;
}

.cta-submit-btn {
  font-weight: 700 !important;
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.4) !important;
  transition: all 0.3s ease !important;
  position: relative;
  z-index: 1;
}

.cta-submit-btn:hover {
  box-shadow: 0 12px 35px rgba(44, 62, 80, 0.5) !important;
  transform: translateY(-3px);
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cursor-pointer:hover {
  transform: scale(1.02);
}
</style>
