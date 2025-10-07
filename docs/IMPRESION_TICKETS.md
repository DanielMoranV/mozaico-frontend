# 🖨️ Guía de Impresión de Tickets

## Descripción General

El sistema de Mozaico Frontend incluye funcionalidad completa para imprimir tickets y comprobantes directamente desde el navegador, sin necesidad de descargar archivos.

## Características Implementadas

### ✅ Impresión Automática
- Cuando se completa un pago en el POS, el ticket se imprime automáticamente
- El diálogo de impresión del navegador se abre después de 1 segundo
- Si falla la impresión automática, el usuario puede imprimir manualmente

### ✅ Impresión Manual
- Botones de impresión en la tabla de comprobantes
- Botones de impresión en el diálogo de pago completado
- Opción para imprimir ticket (80mm) o PDF A4

### ✅ Descarga de Archivos
- Opción para descargar tickets sin imprimir
- Opción para descargar PDF A4 sin imprimir

## Uso en el POS (Punto de Venta)

### Flujo Automático

1. El usuario completa un pedido en el POS
2. Click en "Procesar Pago"
3. Selecciona método de pago y monto
4. Click en "Procesar Pago"
5. **El ticket se imprime automáticamente** 🖨️
6. Aparece el diálogo del navegador para imprimir
7. El usuario puede cerrar o reimprimir desde el diálogo de confirmación

### Flujo Manual desde el Diálogo

Después de procesar el pago, en el diálogo aparecen botones:

- **Imprimir Ticket**: Abre el diálogo de impresión para ticket 80mm
- **Descargar**: Descarga el ticket sin imprimir
- **Imprimir PDF**: Abre el diálogo de impresión para PDF A4

## Uso en Gestión de Comprobantes

### Desde la Vista de Comprobantes (`/comprobantes`)

La tabla de comprobantes incluye botones para cada comprobante:

1. **🖨️ Imprimir Ticket** (mdi-printer)
   - Abre el diálogo de impresión del navegador
   - Optimizado para impresoras térmicas de 80mm

2. **🖨️ Imprimir PDF A4** (mdi-printer-outline)
   - Abre el diálogo de impresión del navegador
   - Formato A4 completo

3. **⬇️ Descargar Ticket** (mdi-download)
   - Descarga el archivo sin abrir diálogo de impresión

4. **📄 Descargar PDF** (mdi-file-pdf-box)
   - Descarga el PDF A4 sin abrir diálogo de impresión

5. **⚙️ Reimprimir en Servidor** (mdi-printer-settings)
   - Envía comando al servidor para reimprimir
   - Útil si hay impresora configurada en el servidor

## Implementación Técnica

### Composable: `useTicketPrinter`

```typescript
import { useTicketPrinter } from '@/composables/useTicketPrinter';

const { imprimirTicket, imprimirPdf, printing, error } = useTicketPrinter();

// Imprimir ticket
await imprimirTicket(idComprobante, true); // true = auto-print

// Imprimir PDF
await imprimirPdf(idComprobante, true);
```

### Archivos Principales

1. **Composable**: `/src/composables/useTicketPrinter.ts`
   - Gestiona la lógica de impresión
   - Crea iframe oculto para cargar el PDF
   - Abre diálogo de impresión automáticamente

2. **Componente POS**: `/src/components/pos/PaymentMethodDialog.vue`
   - Impresión automática después de pago
   - Botones manuales de impresión/descarga

3. **Vista Comprobantes**: `/src/views/ComprobantesView.vue`
   - Gestión completa de comprobantes
   - Integración con `useTicketPrinter`

4. **Tabla Comprobantes**: `/src/components/comprobantes/ComprobanteTable.vue`
   - Botones de acción para cada comprobante

## Configuración de Impresora

### Impresora Térmica (Recomendada para Tickets)

#### Windows
1. Panel de Control → Dispositivos e impresoras
2. Click derecho en la impresora → "Establecer como predeterminada"
3. Configurar tamaño de papel: 80mm x 297mm (o personalizado)
4. Márgenes: 0mm

#### Linux (CUPS)
```bash
# Instalar CUPS si no está instalado
sudo apt-get install cups

# Configurar en http://localhost:631
# Agregar impresora y configurar:
# - Tamaño: 80mm x variable
# - Sin márgenes
```

#### macOS
1. Preferencias del Sistema → Impresoras y escáneres
2. Agregar impresora térmica
3. Configurar tamaño de papel personalizado: 80mm

### Impresora Normal (Para PDF A4)

Cualquier impresora configurada como predeterminada funcionará para los PDF A4.

## Solución de Problemas

### El diálogo de impresión no se abre

**Causa**: Bloqueador de ventanas emergentes del navegador

**Solución**:
1. Permitir ventanas emergentes para tu dominio
2. En Chrome: Click en el ícono de candado → Configuración del sitio → Ventanas emergentes → Permitir

### El ticket se ve muy pequeño

**Causa**: Impresora no configurada para 80mm

**Solución**:
1. Usar impresora térmica de 80mm
2. O imprimir el PDF A4 en su lugar

### No se encuentra el archivo (404)

**Causa**: El comprobante aún no se ha generado completamente

**Solución**: El sistema espera 1 segundo antes de imprimir. Si persiste, verificar el backend.

### Error de CORS

**Causa**: El navegador bloquea la carga del PDF desde el servidor

**Solución**: Verificar que el backend tenga configurado CORS correctamente para el dominio del frontend.

## Endpoints del Backend Utilizados

### Tickets (80mm)

| Endpoint | Propósito | Content-Disposition | Headers Especiales |
|----------|-----------|---------------------|-------------------|
| `GET /api/v1/comprobantes/{id}/ticket` | Descargar para guardar | `attachment` | - |
| `GET /api/v1/comprobantes/{id}/ticket/imprimir` | Imprimir directamente | `inline` | `X-Auto-Print: true` |

### Comprobantes A4

| Endpoint | Propósito |
|----------|-----------|
| `GET /api/v1/comprobantes/{id}/pdf` | Descargar comprobante A4 |

### Otros

| Endpoint | Propósito |
|----------|-----------|
| `POST /api/v1/comprobantes/{id}/reimprimir` | Reimprimir en impresora del servidor |
| `POST /api/v1/comprobantes/{id}/anular` | Anular comprobante |
| `GET /api/v1/comprobantes` | Listar todos los comprobantes |

**Nota Importante:**
- `/ticket` → Devuelve PDF con header `attachment` (descarga automática)
- `/ticket/imprimir` → Devuelve el mismo PDF pero con header `inline` + `X-Auto-Print: true` (abre en navegador para imprimir)

## Consideraciones de Seguridad

- Todos los endpoints requieren autenticación JWT
- Los archivos se generan temporalmente en el navegador
- Los recursos se limpian automáticamente después de 1 segundo
- No se almacenan archivos en el navegador

## Mejoras Futuras

- [ ] Configuración de impresión automática (on/off)
- [ ] Selección de impresora predeterminada
- [ ] Vista previa antes de imprimir
- [ ] Historial de impresiones
- [ ] Soporte para múltiples formatos de ticket

## Soporte

Para problemas o preguntas:
1. Revisar esta documentación
2. Verificar los logs del navegador (F12 → Console)
3. Verificar los logs del backend
4. Contactar al equipo de desarrollo
