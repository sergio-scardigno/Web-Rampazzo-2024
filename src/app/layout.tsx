import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { evolventa } from './fonts';

export const metadata: Metadata = {
    title: 'Estudio Rampazzo',
    description:
        'Toda mi experiencia y profesionalismo aplicado a tu caso. Tengo más de 3 años ayudando a adultos mayores difundiendo sus derechos en los principales canales de TV. Voy a ser tu asesor de confianza.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className={`select-none ${evolventa.className} h-screen`}>
                <Toaster position="bottom-right" />
                <Header />
                {children}

                <Footer />
            </body>
        </html>
    );
}
