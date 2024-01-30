import { EmailTemplate } from '../../components/email-template';
import { Resend } from 'resend';
import * as React from 'react'
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, phone } = await req.json();
  try {
    const data = await resend.emails.send({
      from: `Fernando Rampazzo <estudiorampazzo@gmail.com>`,
      to: `estudiorampazzo@gmail.com`,
      subject: 'Alguien acaba de dejar su contacto para que le devuelvan la llamada',
      text: '',
      react: EmailTemplate({ name, phone }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}