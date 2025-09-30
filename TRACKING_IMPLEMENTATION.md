# Implementación de Tracking de Visitantes

## Resumen
Se ha implementado un sistema completo de tracking de visitantes que captura información sobre la fuente de origen de los usuarios que completan formularios en el sitio web.

## Funcionalidades Implementadas

### 1. Utilidad de Tracking (`src/lib/tracking.ts`)
- **Detección de fuentes**: Identifica automáticamente si el visitante proviene de:
  - Redes sociales (Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok, WhatsApp, Telegram)
  - Motores de búsqueda (Google, Bing, Yahoo, DuckDuckGo)
  - Sitios externos
  - Acceso directo
- **Parámetros UTM**: Extrae automáticamente parámetros de campaña (utm_source, utm_medium, utm_campaign, utm_term, utm_content)
- **Información del navegador**: Captura User-Agent, referrer, URL de la página
- **Sesión única**: Genera un ID de sesión único para cada visitante

### 2. Endpoints de API Actualizados

#### `/api/send` (Contacto General)
- Schema actualizado para incluir información de tracking opcional
- Combina datos del servidor (headers HTTP) con datos del cliente
- Guarda información de tracking en MongoDB
- Incluye información de origen en los emails

#### `/api/indemnizacion` (Calculadora de Indemnización)
- Schema actualizado para incluir información de tracking opcional
- Misma funcionalidad que el endpoint de contacto general
- Información de tracking incluida en emails de notificación

### 3. Formularios del Frontend Actualizados

#### FeedbackForm (`src/app/components/FeedbackForm.tsx`)
- Envía información de tracking automáticamente al completar el formulario
- No requiere cambios en la interfaz de usuario

#### Calculadora de Indemnización (`src/app/indemnizacion/page.tsx`)
- Incluye tracking en el envío de datos de la calculadora
- Mantiene la misma experiencia de usuario

#### Formulario Corporativo (`src/app/corporation/page.tsx`)
- Incluye tracking y asigna automáticamente el tipo de consulta como "asesoramiento-empresas"

### 4. Templates de Email Mejorados
- **Nueva sección "Información de Origen"** en todos los emails
- Muestra:
  - Fuente de tráfico (ej: "Google", "Facebook", "Acceso directo")
  - Parámetros UTM si están disponibles
  - ID de sesión único
  - URL de la página donde se completó el formulario

## Ejemplos de Información Capturada

### Acceso desde Google
```
Fuente de tráfico: Fuente: google | Medio: organic | Término: abogado laboral
ID de sesión: session_1703123456789_abc123def
Página: https://estudiorampazzo.com/indemnizacion
```

### Acceso desde Facebook
```
Fuente de tráfico: Fuente: facebook | Medio: social | Campaña: promocion_2024
ID de sesión: session_1703123456789_xyz789ghi
Página: https://estudiorampazzo.com/
```

### Acceso directo
```
Fuente de tráfico: Fuente: Acceso directo
ID de sesión: session_1703123456789_mno456pqr
Página: https://estudiorampazzo.com/servicios
```

## Estructura de Datos en MongoDB

### Colección `contacts`
```json
{
  "name": "Juan Pérez",
  "phone": "+5491123456789",
  "consultType": "despidos",
  "consulta": "Consulta sobre despido sin causa",
  "tracking": {
    "referrer": "https://www.google.com/search?q=abogado+laboral",
    "utm_source": "google",
    "utm_medium": "organic",
    "utm_term": "abogado laboral",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "pageUrl": "https://estudiorampazzo.com/",
    "sessionId": "session_1703123456789_abc123def",
    "source": "google"
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Colección `laboral`
```json
{
  "nombre": "María González",
  "telefono": "+5491123456789",
  "salario": 150000,
  "fechaIngreso": "2020-01-15",
  "fechaEgreso": "2024-01-15",
  "preaviso": false,
  "indemnizacionCalculada": 450000,
  "quiereContacto": true,
  "agravantes": { ... },
  "tracking": {
    "referrer": "https://www.facebook.com/",
    "utm_source": "facebook",
    "utm_medium": "social",
    "utm_campaign": "promocion_2024",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    "timestamp": "2024-01-15T14:20:00.000Z",
    "pageUrl": "https://estudiorampazzo.com/indemnizacion",
    "sessionId": "session_1703123456789_xyz789ghi",
    "source": "facebook"
  },
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

## Beneficios

1. **Análisis de tráfico**: Saber de dónde provienen los clientes potenciales
2. **Efectividad de campañas**: Medir el ROI de campañas de marketing
3. **Optimización de SEO**: Identificar qué términos de búsqueda generan más conversiones
4. **Experiencia de usuario**: Mejorar la experiencia basada en la fuente de origen
5. **Seguimiento de sesiones**: Rastrear el comportamiento del usuario a través de la sesión

## Consideraciones de Privacidad

- La información de tracking se recopila de manera transparente
- No se almacenan datos personales sensibles en el tracking
- Se respeta la privacidad del usuario manteniendo solo información técnica necesaria
- Los datos se utilizan únicamente para análisis de marketing y mejora del servicio

## Uso

El sistema funciona automáticamente sin necesidad de configuración adicional. Cada vez que un usuario completa un formulario, se captura automáticamente:

1. La fuente de origen (referrer)
2. Parámetros UTM si están presentes en la URL
3. Información del navegador
4. URL de la página actual
5. Un ID de sesión único

Esta información se incluye tanto en la base de datos como en los emails de notificación para el equipo del estudio.
