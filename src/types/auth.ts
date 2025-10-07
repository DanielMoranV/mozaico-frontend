// Tipos para autenticación JWT y sistema de seguridad empresarial
import type { TipoUsuario, EstadoUsuario } from './enums';

export interface AuthRequest {
  username: string;        // Requerido, 1-50 caracteres
  password: string;        // Requerido, mínimo 6 caracteres
}

export interface RefreshTokenRequest {
  refreshToken: string;    // Requerido, JWT refresh token
}

export interface UserInfo {
  id: number;
  username: string;
  nombre: string;
  email: string;
  tipoUsuario: TipoUsuario;
  tipoUsuarioDisplayName: string;
  empresaId: number;
  empresaNombre: string;
  permissions: Permission[];   // Array de permisos
}

export interface AuthResponse {
  accessToken: string;     // JWT access token
  refreshToken: string;    // JWT refresh token
  tokenType: "Bearer";     // Siempre "Bearer"
  expiresIn: number;       // Segundos hasta expiración
  user: UserInfo;          // Información del usuario
}

// Permisos disponibles
export type Permission =
  | "ALL_PERMISSIONS"
  | "MANAGE_USERS"
  | "MANAGE_COMPANY"
  | "VIEW_REPORTS"
  | "MANAGE_PAYMENTS"
  | "MANAGE_ORDERS"
  | "VIEW_ORDERS"
  | "MANAGE_RESERVATIONS"
  | "VIEW_RESERVATIONS"
  | "MANAGE_INVENTORY"
  | "MANAGE_TABLES"
  | "MANAGE_CASH_REGISTER"
  | "MANAGE_KITCHEN"
  | "UPDATE_ORDER_STATUS";

// Interfaz para auditoría
export interface AuditLogResponse {
  id: number;
  usuario: {
    id: number;
    username: string;
    nombre: string;
  };
  empresa: {
    idEmpresa: number;
    nombre: string;
  };
  accion: string;           // CREATE, UPDATE, DELETE, etc.
  entidad: string;          // Pedido, Pago, Reserva, etc.
  entidadId?: number;       // ID del registro afectado
  descripcion: string;
  detallesAdicionales?: string; // JSON con datos extra
  ipAddress: string;
  userAgent?: string;
  fechaHora: string;        // ISO DateTime
  exitoso: boolean;
  mensajeError?: string;
}

// Interfaz para paginación
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Estado de autenticación
export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  empresaId: number | null;
  isLoading: boolean;
}

// Mapa de permisos por rol
export const ROLE_PERMISSIONS: Record<TipoUsuario, Permission[]> = {
  'SUPER_ADMIN': ["ALL_PERMISSIONS"],
  'ADMIN': [
    "MANAGE_USERS",
    "MANAGE_COMPANY",
    "VIEW_REPORTS",
    "MANAGE_PAYMENTS",
    "MANAGE_ORDERS",
    "VIEW_ORDERS",
    "MANAGE_RESERVATIONS",
    "VIEW_RESERVATIONS",
    "MANAGE_INVENTORY"
  ],
  'GERENTE': [
    "VIEW_REPORTS",
    "MANAGE_PAYMENTS",
    "MANAGE_ORDERS",
    "VIEW_ORDERS",
    "MANAGE_RESERVATIONS",
    "VIEW_RESERVATIONS",
    "MANAGE_INVENTORY"
  ],
  'CAJERO': [
    "MANAGE_PAYMENTS",
    "VIEW_ORDERS",
    "MANAGE_CASH_REGISTER"
  ],
  'MESERO': [
    "MANAGE_ORDERS",
    "VIEW_ORDERS",
    "VIEW_RESERVATIONS",
    "MANAGE_TABLES"
  ],
  'COCINERO': [
    "VIEW_ORDERS",
    "MANAGE_KITCHEN",
    "UPDATE_ORDER_STATUS"
  ],
  'CLIENTE': [] // Los clientes no tienen permisos administrativos
};

// Nombres amigables para tipos de usuario
export const TIPO_USUARIO_DISPLAY: Record<TipoUsuario, string> = {
  'SUPER_ADMIN': "Super Administrador",
  'ADMIN': "Administrador",
  'GERENTE': "Gerente",
  'CAJERO': "Cajero",
  'MESERO': "Mesero",
  'COCINERO': "Cocinero",
  'CLIENTE': "Cliente"
};

// Nombres amigables para permisos
export const PERMISSION_DISPLAY: Record<Permission, string> = {
  "ALL_PERMISSIONS": "Todos los permisos",
  "MANAGE_USERS": "Gestionar usuarios",
  "MANAGE_COMPANY": "Gestionar empresa",
  "VIEW_REPORTS": "Ver reportes",
  "MANAGE_PAYMENTS": "Gestionar pagos",
  "MANAGE_ORDERS": "Gestionar pedidos",
  "VIEW_ORDERS": "Ver pedidos",
  "MANAGE_RESERVATIONS": "Gestionar reservas",
  "VIEW_RESERVATIONS": "Ver reservas",
  "MANAGE_INVENTORY": "Gestionar inventario",
  "MANAGE_TABLES": "Gestionar mesas",
  "MANAGE_CASH_REGISTER": "Gestionar caja",
  "MANAGE_KITCHEN": "Gestionar cocina",
  "UPDATE_ORDER_STATUS": "Actualizar estado de pedidos"
};