export interface SalesSummaryResponseDTO {
    startDate: string; // ISO 8601 date string (YYYY-MM-DD)
    endDate: string; // ISO 8601 date string (YYYY-MM-DD)
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
}

export interface ProductSalesResponseDTO {
    idProducto: number;
    nombreProducto: string;
    nombreCategoria: string;
    cantidadVendida: number;
    totalVentas: number;
}

export interface LowStockItemResponseDTO {
    idProducto: number;
    nombreProducto: string;
    stockActual: number;
    stockMinimo: number;
    // Opcional: nombreProveedor?: string;
}

export interface ReportSearchParams {
    startDate?: string; // ISO 8601 date string (YYYY-MM-DD)
    endDate?: string; // ISO 8601 date string (YYYY-MM-DD)
    // Add other report-specific search params here
}
