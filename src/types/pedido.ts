import type { Cliente } from './cliente';
import type { Mesa } from './mesa';
import type { UsuarioResponseDTO } from './usuario';
import { EstadoPedido, TipoServicio } from './enums';

export interface Pedido {
  idPedido: number;
  cliente?: Cliente;
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
}

export interface PedidoRequestDTO {
  idCliente?: number;
  idMesa?: number;
  idEmpleado?: number;
  estado?: EstadoPedido;
  tipoServicio?: TipoServicio;
  observaciones?: string;
  direccionDelivery?: string;
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
