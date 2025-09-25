export const TipoUsuario = {
  ADMIN: "ADMIN",
  MESERO: "MESERO",
  COCINERO: "COCINERO",
  CAJERO: "CAJERO",
  GERENETE: "GERENTE",
} as const;

export type TipoUsuario = (typeof TipoUsuario)[keyof typeof TipoUsuario];

export const EstadoUsuario = {
  ACTIVO: "ACTIVO",
  INACTIVO: "INACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
} as const;

export type EstadoUsuario = (typeof EstadoUsuario)[keyof typeof EstadoUsuario];

export const TipoDocumentoIdentidad = {
  DNI: "DNI",
  PASAPORTE: "PASAPORTE",
  CARNE_EXTRANJERIA: "CARNE_EXTRANJERIA",
  OTROS: "OTROS",
} as const;

export type TipoDocumentoIdentidad =
  (typeof TipoDocumentoIdentidad)[keyof typeof TipoDocumentoIdentidad];

export const EstadoMesa = {
  DISPONIBLE: 'DISPONIBLE',
  OCUPADA: 'OCUPADA',
  RESERVADA: 'RESERVADA',
  MANTENIMIENTO: 'MANTENIMIENTO',
} as const;

export type EstadoMesa = (typeof EstadoMesa)[keyof typeof EstadoMesa];

export const EstadoPedido = {
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;

export type EstadoPedido = (typeof EstadoPedido)[keyof typeof EstadoPedido];

export const TipoServicio = {
  MESA: 'MESA',
  LLEVAR: 'LLEVAR',
  DELIVERY: 'DELIVERY',
} as const;

export type TipoServicio = (typeof TipoServicio)[keyof typeof TipoServicio];

export const EstadoDetallePedido = {
  PENDIENTE: 'PENDIENTE',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
} as const;

export type EstadoDetallePedido = (typeof EstadoDetallePedido)[keyof typeof EstadoDetallePedido];

export const EstadoCompra = {
  PENDIENTE: 'PENDIENTE',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
} as const;

export type EstadoCompra = (typeof EstadoCompra)[keyof typeof EstadoCompra];

export const TipoAjusteStock = {
  ENTRADA: 'ENTRADA',
  SALIDA: 'SALIDA',
} as const;

export type TipoAjusteStock = (typeof TipoAjusteStock)[keyof typeof TipoAjusteStock];

export const EstadoPago = {
  COMPLETADO: 'COMPLETADO',
  PENDIENTE: 'PENDIENTE',
  FALLIDO: 'FALLIDO',
} as const;

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];

export const EstadoReserva = {
  CONFIRMADA: 'CONFIRMADA',
  PENDIENTE: 'PENDIENTE',
  CANCELADA: 'CANCELADA',
} as const;

export type EstadoReserva = (typeof EstadoReserva)[keyof typeof EstadoReserva];
