# Implementación del Selector de Teléfono con Banderas

## Descripción

Se ha implementado un selector de país con banderas para el campo de teléfono en las calculadoras de **Indemnización** e **Incapacidad**, similar al que se usa en el formulario de contacto del home.

## Características

### ✅ **Funcionalidades Implementadas**
- **Selector de país** con banderas visuales
- **Argentina por defecto** (código +54)
- **Formato internacional** automático
- **Validación** de números de teléfono
- **Diseño consistente** con shadcn/ui
- **Responsive** para móviles y desktop

### 🌍 **Países Disponibles**
- **Argentina** (seleccionado por defecto)
- **Todos los países** del mundo con sus respectivos códigos
- **Banderas** visuales para identificación rápida
- **Códigos de país** automáticos

## Implementación Técnica

### **Dependencias Instaladas**
```bash
npm install react-phone-number-input
```

### **Importaciones Requeridas**
```typescript
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
```

### **Componente Implementado**
```typescript
<PhoneInput
    placeholder="Ingrese su número de teléfono"
    value={contactData.telefono}
    onChange={(value) =>
        setContactData({
            ...contactData,
            telefono: value || '',
        })
    }
    defaultCountry="AR"
    international
    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
/>
```

### **Propiedades Clave**
- **`defaultCountry="AR"`**: Argentina seleccionado por defecto
- **`international`**: Habilita formato internacional
- **`onChange`**: Maneja cambios en el valor del teléfono
- **`value`**: Valor actual del campo de teléfono

## Estilos CSS Personalizados

### **Archivo: `src/app/globals.css`**
Se han agregado estilos específicos para:
- **Selector de país** con banderas
- **Campo de entrada** del número
- **Menú desplegable** de países
- **Estados hover y focus**
- **Responsive design**

### **Clases CSS Principales**
```css
.PhoneInput { /* Contenedor principal */ }
.PhoneInputCountry { /* Selector de país */ }
.PhoneInputCountryIcon { /* Bandera del país */ }
.PhoneInputInput { /* Campo de entrada */ }
.PhoneInputCountrySelect-menu { /* Menú desplegable */ }
```

## Archivos Modificados

### **1. Calculadora de Indemnización**
- **Archivo**: `src/app/indemnizacion/page.tsx`
- **Cambios**: Reemplazado Input por PhoneInput
- **Ubicación**: Sección de contacto

### **2. Calculadora de Incapacidad**
- **Archivo**: `src/app/incapacidad/page.tsx`
- **Cambios**: Reemplazado Input por PhoneInput
- **Ubicación**: Sección de contacto

### **3. Estilos Globales**
- **Archivo**: `src/app/globals.css`
- **Cambios**: Agregados estilos para PhoneInput
- **Sección**: Estilos para calculadoras

## Experiencia de Usuario

### **Flujo de Uso**
1. **Usuario abre la calculadora**
2. **Completa los datos básicos**
3. **Pasa al paso de contacto**
4. **Ve Argentina seleccionado por defecto** (+54)
5. **Puede cambiar el país** haciendo clic en la bandera
6. **Ingresa solo el número** (sin código de país)
7. **El formato se aplica automáticamente**

### **Ventajas**
- ✅ **Argentina por defecto** - No requiere selección manual
- ✅ **Formato automático** - Se aplica el código correcto
- ✅ **Validación** - Solo acepta números válidos
- ✅ **Banderas visuales** - Identificación rápida del país
- ✅ **Internacional** - Soporte para todos los países

## Ejemplos de Uso

### **Argentina (por defecto)**
- **Entrada**: `11 1234-5678`
- **Resultado**: `+54 11 1234-5678`

### **Estados Unidos**
- **Entrada**: `555 123-4567`
- **Resultado**: `+1 555 123-4567`

### **España**
- **Entrada**: `612 345 678`
- **Resultado**: `+34 612 345 678`

## Validación y Seguridad

### **Validación Automática**
- **Formato internacional** estándar
- **Códigos de país** válidos
- **Longitud** apropiada para cada país
- **Caracteres** solo numéricos permitidos

### **Manejo de Errores**
- **Valor undefined** se convierte a string vacío
- **País no válido** se mantiene Argentina por defecto
- **Formato incorrecto** se valida automáticamente

## Compatibilidad

### **Navegadores Soportados**
- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### **Dispositivos**
- ✅ Desktop
- ✅ Tablet
- ✅ Móvil

## Mantenimiento

### **Actualizaciones**
- **Dependencias**: `npm update react-phone-number-input`
- **Estilos**: Modificar `globals.css` según necesidades
- **Configuración**: Cambiar `defaultCountry` si es necesario

### **Personalización**
- **Colores**: Modificar variables CSS en `globals.css`
- **Tamaños**: Ajustar clases de Tailwind CSS
- **País por defecto**: Cambiar `defaultCountry` en el componente

## Notas Importantes

1. **Argentina por defecto**: Configurado para usuarios argentinos
2. **Formato internacional**: Siempre incluye código de país
3. **Validación**: Se mantiene la validación existente
4. **Estilos**: Consistente con el diseño de shadcn/ui
5. **Responsive**: Funciona en todos los tamaños de pantalla
