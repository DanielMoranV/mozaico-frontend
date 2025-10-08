# 🔗 Cambiar Slug de Empresa - Guía Completa

## 📋 Descripción

Funcionalidad para cambiar el slug único de tu empresa, que se usa en la URL pública de la carta digital.

---

## 🎯 Ubicación

1. Inicia sesión en el sistema
2. Ve a **Configuración** en el menú lateral
3. En el card **"Información de Empresa"**
4. Click en el botón **"Cambiar Slug"**

---

## 🔧 Especificaciones del Backend

### **Endpoint**
```
PUT /api/v1/empresa/slug
```

### **Autenticación**
✅ Requiere JWT (Token de usuario autenticado)

### **Permisos**
- `ADMIN`
- `SUPER_ADMIN`

### **Body (JSON)**
```json
{
  "slug": "mi-nuevo-slug"
}
```

---

## ✅ Validaciones del Slug

### **Formato del Slug**

**Regex del Backend**: `^[a-z0-9]+(-[a-z0-9]+)*$`

**Reglas:**
- ✅ Solo letras **minúsculas** (a-z)
- ✅ Solo números (0-9)
- ✅ Solo guiones (-) como separador
- ❌ **NO** puede empezar con guión
- ❌ **NO** puede terminar con guión
- ❌ **NO** puede tener guiones consecutivos (---)
- ❌ **NO** puede tener espacios
- ❌ **NO** puede tener caracteres especiales (@, #, $, etc.)
- ✅ Longitud mínima: 3 caracteres
- ✅ Longitud máxima: 50 caracteres

### **Ejemplos de Slugs Válidos**

```
✅ restaurante-mozaico
✅ pizzeria-napolitana
✅ sushi-bar-2024
✅ cafe-central
✅ panaderia-artesanal
✅ bistro-9
✅ mi-restaurante
```

### **Ejemplos de Slugs Inválidos**

```
❌ -restaurante         (empieza con guión)
❌ restaurante-         (termina con guión)
❌ restaurante--central (guiones consecutivos)
❌ Restaurante-Central  (letras mayúsculas)
❌ restaurante_central  (guión bajo no permitido)
❌ restaurante central  (espacio no permitido)
❌ restaurante@central  (carácter especial)
❌ re                   (menos de 3 caracteres)
```

---

## 📝 Proceso de Cambio

### **Paso 1: Abrir el Diálogo**

1. En **Configuración**, busca el card "Información de Empresa"
2. Click en **"Cambiar Slug"**
3. Se abrirá el diálogo de cambio de slug

### **Paso 2: Ver Slug Actual**

```
┌─────────────────────────┐
│ Slug Actual             │
│ [restaurante-central]   │
└─────────────────────────┘
```

### **Paso 3: Ingresar Nuevo Slug**

El campo de texto incluye:
- ✅ **Auto-formateo**: Convierte mayúsculas a minúsculas automáticamente
- ✅ **Validación en tiempo real**: Muestra errores mientras escribes
- ✅ **Vista previa de URL**: Ves cómo quedará la URL final
- ✅ **Contador de caracteres**: Máximo 50 caracteres
- ✅ **Indicador de disponibilidad**: ✓ o ✗

**Formato Automático:**
```
Usuario escribe:      "Mi Restaurante Central"
Sistema convierte a:  "mi-restaurante-central"
```

### **Paso 4: Vista Previa**

Mientras escribes, ves la URL final:
```
Vista Previa de URL:
https://tu-dominio.com/mi-restaurante-central
```

### **Paso 5: Guardar Cambios**

Click en **"Cambiar Slug"**

---

## 🎯 Respuestas del Backend

### **✅ Éxito (200)**

```json
{
  "status": "SUCCESS",
  "code": 200,
  "message": "Slug actualizado exitosamente. URL pública: /public/mi-nuevo-slug/carta",
  "data": {
    "idEmpresa": 1,
    "nombre": "Restaurante Mozaico",
    "slug": "mi-nuevo-slug",
    "ruc": "20123456789",
    "direccion": "Av. Principal 123",
    "telefono": "987654321",
    "email": "info@mozaico.com",
    "logoUrl": "https://...",
    "activa": true
  }
}
```

**Lo que sucede:**
1. ✅ Se actualiza el slug en la base de datos
2. ✅ Se actualiza la URL de la carta digital
3. ✅ Se actualiza el QR code (apunta a la nueva URL)
4. ✅ Se muestra notificación de éxito
5. ✅ Se recarga la información de la empresa

### **❌ Error: Formato Inválido**

```json
{
  "status": "ERROR",
  "code": 400,
  "message": "El slug solo puede contener letras minúsculas, números y guiones. No puede empezar ni terminar con guión, ni tener guiones consecutivos"
}
```

**Causas comunes:**
- Slug con mayúsculas
- Slug con espacios
- Slug con caracteres especiales
- Slug con guiones al inicio o final
- Slug con guiones consecutivos

### **❌ Error: Slug Ya en Uso**

```json
{
  "status": "ERROR",
  "code": 409,
  "message": "El slug 'restaurante-central' ya está en uso por otra empresa"
}
```

**Causa:**
- Otra empresa ya está usando ese slug
- Los slugs deben ser únicos en todo el sistema

**Solución:**
- Elige un slug diferente
- Agrega números o palabras adicionales
  - Ejemplo: `restaurante-central-lima`
  - Ejemplo: `restaurante-central-2024`

### **❌ Error: Sin Autorización**

```json
{
  "status": "ERROR",
  "code": 403,
  "message": "No tienes permisos para realizar esta acción"
}
```

**Causa:**
- Tu usuario no tiene rol `ADMIN` o `SUPER_ADMIN`

**Solución:**
- Contacta con un administrador del sistema

---

## ⚠️ Advertencias Importantes

### **1. URLs Antiguas Dejarán de Funcionar**

```
URL Antigua:  https://tu-dominio.com/carta/restaurante-viejo
URL Nueva:    https://tu-dominio.com/carta/restaurante-nuevo

⚠️ La URL antigua YA NO FUNCIONARÁ después del cambio
```

### **2. QR Codes Antiguos**

Si ya imprimiste QR codes con el slug anterior:
- ❌ Los QR codes antiguos **dejarán de funcionar**
- ✅ Debes **reimprimir** los QR codes con el nuevo slug
- ✅ Reemplaza los QR codes en todas las mesas

### **3. Enlaces Compartidos**

Si compartiste enlaces en:
- WhatsApp
- Redes sociales
- Google Maps
- Flyers impresos

**Debes actualizarlos manualmente con la nueva URL**

---

## 📋 Checklist Antes de Cambiar el Slug

### **Antes del Cambio**

- [ ] ¿Estás seguro del nuevo slug?
- [ ] ¿El slug es fácil de recordar?
- [ ] ¿El slug representa bien a tu empresa?
- [ ] ¿Verificaste que cumple con el formato?

### **Después del Cambio**

- [ ] Verifica que la carta digital funcione con la nueva URL
- [ ] Imprime nuevos QR codes
- [ ] Reemplaza los QR codes en todas las mesas
- [ ] Actualiza enlaces en redes sociales
- [ ] Actualiza enlaces en Google Maps / Tripadvisor
- [ ] Notifica a tus clientes frecuentes (opcional)
- [ ] Actualiza materiales impresos (menús, tarjetas, etc.)

---

## 💡 Mejores Prácticas

### **Elegir un Buen Slug**

✅ **Recomendado:**
- Nombre de tu restaurante en minúsculas
- Corto y fácil de recordar
- Sin abreviaturas confusas
- Representativo de tu marca

```
✅ pizzeria-napolitana
✅ sushi-bar-tokyo
✅ cafe-literario
✅ parrilla-argentina
```

❌ **No Recomendado:**
- Slugs genéricos
- Demasiado largos
- Con números sin sentido
- Difíciles de escribir

```
❌ rest123
❌ mi-restaurante-de-comida-peruana-y-fusión-nikkei-2024
❌ xyz789abc
❌ ñoquis-ñam-ñam  (caracteres especiales)
```

### **Cuándo Cambiar el Slug**

✅ **Buenas razones:**
- Cambio de nombre del restaurante
- Rebrandeo de la empresa
- Slug inicial muy genérico
- Corregir errores tipográficos

❌ **Malas razones:**
- Experimentar o probar
- Cambios frecuentes "por gusto"
- Sin planificación de la transición

---

## 🔍 Solución de Problemas

### **Problema: "Slug ya en uso"**

**Solución:**
1. Intenta con variaciones:
   - Agrega la ciudad: `restaurante-lima`
   - Agrega una especialidad: `restaurante-cevicheria`
   - Agrega el año: `restaurante-2024`

### **Problema: "Formato inválido"**

**Solución:**
1. Verifica que:
   - Solo uses minúsculas (a-z)
   - Solo uses números (0-9)
   - Solo uses guiones (-) como separador
   - No empiece ni termine con guión
   - No tenga guiones consecutivos

### **Problema: "Los clientes no pueden acceder"**

**Solución:**
1. ✅ Verifica que el cambio se haya guardado
2. ✅ Comprueba la nueva URL en el navegador
3. ✅ Imprime nuevos QR codes
4. ✅ Actualiza los QR en las mesas
5. ✅ Limpia caché del navegador si es necesario

### **Problema: "No veo el botón 'Cambiar Slug'"**

**Solución:**
1. Verifica que tu usuario tenga rol `ADMIN` o `SUPER_ADMIN`
2. Recarga la página
3. Verifica que la empresa tenga un slug configurado

---

## 🧪 Casos de Prueba

### **Test 1: Slug Válido Simple**
```
Input:  "restaurante-mozaico"
Result: ✅ Aceptado
```

### **Test 2: Slug con Mayúsculas (Auto-formato)**
```
Input:  "Restaurante Mozaico"
Auto:   "restaurante-mozaico"
Result: ✅ Aceptado
```

### **Test 3: Slug con Espacios (Auto-formato)**
```
Input:  "restaurante mozaico"
Auto:   "restaurante-mozaico"
Result: ✅ Aceptado
```

### **Test 4: Slug con Guión al Inicio**
```
Input:  "-restaurante"
Result: ❌ "El slug no puede empezar ni terminar con guión"
```

### **Test 5: Slug con Guiones Consecutivos**
```
Input:  "restaurante--mozaico"
Result: ❌ "El slug no puede tener guiones consecutivos"
```

### **Test 6: Slug Muy Corto**
```
Input:  "ab"
Result: ❌ "El slug debe tener al menos 3 caracteres"
```

### **Test 7: Slug con Caracteres Especiales**
```
Input:  "restaurante@mozaico"
Auto:   "restaurantemozaico"
Result: ✅ Aceptado (se eliminan automáticamente)
```

### **Test 8: Slug Ya Existente**
```
Input:  "pizzeria-italia"  (ya existe)
Result: ❌ "El slug 'pizzeria-italia' ya está en uso por otra empresa"
```

---

## 🎉 Ejemplo Completo de Flujo

### **Escenario:**
Tu restaurante se llamaba "Restaurante Central" y ahora se llama "Bistró Central"

### **Paso a Paso:**

1. **Preparación**
   ```
   Slug Actual:    restaurante-central
   Nuevo Nombre:   Bistró Central
   Nuevo Slug:     bistro-central
   ```

2. **En la Aplicación**
   - Ve a Configuración
   - Click en "Cambiar Slug"
   - Ingresa: `bistro-central`
   - El sistema valida ✅
   - Vista previa: `https://tu-dominio.com/carta/bistro-central`
   - Click en "Cambiar Slug"

3. **Respuesta del Sistema**
   ```
   ✅ Slug actualizado correctamente a: bistro-central
   ```

4. **Post-Cambio**
   - Abre la carta digital en la nueva URL
   - Imprime nuevos QR codes
   - Reemplaza QR en las 15 mesas
   - Actualiza redes sociales
   - Notifica a clientes VIP

5. **Verificación**
   ```
   ✅ Nueva URL funciona: https://tu-dominio.com/carta/bistro-central
   ✅ QR codes funcionan
   ✅ Clientes pueden acceder sin problemas
   ```

---

## 📊 Resumen de Validaciones

| Validación | Frontend | Backend |
|------------|----------|---------|
| Solo minúsculas | ✅ Auto-formato | ✅ Validación |
| Solo a-z, 0-9, - | ✅ Auto-formato | ✅ Validación |
| No empieza con - | ✅ Validación | ✅ Validación |
| No termina con - | ✅ Validación | ✅ Validación |
| No guiones -- | ✅ Validación | ✅ Validación |
| Min 3 caracteres | ✅ Validación | ✅ Validación |
| Max 50 caracteres | ✅ Counter | ✅ Validación |
| Slug único | ⚠️ Indicador | ✅ Validación |

---

## 🛡️ Seguridad

- ✅ Requiere autenticación JWT
- ✅ Requiere rol ADMIN o SUPER_ADMIN
- ✅ Validación en frontend y backend
- ✅ Slugs únicos por empresa
- ✅ Previene inyección SQL
- ✅ Sanitiza entrada de usuario

---

## 🎯 ¡Listo para Usar!

La funcionalidad de cambio de slug está completamente implementada y lista para usar.

**Recuerda:**
- Planifica el cambio
- Notifica a tus usuarios
- Actualiza todos los materiales
- Imprime nuevos QR codes

**URL de Prueba:**
```
http://localhost:5174/configuracion
```
