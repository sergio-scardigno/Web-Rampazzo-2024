import React from "react";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";
import Testimonials from "../components/Testimonials";
import SeniorOptimizedForm from "../components/SeniorOptimizedForm";
import Credentials from "../components/Credentials";

const services = [
  {
    title: 'Jubilaciones',
    description: 'Tramitación de jubilaciones ante ANSES con evaluación de tus aportes y servicios computables.'
  },
  {
    title: 'Pensión por fallecimiento',
    description: 'Asesoramiento para familiares en la gestión de pensiones por fallecimiento.'
  },
  {
    title: 'Reajuste de haberes',
    description: 'Revisión de tu haber jubilatorio para mejoras salariales.'
  },
  {
    title: 'Rentas vitalicias',
    description: 'Asesoramiento sobre rentas vitalicias y su compatibilidad con el haber mínimo.'
  },
  {
    title: 'Reconocimiento de servicios',
    description: 'Gestión del reconocimiento de servicios no registrados.'
  },
  {
    title: 'Retiro por invalidez',
    description: 'Asesoramiento para el retiro por invalidez y su tramitación.'
  },
  {
    title: 'Trámites ante IPS',
    description: 'Gestión de jubilaciones para empleados de la Provincia de Buenos Aires.'
  }
];

const processSteps = [
  {
    number: '01',
    title: 'Evaluación inicial',
    description: 'Análisis de tu situación previsional y requisitos.'
  },
  {
    number: '02',
    title: 'Revisión documental',
    description: 'Verificación de aportes y servicios computables.'
  },
  {
    number: '03',
    title: 'Cálculo previsional',
    description: 'Estimación de tu haber jubilatorio.'
  },
  {
    number: '04',
    title: 'Presentación formal',
    description: 'Gestión del trámite ante ANSES o IPS.'
  },
  {
    number: '05',
    title: 'Seguimiento',
    description: 'Acompañamiento durante todo el proceso.'
  }
];

const faqItems = [
  {
    question: '¿Cuáles son los requisitos para jubilarme?',
    answer: 'Los requisitos varían según el régimen previsional. Generalmente se consideran la edad y los años de aportes. Te asesoramos sobre tu situación particular.'
  },
  {
    question: '¿Puedo jubilarme si no tengo todos los aportes?',
    answer: 'Sí, existen moratorias y planes de pago que permiten regularizar la situación previsional. Analizamos tu caso en particular.'
  },
  {
    question: '¿Cuánto tarda el trámite de jubilación?',
    answer: 'El tiempo promedio es de 3 a 6 meses, dependiendo de la complejidad del caso y la documentación presentada.'
  },
  {
    question: '¿Puedo trabajar estando jubilado?',
    answer: 'Sí, pero existen topes de ingresos. Te asesoramos sobre las condiciones y restricciones vigentes.'
  },
  {
    question: '¿Qué documentos necesito para iniciar el trámite?',
    answer: 'DNI, partidas de nacimiento, matrimonio si corresponde, constancias de CUIL/CUIT y toda la documentación laboral que acredite tus aportes.'
  },
  {
    question: '¿Puedo reclamar una jubilación por discapacidad?',
    answer: 'Sí, si tenés una discapacidad que te impide trabajar, podés acceder a una jubilación por invalidez. Te guiamos en el proceso.'
  }
];

export default function JubilacionesPage() {
  return (
    <PageLayout
      title="Jubilaciones y Pensiones"
      description="Asesoramiento legal especializado en jubilaciones, pensiones y reajuste de haberes. Más de 15 años ayudando a argentinos a acceder a sus derechos previsionales."
      breadcrumbText="volver"
      breadcrumbLink="/"
      defaultService="jubilacion"
    >
      <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="md:col-span-4">
          <h1 className={`senior-heading text-[#1B1743] ${evolventa.className}`}>
            Asesoramiento Integral en Derecho Previsional
          </h1>
          
          <p className="senior-text text-gray-700 senior-spacing-lg">
            En Estudio Rampazzo nos especializamos en derecho previsional, acompañándote en cada paso del proceso para que puedas acceder a tu jubilación o pensión de manera segura y con el mejor asesoramiento legal.
          </p>

          <div className="senior-card bg-gradient-to-r from-[#F8F6F7] to-[#F0F0F5] border-[#962C52] senior-spacing-lg">
            <p className="senior-text font-semibold text-[#962C52] text-center">
              Más de 15 años de experiencia en el rubro nos permiten ofrecerte el mejor asesoramiento para que accedas a tus derechos previsionales de la manera más beneficiosa.
            </p>
          </div>

          <h2 className={`senior-heading text-[#1B1743] ${evolventa.className}`}>
            Nuestros Servicios
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 senior-spacing-lg">
            {services.map((service, index) => (
              <div key={index} className="senior-card hover:shadow-lg transition-all duration-300">
                <h4 className="senior-text font-semibold text-[#1B1743] mb-3">{service.title}</h4>
                <p className="senior-text text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Nuestro Proceso de Trabajo
          </h1>
          
          <div className="space-y-8 pb-[60px] md:pb-[5.55vh]">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 w-16 h-16 bg-[#F8F6F7] rounded-full flex items-center justify-center text-[#962C52] text-xl font-bold mb-4 md:mb-0 md:mr-6">
                  {step.number}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#1B1743]">{step.title}</h4>
                  <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Documentación Necesaria
          </h1>
          
          <div className="bg-[#F8F6F7] p-6 rounded-xl mb-[60px] md:mb-[5.55vh]">
            <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium mb-4">
              Para iniciar tu trámite, necesitarás:
            </p>
            <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">DNI (frente y dorso)</li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Constancia de CUIL</li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Últimos 12 recibos de sueldo</li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">Certificados de trabajo</li>
              <li className="md:pl-[0.62vw] pl-1">Documentación que acredite servicios no registrados (si corresponde)</li>
            </ul>
          </div>

          <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Preguntas Frecuentes
          </h1>
          
          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <h2 className="senior-text font-semibold text-[#1B1743] mb-2">{faq.question}</h2>
                <p className="senior-text text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Credenciales */}
          <div className="mt-16">
            <Credentials />
          </div>

          {/* Testimonios */}
          <div className="mt-16">
            <Testimonials />
          </div>
        </div>

        {/* Sidebar con formulario optimizado */}
        <div className="md:col-span-2 mt-8 md:mt-0">
          <div className="sticky top-8">
            <SeniorOptimizedForm
              defaultService="jubilacion"
              title="Consulta Gratuita"
              description="Complete el formulario y nos comunicaremos con usted en menos de 24 horas para una consulta gratuita sobre su situación previsional."
              className="shadow-xl"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
