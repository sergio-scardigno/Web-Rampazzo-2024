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

// Schema de validación para los datos de indemnización
const indemnizacionSchema = z.object({
    nombre: z.string().min(1).max(100),
    telefono: z.string().regex(/^\+?\d{7,15}$/),
    salario: z.number().positive(),
    antiguedad: z.number().positive(),
    fechaIngreso: z.string(),
    fechaEgreso: z.string(),
    rubro: z.string(),
    motivoDespido: z.string(),
    indemnizacionCalculada: z.number().positive(),
    quiereContacto: z.boolean(),
});

export async function POST(req: NextRequest) {
    try {
        // Validación y sanitización
        let data;
        try {
            data = indemnizacionSchema.parse(await req.json());
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
            salario: data.salario,
            antiguedad: data.antiguedad,
            fechaIngreso: clean(data.fechaIngreso),
            fechaEgreso: clean(data.fechaEgreso),
            rubro: clean(data.rubro),
            motivoDespido: clean(data.motivoDespido),
            indemnizacionCalculada: data.indemnizacionCalculada,
            quiereContacto: data.quiereContacto,
            createdAt: new Date(),
        };

        console.log('Datos de indemnización recibidos:', datosSanitizados);

        // Guardar en MongoDB en la colección 'laboral' si está configurado
        let insertedId: string | undefined;
        if (clientPromise) {
            try {
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB);
                const result = await db
                    .collection('laboral')
                    .insertOne(datosSanitizados);

                insertedId = result.insertedId.toString();
                console.log(
                    'Documento insertado en laboral con _id:',
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
                from: `"Estudio Rampazzo - Indemnización" <${process.env.GMAIL_USER}>`,
                to: 'sergioscardigno82@gmail.com',
                subject: `Nueva consulta de indemnización - ${datosSanitizados.nombre}`,
                html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
              💼 NUEVA CONSULTA DE INDEMNIZACIÓN - Estudio Rampazzo
            </h1>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">Información del Cliente</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Nombre:</strong> <span style="color: #3b82f6; font-weight: bold;">${datosSanitizados.nombre}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Teléfono:</strong> <span style="color: #3b82f6; font-weight: bold;">${datosSanitizados.telefono}</span>
              </p>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #92400e; margin-bottom: 15px;">Detalles Laborales</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Salario:</strong> <span style="color: #d97706; font-weight: bold;">$${datosSanitizados.salario.toLocaleString('es-AR')}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Antigüedad:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.antiguedad} años</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Fecha de ingreso:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.fechaIngreso}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Fecha de egreso:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.fechaEgreso}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Rubro:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.rubro}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Motivo de despido:</strong> <span style="color: #d97706; font-weight: bold;">${datosSanitizados.motivoDespido}</span>
              </p>
            </div>

            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #166534; margin-bottom: 15px;">Cálculo de Indemnización</h2>
              <p style="font-size: 18px; margin-bottom: 8px;">
                <strong>Indemnización calculada:</strong> <span style="color: #16a34a; font-weight: bold; font-size: 20px;">$${datosSanitizados.indemnizacionCalculada.toLocaleString('es-AR')}</span>
              </p>
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #92400e; margin: 0; text-align: center;">
                ⚠️ <strong>IMPORTANTE:</strong> ${datosSanitizados.quiereContacto ? 'El cliente desea ser contactado' : 'El cliente NO desea ser contactado'}
              </p>
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
            console.log('Email de indemnización enviado exitosamente:', info.messageId);

            return Response.json({
                success: true,
                message: 'Datos guardados y notificación enviada exitosamente',
                insertedId: insertedId,
                emailMessageId: info.messageId,
            });

        } catch (emailError) {
            console.error('Error enviando email de indemnización:', emailError);
            // Si falla el email, aún devolvemos éxito en el guardado pero con advertencia
            return Response.json({
                success: true,
                message: 'Datos guardados exitosamente, pero hubo un error al enviar la notificación',
                insertedId: insertedId,
                emailError: emailError instanceof Error ? emailError.message : 'Error desconocido',
            });
        }

    } catch (error) {
        console.error('Error guardando datos de indemnización:', error);
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
