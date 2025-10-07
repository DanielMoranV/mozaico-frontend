// Importar desde enums.ts y metodoPago.ts para evitar duplicación
import type { EstadoPago } from './enums';
import type { MetodoPagoResponseDTO } from './metodoPago';

export interface PagoRequestDTO {
  idPedido: number;        // ✅ OBLIGATORIO - ID del pedido a pagar
  idMetodo: number;        // ✅ OBLIGATORIO - ID del método de pago
  monto: number;           // ✅ OBLIGATORIO - Monto a pagar (mínimo 0)
  referencia?: string;     // ⚪ OPCIONAL - Referencia del pago
  estado?: EstadoPago;     // ⚪ OPCIONAL - Estado del pago (por defecto: COMPLETADO)
}

export interface PagoResponseDTO {
  idPago: number;
  pedido: {
    idPedido: number;
    fechaPedido: string;
  };
  metodoPago: {
    idMetodo: number;
    nombre: string;
  };
  monto: number;
  fechaPago: string;
  referencia?: string;
  estado: EstadoPago;
}

// Interfaz para pago completo con comprobante
export interface PagoCompletoResponseDTO extends PagoResponseDTO {
  comprobante: ComprobanteDTO;
}

// Tipos de comprobante
export const TIPOS_COMPROBANTE = {
  BOLETA: 'BOLETA',
  FACTURA: 'FACTURA',
  NOTA_CREDITO: 'NOTA_CREDITO',
  NOTA_DEBITO: 'NOTA_DEBITO'
} as const;

export type TipoComprobante = typeof TIPOS_COMPROBANTE[keyof typeof TIPOS_COMPROBANTE];

// Estados de comprobante
export const ESTADOS_COMPROBANTE = {
  EMITIDO: 'EMITIDO',
  ANULADO: 'ANULADO',
  REIMPRESO: 'REIMPRESO'
} as const;

export type EstadoComprobante = typeof ESTADOS_COMPROBANTE[keyof typeof ESTADOS_COMPROBANTE];

// Interfaz del comprobante
export interface ComprobanteDTO {
  idComprobante: number;
  tipoComprobante: TipoComprobante;
  numeroComprobante: string;
  serieComprobante: string;
  fechaEmision: string;
  estado: EstadoComprobante;
  hashVerificacion: string;
  urlDescargaTicket: string;
  urlDescargaPdf: string;
  archivoTicketDisponible: boolean;
  archivoPdfDisponible: boolean;
}

// Re-exportar para compatibilidad
export type { EstadoPago, MetodoPagoResponseDTO };

// Interfaz para parámetros de búsqueda de pagos (compatibilidad con archivos existentes)
export interface PagoSearchParams {
  idPedido?: number;
  idMetodo?: number;
  fechaPagoDesde?: string;
  fechaPagoHasta?: string;
  estado?: EstadoPago;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}

// Métodos de pago predefinidos según la documentación
export const METODOS_PAGO_DEFAULT = [
  { idMetodo: 1, nombre: "Efectivo" },
  { idMetodo: 2, nombre: "Tarjeta de Crédito" },
  { idMetodo: 3, nombre: "Tarjeta de Débito" },
  { idMetodo: 4, nombre: "Yape" },
  { idMetodo: 5, nombre: "Plin" },
  { idMetodo: 6, nombre: "Transferencia Bancaria" }
] as const;