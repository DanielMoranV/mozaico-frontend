export const TipoUsuario = {
  ADMIN: 'ADMIN',
  CLIENTE: 'CLIENTE',
} as const;

export type TipoUsuario = typeof TipoUsuario[keyof typeof TipoUsuario];

export const EstadoUsuario = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  BLOQUEADO: 'BLOQUEADO',
} as const;

export type EstadoUsuario = typeof EstadoUsuario[keyof typeof EstadoUsuario];

export const TipoDocumentoIdentidad = {
  DNI: 'DNI',
  PASAPORTE: 'PASAPORTE',
  CARNE_EXTRANJERIA: 'CARNE_EXTRANJERIA',
  OTROS: 'OTROS',
} as const;

export type TipoDocumentoIdentidad = typeof TipoDocumentoIdentidad[keyof typeof TipoDocumentoIdentidad];