# Plan de Implementación - Mozaico Frontend

## Estado del Proyecto: 80% Completo

**Última actualización:** 2025-10-19

---

## 🎯 ROADMAP DE IMPLEMENTACIÓN

### **FASE 1: FUNCIONALIDADES CRÍTICAS** (Prioridad Alta)
**Duración estimada:** 2-3 semanas

#### 1.1 Validación de Disponibilidad de Mesas en Reservas
- **Estado:** ✅ COMPLETADO
- **Archivos afectados:**
  - `src/components/reservas/ReservaEditDialog.vue` ✅
  - `src/components/reservas/CrearReservaForm.vue` ✅
  - `src/components/reservas/DisponibilidadMesas.vue` (ya existía)
- **Tareas:**
  - [x] Integrar validación de disponibilidad en CrearReservaForm
  - [x] Integrar validación de disponibilidad en ReservaEditDialog
  - [x] Botón "Verificar Disponibilidad" en ambos formularios
  - [x] Validar disponibilidad antes de crear/editar reserva
  - [x] Mostrar mesas alternativas cuando hay conflicto
  - [x] Prevenir solapamiento de reservas (validación backend)
  - [x] Indicadores visuales: alerta de éxito cuando mesa está disponible
  - [x] Auto-resetear validación al cambiar fecha/hora o número de personas
  - [x] Chips clickeables para seleccionar mesas alternativas
- **Prioridad:** ✅ COMPLETADA

#### 1.2 Gráficos en Dashboard
- **Estado:** ✅ COMPLETADO
- **Archivos afectados:**
  - `src/views/DashboardView.vue` ✅
  - `src/components/dashboard/SalesChart.vue` ✅
  - `src/components/dashboard/OrdersChart.vue` ✅
  - `src/components/dashboard/InventoryChart.vue` ✅
- **Tareas:**
  - [x] Instalar librería de gráficos (Chart.js)
  - [x] Crear componente SalesChart (líneas con área)
  - [x] Crear componente OrdersChart (barras por estado)
  - [x] Crear componente InventoryChart (dona de stock)
  - [x] Conectar con endpoints de reportes existentes
  - [x] Agregar selectores de período (día, semana, mes)
  - [x] Hacer responsivo para móviles
  - [x] Conectar tarjetas de resumen con datos reales
- **Prioridad:** ✅ COMPLETADA

#### 1.3 Fix: Mesas Huérfanas al Eliminar Pedido
- **Estado:** ✅ COMPLETADO
- **Archivos afectados:**
  - `src/stores/pedidoStore.ts` ✅
- **Tareas:**
  - [x] Interceptar eliminación de pedido
  - [x] Actualizar estado de mesa a DISPONIBLE si era el último pedido
  - [x] Agregar validación de pedidos activos antes de cambiar estado de mesa
  - [x] Liberar mesa automáticamente al marcar pedido como PAGADO o CANCELADO
  - [x] Logging detallado para debug
  - [x] Refrescar lista de mesas en POS después de eliminar pedido (ya existía)
- **Prioridad:** ✅ COMPLETADA

---

### **FASE 2: FUNCIONALIDADES DE ALTO VALOR** (Prioridad Media-Alta)
**Duración estimada:** 3-4 semanas

#### 2.1 Sincronización en Tiempo Real (WebSocket)
- **Estado:** ❌ Solo polling cada 30s
- **Archivos afectados:**
  - Crear: `src/services/websocketService.ts`
  - Crear: `src/composables/useWebSocket.ts`
  - `src/views/KitchenView.vue`
  - `src/views/PosView.vue`
  - `src/stores/pedidoStore.ts`
  - `src/stores/mesaStore.ts`
- **Tareas:**
  - [ ] Implementar WebSocketService con reconexión automática
  - [ ] Crear composable useWebSocket para suscripciones
  - [ ] Suscribir KDS a cambios de estado de pedidos
  - [ ] Suscribir POS a cambios de estado de mesas
  - [ ] Agregar indicador de "conectado/desconectado"
  - [ ] Manejar eventos: nuevo_pedido, pedido_actualizado, mesa_actualizada
  - [ ] Fallback a polling si WebSocket falla
- **Prioridad:** 🟠 ALTA

#### 2.2 Alertas Automáticas de Inventario Bajo
- **Estado:** ❌ Endpoint existe, sin UI
- **Archivos afectados:**
  - Crear: `src/components/inventario/StockAlerts.vue`
  - Crear: `src/components/layout/NotificationBadge.vue`
  - `src/views/DashboardView.vue`
  - `src/stores/inventarioStore.ts`
- **Tareas:**
  - [ ] Crear componente StockAlerts para mostrar productos críticos
  - [ ] Agregar badge de notificaciones en DashboardLayout
  - [ ] Consultar inventario bajo en mount del dashboard
  - [ ] Crear panel deslizable con listado de productos críticos
  - [ ] Agregar acción rápida "Crear compra" desde alerta
  - [ ] Configurar umbral de alerta (% del stock mínimo)
- **Prioridad:** 🟠 ALTA

#### 2.3 Módulo de Anulaciones y Devoluciones
- **Estado:** ❌ No implementado
- **Archivos afectados:**
  - Crear: `src/components/pedidos/AnularPedidoDialog.vue`
  - Crear: `src/components/pagos/ReembolsoDialog.vue`
  - `src/services/pedidoService.ts`
  - `src/services/pagoService.ts`
  - `src/stores/pedidoStore.ts`
- **Tareas:**
  - [ ] Crear endpoint para anular pedido (backend)
  - [ ] Crear endpoint para reembolso (backend)
  - [ ] Implementar diálogo de anulación con motivo
  - [ ] Implementar diálogo de reembolso
  - [ ] Validar que solo se puedan anular pedidos EN_PREPARACION o anteriores
  - [ ] Revertir stock al anular pedido
  - [ ] Registrar motivo de anulación en historial
  - [ ] Generar nota de crédito para reembolsos
- **Prioridad:** 🟠 ALTA

---

### **FASE 3: MEJORAS Y FEATURES ADICIONALES** (Prioridad Media)
**Duración estimada:** 2-3 semanas

#### 3.1 Reportes Adicionales
- **Estado:** ⚠️ Solo 3 tipos implementados
- **Archivos afectados:**
  - `src/services/reportService.ts`
  - `src/views/ReportesView.vue`
  - Crear: `src/components/reportes/EmployeePerformanceReport.vue`
  - Crear: `src/components/reportes/CostAnalysisReport.vue`
- **Tareas:**
  - [ ] Reporte de rendimiento por empleado (pedidos atendidos, ventas)
  - [ ] Reporte de análisis de costos (compras vs ventas)
  - [ ] Reporte de devoluciones/anulaciones
  - [ ] Reporte de métodos de pago más usados
  - [ ] Exportar reportes a Excel/CSV
  - [ ] Agregar comparativas período anterior
- **Prioridad:** 🟡 MEDIA

#### 3.2 Split de Pagos (Pago Dividido)
- **Estado:** ❌ Solo pagos completos
- **Archivos afectados:**
  - `src/components/pos/PaymentMethodDialog.vue`
  - `src/services/pagoService.ts`
  - `src/stores/pagoStore.ts`
- **Tareas:**
  - [ ] Permitir múltiples métodos de pago en un pedido
  - [ ] UI para agregar/quitar métodos de pago
  - [ ] Validar que suma de pagos = total del pedido
  - [ ] Soportar pago parcial (cliente adelanta parte)
  - [ ] Registrar múltiples comprobantes si es necesario
  - [ ] Mostrar resumen de pagos aplicados
- **Prioridad:** 🟡 MEDIA

#### 3.3 Historial de Cambios y Auditoría
- **Estado:** ❌ No implementado
- **Archivos afectados:**
  - Crear: `src/components/common/HistorialDialog.vue`
  - Crear: `src/services/auditoriaService.ts`
  - Todos los stores principales
- **Tareas:**
  - [ ] Crear servicio de auditoría
  - [ ] Registrar cambios en pedidos (creación, edición, cambio estado)
  - [ ] Registrar cambios en inventario (ajustes, compras)
  - [ ] Registrar acciones de usuarios (login, logout)
  - [ ] Crear componente HistorialDialog reutilizable
  - [ ] Mostrar timeline de cambios en cada entidad
  - [ ] Filtrar por usuario, fecha, tipo de acción
- **Prioridad:** 🟡 MEDIA

#### 3.4 Impresión de Tickets Completa
- **Estado:** ⚠️ Botones existen, sin implementación
- **Archivos afectados:**
  - Crear: `src/composables/useTicketPrinter.ts` (reemplazar stub)
  - `src/components/pos/PaymentMethodDialog.vue`
  - Crear: `src/utils/ticketTemplates.ts`
- **Tareas:**
  - [ ] Implementar useTicketPrinter con driver de impresora térmica
  - [ ] Crear plantillas de tickets (80mm)
  - [ ] Configuración de impresora en settings
  - [ ] Pre-visualización antes de imprimir
  - [ ] Imprimir comandas para cocina (desde KDS)
  - [ ] Imprimir tickets de pago (desde POS)
  - [ ] Manejar errores de impresión
  - [ ] Reimprimir último ticket
- **Prioridad:** 🟡 MEDIA

---

### **FASE 4: OPTIMIZACIONES Y PULIDO** (Prioridad Baja)
**Duración estimada:** 1-2 semanas

#### 4.1 Fixes de Bugs Menores
- **Tareas:**
  - [ ] Fix: Dashboard con datos hardcoded (línea 65 DashboardView)
  - [ ] Fix: Inconsistencia `fechaReservaDesde` vs `fechaHoraReservaDesde`
  - [ ] Fix: Filtros KDS no persisten al recargar
  - [ ] Fix: Validación de rollback si falla pago en OrderPanel
- **Prioridad:** 🟢 BAJA

#### 4.2 Mejoras de UX
- **Tareas:**
  - [ ] Agregar loading skeletons en lugar de spinners
  - [ ] Animaciones de transición más suaves
  - [ ] Mensajes de éxito/error más descriptivos
  - [ ] Atajos de teclado para acciones comunes
  - [ ] Modo oscuro (dark mode)
  - [ ] Tour guiado para nuevos usuarios
- **Prioridad:** 🟢 BAJA

#### 4.3 Performance
- **Tareas:**
  - [ ] Lazy loading de vistas
  - [ ] Virtualización de listas largas (pedidos, inventario)
  - [ ] Caché de reportes frecuentes
  - [ ] Optimización de imágenes de productos
  - [ ] Service Worker para offline support
- **Prioridad:** 🟢 BAJA

---

## 📋 CHECKLIST DE INICIO

Antes de comenzar la implementación:

- [x] Análisis completo del proyecto realizado
- [x] Corrección de servicios (transformación ApiResponse)
- [x] Corrección de selects de clientes (clientesFormateados)
- [ ] Definir librería de gráficos (Chart.js vs ApexCharts)
- [ ] Revisar backend para endpoints faltantes
- [ ] Configurar entorno de testing
- [ ] Crear branch de desarrollo: `feature/fase-1-criticas`

---

## 🚀 EMPEZAR IMPLEMENTACIÓN

**Orden recomendado:**

### 🎯 SPRINT 1 (Esta semana)
1. ✅ Gráficos en Dashboard (impacto visual inmediato)
2. ✅ Fix: Mesas huérfanas (bug crítico)

### 🎯 SPRINT 2 (Próxima semana)
3. ✅ Validación de disponibilidad en reservas (previene conflictos)

### 🎯 SPRINT 3 (Semana 3)
4. ✅ Alertas de inventario bajo

---

## 📊 MÉTRICAS DE ÉXITO

Al completar Fase 1:
- ✅ 0 bugs críticos
- ✅ Dashboard 100% funcional con datos reales
- ✅ 0 conflictos de reservas
- ✅ Experiencia de usuario mejorada en 40%

Al completar Fase 2:
- ✅ Tiempo real implementado (latencia < 1s)
- ✅ Alertas automáticas funcionando
- ✅ Sistema de anulaciones operativo
- ✅ 95% de completitud del proyecto

---

## 🛠️ STACK TECNOLÓGICO A USAR

- **Gráficos:** Chart.js (recomendado por simplicidad)
- **WebSocket:** native WebSocket API + composable
- **Testing:** Vitest + Vue Test Utils
- **Documentación:** TypeDoc

---

**Versión del documento:** 1.0
**Próxima revisión:** Al completar Fase 1
