# Implementación de la API de Gestión de Reservas de Mesas

## Resumen de la Implementación

Se ha implementado completamente la API de gestión de reservas de mesas según la documentación proporcionada. Esta implementación incluye:

### 1. Tipos TypeScript ✅

**Ubicación:** `src/types/reserva.ts`

Se han actualizado todos los tipos para incluir:
- `EstadoReserva` con todos los estados del ciclo de vida (PENDIENTE, CONFIRMADA, EN_CURSO, COMPLETADA, CANCELADA, NO_PRESENTADO)
- `ReservaRequestDTO` y `ReservaUpdateDTO` para crear/actualizar reservas
- `DisponibilidadRequestDTO` y `DisponibilidadResponseDTO` para consultar disponibilidad de mesas
- `MesaDisponibleDTO` para representar mesas disponibles
- `ClienteBasicoDTO` y `MesaBasicaDTO` para información básica en las respuestas

**Ubicación:** `src/types/enums.ts`

Se actualizó el enum `EstadoReserva` con los nuevos estados.

### 2. Servicio de Reservas ✅

**Ubicación:** `src/services/reservaService.ts`

Se implementaron todos los endpoints de la API:

#### Métodos principales:
- `crear(data)` - Crear nueva reserva
- `obtenerTodas()` - Obtener todas las reservas
- `obtenerPorId(id)` - Obtener reserva por ID
- `actualizar(id, data)` - Actualizar reserva existente
- `eliminar(id)` - Eliminar reserva
- `cambiarEstado(id, nuevoEstado)` - Cambiar estado de reserva
- `buscar(params)` - Buscar reservas con filtros
- `consultarDisponibilidad(data)` - **NUEVO** - Consultar disponibilidad de mesas

#### Métodos legacy (compatibilidad):
Se mantienen los métodos antiguos con `@deprecated` para no romper código existente:
- `crearReserva()`, `obtenerTodasLasReservas()`, etc.

### 3. Utilidades de Manejo de Errores ✅

**Ubicación:** `src/utils/error-handler.ts`

Se crearon utilidades para manejar errores de la API:

```typescript
handleApiError(error) // Normaliza errores de Axios
getErrorMessage(statusCode, defaultMessage) // Mensajes amigables por código HTTP
isDisponibilidadError(error) // Verifica si es error 409 (conflicto)
isValidacionError(error) // Verifica si es error 400 (validación)
isNotFoundError(error) // Verifica si es error 404 (no encontrado)
```

### 4. Componentes Vue ✅

#### A. DisponibilidadMesas.vue
**Ubicación:** `src/components/reservas/DisponibilidadMesas.vue`

Componente para consultar disponibilidad de mesas antes de hacer una reserva.

**Características:**
- Formulario con fecha/hora, número de personas y ubicación opcional
- Muestra lista de mesas disponibles en tarjetas
- Permite seleccionar una mesa disponible
- Emite evento `mesaSeleccionada` con idMesa y fechaHora

**Uso:**
```vue
<DisponibilidadMesas
  @mesaSeleccionada="onMesaSeleccionada"
/>
```

#### B. CrearReservaForm.vue
**Ubicación:** `src/components/reservas/CrearReservaForm.vue`

Formulario completo para crear o editar reservas.

**Características:**
- Modo crear o editar según props
- Selección de cliente y mesa con autocompletado
- Validación de fecha futura
- Validación de número de personas
- Manejo de conflictos de disponibilidad
- Sugerencias de mesas alternativas cuando no hay disponibilidad
- Estados de reserva configurables

**Props:**
- `reservaId?: number` - ID para editar reserva existente
- `mesaPreseleccionada?: number` - ID de mesa preseleccionada
- `fechaHoraPreseleccionada?: string` - Fecha/hora preseleccionada

**Eventos:**
- `success: [ReservaResponseDTO]` - Emitido al guardar exitosamente
- `cancel: []` - Emitido al cancelar

**Uso:**
```vue
<!-- Crear nueva reserva -->
<CrearReservaForm
  @success="onReservaCreada"
  @cancel="cerrarDialog"
/>

<!-- Editar reserva existente -->
<CrearReservaForm
  :reserva-id="123"
  @success="onReservaActualizada"
  @cancel="cerrarDialog"
/>

<!-- Con mesa y fecha preseleccionadas -->
<CrearReservaForm
  :mesa-preseleccionada="5"
  :fecha-hora-preseleccionada="'2025-01-20T19:00'"
  @success="onReservaCreada"
  @cancel="cerrarDialog"
/>
```

#### C. DashboardReservas.vue
**Ubicación:** `src/components/reservas/DashboardReservas.vue`

Dashboard completo para gestionar reservas del día.

**Características:**
- Vista de todas las reservas del día actual
- Filtros por estado y búsqueda por nombre
- Tarjetas con información detallada de cada reserva
- Botones contextuales según el estado:
  - PENDIENTE → Botón "Confirmar"
  - CONFIRMADA → Botón "Cliente Llegó"
  - EN_CURSO → Botón "Finalizar"
- Menú de opciones: Editar, Cancelar, Marcar como No Presentado, Eliminar
- Indicadores visuales por estado (colores e iconos)
- Actualización automática después de cada acción

**Uso:**
```vue
<DashboardReservas />
```

### 5. Servicios Auxiliares Actualizados ✅

Se añadieron métodos helper a los servicios de Cliente y Mesa para facilitar su uso:

**ClienteService:**
```typescript
obtenerTodos() // Retorna ClienteResponseDTO[] directamente
```

**MesaService:**
```typescript
obtenerTodas() // Retorna Mesa[] directamente
```

## Flujos de Uso Principales

### Flujo 1: Crear Reserva con Verificación de Disponibilidad

```vue
<template>
  <v-dialog v-model="dialog" max-width="1200">
    <!-- Paso 1: Verificar disponibilidad -->
    <DisponibilidadMesas
      v-if="!mesaSeleccionada"
      @mesaSeleccionada="onMesaSeleccionada"
    />

    <!-- Paso 2: Crear reserva -->
    <CrearReservaForm
      v-else
      :mesa-preseleccionada="mesaSeleccionada.idMesa"
      :fecha-hora-preseleccionada="mesaSeleccionada.fechaHora"
      @success="onReservaCreada"
      @cancel="volverADisponibilidad"
    />
  </v-dialog>
</template>

<script setup lang="ts">
const mesaSeleccionada = ref(null);

function onMesaSeleccionada(data) {
  mesaSeleccionada.value = data;
}

function volverADisponibilidad() {
  mesaSeleccionada.value = null;
}
</script>
```

### Flujo 2: Dashboard de Gestión Diaria

```vue
<template>
  <v-container>
    <DashboardReservas />
  </v-container>
</template>
```

El dashboard maneja automáticamente:
- Carga de reservas del día
- Cambios de estado
- Edición
- Eliminación
- Notificaciones

### Flujo 3: Integración en la Vista Existente

La vista `ReservasView.vue` ya existe y funciona. Se puede mejorar añadiendo:

```vue
<!-- Agregar botón en ReservaHeader para ver dashboard del día -->
<v-btn
  color="info"
  @click="mostrarDashboard = true"
>
  Dashboard del Día
</v-btn>

<!-- Agregar diálogo con dashboard -->
<v-dialog v-model="mostrarDashboard" fullscreen>
  <DashboardReservas />
</v-dialog>
```

## Endpoints Disponibles

Todos los endpoints están configurados en el servicio y listos para usar:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/reservas` | Crear reserva |
| GET | `/api/v1/reservas` | Obtener todas las reservas |
| GET | `/api/v1/reservas/{id}` | Obtener reserva por ID |
| PUT | `/api/v1/reservas/{id}` | Actualizar reserva |
| DELETE | `/api/v1/reservas/{id}` | Eliminar reserva |
| PATCH | `/api/v1/reservas/{id}/estado?nuevoEstado={estado}` | Cambiar estado |
| GET | `/api/v1/reservas/buscar?{params}` | Buscar con filtros |
| POST | `/api/v1/reservas/disponibilidad` | Consultar disponibilidad |

## Manejo de Errores

Todos los componentes implementan manejo de errores consistente:

```typescript
try {
  const reserva = await ReservaService.crear(data);
  // Éxito
} catch (error) {
  const { message, statusCode } = handleApiError(error);

  if (isDisponibilidadError(error)) {
    // Mesa no disponible - mostrar alternativas
  } else if (isValidacionError(error)) {
    // Error de validación - mostrar campos
  } else {
    // Otro error
    mostrarNotificacion(getErrorMessage(statusCode, message));
  }
}
```

## Estados del Ciclo de Vida

```
PENDIENTE → CONFIRMADA → EN_CURSO → COMPLETADA
    ↓           ↓
 CANCELADA  NO_PRESENTADO
```

## Validaciones Implementadas

### En el Cliente (Frontend):
- Fecha debe ser presente o futura
- Número de personas mínimo 1
- Campos requeridos: cliente, mesa, fecha, número de personas

### En el Servidor (Backend - según documentación):
- Fecha no puede ser pasada
- Número de personas no debe exceder capacidad de mesa
- Mesa debe estar disponible en el horario solicitado
- No puede haber otra reserva conflictiva

## Próximos Pasos Sugeridos

1. **Integrar con Router:**
   ```typescript
   // router/index.ts
   {
     path: '/reservas/dashboard',
     name: 'ReservasDashboard',
     component: () => import('@/components/reservas/DashboardReservas.vue')
   }
   ```

2. **Añadir Notificaciones en Tiempo Real:**
   - WebSockets para actualizar dashboard automáticamente
   - Notificaciones push cuando cliente llega

3. **Mejorar UX:**
   - Calendario visual para seleccionar fecha
   - Vista de timeline con todas las reservas del día
   - Drag & drop para cambiar mesa o hora

4. **Reportes:**
   - Tasa de no-show por cliente
   - Ocupación promedio por día/hora
   - Reservas más frecuentes

## Testing

Para probar la implementación:

```bash
# 1. Verificar que el backend esté corriendo en http://localhost:8091

# 2. Iniciar el frontend
npm run dev

# 3. Navegar a la vista de reservas
# /reservas

# 4. Probar los componentes:
# - Crear una reserva
# - Consultar disponibilidad
# - Ver dashboard del día
# - Cambiar estados
```

## Archivos Creados/Modificados

### Creados:
- ✅ `src/utils/error-handler.ts`
- ✅ `src/components/reservas/DisponibilidadMesas.vue`
- ✅ `src/components/reservas/CrearReservaForm.vue`
- ✅ `src/components/reservas/DashboardReservas.vue`

### Modificados:
- ✅ `src/types/reserva.ts` - Tipos actualizados según documentación
- ✅ `src/types/enums.ts` - Estados de reserva ampliados
- ✅ `src/types/mesa.ts` - Añadido alias MesaResponseDTO
- ✅ `src/services/reservaService.ts` - Nuevos endpoints y métodos
- ✅ `src/services/clienteService.ts` - Método helper obtenerTodos()
- ✅ `src/services/mesaService.ts` - Método helper obtenerTodas()

### Existentes (no modificados):
- `src/views/ReservasView.vue` - Vista existente funcionando
- `src/components/reservas/ReservaTable.vue`
- `src/components/reservas/ReservaFilters.vue`
- `src/components/reservas/ReservaHeader.vue`
- `src/components/reservas/ReservaEditDialog.vue`
- `src/components/reservas/ReservaDeleteConfirmDialog.vue`

## Compatibilidad

La implementación mantiene **100% compatibilidad** con el código existente:
- Los métodos legacy están marcados como `@deprecated` pero siguen funcionando
- La vista `ReservasView.vue` no requiere cambios
- Los stores existentes siguen siendo compatibles

## Conclusión

La implementación está completa y lista para usar. Todos los componentes están documentados con JSDoc, incluyen manejo de errores robusto y siguen las mejores prácticas de Vue 3 + TypeScript + Vuetify.

---

**Fecha de implementación:** 2025-01-16
**Versión:** 1.0.0
