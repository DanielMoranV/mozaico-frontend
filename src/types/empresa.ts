export const TipoOperacion = {
  TICKET_SIMPLE: 'TICKET_SIMPLE',
  FACTURA_ELECTRONICA: 'FACTURA_ELECTRONICA',
  BOLETA_MANUAL: 'BOLETA_MANUAL',
  MIXTO: 'MIXTO'
} as const;

export type TipoOperacion = typeof TipoOperacion[keyof typeof TipoOperacion];

export interface ValidacionIgvResponse {
  // Configuración de IGV
  aplicaIgv: boolean
  porcentajeIgv: number
  moneda: string

  // Capacidades de emisión
  tipoOperacion: TipoOperacion
  puedeEmitirFacturas: boolean
  puedeEmitirBoletas: boolean
  puedeEmitirTickets: boolean
  facturacionElectronicaActiva: boolean

  // Información para cliente
  mensajeCliente: string
  tipoComprobanteDisponible: string
  comprobantesPermitidos: string[]

  // Datos de empresa
  nombreEmpresa: string
  ruc: string | null
  tieneRuc: boolean

  // Configuración de cálculos
  incluyeIgvEnPrecio: boolean
  formatoNumeracion: string
  prefijoComprobante: string

  // Estado y validaciones
  empresaActiva: boolean
  configuracionValida: boolean
  advertencias: string[]
  limitaciones: string[]
}

export interface CalculoTotales {
  subtotal: number
  igv: number
  descuento: number
  total: number
  aplicaIgv: boolean
  porcentajeIgv: number
}

export interface ProductoCarrito {
  id: number
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

export interface ConfiguracionEmpresa {
  aplicaIgv: boolean
  porcentajeIgv: number
  inicializada: boolean
}

export interface Empresa {
  idEmpresa: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  paginaWeb?: string;
  logoUrl?: string;
  activa: boolean;
  tipoOperacion: TipoOperacion;
  aplicaIgv: boolean;
  porcentajeIgv: number;
  moneda: string;
  prefijoTicket?: string;
  correlativoTicket?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface EmpresaUpdateDTO {
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  paginaWeb?: string;
  tipoOperacion: TipoOperacion;
  aplicaIgv: boolean;
  porcentajeIgv?: number;
  moneda?: string;
  prefijoTicket?: string;
}

export interface EmpresaEstadisticas {
  totalProductos: number;
  totalClientes: number;
  totalEmpleados: number;
  totalPedidos: number;
  empresa: Empresa;
}