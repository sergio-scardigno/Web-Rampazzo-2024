import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { evolventa } from './fonts';
import ExitIntentProvider from './components/ExitIntentProvider';
import LeadCaptureBanner from './components/LeadCaptureBanner';

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
                
                {/* Plausible Analytics */}
                <script 
                    defer 
                    data-domain="fernandorampazzo.com.ar" 
                    src="https://rampazzo-plausible.ndorzn.easypanel.host/js/script.js"
                ></script>
                
                {/* Matomo Analytics */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            var _paq = window._paq = window._paq || [];
                            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                            _paq.push(['trackPageView']);
                            _paq.push(['enableLinkTracking']);
                            (function() {
                                var u="//rampazzo-matomo.ndorzn.easypanel.host/";
                                _paq.push(['setTrackerUrl', u+'matomo.php']);
                                _paq.push(['setSiteId', '1']);
                                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`select-none ${evolventa.className} h-screen`}>
                <Toaster position="bottom-right" />
                <ExitIntentProvider>
                    <LeadCaptureBanner 
                        variant="top" 
                        message="¿Necesitas ayuda con tu jubilación? Consulta gratuita disponible"
                        autoHide={true}
                        hideDelay={8000}
                    />
                    <Header />
                    {children}
                    <Footer />
                </ExitIntentProvider>
            </body>
        </html>
    );
}
