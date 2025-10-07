# 🔄 Diagrama de Flujo - Impresión de Tickets

## Flujo Completo de Impresión Automática

```
┌─────────────────────────────────────────────────────────────┐
│                   USUARIO EN POS                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Toma pedido y selecciona productos                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Click en "Procesar Pago"                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  3. PaymentMethodDialog se abre                             │
│     - Selecciona método de pago                             │
│     - Confirma monto                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Click en "Procesar Pago"                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  📤 FRONTEND: Llama a PagoService.crearPagoCompleto()      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🌐 API: POST /api/v1/pagos/completo                       │
│     Body: { idPedido, idMetodo, monto, referencia }        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖥️ BACKEND:                                                │
│     1. Crea registro de pago                                │
│     2. Actualiza estado del pedido → PAGADO                 │
│     3. Genera comprobante automáticamente                   │
│     4. Crea archivos PDF (ticket + A4)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  📨 Respuesta del Backend:                                  │
│  {                                                          │
│    success: true,                                           │
│    data: {                                                  │
│      pago: { ... },                                         │
│      comprobante: {                                         │
│        idComprobante: 123,                                  │
│        numeroComprobante: "T001-00000001",                  │
│        archivoTicketDisponible: true,                       │
│        archivoPdfDisponible: true                           │
│      }                                                      │
│    }                                                        │
│  }                                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  📱 FRONTEND: Recibe respuesta                              │
│     - Emite evento 'pago-completado'                        │
│     - Emite evento 'comprobante-generado'                   │
│     - Guarda en ultimoComprobante.value                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ⏱️ setTimeout(1000ms) - Esperar que archivo esté listo    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖨️ useTicketPrinter.imprimirTicket()                      │
│     - idComprobante: 123                                    │
│     - autoImprimir: true                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🌐 API: GET /api/v1/comprobantes/123/ticket/imprimir      │
│     Headers: Authorization: Bearer {token}                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖥️ BACKEND Responde:                                       │
│     - Content-Type: application/pdf                         │
│     - Content-Disposition: inline                           │
│     - X-Auto-Print: true                                    │
│     - Body: [PDF Binary Data]                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  📱 FRONTEND Recibe Blob                                    │
│     const blob = response.data;                             │
│     const url = URL.createObjectURL(blob);                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🪟 Crear Iframe Oculto                                     │
│     const iframe = document.createElement('iframe');        │
│     iframe.style.display = 'none';                          │
│     iframe.src = url;                                       │
│     document.body.appendChild(iframe);                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ⏱️ iframe.onload → setTimeout(500ms)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖨️ iframe.contentWindow.print()                           │
│     - Abre diálogo de impresión del navegador               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖨️ DIÁLOGO DEL NAVEGADOR                                  │
│     ┌───────────────────────────────────────┐              │
│     │  Imprimir                             │              │
│     │  ─────────────────────────────────    │              │
│     │  Impresora: [Térmica 80mm ▼]         │              │
│     │  Copias: [1]                          │              │
│     │  ─────────────────────────────────    │              │
│     │  [ Cancelar ]  [ Imprimir ]           │              │
│     └───────────────────────────────────────┘              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ✅ Usuario imprime o cancela                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🧹 Cleanup (después de 1 segundo)                          │
│     - document.body.removeChild(iframe)                     │
│     - URL.revokeObjectURL(url)                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  💬 Mostrar diálogo con comprobante generado                │
│     ┌───────────────────────────────────────────────┐      │
│     │  ✅ Comprobante generado                      │      │
│     │  T001-00000001                                │      │
│     │                                               │      │
│     │  [🖨️ Imprimir Ticket] [📥 Descargar]          │      │
│     │  [📄 Imprimir PDF]                            │      │
│     └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Descarga (Sin Impresión)

```
Usuario Click "Descargar Ticket"
         │
         ▼
GET /api/v1/comprobantes/{id}/ticket
         │
         ▼
Blob con Content-Disposition: attachment
         │
         ▼
ComprobanteService.downloadFile(blob, filename)
         │
         ▼
Navegador descarga automáticamente el archivo
         │
         ▼
Usuario guarda en disco
```

## Comparación de Endpoints

### Endpoint `/ticket` (Descarga)
```
Request:  GET /api/v1/comprobantes/123/ticket
Response Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="ticket_T001-00000001.pdf"

Comportamiento: Navegador descarga automáticamente
```

### Endpoint `/ticket/imprimir` (Impresión)
```
Request:  GET /api/v1/comprobantes/123/ticket/imprimir
Response Headers:
  Content-Type: application/pdf
  Content-Disposition: inline; filename="ticket_T001-00000001.pdf"
  X-Auto-Print: true

Comportamiento: Se abre inline (en iframe) para imprimir
```

## Flujo de Manejo de Errores

```
imprimirTicket()
     │
     ▼
try { obtenerTicketParaImprimir() }
     │
     ├─ ✅ Success
     │   └─> Crear iframe → print()
     │
     └─ ❌ Error
         │
         ▼
     catch (error)
         │
         ├─> error.value = error.message
         ├─> printing.value = false
         └─> return false
              │
              ▼
         Usuario ve error en snackbar
              │
              ▼
         Opción manual de descarga disponible
```

## Timeline de Ejecución

```
t=0ms     Usuario click "Procesar Pago"
          ↓
t=100ms   API call POST /pagos/completo
          ↓
t=800ms   Backend responde con comprobante
          ↓
t=1000ms  setTimeout espera (archivo listo)
          ↓
t=1100ms  GET /ticket/imprimir
          ↓
t=1300ms  Blob recibido
          ↓
t=1400ms  Iframe creado y PDF cargado
          ↓
t=1900ms  iframe.onload + setTimeout(500ms)
          ↓
t=1900ms  🖨️ Diálogo de impresión se abre
          ↓
t=2900ms  Cleanup (removeChild + revokeURL)
```

## Estados del Sistema

| Estado | Descripción | UI |
|--------|-------------|-----|
| `idle` | Sin operación en curso | Botones habilitados |
| `processing` | Creando pago | Loading en botón "Procesar Pago" |
| `printing` | Imprimiendo ticket | Loading en botones de impresión |
| `success` | Completado exitosamente | Dialog con opciones |
| `error` | Error en operación | Snackbar con mensaje de error |

## Puntos Críticos de Fallo

1. **❌ Token expirado** → Interceptor refresca automáticamente
2. **❌ Archivo no disponible** → Backend responde 404
3. **❌ CORS bloqueado** → Verificar configuración del servidor
4. **❌ Bloqueador de popups** → Usuario debe permitir ventanas emergentes
5. **❌ Impresora no configurada** → Diálogo del navegador permite seleccionar
