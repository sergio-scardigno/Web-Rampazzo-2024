# Guía de Integración de Analytics Mejorados

## 🎯 Opciones Recomendadas

### 1. **Plausible Analytics** (Más completo)
- ✅ **100% open source**
- ✅ **GDPR compliant** (sin cookies)
- ✅ **Muy ligero** (1.4KB)
- ✅ **Información geográfica precisa**
- ✅ **Detección de referrers mejorada**
- ✅ **Interfaz moderna**

### 2. **Umami Analytics** (Más simple)
- ✅ **Open source**
- ✅ **Muy ligero** (2KB)
- ✅ **Interfaz simple**
- ✅ **Fácil instalación**

### 3. **Matomo** (Más potente)
- ✅ **Análisis avanzado**
- ✅ **Heatmaps y grabaciones**
- ✅ **Geolocalización precisa**
- ❌ **Más pesado** (requiere más recursos)

## 🚀 Instalación Rápida

### Opción 1: Plausible Analytics

```bash
# En tu VPS
wget https://raw.githubusercontent.com/tu-repo/scripts/main/install-plausible.sh
chmod +x install-plausible.sh
./install-plausible.sh

# Editar configuración
nano /opt/plausible/docker-compose.yml

# Iniciar
cd /opt/plausible
./start-plausible.sh
```

### Opción 2: Umami Analytics

```bash
# En tu VPS
wget https://raw.githubusercontent.com/tu-repo/scripts/main/install-umami.sh
chmod +x install-umami.sh
./install-umami.sh

# Iniciar
cd /opt/umami
./start-umami.sh
```

## 🔧 Integración con tu Sitio

### 1. **Script de Tracking Básico**

Agrega esto a tu `layout.tsx`:

```tsx
// En src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Plausible Analytics */}
        <script 
          defer 
          data-domain="estudiorampazzo.com" 
          src="https://analytics.tudominio.com/js/script.js"
        ></script>
        
        {/* O Umami Analytics */}
        <script 
          async 
          src="https://analytics.tudominio.com/script.js" 
          data-website-id="tu-website-id"
        ></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### 2. **Tracking Personalizado Mejorado**

Crea un hook personalizado para tracking avanzado:

```tsx
// src/hooks/useAnalytics.ts
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: pathname,
          timestamp: new Date().toISOString(),
        }
      });
    }
  }, [pathname]);

  // Track custom events
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props });
    }
  };

  return { trackEvent };
}
```

### 3. **Tracking de Formularios**

Actualiza tus formularios para trackear conversiones:

```tsx
// En tu formulario de contacto
const { trackEvent } = useAnalytics();

const onSubmit = async (formData: FormInput) => {
  // Track form submission
  trackEvent('form_submit', {
    form_type: 'contact',
    page: pathname,
  });

  // Tu lógica existente...
  await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      tracking: getClientTrackingData(),
    }),
  });
};
```

### 4. **Tracking de Calculadora de Indemnización**

```tsx
// En tu calculadora
const trackCalculation = (result: IndemnizacionResult) => {
  trackEvent('calculation_completed', {
    indemnization_amount: result.total,
    salary: formData.salario,
    years_worked: calculateYears(formData.fechaIngreso, formData.fechaEgreso),
    has_aggravantes: Object.values(agravantes).some(v => v),
  });
};
```

## 📊 Información que Obtendrás

### **Plausible Analytics:**
- **Páginas más visitadas**
- **Fuentes de tráfico** (Google, Facebook, etc.)
- **Países y ciudades** de visitantes
- **Dispositivos** (móvil, desktop, tablet)
- **Navegadores** más usados
- **Términos de búsqueda** (si vienen de Google)
- **Tiempo en el sitio**
- **Tasa de rebote**

### **Umami Analytics:**
- **Vistas de página**
- **Usuarios únicos**
- **Sesiones**
- **Duración de sesión**
- **Referrers**
- **Dispositivos**
- **Navegadores**

## 🔍 Ejemplos de Eventos Personalizados

```tsx
// Trackear diferentes acciones
trackEvent('calculator_started');
trackEvent('calculator_completed', { amount: 450000 });
trackEvent('form_submitted', { form_type: 'contact' });
trackEvent('phone_clicked');
trackEvent('whatsapp_clicked');
trackEvent('email_clicked');
trackEvent('service_page_viewed', { service: 'indemnizacion' });
```

## 🛡️ Privacidad y GDPR

### **Plausible Analytics:**
- ✅ **Sin cookies**
- ✅ **No recopila datos personales**
- ✅ **GDPR compliant**
- ✅ **Datos anónimos**

### **Umami Analytics:**
- ✅ **Sin cookies**
- ✅ **Datos anónimos**
- ✅ **GDPR friendly**

## 📈 Dashboard y Reportes

### **Plausible:**
- Dashboard en tiempo real
- Reportes por período
- Exportación de datos
- Alertas por email

### **Umami:**
- Dashboard simple
- Métricas básicas
- Exportación CSV

## 🔧 Configuración Avanzada

### **Nginx Reverse Proxy** (Recomendado)

```nginx
# /etc/nginx/sites-available/analytics
server {
    listen 80;
    server_name analytics.tudominio.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **SSL con Let's Encrypt**

```bash
# Instalar certificado SSL
sudo certbot --nginx -d analytics.tudominio.com
```

## 🚀 Beneficios Inmediatos

1. **Análisis de tráfico en tiempo real**
2. **Identificación de fuentes más efectivas**
3. **Optimización de páginas más visitadas**
4. **Detección de problemas de UX**
5. **Métricas de conversión**
6. **Análisis geográfico de clientes**
7. **Optimización para dispositivos móviles**

## 💡 Recomendación Final

**Para tu caso específico, recomiendo Plausible Analytics** porque:

1. **Es el más ligero** (no afecta la velocidad de tu sitio)
2. **Información geográfica precisa** (importante para un estudio jurídico)
3. **Detección de referrers mejorada** (sabrás exactamente de dónde vienen tus clientes)
4. **GDPR compliant** (importante para un estudio jurídico)
5. **Interfaz moderna y fácil de usar**

¿Te gustaría que te ayude a configurar alguna de estas opciones específicamente?
