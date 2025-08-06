# Sitio Web Corporativo - Estudio Rampazzo

Este es el repositorio del código fuente para el sitio web corporativo del Estudio Rampazzo, desarrollado por Sergio Scardigno. El sitio está diseñado para ser moderno, rápido y completamente responsivo.

## 📜 Descripción General

El proyecto es una aplicación web construida con Next.js que sirve como plataforma de presentación para los servicios legales ofrecidos por el estudio. Incluye varias secciones estáticas, páginas de servicios específicos y un formulario de contacto funcional con envío de correo electrónico.

## ✨ Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack de tecnologías modernas:

- **Framework Principal:** [Next.js](https://nextjs.org/) 14
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Framework de UI:** [React](https://react.dev/) 18
- **Estilos CSS:** [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)
- **Envío de Correos (API):** [Resend](https://resend.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Dependencias Adicionales:**
  - Material UI (`@mui/material`) para componentes específicos.
  - `react-calendly` para incrustar agendamiento de citas.

## 📂 Estructura del Proyecto

El código fuente está organizado siguiendo las convenciones de Next.js con el App Router:

```
/
├── public/           # Archivos estáticos: imágenes, fuentes, iconos.
├── src/
│   ├── app/          # Lógica principal de la aplicación (App Router)
│   │   ├── api/      # Rutas de la API (ej. /api/send para el form)
│   │   ├── components/ # Componentes reutilizables de React (Header, Footer, etc.)
│   │   ├── (pages)/  # Carpetas para cada ruta/página del sitio
│   │   ├── layout.tsx  # Layout principal de la aplicación
│   │   └── page.tsx    # Página de inicio
│   └── ...
├── .env              # Archivo para variables de entorno (debe ser ignorado por Git)
├── next.config.js    # Archivo de configuración de Next.js
├── tailwind.config.ts# Archivo de configuración de Tailwind CSS
└── package.json      # Dependencias y scripts del proyecto
```

## 🚀 Cómo Empezar

Sigue estos pasos para levantar una copia local del proyecto.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 20.x o superior).

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade las variables necesarias (por ejemplo, la API key de Resend).
    ```
    RESEND_API_KEY=tu_api_key_aqui
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 🛠️ Scripts Disponibles

En el archivo `package.json`, encontrarás los siguientes scripts:

- `npm run dev`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia un servidor de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para analizar el código en busca de errores y problemas de estilo.
