import { apiClient } from './api';
import type { ComprobanteDTO } from '@/types/pago';
import type { Comprobante, ComprobanteListItem } from '@/types/comprobante';
import type { ApiResponse, LegacyApiResponse } from '@/types/api';

export class ComprobanteService {
  private static readonly BASE_URL = '/comprobantes';

  /**
   * Obtener todos los comprobantes
   * GET /api/v1/comprobantes
   */
  static async getAll(): Promise<ApiResponse<ComprobanteListItem[]>> {
    try {
      console.log('📋 Obteniendo todos los comprobantes');

      const response = await apiClient.get<ApiResponse<ComprobanteListItem[]>>(this.BASE_URL);

      console.log('✅ Comprobantes obtenidos exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener comprobantes:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al obtener comprobantes',
        data: [] as ComprobanteListItem[]
      };
    }
  }

  /**
   * Descarga el comprobante en formato ticket PDF (para guardar)
   * GET /api/v1/comprobantes/{id}/ticket
   * Content-Disposition: attachment
   * Backend envía tickets en formato PDF
   */
  static async descargarTicket(idComprobante: number): Promise<Blob> {
    try {
      console.log('🎫 Descargando ticket PDF:', idComprobante);

      const response = await apiClient.get(`${this.BASE_URL}/${idComprobante}/ticket`, {
        responseType: 'blob'
      });

      console.log('✅ Ticket PDF descargado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al descargar ticket:', error);
      throw new Error('Error al descargar el ticket');
    }
  }

  /**
   * Obtiene el ticket PDF para imprimir automáticamente
   * GET /api/v1/comprobantes/{id}/ticket/imprimir
   * Content-Disposition: inline
   * Header: X-Auto-Print: true
   * Backend envía tickets en formato PDF
   */
  static async obtenerTicketParaImprimir(idComprobante: number): Promise<Blob> {
    try {
      console.log('🖨️ Obteniendo ticket PDF para imprimir:', idComprobante);

      const response = await apiClient.get(`${this.BASE_URL}/${idComprobante}/ticket/imprimir`, {
        responseType: 'blob'
      });

      console.log('✅ Ticket PDF listo para imprimir');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ticket para imprimir:', error);
      throw new Error('Error al obtener el ticket para impresión');
    }
  }

  /**
   * Descarga el comprobante en formato PDF A4
   * GET /api/v1/comprobantes/{id}/pdf
   */
  static async descargarPdf(idComprobante: number): Promise<Blob> {
    try {
      console.log('📄 Descargando PDF:', idComprobante);

      const response = await apiClient.get(`${this.BASE_URL}/${idComprobante}/pdf`, {
        responseType: 'blob'
      });

      console.log('✅ PDF descargado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al descargar PDF:', error);
      throw new Error('Error al descargar el PDF');
    }
  }

  /**
   * Obtiene el comprobante por ID de pago
   * GET /api/v1/comprobantes/pago/{idPago}
   */
  static async getComprobantePorPago(idPago: number): Promise<ApiResponse<ComprobanteDTO>> {
    try {
      console.log('🔍 Obteniendo comprobante por pago:', idPago);

      const response = await apiClient.get<ApiResponse<ComprobanteDTO>>(
        `${this.BASE_URL}/pago/${idPago}`
      );

      console.log('✅ Comprobante obtenido exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener comprobante:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al obtener comprobante',
        data: null as any
      };
    }
  }

  /**
   * Reimprime un comprobante
   * POST /api/v1/comprobantes/{id}/reimprimir
   */
  static async reimprimirComprobante(idComprobante: number): Promise<ApiResponse<ComprobanteDTO>> {
    try {
      console.log('🖨️ Reimprimiendo comprobante:', idComprobante);

      const response = await apiClient.post<ApiResponse<ComprobanteDTO>>(
        `${this.BASE_URL}/${idComprobante}/reimprimir`
      );

      console.log('✅ Comprobante reimpreso exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al reimprimir comprobante:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al reimprimir comprobante',
        data: null as any
      };
    }
  }

  /**
   * Anula un comprobante
   * POST /api/v1/comprobantes/{id}/anular?motivo={motivo}
   */
  static async anularComprobante(idComprobante: number, motivo?: string): Promise<ApiResponse<ComprobanteDTO>> {
    try {
      console.log('❌ Anulando comprobante:', idComprobante, 'Motivo:', motivo);

      const response = await apiClient.post<ApiResponse<ComprobanteDTO>>(
        `${this.BASE_URL}/${idComprobante}/anular`,
        null,
        {
          params: motivo ? { motivo } : undefined
        }
      );

      console.log('✅ Comprobante anulado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al anular comprobante:', error);

      return {
        status: 'ERROR',
        code: error.response?.status || 500,
        message: error.response?.data?.message || 'Error al anular comprobante',
        data: null as any
      };
    }
  }

  /**
   * Descarga un archivo y lo guarda con el nombre especificado
   */
  static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Formatea el nombre del archivo para descarga
   * Nota: Tanto tickets como PDFs son en formato PDF
   */
  static formatFilename(comprobante: ComprobanteDTO, tipo: 'ticket' | 'pdf'): string {
    const fecha = new Date(comprobante.fechaEmision).toISOString().split('T')[0];
    const prefix = tipo === 'ticket' ? 'ticket' : 'comprobante';
    return `${prefix}_${comprobante.numeroComprobante}_${fecha}.pdf`;
  }

  /**
   * Descarga ticket y guarda automáticamente
   */
  static async descargarYGuardarTicket(comprobante: ComprobanteDTO): Promise<void> {
    try {
      if (!comprobante.archivoTicketDisponible) {
        throw new Error('El archivo ticket no está disponible');
      }

      const blob = await this.descargarTicket(comprobante.idComprobante);
      const filename = this.formatFilename(comprobante, 'ticket');
      this.downloadFile(blob, filename);
    } catch (error) {
      console.error('❌ Error al descargar y guardar ticket:', error);
      throw error;
    }
  }

  /**
   * Descarga PDF y guarda automáticamente
   */
  static async descargarYGuardarPdf(comprobante: ComprobanteDTO): Promise<void> {
    try {
      if (!comprobante.archivoPdfDisponible) {
        throw new Error('El archivo PDF no está disponible');
      }

      const blob = await this.descargarPdf(comprobante.idComprobante);
      const filename = this.formatFilename(comprobante, 'pdf');
      this.downloadFile(blob, filename);
    } catch (error) {
      console.error('❌ Error al descargar y guardar PDF:', error);
      throw error;
    }
  }
}