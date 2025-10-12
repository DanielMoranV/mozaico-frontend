/**
 * Composable para consumir la API pública de Carta Digital
 * Endpoints sin autenticación para visualización pública de menús
 */

import { ref } from "vue";
import type { ApiResponse, ProductoCartaDTO, CartaResponseDTO, EmpresaDTO } from "@/types/cartaPublica";

// Base URL del backend - Usar variable de entorno
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8091/api/v1";

export function useCartaApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const empresa = ref<EmpresaDTO | null>(null);

  /**
   * Obtiene la carta completa de un restaurante
   * Endpoint: GET /api/v1/productos/public/{slug}/carta
   *
   * @param slug - Slug único del restaurante
   * @param idCategoria - Filtro opcional por categoría
   * @returns Array de productos disponibles
   */
  async function obtenerCarta(
    slug: string,
    idCategoria?: number
  ): Promise<ProductoCartaDTO[]> {
    loading.value = true;
    error.value = null;

    try {
      const url = new URL(`${API_BASE_URL}/productos/public/${slug}/carta`);

      if (idCategoria) {
        url.searchParams.append("idCategoria", idCategoria.toString());
      }

      console.log("🌐 Obteniendo carta:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Restaurante no encontrado. Verifica el enlace.");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<CartaResponseDTO> =
        await response.json();

      if (apiResponse.status === "ERROR") {
        throw new Error(apiResponse.message);
      }

      // Guardar información de la empresa
      empresa.value = apiResponse.data.empresa;

      console.log("✅ Carta obtenida:", apiResponse.data.productos.length, "productos");
      console.log("🏢 Empresa:", apiResponse.data.empresa.nombre);
      return apiResponse.data.productos;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar la carta";
      error.value = errorMessage;
      console.error("❌ Error al obtener carta:", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene la carta agrupada por categorías
   * Endpoint: GET /api/v1/productos/public/{slug}/carta/por-categoria
   *
   * @param slug - Slug único del restaurante
   * @returns Array de productos agrupados por categoría
   */
  async function obtenerCartaPorCategoria(
    slug: string
  ): Promise<ProductoCartaDTO[]> {
    loading.value = true;
    error.value = null;

    try {
      const url = `${API_BASE_URL}/productos/public/${slug}/carta/por-categoria`;

      console.log("🌐 Obteniendo carta por categoría:", url);

      const response = await fetch(url);
      console.log("Respuesta recibida:", response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Restaurante no encontrado. Verifica el enlace.");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiResponse: ApiResponse<CartaResponseDTO> =
        await response.json();

      if (apiResponse.status === "ERROR") {
        throw new Error(apiResponse.message);
      }

      // Guardar información de la empresa
      empresa.value = apiResponse.data.empresa;

      console.log(
        "✅ Carta por categoría obtenida:",
        apiResponse.data.productos.length,
        "productos"
      );
      console.log("🏢 Empresa:", apiResponse.data.empresa.nombre);
      console.log(apiResponse);
      return apiResponse.data.productos;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar la carta";
      error.value = errorMessage;
      console.error("❌ Error al obtener carta por categoría:", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene la URL del QR code de la carta
   * Endpoint: GET /api/v1/carta-qr/public/{slug}
   *
   * @param slug - Slug único del restaurante
   * @returns URL de la imagen QR (400x400 px)
   */
  function obtenerUrlQR(slug: string): string {
    return `${API_BASE_URL}/carta-qr/public/${slug}`;
  }

  /**
   * Obtiene la URL completa de una imagen de producto
   *
   * @param imagenUrl - URL relativa de la imagen
   * @returns URL completa de la imagen
   */
  function obtenerUrlImagen(imagenUrl: string | null): string | null {
    if (!imagenUrl) return null;

    // Si ya es una URL completa, retornarla tal cual
    if (imagenUrl.startsWith("http://") || imagenUrl.startsWith("https://")) {
      return imagenUrl;
    }

    // Construir URL completa desde el backend
    const baseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${baseUrl}${imagenUrl}`;
  }

  /**
   * Limpia el estado de error
   */
  function limpiarError(): void {
    error.value = null;
  }

  return {
    // Estado
    loading,
    error,
    empresa,

    // Métodos
    obtenerCarta,
    obtenerCartaPorCategoria,
    obtenerUrlQR,
    obtenerUrlImagen,
    limpiarError,
  };
}
