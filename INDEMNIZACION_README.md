# Calculadora de Indemnización por Despido - Estudio Rampazzo

## Descripción

Esta es una herramienta web desarrollada para calcular la indemnización por despido según la Ley de Contrato de Trabajo Argentina (Ley 20.744). La calculadora está diseñada para ser una herramienta informativa que ayude a los trabajadores a entender sus derechos laborales.

## Características

### 🧮 Funcionalidades Principales
- **Cálculo automático** de indemnización por despido sin causa
- **Consideración de rubros** con diferentes factores de cálculo
- **Cálculo de antigüedad** con precisión decimal
- **Inclusión de vacaciones** no gozadas
- **Cálculo del SAC** (Sueldo Anual Complementario) proporcional
- **Interfaz responsiva** para dispositivos móviles y desktop

### 📋 Campos del Formulario
- Salario mensual en pesos argentinos
- Años de antigüedad (con decimales)
- Fecha de ingreso
- Fecha de egreso
- Rubro de actividad
- Motivo del despido

### 🏭 Rubros Incluidos
- **Comercio** - Factor 1.0
- **Industria** - Factor 1.0
- **Construcción** - Factor 1.2
- **Servicios** - Factor 1.0
- **Transporte** - Factor 1.1
- **Salud** - Factor 1.15
- **Educación** - Factor 1.05
- **Bancario** - Factor 1.25

## Base Legal

La calculadora se basa en los siguientes artículos de la Ley de Contrato de Trabajo:

- **Artículo 245**: Indemnización por despido sin causa justificada
- **Artículo 232**: Sueldo anual complementario proporcional
- **Artículo 170**: Vacaciones no gozadas
- **Artículo 164**: Cálculo de vacaciones según antigüedad

## Cálculos Realizados

### 1. Indemnización Básica
- 1 mes de salario por año de antigüedad

### 2. Indemnización por Antigüedad
- Salario × Años de antigüedad × Factor del rubro

### 3. Vacaciones no Gozadas
- (Salario ÷ 25) × 14 días

### 4. SAC Proporcional
- Salario ÷ 12

## Tecnologías Utilizadas

- **Frontend**: Next.js 14 con TypeScript
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Acceso
La calculadora estará disponible en: `http://localhost:3000/indemnizacion`

## Estructura de Archivos

```
src/
├── app/
│   └── indemnizacion/
│       ├── page.tsx          # Página principal
│       └── metadata.ts       # Metadatos SEO
├── components/
│   └── ui/                   # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── alert.tsx
```

## Consideraciones Importantes

### ⚠️ Advertencias Legales
- Esta calculadora es **informativa** y no reemplaza la asesoría legal profesional
- Los montos están sujetos a actualizaciones por inflación
- Para casos específicos o disputas legales, consulte con un abogado laboral
- Los cálculos se basan en la legislación vigente al momento del desarrollo

### 📊 Limitaciones
- No incluye cálculos de intereses por mora
- No considera convenios colectivos específicos
- No incluye indemnizaciones por accidentes laborales
- Los factores por rubro son aproximativos

## Personalización

### Agregar Nuevos Rubros
Para agregar un nuevo rubro, modifique el array `rubros` en `page.tsx`:

```typescript
const rubros = [
  // ... rubros existentes
  { id: 'nuevo_rubro', nombre: 'Nuevo Rubro', factor: 1.1 }
];
```

### Modificar Factores
Los factores se pueden ajustar según la legislación específica o convenios colectivos:

```typescript
{ id: 'construccion', nombre: 'Construcción', factor: 1.3 } // Factor modificado
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Cree una rama para su feature (`git checkout -b feature/AmazingFeature`)
3. Commit sus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abra un Pull Request

## Licencia

Este proyecto está bajo la licencia [LICENCIA]. Consulte el archivo LICENSE para más detalles.

## Contacto

**Estudio Rampazzo**
- Email: estudiorampazzo@gmail.com
- Teléfono: +54 9 11 2191-4149
- WhatsApp: [Enlace directo]

## Changelog

### v1.0.0 (2024-12-19)
- ✅ Calculadora básica de indemnización
- ✅ Soporte para múltiples rubros
- ✅ Interfaz responsiva
- ✅ Cálculos según LCT Argentina
- ✅ Componentes UI reutilizables

---

**Nota**: Esta herramienta está diseñada para uso educativo e informativo. Para asesoría legal profesional, contacte directamente con el Estudio Rampazzo.
