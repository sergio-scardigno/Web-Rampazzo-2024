"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBalanceScale, FaCarCrash, FaUserTie, FaPassport, FaLandmark, FaHandshake, FaArrowRight } from 'react-icons/fa';

const services = [
  {
    icon: FaBalanceScale,
    title: "Despidos",
    description: "Asesoramos y representamos a trabajadores despedidos injustamente. Evaluamos tu caso, reclamamos indemnizaciones, sueldos adeudados, diferencias salariales y todos los derechos que te correspondan."
  },
  {
    icon: FaUserTie,
    title: "Accidentes y enfermedades laborales",
    description: "Reclamamos ante la ART por accidentes de trabajo, enfermedades profesionales, secuelas físicas o psicológicas. También iniciamos juicios por incapacidad y buscamos la máxima indemnización posible."
  },
  {
    icon: FaCarCrash,
    title: "Accidente de tránsito",
    description: "Si sufriste un accidente de tránsito como conductor, acompañante o peatón, gestionamos tu indemnización ante la aseguradora. Nos ocupamos de todo: daños físicos, materiales y pérdida de ingresos."
  },
  {
    icon: FaLandmark,
    title: "Defensas penales",
    description: "Brindamos defensa penal en todas las instancias: denuncias, detenciones, causas judiciales. Intervenimos con rapidez, seriedad y estrategia para proteger tus derechos y garantizar una defensa efectiva."
  },
  {
    icon: FaPassport,
    title: "Ciudadanía argentina",
    description: "Tramitamos la ciudadanía argentina para extranjeros de forma completa. Te acompañamos en cada paso: documentación, presentación judicial, seguimiento del expediente y obtención de la sentencia."
  },
  {
    icon: FaHandshake,
    title: "Sucesiones",
    description: "Realizamos sucesiones en todo el país, de forma simple y rápida. Regularizamos bienes, propiedades y cuentas bancarias para que los herederos puedan disponer de su parte legal sin demoras."
  }
];

const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  // Subtle pulse effect every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 1500); // Longer, more subtle pulse duration
      return () => clearTimeout(timer);
    }, 5000); // Less frequent pulsing
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-white" id="servicios">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Nuestros Servicios Legales</h2>
          <div className="w-24 h-1 bg-[#962C52] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#962C52]"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto 
                    ${isHovered ? 'animate-bounce' : ''} 
                    ${isPulsing ? 'animate-pulse' : ''}
                    transition-all duration-500 ease-in-out`}
                    style={{
                      transform: isPulsing ? 'scale(1.05)' : 'scale(1)',
                      opacity: isPulsing ? 0.9 : 1
                    }}
                  >
                    <Icon className={`w-12 h-12 ${isHovered ? 'text-[#962C52]' : 'text-[#962C52]'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-black mb-4">
            Abogado con amplia experiencia en la defensa de tus derechos
          </h3>
          <p className="text-gray-600 mb-8">
            Nuestro objetivo es acompañarte, asesorarte y representarte con compromiso, claridad y eficiencia en cada etapa del proceso legal. Trabajamos para que accedas a lo que te corresponde, con resultados concretos y soluciones reales.
          </p>
          
          <Link 
            href="/servicios"
            className="inline-flex items-center px-8 py-3 bg-[#962C52] text-white font-semibold rounded-lg hover:bg-[#7a2342] transition-colors duration-300"
          >
            Ver todos nuestros servicios
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
