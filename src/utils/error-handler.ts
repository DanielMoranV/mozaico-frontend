import { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  statusCode: number;
}

/**
 * Maneja errores de la API y devuelve un objeto ErrorResponse normalizado
 *
 * @param error - Error desconocido capturado en try-catch
 * @returns Objeto ErrorResponse con mensaje y código de estado
 *
 * @example
 * ```typescript
 * try {
 *   await reservaService.crear(form.value);
 * } catch (error) {
 *   const { message, statusCode } = handleApiError(error);
 *
 *   if (statusCode === 409) {
 *     // Mesa no disponible - mostrar mesas alternativas
 *     showAlternativasModal.value = true;
 *   } else {
 *     errorMessage.value = message;
 *   }
 * }
 * ```
 */
export function handleApiError(error: unknown): ErrorResponse {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Error desconocido';

    return { message, statusCode: status };
  }

  return {
    message: 'Error inesperado',
    statusCode: 500,
  };
}

/**
 * Mensajes de error por código de estado para reservas
 */
export const RESERVA_ERROR_MESSAGES: Record<number, string> = {
  400: 'Los datos proporcionados no son válidos',
  401: 'Debe iniciar sesión para continuar',
  404: 'La reserva no fue encontrada',
  409: 'La mesa no está disponible para la fecha y hora seleccionadas',
  500: 'Error del servidor. Por favor, intente más tarde'
};

/**
 * Obtiene un mensaje de error amigable basado en el código de estado
 *
 * @param statusCode - Código de estado HTTP
 * @param defaultMessage - Mensaje por defecto si no hay uno específico
 * @returns Mensaje de error amigable para el usuario
 */
export function getErrorMessage(statusCode: number, defaultMessage?: string): string {
  return RESERVA_ERROR_MESSAGES[statusCode] || defaultMessage || 'Ha ocurrido un error';
}

/**
 * Verifica si el error es por falta de disponibilidad (409 Conflict)
 */
export function isDisponibilidadError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 409;
  }
  return false;
}

/**
 * Verifica si el error es por validación (400 Bad Request)
 */
export function isValidacionError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
}

/**
 * Verifica si el error es por recurso no encontrado (404 Not Found)
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
}
