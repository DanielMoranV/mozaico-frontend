import { ref, reactive, computed, onMounted, readonly } from 'vue';
import { EmpresaService } from '@/services/empresaService';
import type { ValidacionIgvResponse, CalculoTotales, ProductoCarrito, ConfiguracionEmpresa } from '@/types/empresa';

export function useCalculadoraPrecios() {
  // Estado reactivo
  const validacion = ref<ValidacionIgvResponse | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Configuración calculadora
  const config = reactive<ConfiguracionEmpresa>({
    aplicaIgv: false,
    porcentajeIgv: 18.0,
    inicializada: false
  });

  /**
   * Inicializa la calculadora obteniendo configuración de empresa
   */
  const inicializar = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.getValidacionCompleta();
      validacion.value = response;

      config.aplicaIgv = response.aplicaIgv;
      config.porcentajeIgv = response.porcentajeIgv;
      config.inicializada = true;

      console.log('✅ Calculadora inicializada:', {
        aplicaIgv: config.aplicaIgv,
        porcentajeIgv: config.porcentajeIgv,
        tipoOperacion: response.tipoOperacion
      });
    } catch (err) {
      error.value = 'Error al inicializar calculadora de precios';
      console.error('❌ Error en calculadora:', err);

      // Configuración por defecto en caso de error
      config.aplicaIgv = false;
      config.porcentajeIgv = 18.0;
      config.inicializada = true;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Calcula totales para una lista de productos
   */
  const calcularTotales = (productos: ProductoCarrito[]): CalculoTotales => {
    if (!config.inicializada) {
      throw new Error('Calculadora no inicializada. Llame a inicializar() primero.');
    }

    const subtotal = productos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.cantidad);
    }, 0);

    let igv = 0;
    if (config.aplicaIgv) {
      igv = subtotal * (config.porcentajeIgv / 100);
    }

    const descuento = 0; // Por ahora sin descuentos
    const total = subtotal + igv - descuento;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      descuento: Number(descuento.toFixed(2)),
      total: Number(total.toFixed(2)),
      aplicaIgv: config.aplicaIgv,
      porcentajeIgv: config.porcentajeIgv
    };
  };

  /**
   * Formatea un monto en soles peruanos
   */
  const formatearMoneda = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Computed properties
  const mensajeEmpresa = computed(() =>
    validacion.value?.mensajeCliente || ''
  );

  const capacidades = computed(() => ({
    puedeEmitirFacturas: validacion.value?.puedeEmitirFacturas || false,
    puedeEmitirBoletas: validacion.value?.puedeEmitirBoletas || false,
    puedeEmitirTickets: validacion.value?.puedeEmitirTickets || true
  }));

  const limitaciones = computed(() =>
    validacion.value?.limitaciones || []
  );

  // Auto-inicializar en mounted solo si hay autenticación
  onMounted(() => {
    // Solo inicializar si hay un token de acceso y no está ya inicializada
    if (localStorage.getItem('accessToken') && !config.inicializada) {
      inicializar().catch(err => {
        console.warn('Error inicializando calculadora:', err);
      });
    }
  });

  return {
    // Estado
    validacion: readonly(validacion),
    loading: readonly(loading),
    error: readonly(error),
    config: readonly(config),

    // Métodos
    inicializar,
    calcularTotales,
    formatearMoneda,

    // Computed
    mensajeEmpresa,
    capacidades,
    limitaciones
  };
}