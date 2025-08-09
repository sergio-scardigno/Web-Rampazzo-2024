"use client";
import React from "react";
import Link from "next/link";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";
import { FaBalanceScale, FaCarCrash, FaUserTie, FaPassport, FaLandmark, FaHandshake, FaArrowRight } from 'react-icons/fa';

const services = [
  {
    id: 'despidos',
    icon: <FaBalanceScale className="w-8 h-8 text-[#962C52]" />,
    title: "Despidos",
    description: "Asesoramiento y representación legal para trabajadores despedidos injustamente.",
    content: [
      "Evaluación integral de tu caso",
      "Reclamo de indemnizaciones",
      "Cobro de sueldos adeudados",
      "Diferencias salariales",
      "Tramitación ante el Ministerio de Trabajo"
    ]
  },
  {
    id: 'accidentes-laborales',
    icon: <FaUserTie className="w-8 h-8 text-[#962C52]" />,
    title: "Accidentes y Enfermedades Laborales",
    description: "Reclamos ante la ART por accidentes de trabajo y enfermedades profesionales.",
    content: [
      "Asesoramiento integral ante la ART",
      "Reclamos por incapacidad laboral",
      "Enfermedades profesionales",
      "Secuelas físicas y psicológicas",
      "Máxima indemnización posible"
    ]
  },
  {
    id: 'accidentes-transito',
    icon: <FaCarCrash className="w-8 h-8 text-[#962C52]" />,
    title: "Accidente de Tránsito",
    description: "Gestión de indemnizaciones por accidentes viales.",
    content: [
      "Asesoramiento integral",
      "Reclamos a compañías de seguro",
      "Daños materiales",
      "Daños físicos",
      "Pérdida de ingresos"
    ]
  },
  {
    id: 'defensas-penales',
    icon: <FaLandmark className="w-8 h-8 text-[#962C52]" />,
    title: "Defensas Penales",
    description: "Defensa legal en causas penales de toda índole.",
    content: [
      "Defensa en todas las instancias",
      "Acompañamiento en declaraciones",
      "Medidas cautelares",
      "Recursos y apelaciones",
      "Defensa efectiva de tus derechos"
    ]
  },
  {
    id: 'ciudadania',
    icon: <FaPassport className="w-8 h-8 text-[#962C52]" />,
    title: "Ciudadanía Argentina",
    description: "Tramitación de ciudadanía para extranjeros.",
    content: [
      "Asesoramiento integral",
      "Armado de carpeta",
      "Presentación judicial",
      "Seguimiento del expediente",
      "Obtención de la sentencia"
    ]
  },
  {
    id: 'sucesiones',
    icon: <FaHandshake className="w-8 h-8 text-[#962C52]" />,
    title: "Sucesiones",
    description: "Tramitación de sucesiones en todo el país.",
    content: [
      "Tramitación completa",
      "Inscripción de bienes",
      "Cuentas bancarias",
      "Propiedades",
      "Asesoramiento a herederos"
    ]
  },
  {
    id: 'divorcios',
    icon: <FaHandshake className="w-8 h-8 text-[#962C52]" />,
    title: "Divorcios",
    description: "Asesoramiento legal en procesos de divorcio y derecho de familia.",
    content: [
      "Divorcio express",
      "División de bienes",
      "Custodia de hijos",
      "Acuerdos prenupciales",
      "Mediación familiar"
    ]
  },
  {
    id: 'asesoramiento-empresas',
    icon: <FaBalanceScale className="w-8 h-8 text-[#962C52]" />,
    title: "Asesoramiento Empresarial",
    description: "Servicios legales integrales para empresas y emprendedores.",
    content: [
      "Constitución de sociedades",
      "Contratos comerciales",
      "Derecho laboral empresarial",
      "Propiedad intelectual",
      "Cumplimiento normativo"
    ]
  },
  {
    id: 'trabajo-negro',
    icon: <FaUserTie className="w-8 h-8 text-[#962C52]" />,
    title: "Trabajo en Negro",
    description: "Asesoramiento legal para trabajadores en situación irregular.",
    content: [
      "Regularización laboral",
      "Reclamo de aportes",
      "Indemnizaciones",
      "Derechos laborales",
      "Representación legal"
    ]
  }
];

const ServiciosPage = () => {
  return (
    <PageLayout
      title="Nuestros Servicios Legales"
      description="Asesoramiento legal integral y especializado para proteger tus derechos y resolver tus problemas legales de manera efectiva"
      breadcrumbText="volver"
      breadcrumbLink="/"
    >
      <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="md:col-span-6">
          <div className="mb-[60px] md:mb-[5.55vh]">
            <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
              Servicios Legales Integrales
            </h1>
            <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
              En Estudio Rampazzo ofrecemos asesoramiento legal especializado en todas las áreas del derecho. 
              Nuestro equipo de abogados con amplia experiencia está comprometido en proteger tus derechos 
              y obtener los mejores resultados para tu caso.
            </p>
          </div>

          <div className="h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md mb-[60px] md:mb-[5.55vh]">
            <p className="font-medium text-[#962C52]">
              Más de 15 años de experiencia en el rubro legal nos permiten ofrecerte el mejor asesoramiento 
              para que accedas a tus derechos de la manera más beneficiosa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link 
                key={service.id} 
                href={`/servicios/${service.id}`}
                className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#962C52]"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#F8F6F7] rounded-full mr-4">
                    {service.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-[#1B1743] group-hover:text-[#962C52]">
                    {service.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                  {service.description}
                </p>
                <div className="flex items-center text-[#962C52] font-medium">
                  Ver más <FaArrowRight className="ml-2" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-[60px] md:mt-[5.55vh]">
            <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
              ¿Por qué elegirnos?
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-[#1B1743] mb-2">Experiencia comprobada</h4>
                <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                  Más de 15 años de experiencia en el rubro legal nos permiten ofrecerte el mejor asesoramiento.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-[#1B1743] mb-2">Atención personalizada</h4>
                <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                  Cada caso es único y merece atención personalizada. Nos comprometemos a brindarte el mejor servicio.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-[#1B1743] mb-2">Compromiso total</h4>
                <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                  Nuestro objetivo es obtener los mejores resultados para nuestros clientes, protegiendo siempre sus derechos.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-[#1B1743] mb-2">Compromiso total</h4>
                <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                  Te acompañamos en cada paso del proceso legal con claridad, eficiencia y resultados concretos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ServiciosPage;
