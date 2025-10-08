# 📋 Carta Digital Pública - Documentación

## 🎯 Descripción

Sistema de visualización pública de menús/carta de restaurantes usando el sistema de slugs del backend Mozaico. Permite a los clientes ver los productos disponibles sin necesidad de autenticación.

---

## 🚀 Características

✅ **Acceso público** - No requiere autenticación
✅ **Responsive** - Diseño adaptado a móviles, tablets y desktop
✅ **Filtrado por categorías** - Navega fácilmente entre categorías
✅ **Búsqueda en tiempo real** - Busca productos por nombre, descripción o ingredientes
✅ **QR Code integrado** - Comparte la carta fácilmente
✅ **Información detallada** - Precios, ingredientes, calorías, tiempo de preparación
✅ **Imágenes de productos** - Visualización atractiva de cada producto
✅ **Estados de carga** - Loading y manejo de errores elegante

---

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── cartaPublica.ts              # Tipos TypeScript para carta pública
├── composables/
│   └── useCartaApi.ts               # Hook para consumir API pública
├── components/
│   └── carta/
│       ├── ProductoCard.vue         # Tarjeta de producto individual
│       └── FiltrosCategorias.vue    # Componente de filtros
├── views/
│   └── CartaDigitalView.vue         # Vista principal de carta
└── router/
    └── index.ts                     # Configuración de rutas
```

---

## 🔌 Endpoints Backend

### 1. Obtener Carta Completa
```
GET /api/v1/productos/public/{slug}/carta
Query params: ?idCategoria=5 (opcional)
```

### 2. Obtener Carta por Categorías
```
GET /api/v1/productos/public/{slug}/carta/por-categoria
```

### 3. Obtener QR Code
```
GET /api/v1/carta-qr/public/{slug}
Response: image/png (400x400)
```

---

## 🌐 URLs de Acceso

### Desarrollo
```
http://localhost:5173/carta/{slug}
```

### Ejemplos
```
http://localhost:5173/carta/restaurante-mozaico
http://localhost:5173/carta/pizzeria-italiana
http://localhost:5173/carta/cafeteria-central
```

---

## ⚙️ Configuración

### Variables de Entorno

Archivo: `.env`
```bash
VITE_API_BASE_URL=http://localhost:8091/api/v1
```

Para producción, actualiza la URL:
```bash
VITE_API_BASE_URL=https://tu-dominio.com/api/v1
```

---

## 🧪 Pruebas

### 1. Verificar que el backend está corriendo
```bash
curl http://localhost:8091/api/v1/productos/public/restaurante-mozaico/carta
```

### 2. Acceder a la carta digital
```
http://localhost:5173/carta/restaurante-mozaico
```

### 3. Verificar QR Code
```
http://localhost:8091/api/v1/carta-qr/public/restaurante-mozaico
```

---

## 📱 Funcionalidades

### Filtrado por Categorías
- Todas las categorías visibles en chips horizontales
- Click para filtrar productos por categoría
- Contador de productos por categoría

### Búsqueda de Productos
- Busca por nombre, descripción o ingredientes
- Filtrado en tiempo real
- Combina con filtros de categoría

### Compartir Carta
- Botón "Compartir" en desktop y móvil
- Usa Web Share API en dispositivos compatibles
- Fallback a copiar enlace al portapapeles

### Información de Productos
- Imagen del producto (con placeholder si no hay)
- Nombre y descripción
- Precio formateado (S/)
- Ingredientes
- Tiempo de preparación
- Calorías
- Presentación
- Badge de contenido alcohólico (+18)
- Badge de no disponible

---

## 🎨 Personalización

### Colores
Los colores principales están definidos en el tema de Vuetify. Para cambiarlos:

```typescript
// src/main.ts
const theme = {
  themes: {
    light: {
      colors: {
        primary: '#1976d2',  // Color principal (azul)
        // ... otros colores
      }
    }
  }
}
```

### Layout
Ajusta el grid de productos en `CartaDigitalView.vue`:
```css
.productos-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
```

---

## 🔧 Troubleshooting

### Error: "Restaurante no encontrado"
- Verifica que el slug sea correcto
- Asegúrate de que la empresa existe en el backend
- Revisa que la empresa esté activa

### No se cargan las imágenes
- Verifica que `VITE_API_BASE_URL` esté correctamente configurado
- Asegúrate de que las imágenes existan en `/uploads/productos/`
- Revisa permisos de carpeta en el backend

### QR Code no se muestra
- Verifica que el endpoint `/carta-qr/public/{slug}` responda
- Revisa la consola del navegador para errores de CORS
- Asegúrate de que el backend tenga la librería QR instalada

---

## 🚀 Mejoras Futuras

- [ ] PWA para instalación en móvil
- [ ] Modo oscuro
- [ ] Multi-idioma (i18n)
- [ ] Favoritos con localStorage
- [ ] Compartir producto específico vía WhatsApp
- [ ] Modal de detalle de producto
- [ ] Animaciones de transición
- [ ] Filtros avanzados (precio, calorías, alergenos)
- [ ] Ordenamiento (precio, nombre, popularidad)

---

## 📞 Soporte

Para reportar issues o solicitar features, contacta al equipo de desarrollo.
