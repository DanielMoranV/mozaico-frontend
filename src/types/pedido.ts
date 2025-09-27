import type { ClienteResponseDTO } from './cliente';
import type { Mesa } from './mesa';
import type { UsuarioResponseDTO } from './usuario';
import type { DetallePedido, DetallePedidoRequestDTO, DetallePedidoResponseDTO } from './detallePedido'; // Importar DetallePedido
import { EstadoPedido, TipoServicio } from './enums';

export { EstadoPedido, TipoServicio };

export interface Pedido {
  idPedido: number;
  cliente?: ClienteResponseDTO;
  mesa?: Mesa;
  empleado?: UsuarioResponseDTO;
  fechaPedido: string;
  estado: EstadoPedido;
  tipoServicio: TipoServicio;
  subtotal: number;
  impuestos: number;
  descuento: number;
  total: number;
  observaciones?: string;
  direccionDelivery?: string;
  detalles?: DetallePedido[]; // Añadir detalles del pedido
}

export interface PedidoRequestDTO {
  idCliente?: number;
  idMesa?: number;
  idEmpleado?: number;
  tipoServicio: TipoServicio;
  observaciones?: string;
  direccionDelivery?: string;
  detalles: DetallePedidoRequestDTO[];
}

export interface PedidoResponseDTO {
  idPedido: number;
  cliente?: {
    idCliente: number;
    nombre: string;
    apellido: string;
  };
  mesa?: {
    idMesa: number;
    numeroMesa: number;
  };
  empleado?: {
    idUsuario: number;
    nombre: string;
    username: string;
  };
  fechaPedido: string; // ISO 8601 date string
  estado: EstadoPedido;
  tipoServicio: TipoServicio;
  subtotal: number;
  impuestos: number;
  descuento: number;
  total: number;
  observaciones?: string;
  direccionDelivery?: string;
  detalles: DetallePedidoResponseDTO[];
}


export interface PedidoUpdateDTO {
  idCliente?: number;
  idMesa?: number;
  idEmpleado?: number;
  estado?: EstadoPedido;
  tipoServicio?: TipoServicio;
  subtotal?: number;
  impuestos?: number;
  descuento?: number;
  total?: number;
  observaciones?: string;
  direccionDelivery?: string;
}

export interface PedidoSearchParams {
  idCliente?: number;
  idMesa?: number;
  idEmpleado?: number;
  fechaPedidoDesde?: string;
  fechaPedidoHasta?: string;
  estado?: EstadoPedido;
  tipoServicio?: TipoServicio;
  searchTerm?: string;
  logic?: 'AND' | 'OR';
}
