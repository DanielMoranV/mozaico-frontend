import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { EmpresaService } from '@/services/empresaService';
import type { ValidacionIgvResponse, Empresa, EmpresaUpdateDTO, EmpresaEstadisticas } from '@/types/empresa';

export const useEmpresaStore = defineStore('empresa', () => {
  // Estado
  const empresa = ref<Empresa | null>(null);
  const estadisticas = ref<EmpresaEstadisticas | null>(null);
  const validacion = ref<ValidacionIgvResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const ultimaActualizacion = ref<Date | null>(null);

  // Getters
  const aplicaIgv = computed(() => validacion.value?.aplicaIgv ?? false);
  const porcentajeIgv = computed(() => validacion.value?.porcentajeIgv ?? 0);
  const nombreEmpresa = computed(() => validacion.value?.nombreEmpresa ?? '');
  const tipoOperacion = computed(() => validacion.value?.tipoOperacion);
  const mensajeCliente = computed(() => validacion.value?.mensajeCliente ?? '');

  const capacidades = computed(() => ({
    puedeEmitirFacturas: validacion.value?.puedeEmitirFacturas ?? false,
    puedeEmitirBoletas: validacion.value?.puedeEmitirBoletas ?? false,
    puedeEmitirTickets: validacion.value?.puedeEmitirTickets ?? true
  }));

  const esEmpresaInformal = computed(() =>
    tipoOperacion.value === 'TICKET_SIMPLE'
  );

  const necesitaActualizacion = computed(() => {
    if (!ultimaActualizacion.value) return true;
    const ahora = new Date();
    const diferencia = ahora.getTime() - ultimaActualizacion.value.getTime();
    return diferencia > 5 * 60 * 1000; // 5 minutos
  });

  // Actions
  const cargarValidacion = async (forzar = false): Promise<void> => {
    if (!forzar && validacion.value && !necesitaActualizacion.value) {
      return; // Ya tenemos datos recientes
    }

    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.getValidacionCompleta();
      validacion.value = response;
      ultimaActualizacion.value = new Date();

      console.log('✅ Validación de empresa actualizada:', response);
    } catch (err) {
      error.value = 'Error al cargar configuración de empresa';
      console.error('❌ Error al cargar validación:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const verificarSoloIgv = async (): Promise<boolean> => {
    try {
      return await EmpresaService.verificarAplicaIgv();
    } catch (err) {
      console.error('Error al verificar IGV:', err);
      return aplicaIgv.value;
    }
  };

  const obtenerMensajeCliente = async (): Promise<string> => {
    try {
      return await EmpresaService.getMensajeCliente();
    } catch (err) {
      console.error('Error al obtener mensaje:', err);
      return mensajeCliente.value;
    }
  };

  const limpiarCache = (): void => {
    validacion.value = null;
    ultimaActualizacion.value = null;
    error.value = null;
  };

  // =====================================================
  // NUEVAS ACCIONES - GESTIÓN DE EMPRESA
  // =====================================================

  /**
   * Cargar información de la empresa
   */
  const fetchEmpresa = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.getEmpresa();
      if (response.data) {
        empresa.value = response.data;
        ultimaActualizacion.value = new Date();
        console.log('✅ Empresa cargada:', response.data);
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar empresa';
      console.error('❌ Error al cargar empresa:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar información de la empresa
   */
  const updateEmpresa = async (data: EmpresaUpdateDTO): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.updateEmpresa(data);
      if (response.data) {
        empresa.value = response.data;
        ultimaActualizacion.value = new Date();
        console.log('✅ Empresa actualizada:', response.data);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar empresa';
      console.error('❌ Error al actualizar empresa:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar logo de la empresa
   */
  const updateLogo = async (file: File): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.updateLogo(file);
      if (response.data) {
        empresa.value = response.data;
        console.log('✅ Logo actualizado:', response.data.logoUrl);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar logo';
      console.error('❌ Error al actualizar logo:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cambiar estado de la empresa
   */
  const cambiarEstado = async (activa: boolean): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.cambiarEstado(activa);
      if (response.data) {
        empresa.value = response.data;
        console.log(`✅ Estado cambiado a: ${activa ? 'ACTIVA' : 'INACTIVA'}`);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Error al cambiar estado';
      console.error('❌ Error al cambiar estado:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cargar estadísticas de la empresa
   */
  const fetchEstadisticas = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.getEstadisticas();
      if (response.data) {
        estadisticas.value = response.data;
        console.log('✅ Estadísticas cargadas:', response.data);
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar estadísticas';
      console.error('❌ Error al cargar estadísticas:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cambiar slug de la empresa
   */
  const cambiarSlug = async (nuevoSlug: string): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await EmpresaService.cambiarSlug(nuevoSlug);
      if (response.data) {
        empresa.value = response.data;
        console.log('✅ Slug actualizado:', response.data.slug);
        return true;
      }
      return false;
    } catch (err: any) {
      // Capturar mensajes específicos del backend
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else if (err.message) {
        error.value = err.message;
      } else {
        error.value = 'Error al cambiar slug';
      }
      console.error('❌ Error al cambiar slug:', err);
      throw err; // Propagar el error para que ConfiguracionView pueda manejarlo
    } finally {
      loading.value = false;
    }
  };

  /**
   * Limpiar error
   */
  const clearError = (): void => {
    error.value = null;
  };

  return {
    // Estado
    empresa: readonly(empresa),
    estadisticas: readonly(estadisticas),
    validacion: readonly(validacion),
    loading: readonly(loading),
    error: readonly(error),
    ultimaActualizacion: readonly(ultimaActualizacion),

    // Getters
    aplicaIgv,
    porcentajeIgv,
    nombreEmpresa,
    tipoOperacion,
    mensajeCliente,
    capacidades,
    esEmpresaInformal,
    necesitaActualizacion,

    // Actions - Legacy
    cargarValidacion,
    verificarSoloIgv,
    obtenerMensajeCliente,
    limpiarCache,

    // Actions - Nueva Gestión
    fetchEmpresa,
    updateEmpresa,
    updateLogo,
    cambiarEstado,
    fetchEstadisticas,
    cambiarSlug,
    clearError,
  };
});