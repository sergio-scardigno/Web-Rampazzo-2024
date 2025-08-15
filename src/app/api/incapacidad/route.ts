import { NextRequest } from 'next/server';
import { z } from 'zod';
import xss from 'xss';
import nodemailer from 'nodemailer';

// Importar MongoDB solo si las variables de entorno están disponibles
let clientPromise: any = null;
try {
    if (process.env.MONGODB_URI) {
        clientPromise = require('@/lib/mongodb').default;
    }
} catch (error) {
    console.warn('MongoDB not configured:', error);
}

// Función para crear el transportador de nodemailer
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
};

// Schema de validación para los datos de incapacidad
const incapacidadSchema = z.object({
    nombre: z.string().min(1).max(100),
    telefono: z.string().regex(/^\+?\d{7,15}$/),
    ingresoBase: z.number().positive(),
    porcentajeIncapacidad: z.number().min(0).max(100),
    edad: z.number().positive(),
    tipoContingencia: z.string(),
    fechaContingencia: z.string(),
    fechaPMI: z.string(),
    prestacionCalculada: z.number().positive(),
    quiereContacto: z.boolean(),
});

export async function POST(req: NextRequest) {
    try {
        // Validación y sanitización
        let data;
        try {
            data = incapacidadSchema.parse(await req.json());
        } catch (err) {
            if (err instanceof z.ZodError) {
                console.error('Error de validación:', err.issues);
                return Response.json(
                    {
                        success: false,
                        error: 'Datos inválidos',
                        details: err.issues,
                    },
                    { status: 400 }
                );
            }
            throw err;
        }

        const clean = (str: string) => xss(str, { whiteList: {} });

        // Sanitizar datos
        const datosSanitizados = {
            nombre: clean(data.nombre),
            telefono: clean(data.telefono),
            ingresoBase: data.ingresoBase,
            porcentajeIncapacidad: data.porcentajeIncapacidad,
            edad: data.edad,
            tipoContingencia: clean(data.tipoContingencia),
            fechaContingencia: clean(data.fechaContingencia),
            fechaPMI: clean(data.fechaPMI),
            prestacionCalculada: data.prestacionCalculada,
            quiereContacto: data.quiereContacto,
            createdAt: new Date(),
        };

        console.log('Datos de incapacidad recibidos:', datosSanitizados);

        // Guardar en MongoDB en la colección 'incapacidad' si está configurado
        let insertedId: string | undefined;
        if (clientPromise) {
            try {
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB);
                const result = await db
                    .collection('incapacidad')
                    .insertOne(datosSanitizados);

                insertedId = result.insertedId.toString();
                console.log(
                    'Documento insertado en incapacidad con _id:',
                    insertedId
                );
            } catch (dbError) {
                console.error('Error guardando en MongoDB:', dbError);
                return Response.json(
                    {
                        success: false,
                        error: 'Error al guardar en la base de datos',
                        details:
                            dbError instanceof Error
                                ? dbError.message
                                : 'Error desconocido',
                    },
                    { status: 500 }
                );
            }
        } else {
            // Si MongoDB no está configurado, solo simular
            console.log('MongoDB no configurado, simulando guardado exitoso');
            insertedId = 'simulated';
        }

        // Enviar correo electrónico de notificación
        try {
            const transporter = createTransporter();

            const mailOptions = {
                from: `"Estudio Rampazzo - Incapacidad" <${process.env.GMAIL_USER}>`,
                to: 'sergioscardigno82@gmail.com',
                subject: `Nueva consulta de incapacidad - ${datosSanitizados.nombre}`,
                html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
              🏥 NUEVA CONSULTA DE INCAPACIDAD - Estudio Rampazzo
            </h1>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">Información del Cliente</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Nombre:</strong> <span style="color: #3b82f6; font-weight: bold;">${datosSanitizados.nombre}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Teléfono:</strong> <span style="color: #3b82f6; font-weight: bold;">${datosSanitizados.telefono}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Edad:</strong> <span style="color: #3b82f6; font-weight: bold;">${datosSanitizados.edad} años</span>
              </p>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #92400e; margin-bottom: 15px;">Detalles de la Incapacidad</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Ingreso base:</strong> <span style="color: #d97706; font-weight: bold;">$${datosSanitizados.ingresoBase.toLocaleString('es-AR')}</span>
                <br><small style="color: #92400e; font-style: italic;">💰 Salario promedio para el cálculo de la prestación</small>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Porcentaje de incapacidad:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.porcentajeIncapacidad}%</span>
                <br><small style="color: #92400e; font-style: italic;">🏥 Evaluado por la Junta Médica (0-100%)</small>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Tipo de contingencia:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.tipoContingencia}</span>
                <br><small style="color: #92400e; font-style: italic;">⚠️ Causa de la incapacidad (accidente/enfermedad)</small>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Fecha de contingencia:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.fechaContingencia}</span>
                <br><small style="color: #92400e; font-style: italic;">📅 Día del accidente o diagnóstico</small>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Fecha PMI:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.fechaPMI}</span>
                <br><small style="color: #92400e; font-style: italic;">📋 PMI = Período de Mejoramiento de la Incapacidad - fecha de estabilización</small>
              </p>
            </div>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #166534; margin-bottom: 15px;">Cálculo de Prestación</h2>
              <p style="font-size: 18px; margin-bottom: 8px;">
                <strong>Prestación calculada:</strong> <span style="color: #16a34a; font-weight: bold; font-size: 20px;">$${datosSanitizados.prestacionCalculada.toLocaleString('es-AR')}</span>
              </p>
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #92400e; margin: 0; text-align: center;">
                ⚠️ <strong>IMPORTANTE:</strong> ${datosSanitizados.quiereContacto ? 'El cliente desea ser contactado' : 'El cliente NO desea ser contactado'}
              </p>
            </div>

            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #475569; margin-bottom: 10px; font-size: 14px;">📚 Glosario de Términos:</h3>
              <ul style="font-size: 12px; color: #64748b; margin: 0; padding-left: 20px;">
                <li><strong>PMI:</strong> Período de Mejoramiento de la Incapacidad - tiempo durante el cual se evalúa si la incapacidad puede mejorar o estabilizarse</li>
                <li><strong>Contingencia:</strong> Evento que causa la incapacidad (accidente laboral, enfermedad profesional, etc.)</li>
                <li><strong>Ingreso Base:</strong> Salario promedio sobre el cual se calcula la prestación por incapacidad</li>
                <li><strong>Porcentaje de Incapacidad:</strong> Grado de limitación funcional evaluado por la Junta Médica</li>
                <li><strong>Fecha de Contingencia:</strong> Día en que ocurrió el accidente o se diagnosticó la enfermedad</li>
                <li><strong>Fecha PMI:</strong> Fecha desde la cual se considera que la incapacidad se estabilizó</li>
              </ul>
            </div>
            
            <div style="font-size: 14px; color: #666; text-align: center;">
              <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString(
                  'es-AR',
                  {
                      timeZone: 'America/Argentina/Buenos_Aires',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                  }
              )}</p>
              <p><strong>ID de consulta:</strong> ${insertedId || 'N/A'}</p>
            </div>
          </div>
        </div>
      `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email de incapacidad enviado exitosamente:', info.messageId);

            return Response.json({
                success: true,
                message: 'Datos guardados y notificación enviada exitosamente',
                insertedId: insertedId,
                emailMessageId: info.messageId,
            });

        } catch (emailError) {
            console.error('Error enviando email de incapacidad:', emailError);
            // Si falla el email, aún devolvemos éxito en el guardado pero con advertencia
            return Response.json({
                success: true,
                message: 'Datos guardados exitosamente, pero hubo un error al enviar la notificación',
                insertedId: insertedId,
                emailError: emailError instanceof Error ? emailError.message : 'Error desconocido',
            });
        }

    } catch (error) {
        console.error('Error guardando datos de incapacidad:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
        return Response.json(
            {
                success: false,
                error: errorMessage,
                details: error instanceof Error ? error.stack : null,
            },
            { status: 500 }
        );
    }
}
