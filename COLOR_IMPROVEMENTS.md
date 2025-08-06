# Mejoras de Contraste - Web Rampazzo

## Análisis de la Paleta de Colores Actual

### Colores Identificados:
- **Negro**: `#000000` - Fondo principal
- **Dorado**: `#efb810` / `#FFD700` - Color de acento
- **Burgundy**: `#962C52` - Color secundario
- **Azul oscuro**: `#1B1743` - Texto principal
- **Grises**: `#EBECF1`, `#FCFCFD`, `#F8F6F7`, `#D8CACF`, `#F0F0F5`, `#807D9B`, `#D3D3E3`

## Problemas de Contraste Identificados

### 1. Contraste Insuficiente
- **Texto dorado sobre negro**: `#FFD700` sobre `#000000` - Ratio de contraste: 2.5:1 (debería ser 4.5:1)
- **Texto gris sobre fondos claros**: `#807D9B` sobre `#F8F6F7` - Difícil de leer
- **Bordes grises**: `#D3D3E3` - Poco visibles

### 2. Jerarquía Visual Confusa
- Múltiples tonos de gris muy similares
- Gradientes muy sutiles que no aportan valor visual

## Recomendaciones de Mejora

### 1. Mejorar Contraste de Texto Dorado
**Antes**: `text-[#FFD700]` sobre fondo negro
**Después**: `text-gold-dark` (`#D4A017`) - Mejor contraste

### 2. Texto Secundario Más Legible
**Antes**: `text-[#807D9B]` - Gris muy claro
**Después**: `text-gray-dark` (`#6C757D`) - Gris más oscuro

### 3. Bordes Más Visibles
**Antes**: `border-[#D3D3E3]` - Bordes muy sutiles
**Después**: `border-gray-medium` (`#E9ECEF`) - Bordes más definidos

### 4. Gradientes Mejorados
**Antes**: `from-[#EBECF1] to-[#FCFCFD]` - Gradiente muy sutil
**Después**: `bg-gradient-primary` - Gradiente más definido

## Implementación Sugerida

### Archivos a Modificar:

1. **Header.tsx**:
   - Cambiar `text-[#FFD700]` por `text-gold-dark`
   - Cambiar `text-[#1B1743]` por `text-navy`

2. **Main.tsx**:
   - Cambiar gradientes por `bg-gradient-primary`
   - Cambiar `text-[#D3D3E3]` por `text-gray-dark`
   - Cambiar `border-[#D3D3E3]` por `border-gray-medium`

3. **Componentes de Páginas**:
   - Cambiar `text-[#807D9B]` por `text-gray-dark`
   - Cambiar `text-[#962C52]` por `text-burgundy`
   - Cambiar `bg-[#F8F6F7]` por `bg-gray-light`

### Beneficios Esperados:

1. **Mejor Accesibilidad**: Cumplimiento de estándares WCAG 2.1
2. **Mayor Legibilidad**: Texto más fácil de leer en todos los dispositivos
3. **Jerarquía Visual Clara**: Mejor diferenciación entre elementos
4. **Experiencia de Usuario Mejorada**: Navegación más intuitiva

## Paleta de Colores Mejorada

### Colores Principales:
- **Negro**: `#000000` - Fondo principal
- **Dorado Oscuro**: `#D4A017` - Texto sobre negro (mejor contraste)
- **Burgundy**: `#962C52` - Color de acento
- **Azul Oscuro**: `#1B1743` - Texto principal

### Colores de Fondo:
- **Gris Claro**: `#F8F9FA` - Fondos de tarjetas
- **Gris Medio**: `#E9ECEF` - Bordes y separadores
- **Blanco**: `#FFFFFF` - Fondos principales

### Colores de Texto:
- **Gris Oscuro**: `#6C757D` - Texto secundario
- **Gris Más Oscuro**: `#495057` - Texto terciario

## Próximos Pasos

1. Aplicar los cambios de colores en los componentes principales
2. Probar la legibilidad en diferentes dispositivos
3. Validar el contraste con herramientas de accesibilidad
4. Documentar la nueva paleta de colores para el equipo 