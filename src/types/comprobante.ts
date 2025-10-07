import type { TipoComprobante, EstadoComprobante } from './enums';
import type { Pago } from './pago';

export interface Comprobante {
  idComprobante: number;
  pago?: Pago;
  tipoComprobante: TipoComprobante;
  numeroComprobante: string;
  serieComprobante: string;
  fechaEmision: string;
  estado: EstadoComprobante;
  rutaArchivoPdf?: string;
  rutaArchivoTicket?: string;
  hashVerificacion?: string;
  qrCode?: string;
  urlDescargaTicket?: string;
  urlDescargaPdf?: string;
  urlVisualizacion?: string;
  observaciones?: string;
  archivoTicketDisponible?: boolean;
  archivoPdfDisponible?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ComprobanteListItem {
  idComprobante: number;
  tipoComprobante: TipoComprobante;
  numeroComprobante: string;
  serieComprobante: string;
  fechaEmision: string;
  estado: EstadoComprobante;
  hashVerificacion?: string;
  urlDescargaTicket?: string;
  urlDescargaPdf?: string;
  urlVisualizacion?: string;
  observaciones?: string;
  archivoTicketDisponible?: boolean;
  archivoPdfDisponible?: boolean;
}
