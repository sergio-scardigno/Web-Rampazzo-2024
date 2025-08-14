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
        if (clientPromise) {
            try {
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB);
                const result = await db
                    .collection('incapacidad')
                    .insertOne(datosSanitizados);

                console.log(
                    'Documento insertado en incapacidad con _id:',
                    result.insertedId
                );

                return Response.json({
                    success: true,
                    message: 'Datos guardados exitosamente',
                    insertedId: result.insertedId.toString(),
                });
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
            // Si MongoDB no está configurado, solo devolver éxito
            console.log('MongoDB no configurado, simulando guardado exitoso');
            return Response.json({
                success: true,
                message:
                    'Datos procesados exitosamente (MongoDB no configurado)',
                insertedId: 'simulated',
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
