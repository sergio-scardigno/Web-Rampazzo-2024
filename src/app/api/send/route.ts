import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import xss from 'xss';

// Importar MongoDB solo si las variables de entorno están disponibles
let clientPromise: any = null;
try {
    if (process.env.MONGODB_URI) {
        clientPromise = require('@/lib/mongodb').default;
    }
} catch (error) {
    console.warn('MongoDB not configured:', error);
}

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
};

// ─── Regex para detectar URLs ─────────────────────────
const urlRegex = /(https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+\S*/i;

// ─── Schema de validación actualizado ───────────────────────────
const contactSchema = z.object({
    name: z.string().min(1).max(100),
    phone: z.string().regex(/^\+?\d{7,15}$/),
    consultType: z.enum([
        'general',
        'asesoramiento',
        'jubilacion',
        'despidos',
        'accidentes-laborales',
        'accidentes-transito',
        'defensas-penales',
        'ciudadania',
        'sucesiones',
        'divorcios',
        'asesoramiento-empresas',
        'trabajo-negro',
        'enfermedades-laborales',
        'mediacion',
        'personas-juridicas',
        'otro',
    ]),
    consulta: z
        .string()
        .max(500)
        .optional()
        .refine((val) => !val || !urlRegex.test(val), {
            message: 'No se permiten enlaces web en la consulta',
        }),
});

// ─── Mapeo de tipos de consulta a nombres legibles ───────────────────────────
const consultTypeLabels = {
    general: 'Consulta general',
    asesoramiento: 'Asesoramiento',
    jubilacion: 'Jubilación',
    despidos: 'Despidos',
    'accidentes-laborales': 'Accidentes laborales',
    'accidentes-transito': 'Accidentes de tránsito',
    'defensas-penales': 'Defensas penales',
    ciudadania: 'Ciudadanía argentina',
    sucesiones: 'Sucesiones',
    divorcios: 'Divorcios',
    'asesoramiento-empresas': 'Asesoramiento empresarial',
    'trabajo-negro': 'Trabajo en negro',
    'enfermedades-laborales': 'Enfermedades laborales',
    mediacion: 'Mediación',
    'personas-juridicas': 'Personas jurídicas',
    otro: 'Otro',
};

export async function POST(req: NextRequest) {
    // ─── Validación y sanitización ─────────────────────
    let data;
    try {
        data = contactSchema.parse(await req.json());
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Error de validación:', err.issues);
            return Response.json(
                { success: false, error: 'Invalid input', details: err.issues },
                { status: 400 }
            );
        }
        throw err;
    }

    const clean = (str: string) => xss(str, { whiteList: {} });

    const name = xss(data.name);
    const phone = xss(data.phone);
    const consultType = data.consultType;
    const consulta = data.consulta ? clean(data.consulta) : undefined;

    console.log('Datos recibidos sanitizados:', {
        name,
        phone,
        consultType,
        consulta,
    });

    // ─── Guarda en MongoDB ───────────────────────────────
    let insertedId: string | undefined;
    if (clientPromise) {
        try {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB);
            const result = await db.collection('contacts').insertOne({
                name,
                phone,
                consultType,
                consulta,
                createdAt: new Date(),
            });
            insertedId = result.insertedId.toString();
            console.log('Documento insertado con _id:', insertedId);
        } catch (dbErr) {
            console.error('Error guardando en MongoDB:', dbErr);
        }
    } else {
        console.log('MongoDB no configurado, simulando guardado');
        insertedId = 'simulated';
    }

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Estudio Rampazzo - Contacto Web" <${process.env.GMAIL_USER}>`,
            //to: 'estudiorampazzofernando@gmail.com, sergioscardigno82@gmail.com',
            to: 'sergioscardigno82@gmail.com',
            subject: `Nuevo contacto - ${
                consultTypeLabels[consultType] || consultType
            }`,
            html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
              🎯 NUEVO CONTACTO - Estudio Rampazzo
            </h1>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">Información del Contacto</h2>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Nombre:</strong> <span style="color: #3b82f6; font-weight: bold;">${name}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Teléfono:</strong> <span style="color: #3b82f6; font-weight: bold;">${phone}</span>
              </p>
              <p style="font-size: 16px; margin-bottom: 8px;">
                <strong>Tipo de consulta:</strong> <span style="color: #3b82f6; font-weight: bold;">${
                    consultTypeLabels[consultType] || consultType
                }</span>
              </p>
              ${
                  consulta
                      ? `<p style="font-size: 16px; margin-bottom: 8px;"><strong>Consulta adicional:</strong> <span style="color: #3b82f6;">${consulta}</span></p>`
                      : ''
              }
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #92400e; margin: 0; text-align: center;">
                ⚠️ <strong>IMPORTANTE:</strong> Contactar al cliente lo antes posible
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
              <p><strong>ID de contacto:</strong> ${insertedId || 'N/A'}</p>
            </div>
          </div>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', info.messageId);
        return Response.json({
            success: true,
            messageId: info.messageId,
            insertedId,
        });
    } catch (error) {
        console.error('Error enviando email:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
        return Response.json(
            {
                error: errorMessage,
                details: error instanceof Error ? error.stack : null,
            },
            { status: 500 }
        );
    }
}
