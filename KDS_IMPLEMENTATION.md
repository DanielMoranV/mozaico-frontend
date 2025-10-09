# Implementación del Sistema KDS (Kitchen Display System)

## ✅ Implementación Completa

El sistema KDS ha sido implementado exitosamente en el proyecto. A continuación se detalla lo que se ha creado:

---

## 📁 Archivos Creados

### 1. **Servicio API**
`src/services/kdsService.ts`
- `obtenerDetallesPorEstado(estado)` - Obtiene productos filtrados por estado
- `cambiarEstadoDetalle(detalleId, nuevoEstado)` - Cambia el estado de un producto
- `obtenerTableroCompleto()` - Obtiene todos los estados de una vez (PEDIDO, EN_PREPARACION, SERVIDO)

### 2. **Store de Pinia**
`src/stores/kdsStore.ts`
- Estado reactivo para productos en cada estado
- Acciones para cambiar estados
- Auto-refresh cada 30 segundos (configurable)
- Agrupación de productos por mesa

### 3. **Componentes Vue**
- `src/components/kds/KitchenOrderCard.vue` - Tarjeta individual de producto
- `src/components/kds/KitchenBoard.vue` - Tablero Kanban con 3 columnas

### 4. **Vista Principal**
`src/views/KitchenView.vue`
- Dashboard completo de cocina
- Estadísticas en tiempo real
- Auto-refresh configurable

### 5. **Configuración de Router**
`src/router/index.ts`
- Nueva ruta: `/cocina`
- Permisos: `MANAGE_KITCHEN` o `ALL_PERMISSIONS`

### 6. **Menú de Navegación**
`src/components/layout/DashboardLayout.vue`
- Enlace "Cocina (KDS)" agregado en el menú principal
- Prioridad alta con badge informativo

---

## 🎨 Características Implementadas

### Estados de Productos
1. **PEDIDO** (Amarillo) - Productos pendientes de preparación
2. **EN_PREPARACION** (Azul) - Productos que se están cocinando
3. **SERVIDO** (Verde) - Productos listos para entregar
4. **CANCELADO** (Rojo) - Productos cancelados

### Funcionalidades
✅ Vista tipo Kanban con 3 columnas
✅ Tarjetas de producto con información detallada
✅ Botones de acción según el estado
✅ Actualización automática cada 30 segundos
✅ Notificaciones de cambio de estado
✅ Agrupación por mesa
✅ Tiempo transcurrido desde el pedido
✅ Observaciones destacadas
✅ Animaciones y transiciones suaves

---

## 🚀 Cómo Usar

### Para Cocineros

1. **Acceder al sistema:**
   - Navegar a `/cocina` o hacer clic en "Cocina (KDS)" en el menú lateral

2. **Ver pedidos pendientes:**
   - La columna "Pendientes" muestra todos los productos en estado PEDIDO

3. **Iniciar preparación:**
   - Hacer clic en el botón "Iniciar Preparación" en la tarjeta del producto
   - El producto se moverá a la columna "En Preparación"

4. **Marcar como listo:**
   - Cuando el producto esté terminado, hacer clic en "Marcar como Listo"
   - El producto se moverá a la columna "Listos"

5. **Cancelar producto:**
   - Si es necesario cancelar, hacer clic en el botón rojo "X"
   - Confirmar la cancelación

### Auto-refresh

- El sistema se actualiza automáticamente cada 30 segundos
- Puedes desactivar/activar el auto-refresh con el botón de sincronización
- También puedes refrescar manualmente con el botón "Actualizar"

---

## 🔧 Configuración de Backend

Para que el sistema funcione, tu backend debe tener estos endpoints:

### 1. Obtener detalles por estado
```
GET /api/v1/kds/detalles?estado={ESTADO}
```

**Parámetros:**
- `estado`: PEDIDO | EN_PREPARACION | SERVIDO | CANCELADO

**Respuesta:**
```json
{
  "status": "SUCCESS",
  "message": "Detalles KDS obtenidos exitosamente",
  "data": [
    {
      "idDetalle": 1,
      "pedido": {
        "idPedido": 5,
        "mesa": { "idMesa": 3, "numeroMesa": 5 },
        "cliente": { "idCliente": 2, "nombre": "Juan", "apellido": "Pérez" },
        "fechaPedido": "2025-10-08T14:30:00",
        "estado": "EN_PROCESO"
      },
      "producto": { "idProducto": 10, "nombre": "Lomo Saltado" },
      "cantidad": 1,
      "precioUnitario": 45.00,
      "subtotal": 45.00,
      "observaciones": "Sin cebolla",
      "estado": "PEDIDO"
    }
  ]
}
```

### 2. Cambiar estado de detalle
```
PUT /api/v1/kds/detalles/{id}/estado?estado={NUEVO_ESTADO}
```

**Parámetros:**
- `id`: ID del detalle de pedido
- `estado`: PEDIDO | EN_PREPARACION | SERVIDO | CANCELADO

**Respuesta:**
```json
{
  "status": "SUCCESS",
  "message": "Estado del detalle actualizado exitosamente",
  "data": { /* DetallePedidoResponseDTO actualizado */ }
}
```

---

## 🎯 Permisos Requeridos

Para acceder a la vista de cocina, el usuario debe tener uno de estos permisos:
- `MANAGE_KITCHEN`
- `ALL_PERMISSIONS`

### Configurar permisos en el backend

Asegúrate de que el rol `COCINERO` tenga el permiso `MANAGE_KITCHEN` en tu sistema de autenticación.

---

## 🎨 Personalización

### Cambiar intervalo de auto-refresh

En `src/views/KitchenView.vue`, línea 25:
```typescript
kdsStore.enableAutoRefresh(30000); // 30 segundos
```

Cambia `30000` por el valor deseado en milisegundos.

### Modificar colores de estados

En `src/components/kds/KitchenOrderCard.vue`, función `getEstadoColor()`:
```typescript
const getEstadoColor = () => {
  switch (props.detalle.estado) {
    case 'PEDIDO': return 'warning';        // Amarillo
    case 'EN_PREPARACION': return 'info';   // Azul
    case 'SERVIDO': return 'success';       // Verde
    case 'CANCELADO': return 'error';       // Rojo
  }
};
```

---

## 🧪 Testing

### Probar con datos de prueba

1. Crear pedidos con productos en diferentes estados
2. Acceder a `/cocina`
3. Verificar que los productos aparezcan en las columnas correctas
4. Probar cambiar estados con los botones
5. Verificar que el auto-refresh funcione

### Verificar endpoints del backend

```bash
# Obtener productos pendientes
curl -X GET "http://localhost:8080/api/v1/kds/detalles?estado=PEDIDO" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Cambiar estado
curl -X PUT "http://localhost:8080/api/v1/kds/detalles/1/estado?estado=EN_PREPARACION" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Estructura del Tablero

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Pendientes    │ En Preparación  │     Listos      │
│   (PEDIDO)      │(EN_PREPARACION) │   (SERVIDO)     │
├─────────────────┼─────────────────┼─────────────────┤
│ [Producto 1]    │ [Producto 4]    │ [Producto 6]    │
│ [Botón: Iniciar]│ [Botón: Listo]  │ [Checkmark]     │
│                 │                 │                 │
│ [Producto 2]    │ [Producto 5]    │                 │
│ [Botón: Iniciar]│ [Botón: Listo]  │                 │
│                 │                 │                 │
│ [Producto 3]    │                 │                 │
│ [Botón: Iniciar]│                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 🐛 Solución de Problemas

### Los productos no aparecen
- Verificar que el backend esté funcionando
- Revisar que los endpoints devuelvan datos
- Verificar permisos del usuario

### El auto-refresh no funciona
- Abrir la consola del navegador y buscar errores
- Verificar que `enableAutoRefresh()` se esté llamando en `onMounted()`

### Errores de permisos
- Verificar que el usuario tenga el permiso `MANAGE_KITCHEN`
- Revisar la configuración de roles en el backend

---

## 📝 Próximas Mejoras Sugeridas

1. **WebSocket en lugar de polling** - Para actualizaciones en tiempo real
2. **Notificaciones de sonido** - Alertas cuando lleguen nuevos pedidos
3. **Filtros por categoría** - Separar cocina caliente, fría, bar, etc.
4. **Estadísticas** - Tiempo promedio de preparación, productos más vendidos
5. **Modo pantalla completa** - Para usar en monitores de cocina
6. **Drag & drop** - Arrastrar tarjetas entre columnas
7. **Historial de cambios** - Auditoría de quién cambió qué estado y cuándo

---

## 📞 Soporte

Si tienes problemas con la implementación:
1. Revisa los logs de la consola del navegador
2. Verifica que el backend tenga los endpoints correctos
3. Asegúrate de que los permisos estén configurados
4. Revisa este documento para configuraciones

---

¡Sistema KDS implementado y listo para usar! 🎉
