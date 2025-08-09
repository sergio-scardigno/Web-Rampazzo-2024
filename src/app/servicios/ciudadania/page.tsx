import React from "react";
import { montserrat } from "../../fonts";
import { evolventa } from "../../fonts";
import PageLayout from "../../components/PageLayout";

export const metadata = {
  title: 'Ciudadanía - Estudio Rampazzo',
  description: 'Trámites de ciudadanía y documentación legal',
};

export default function CiudadaníaPage() {
  return (
    <PageLayout
      title="Ciudadanía"
      description="Trámites de ciudadanía y documentación legal"
      breadcrumbText="volver a servicios"
      breadcrumbLink="/servicios"
      defaultService="ciudadania">
      <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="md:col-span-4">
          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Ciudadanía
          </h1>
          
          <p className="pb-[60px] md:pb-[5.55vh] text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
            En Estudio Rampazzo nos especializamos en ciudadanía, brindando asesoramiento legal integral y personalizado para proteger sus derechos y obtener los mejores resultados en su caso.
          </p>

          <div className="h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md mb-[60px] md:mb-[5.55vh]">
            <p className="font-medium text-[#962C52]">
              Contamos con amplia experiencia en ciudadanía y un equipo de profesionales especializados que le brindarán el mejor asesoramiento legal.
            </p>
          </div>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Nuestros Servicios
          </h1>
          
          <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium pb-[60px] md:pb-[5.55vh]">
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Asesoramiento legal especializado</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Evaluación integral de su caso</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Representación legal ante organismos competentes</li>
            <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Negociación y mediación cuando sea posible</li>
            <li className="md:pl-[0.62vw] pl-1">Acompañamiento durante todo el proceso</li>
          </ul>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            ¿Por qué elegirnos?
          </h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">Experiencia comprobada</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Más de 15 años de experiencia en el rubro legal nos permiten ofrecerle el mejor asesoramiento.
              </p>
            </div>
            
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">Atención personalizada</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Cada caso es único y merece atención personalizada. Nos comprometemos a brindarle el mejor servicio.
              </p>
            </div>
            
            <div>
              <h2 className="font-medium text-[#1B1743] mb-2">Resultados garantizados</h2>
              <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                Nuestro objetivo es obtener los mejores resultados para nuestros clientes, protegiendo siempre sus derechos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}