# Configuración de MongoDB para la Calculadora de Indemnización

## Variables de Entorno Requeridas

Para que la calculadora de indemnización funcione correctamente con la base de datos, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/estudio-rampazzo
MONGODB_DB=estudio-rampazzo

# Email Configuration (opcional, para notificaciones)
GMAIL_USER=estudiorampazzofernando@gmail.com
GMAIL_PASSWORD=your-app-password-here
```

## Estructura de la Base de Datos

### Colección: `laboral`

La calculadora de indemnización guarda los datos en la colección `laboral` con la siguiente estructura:

```javascript
{
  nombre: "string",                    // Nombre completo del usuario
  telefono: "string",                  // Número de teléfono
  salario: number,                     // Salario mensual
  antiguedad: number,                  // Años de antigüedad
  fechaIngreso: "string",              // Fecha de ingreso (YYYY-MM-DD)
  fechaEgreso: "string",               // Fecha de egreso (YYYY-MM-DD)
  rubro: "string",                     // Rubro de actividad
  motivoDespido: "string",             // Motivo del despido
  indemnizacionCalculada: number,      // Monto total calculado
  quiereContacto: boolean,             // Si quiere ser contactado
  createdAt: Date                      // Fecha de creación del registro
}
```

## Flujo de la Calculadora

1. **Paso 1 - Datos del Trabajador**: El usuario ingresa sus datos laborales
2. **Paso 2 - Información de Contacto**: El usuario proporciona su nombre y teléfono, y elige si quiere ser contactado
3. **Paso 3 - Resultado**: Se muestra el cálculo final y se guardan los datos en MongoDB si el usuario lo autorizó

## Configuración de MongoDB

### Opción 1: MongoDB Local

1. Instala MongoDB en tu sistema
2. Inicia el servicio de MongoDB
3. Usa la URI: `mongodb://localhost:27017/estudio-rampazzo`

### Opción 2: MongoDB Atlas (Recomendado para producción)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster
3. Obtén la URI de conexión
4. Usa la URI: `mongodb+srv://username:password@cluster.mongodb.net/estudio-rampazzo`

## Configuración de Email (Opcional)

Si quieres recibir notificaciones por email cuando alguien use la calculadora:

1. Configura una cuenta de Gmail
2. Genera una contraseña de aplicación
3. Usa esa contraseña en `GMAIL_PASSWORD`

## Desarrollo vs Producción

-   **Desarrollo**: Puedes usar MongoDB local
-   **Producción**: Usa MongoDB Atlas para mejor rendimiento y seguridad

## Notas Importantes

-   El archivo `.env.local` está en `.gitignore` por seguridad
-   La aplicación funcionará sin MongoDB configurado, pero no guardará los datos
-   Los datos se guardan solo si el usuario autoriza el contacto
