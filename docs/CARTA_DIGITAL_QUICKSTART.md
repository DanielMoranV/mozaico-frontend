# 🚀 Carta Digital - Guía Rápida

## Inicio Rápido (5 minutos)

### 1. Asegúrate de que el backend esté corriendo
```bash
# El backend debe estar en http://localhost:8091
curl http://localhost:8091/api/v1/productos/public/restaurante-mozaico/carta
```

### 2. Verifica la configuración
```bash
# Archivo: .env
VITE_API_BASE_URL=http://localhost:8091/api/v1
```

### 3. Inicia el frontend
```bash
npm run dev
```

### 4. Accede a la carta digital
```
http://localhost:5173/carta/restaurante-mozaico
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Carta Básica
```
URL: http://localhost:5173/carta/mi-restaurante
```

### Ejemplo 2: Con Slug Personalizado
```
URL: http://localhost:5173/carta/pizzeria-italiana
URL: http://localhost:5173/carta/cafeteria-central-lima
URL: http://localhost:5173/carta/sushi-nikkei-2024
```

### Ejemplo 3: Compartir QR
1. Accede a la carta digital
2. Observa el QR Code en la esquina superior derecha
3. Escanea el QR con tu móvil
4. ¡Listo! La carta se abre en el móvil

---

## 🎯 Casos de Uso Comunes

### Para Restaurantes

**Escenario 1: Mesa con QR**
1. Imprime el QR desde: `http://localhost:8091/api/v1/carta-qr/public/tu-slug`
2. Coloca el QR en cada mesa
3. Los clientes escanean y ven la carta en su móvil

**Escenario 2: Redes Sociales**
1. Comparte el enlace: `https://tudominio.com/carta/tu-slug`
2. Los clientes pueden ver el menú antes de visitar el restaurante

**Escenario 3: Delivery**
1. Incluye el enlace en materiales de marketing
2. Los clientes ven productos y precios actualizados

---

## 🔍 Testing Rápido

### Probar con datos de ejemplo

1. **Crear productos en el backend** (vía Postman o interfaz admin)
2. **Configurar slug de empresa** (ej: "restaurante-test")
3. **Acceder a la carta**: `http://localhost:5173/carta/restaurante-test`

### Verificar funcionalidades

✅ **Filtros de categoría** - Click en los chips de categoría
✅ **Búsqueda** - Escribe en el campo de búsqueda
✅ **Responsive** - Abre en móvil o redimensiona la ventana
✅ **QR Code** - Verifica que se muestre correctamente
✅ **Imágenes** - Verifica que las imágenes de productos carguen

---

## 🐛 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| **"Restaurante no encontrado"** | Verifica que el slug exista en el backend |
| **Página en blanco** | Revisa la consola del navegador (F12) |
| **Imágenes no cargan** | Verifica `VITE_API_BASE_URL` en `.env` |
| **QR no se muestra** | Verifica que el endpoint QR funcione |
| **Errores de CORS** | Configura CORS en el backend |

---

## 📱 URLs de Prueba

```bash
# Desarrollo local
http://localhost:5173/carta/restaurante-mozaico

# Producción (ejemplo)
https://carta.mirestaurante.com/restaurante-mozaico
```

---

## 🎨 Personalización Rápida

### Cambiar colores principales
```vue
<!-- src/views/CartaDigitalView.vue -->
<style scoped>
.titulo-principal {
  color: #1976d2; /* Cambiar a tu color */
}
</style>
```

### Cambiar tamaño de cards
```vue
<!-- src/components/carta/ProductoCard.vue -->
<v-img height="220"> <!-- Ajustar altura -->
```

---

## ✅ Checklist de Implementación

- [ ] Backend corriendo en puerto 8091
- [ ] Variable `VITE_API_BASE_URL` configurada
- [ ] Al menos 1 empresa con slug configurado
- [ ] Al menos 3 productos activos y disponibles
- [ ] Categorías creadas y asignadas
- [ ] Imágenes de productos subidas
- [ ] Acceso a `/carta/{slug}` funcional
- [ ] QR Code generándose correctamente
- [ ] Filtros de categoría funcionando
- [ ] Búsqueda operativa
- [ ] Responsive en móvil verificado

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa la documentación completa**: `docs/CARTA_DIGITAL.md`
2. **Verifica los logs del backend**: Busca errores en la consola
3. **Revisa la consola del navegador**: F12 > Console
4. **Prueba los endpoints directamente**: Usa Postman o curl

---

## 🎉 ¡Listo para Producción!

Una vez que todo funcione en desarrollo:

1. **Actualiza `.env` con URL de producción**
2. **Compila el proyecto**: `npm run build`
3. **Despliega el dist/**: Sube a tu servidor
4. **Configura tu dominio**: Apunta a la carpeta dist
5. **Prueba con slug real**: `https://tudominio.com/carta/tu-slug`

¡Disfruta tu Carta Digital! 🍽️
