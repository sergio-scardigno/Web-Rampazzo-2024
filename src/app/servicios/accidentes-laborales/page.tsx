import React from "react";
import { montserrat } from "../../fonts";
import { evolventa } from "../../fonts";
import PageLayout from "../../components/PageLayout";

export const metadata = {
  title: 'Accidentes Laborales - Estudio Rampazzo',
  description: 'Asesoramiento legal especializado en accidentes laborales. Te ayudamos a reclamar tus derechos ante la ART y obtener la indemnización que mereces.',
};

export default function AccidentesLaboralesPage() {
  return (
    <PageLayout
      title="Accidentes Laborales"
      description="Asesoramiento legal especializado para reclamar tus derechos ante la ART"
      breadcrumbText="volver a servicios"
      breadcrumbLink="/servicios"
      defaultService="accidentes-laborales"
    >
      <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="md:col-span-4">
          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Protección Legal en Accidentes Laborales
          </h1>
          
          <p className="pb-[60px] md:pb-[5.55vh] text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
            Si sufriste un accidente en tu lugar de trabajo o desarrollaste una enfermedad profesional, es fundamental contar con asesoramiento legal especializado. Nuestro equipo te guiará en el proceso de reclamación ante la ART para que obtengas todas las prestaciones médicas e indemnizaciones que te corresponden por ley.
          </p>

          <div className="h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md mb-[60px] md:mb-[5.55vh]">
            <p className="font-medium text-[#962C52]">
              Los trabajadores tienen derecho a recibir atención médica integral, rehabilitación y una indemnización justa por las secuelas permanentes derivadas de accidentes laborales o enfermedades profesionales.
            </p>
          </div>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Nuestros Servicios
          </h1>
          
          <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium pb-[60px] md:pb-[5.55vh]">
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Asesoramiento integral ante la ART</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Reclamos por incapacidad laboral temporal o permanente</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Enfermedades profesionales no reconocidas</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Secuelas físicas y psicológicas</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Reclamo de indemnizaciones complementarias</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Negociación con aseguradoras</li>
            <li className="md:pl-[0.62vw] pl-1">Judicialización cuando sea necesario</li>
          </ul>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Preguntas Frecuentes
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">¿Qué debo hacer si sufro un accidente laboral?</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Debes dar aviso inmediato a tu empleador, solicitar atención médica de inmediato y comunicarte con un abogado especializado para proteger tus derechos.
              </p>
            </div>
            
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">¿Tengo derecho a una indemnización por accidente laboral?</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Sí, dependiendo de las secuelas que te haya dejado el accidente, podrías tener derecho a una indemnización por incapacidad permanente.
              </p>
            </div>
            
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">¿Qué es una enfermedad profesional?</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Es toda aquella enfermedad contraída por causa del trabajo o exposición al medio en el que el trabajador se encuentra obligado a trabajar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
