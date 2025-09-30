# Estudio Rampazzo - Sitio Web

Sitio web profesional para el Estudio Jurídico Rampazzo, especializado en derecho laboral, indemnizaciones y asesoramiento legal.

## 🚀 Características

- **Calculadora de Indemnización**: Herramienta interactiva para calcular indemnizaciones laborales
- **Formularios de Contacto**: Sistema de contacto con tracking de visitantes
- **Analytics Integrado**: Plausible Analytics + Matomo Analytics para seguimiento completo de visitantes
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **SEO Optimizado**: Metadatos y estructura optimizada para motores de búsqueda

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **MongoDB** - Base de datos
- **Nodemailer** - Envío de emails
- **Plausible Analytics** - Analytics privado y ligero
- **Matomo Analytics** - Analytics completo y detallado

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Deploy

El proyecto está configurado para deploy automático en Vercel:

- **Producción**: https://rampazzo-2024-nc4fk2x6x-scardigno1982s-projects.vercel.app
- **Node.js**: 22.x
- **Build**: Automático en cada push

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
│   ├── api/               # APIs (send, indemnizacion, incapacidad)
│   ├── components/        # Componentes reutilizables
│   └── [pages]/          # Páginas del sitio
├── components/ui/         # Componentes de UI base
├── hooks/                # Hooks personalizados
└── lib/                  # Utilidades y configuración
    ├── tracking.ts       # Sistema de tracking de visitantes
    ├── mongodb.ts        # Configuración de MongoDB
    └── utils.ts          # Utilidades generales
```

## 🔧 Configuración

### Variables de Entorno

```env
MONGODB_URI=mongodb://...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password
```

### Analytics

- **Plausible Analytics** integrado
- **Tracking de visitantes** con información detallada
- **Eventos personalizados** para formularios y calculadora

## 📊 Funcionalidades

### Calculadora de Indemnización
- Cálculo automático basado en salario y antigüedad
- Validación de datos en tiempo real
- Envío de resultados por email

### Sistema de Tracking
- Información de origen del visitante
- Datos de dispositivo y navegador
- Ubicación geográfica
- Parámetros UTM para campañas

### Formularios de Contacto
- Validación de datos
- Envío de emails automático
- Almacenamiento en MongoDB
- Tracking de conversiones

## 🚀 Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 📞 Contacto

**Estudio Rampazzo**
- Email: contacto@fernandorampazzo.com.ar
- Web: https://fernandorampazzo.com.ar

---

Desarrollado con ❤️ para el Estudio Rampazzo