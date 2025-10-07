import { ref } from 'vue';
import { ComprobanteService } from '@/services/comprobanteService';

/**
 * Composable para gestionar la impresión de tickets
 */
export function useTicketPrinter() {
  const printing = ref(false);
  const error = ref<string | null>(null);

  /**
   * Imprime un ticket directamente usando el navegador
   * @param idComprobante ID del comprobante a imprimir
   * @param autoImprimir Si debe abrir el diálogo de impresión automáticamente
   */
  const imprimirTicket = async (idComprobante: number, autoImprimir = true): Promise<boolean> => {
    printing.value = true;
    error.value = null;

    try {
      console.log('🖨️ Iniciando impresión de ticket:', idComprobante);

      // Obtener el ticket usando el endpoint de impresión (inline + X-Auto-Print)
      const blob = await ComprobanteService.obtenerTicketParaImprimir(idComprobante);

      // Crear URL temporal para el blob
      const url = URL.createObjectURL(blob);

      if (autoImprimir) {
        // Crear iframe oculto para la impresión
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.src = url;

        // Evento cuando el PDF se carga
        iframe.onload = () => {
          console.log('📄 PDF cargado, abriendo diálogo de impresión...');

          setTimeout(() => {
            try {
              // Intentar imprimir
              iframe.contentWindow?.print();

              // Limpiar después de un tiempo
              setTimeout(() => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(url);
                console.log('✅ Impresión completada y recursos liberados');
              }, 1000);
            } catch (err) {
              console.error('❌ Error al intentar imprimir:', err);
              error.value = 'Error al abrir el diálogo de impresión';
              document.body.removeChild(iframe);
              URL.revokeObjectURL(url);
            }
          }, 500); // Esperar medio segundo para que el PDF se cargue completamente
        };

        iframe.onerror = () => {
          console.error('❌ Error al cargar el PDF en el iframe');
          error.value = 'Error al cargar el documento para impresión';
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        };

        // Agregar iframe al DOM
        document.body.appendChild(iframe);
      } else {
        // Solo abrir en nueva ventana para visualizar
        window.open(url, '_blank');

        // Limpiar URL después de un tiempo
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000); // 1 minuto
      }

      printing.value = false;
      return true;
    } catch (err: any) {
      console.error('❌ Error al imprimir ticket:', err);
      error.value = err.message || 'Error al imprimir el ticket';
      printing.value = false;
      return false;
    }
  };

  /**
   * Imprime un PDF A4 completo
   * @param idComprobante ID del comprobante a imprimir
   * @param autoImprimir Si debe abrir el diálogo de impresión automáticamente
   */
  const imprimirPdf = async (idComprobante: number, autoImprimir = true): Promise<boolean> => {
    printing.value = true;
    error.value = null;

    try {
      console.log('🖨️ Iniciando impresión de PDF:', idComprobante);

      const blob = await ComprobanteService.descargarPdf(idComprobante);
      const url = URL.createObjectURL(blob);

      if (autoImprimir) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.src = url;

        iframe.onload = () => {
          console.log('📄 PDF cargado, abriendo diálogo de impresión...');

          setTimeout(() => {
            try {
              iframe.contentWindow?.print();

              setTimeout(() => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(url);
                console.log('✅ Impresión completada y recursos liberados');
              }, 1000);
            } catch (err) {
              console.error('❌ Error al intentar imprimir:', err);
              error.value = 'Error al abrir el diálogo de impresión';
              document.body.removeChild(iframe);
              URL.revokeObjectURL(url);
            }
          }, 500);
        };

        iframe.onerror = () => {
          console.error('❌ Error al cargar el PDF en el iframe');
          error.value = 'Error al cargar el documento para impresión';
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        };

        document.body.appendChild(iframe);
      } else {
        window.open(url, '_blank');
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
      }

      printing.value = false;
      return true;
    } catch (err: any) {
      console.error('❌ Error al imprimir PDF:', err);
      error.value = err.message || 'Error al imprimir el PDF';
      printing.value = false;
      return false;
    }
  };

  /**
   * Reinicia el estado de error
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    printing,
    error,
    imprimirTicket,
    imprimirPdf,
    clearError,
  };
}
