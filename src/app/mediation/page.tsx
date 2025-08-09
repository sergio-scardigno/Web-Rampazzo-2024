import React from "react";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";

const Mediation = () => {
  return (
    <PageLayout
      title="Resolución de Conflictos y Mediación"
      description="Servicios especializados en mediación y resolución alternativa de conflictos"
      breadcrumbText="volver"
      breadcrumbLink="/"
      defaultService="mediacion">
      <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className={`md:col-span-4 ${montserrat.className}`}>
          <div className="pb-[60px] md:pb-[7.4vh]">
            <h1
              className={`pb-4 text-2xl leading-[26px] md:pb-[2.59vh] ${evolventa.className} md:text-[3.33vh] md:leading-[3.51vh] font-bold`}
            >
              Representación legal
            </h1>
            <p className="pb-[60px] text-sm leading-5 md:pb-[5.55vh] md:text-[1.48vh] md:leading-[2.22vh] font-medium">
              Me especializo en la representación de intereses de clientes en tribunales arbitrales, 
              tribunales de jurisdicción general y tribunales arbitrales, brindo apoyo legal durante las negociaciones
            </p>
            
            <h1
              className={`pb-10 text-2xl leading-[26px] md:pb-[5.55vh] ${evolventa.className} md:text-[3.33vh] md:leading-[3.51vh] font-bold`}
            >
              Resolución extrajudicial
              <br /> de conflictos
            </h1>
            <div className="pb-6 md:pb-[4.44vh]">
              <p className="pb-4 text-base leading-[22px] md:pb-[1.85vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Servicios
              </p>
              <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Desarrollo de estrategias para resolver situaciones conflictivas
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Negociaciones con la contraparte, incluyendo procedimientos de mediación, 
                  redacción de reclamos o respuestas a reclamos
                </li>
                <li className="md:pl-[0.62vw] pl-1">
                  Formalización legal de acuerdos
                </li>
              </ul>
            </div>
            <div
              className={`h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md`}
            >
              <div className="pb-2 md:pb-[1.11vh] flex items-center text-[#962C52]">
                <p className="text-base leading-[22px] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                  desde $50.000
                </p>
              </div>
              <p className="text-sm leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-medium md:font-normal">
                El costo se determina individualmente en cada situación
              </p>
            </div>
          </div>
          
          <div className="pb-[60px] md:pb-0">
            <h1
              className={`text-2xl leading-[26px] pb-10 md:pb-[5.55vh] ${evolventa.className} md:text-[3.33vh] md:leading-[3.51vh] font-bold`}
            >
              Protección judicial
            </h1>
            <p className="pb-4 text-base leading-[22px] md:pb-[1.85vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
              Me especializo en disputas comerciales y corporativas, represento los intereses 
              de los clientes en disputas por quiebras y brindo apoyo legal en cuestiones que surgen en el marco de:
            </p>
            <div className="pb-6 md:pb-[4.44vh]">
              <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Disputas financieras relacionadas con el cobro de deudas e incumplimiento 
                  de otras obligaciones contractuales, compensación por daños
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Disputas relacionadas con el reconocimiento de contratos como inválidos o no celebrados
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Disputas en el ámbito inmobiliario y de construcción
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Disputas antimonopolio
                </li>
                <li className="md:pl-[0.62vw] pl-1">
                  Disputas en el marco de casos de quiebra, incluyendo la representación de intereses de clientes 
                  en disputas sobre el reconocimiento de transacciones como inválidas y la atracción de personas 
                  controladoras a responsabilidad subsidiaria y compensación por daños
                </li>
              </ul>
            </div>
            <div className="pb-10 md:pb-[4.44vh]">
              <p className="text-base leading-[22px] pb-4 md:pb-[1.85vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Servicios
              </p>
              <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Evaluación de perspectivas de disputa, consultoría
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Recolección de evidencia
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Desarrollo de posición legal
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Representación de intereses en tribunales
                </li>
                <li className="md:pl-[0.62vw] pl-1">
                  Acompañamiento legal en la etapa de ejecución de actos judiciales
                </li>
              </ul>
            </div>
            <div
              className={`h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md`}
            >
              <div className="pb-2 md:pb-[1.11vh] flex items-center text-[#962C52]">
                <p className="text-base leading-[22px] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                  desde $100.000
                </p>
              </div>
              <p className="text-sm leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-medium md:font-normal">
                El costo se determina individualmente en cada situación
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Mediation;
