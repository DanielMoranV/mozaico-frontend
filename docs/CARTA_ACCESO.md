# 🎯 Cómo Acceder a la Carta Digital Pública

## ✅ **Carta Digital - Vista Independiente**

La Carta Digital es una **vista completamente independiente** del panel de control administrativo.

---

## 🌐 **Características de la Vista Pública**

✅ **Sin menú lateral** - Vista limpia sin navegación administrativa
✅ **Sin header del sistema** - No muestra el header de Mozaico
✅ **Sin autenticación** - Acceso público directo
✅ **Responsive** - Optimizada para móviles
✅ **URL limpia** - `/carta/{slug}` sin rutas anidadas

---

## 📱 **Formas de Acceder**

### 1. **URL Directa (Para Clientes)**

```
http://localhost:5173/carta/{slug-empresa}
```

**Ejemplos:**
```
http://localhost:5173/carta/restaurante-mozaico
http://localhost:5173/carta/pizzeria-napolitana
http://localhost:5173/carta/sushi-bar
```

### 2. **Desde el Panel Administrativo**

**Paso a paso:**
1. Inicia sesión en el sistema
2. Ve a `Configuración` en el menú lateral
3. Verás un botón **"Ver Carta Digital"** arriba a la derecha
4. Click en el botón (se abre en nueva pestaña)
5. **¡Importante!** La carta se abre SIN el layout del panel

### 3. **Escaneo de QR Code**

1. Ve a `Configuración`
2. En el card "Carta Digital Pública"
3. Click en **"Descargar QR"**
4. Imprime el QR
5. Los clientes escanean y acceden directamente

---

## 🎨 **Diferencias Entre Vistas**

### **Panel Administrativo** (`/dashboard`, `/productos`, etc.)
```
┌─────────────────────────────────┐
│ ☰  Mozaico     🔔 👤 Admin      │  ← Header
├─────────────────────────────────┤
│ ☰ Menu  │                       │
│         │  Contenido            │
│ Dashboard│                      │  ← Menú lateral
│ Productos│                      │
│ Config   │                      │
│         │                       │
└─────────────────────────────────┘
```

### **Carta Digital Pública** (`/carta/{slug}`)
```
┌─────────────────────────────────┐
│                                 │
│   Nuestra Carta Digital    [QR] │
│                                 │
│   [Buscar...]                   │  ← Sin layout
│   [Categorías]                  │
│                                 │
│   ┌───┐ ┌───┐ ┌───┐            │
│   │Pro│ │Pro│ │Pro│            │  ← Vista limpia
│   └───┘ └───┘ └───┘            │
│                                 │
└─────────────────────────────────┘
```

---

## 🔧 **Implementación Técnica**

### **App.vue - Lógica de Renderizado**

```typescript
// Detecta rutas públicas
const isPublicRoute = computed(() => {
  const publicRoutes = ['/carta'];
  return publicRoutes.some(r => route.path.startsWith(r));
});

// Renderizado condicional
<template v-if="isPublicRoute">
  <router-view />  <!-- Sin layout -->
</template>
<template v-else>
  <DashboardLayout />  <!-- Con layout -->
</template>
```

### **Rutas Públicas Configuradas**
- `/carta/:slug` - Carta Digital (sin auth)
- `/login` - Login (sin auth)

### **Rutas Protegidas (Con Layout)**
- `/dashboard`
- `/productos`
- `/configuracion`
- Todas las demás rutas administrativas

---

## 📋 **Checklist de Verificación**

### ✅ **La carta se ve correctamente si:**

- [ ] NO ves el menú lateral de Mozaico
- [ ] NO ves el header con notificaciones
- [ ] NO ves el footer del sistema
- [ ] Ves solo el título "Nuestra Carta Digital"
- [ ] Ves el QR Code en la esquina
- [ ] Ves los filtros de categorías
- [ ] Ves las tarjetas de productos
- [ ] La URL es `/carta/{slug}`

### ❌ **Hay un problema si:**

- [ ] Ves el menú lateral de Mozaico
- [ ] Ves el header administrativo
- [ ] Te redirige al login
- [ ] Ves el layout del dashboard

---

## 🚀 **Prueba Rápida**

### **Opción 1: Modo Incógnito**
```bash
1. Abre una ventana de incógnito
2. Ve a: http://localhost:5173/carta/restaurante-mozaico
3. Deberías ver la carta SIN necesidad de login
4. NO debería aparecer el menú lateral
```

### **Opción 2: Desde Configuración**
```bash
1. Login en el sistema
2. Ve a Configuración
3. Click en "Ver Carta Digital"
4. Se abre en nueva pestaña SIN el layout
```

---

## 🎯 **Casos de Uso**

### **Para Administradores**
1. Accede desde `Configuración > Ver Carta Digital`
2. Copia el enlace desde el card informativo
3. Comparte con clientes vía WhatsApp/Email

### **Para Clientes**
1. Reciben el enlace o escanean el QR
2. Acceden directamente sin login
3. Ven el menú actualizado en tiempo real

### **Para Mesas del Restaurante**
1. Imprime el QR Code
2. Coloca en cada mesa
3. Clientes escanean y ven el menú al instante

---

## 🐛 **Solución de Problemas**

| Problema | Causa | Solución |
|----------|-------|----------|
| **Veo el menú lateral** | No se detecta como ruta pública | Verifica que la URL sea `/carta/{slug}` |
| **Me redirige al login** | Router guard activado | La ruta debe estar configurada con `requiresAuth: false` |
| **Página en blanco** | Error en el componente | Revisa la consola del navegador (F12) |
| **No carga productos** | Backend no responde | Verifica que el backend esté corriendo |

---

## 💡 **Tips**

✅ Usa siempre el slug correcto de tu empresa
✅ Comparte el enlace completo con tus clientes
✅ El QR Code se genera automáticamente en el backend
✅ La carta se actualiza en tiempo real
✅ No necesitas mantener sesión abierta para ver la carta
✅ Funciona en todos los dispositivos (móvil, tablet, desktop)

---

## 🎉 **¡Listo!**

Ahora tu Carta Digital es completamente independiente y tus clientes pueden acceder sin complicaciones.
