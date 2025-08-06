import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
};

export async function POST(req: NextRequest) {
  const { name, phone } = await req.json();
  console.log('Datos recibidos:', { name, phone });
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to: 'estudiorampazzofernando@gmail.com, sergioscardigno82@gmail.com',
      subject: 'Alguien acaba de dejar su contacto para que le devuelvan la llamada',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
              🎯 NUEVO CONTACTO - Estudio Rampazzo
            </h1>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 18px; margin-bottom: 10px;">
                <strong>Nombre:</strong> <span style="color: #3b82f6; font-weight: bold;">${name}</span>
              </p>
              <p style="font-size: 18px; margin-bottom: 10px;">
                <strong>Teléfono:</strong> <span style="color: #3b82f6; font-weight: bold;">${phone}</span>
              </p>
            </div>
            <div style="font-size: 16px; color: #666;">
              <p><strong>Para:</strong> Fernando Rampazzo</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
              <p style="font-size: 14px; color: #92400e; margin: 0;">
                ⚠️ IMPORTANTE: Reenviar este email a estudiorampazzofernando@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', info.messageId);
    return Response.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error enviando email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return Response.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}