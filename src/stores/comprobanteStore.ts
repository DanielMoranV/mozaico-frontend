import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ComprobanteService } from '@/services/comprobanteService';
import type { Comprobante, ComprobanteListItem } from '@/types/comprobante';
import type { ComprobanteDTO } from '@/types/pago';

export const useComprobanteStore = defineStore('comprobante', () => {
  const comprobantes = ref<ComprobanteListItem[]>([]);
  const comprobanteActual = ref<Comprobante | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Cargar todos los comprobantes
   */
  async function fetchComprobantes() {
    loading.value = true;
    error.value = null;
    try {
      const response = await ComprobanteService.getAll();
      if (response.data) {
        comprobantes.value = response.data;
      } else {
        error.value = response.message || 'Error al cargar comprobantes';
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar comprobantes';
      console.error('Error al cargar comprobantes:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtener comprobante por ID de pago
   */
  async function fetchComprobantePorPago(idPago: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await ComprobanteService.getComprobantePorPago(idPago);
      if (response.data) {
        comprobanteActual.value = response.data as any;
        return response.data;
      } else {
        error.value = response.message || 'Error al cargar comprobante';
        return null;
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar comprobante';
      console.error('Error al cargar comprobante:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Descargar ticket
   */
  async function descargarTicket(comprobante: ComprobanteDTO) {
    try {
      loading.value = true;
      error.value = null;
      await ComprobanteService.descargarYGuardarTicket(comprobante);
    } catch (err: any) {
      error.value = err.message || 'Error al descargar ticket';
      console.error('Error al descargar ticket:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Descargar PDF
   */
  async function descargarPdf(comprobante: ComprobanteDTO) {
    try {
      loading.value = true;
      error.value = null;
      await ComprobanteService.descargarYGuardarPdf(comprobante);
    } catch (err: any) {
      error.value = err.message || 'Error al descargar PDF';
      console.error('Error al descargar PDF:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reimprimir comprobante
   */
  async function reimprimirComprobante(idComprobante: number) {
    try {
      loading.value = true;
      error.value = null;
      const response = await ComprobanteService.reimprimirComprobante(idComprobante);
      if (response.data) {
        // Actualizar lista de comprobantes
        await fetchComprobantes();
        return true;
      } else {
        error.value = response.message || 'Error al reimprimir comprobante';
        return false;
      }
    } catch (err: any) {
      error.value = err.message || 'Error al reimprimir comprobante';
      console.error('Error al reimprimir comprobante:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Anular comprobante
   */
  async function anularComprobante(idComprobante: number, motivo?: string) {
    try {
      loading.value = true;
      error.value = null;
      const response = await ComprobanteService.anularComprobante(idComprobante, motivo);
      if (response.data) {
        // Actualizar lista de comprobantes
        await fetchComprobantes();
        return true;
      } else {
        error.value = response.message || 'Error al anular comprobante';
        return false;
      }
    } catch (err: any) {
      error.value = err.message || 'Error al anular comprobante';
      console.error('Error al anular comprobante:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Limpiar error
   */
  function clearError() {
    error.value = null;
  }

  return {
    // State
    comprobantes,
    comprobanteActual,
    loading,
    error,

    // Actions
    fetchComprobantes,
    fetchComprobantePorPago,
    descargarTicket,
    descargarPdf,
    reimprimirComprobante,
    anularComprobante,
    clearError,
  };
});
