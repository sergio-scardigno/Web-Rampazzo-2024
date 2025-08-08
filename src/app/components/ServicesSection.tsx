import React from 'react';
import { FaBalanceScale, FaCarCrash, FaUserTie, FaPassport, FaLandmark, FaHandshake } from 'react-icons/fa';

const services = [
  {
    icon: <FaBalanceScale className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Despidos",
    description: "Asesoramos y representamos a trabajadores despedidos injustamente. Evaluamos tu caso, reclamamos indemnizaciones, sueldos adeudados, diferencias salariales y todos los derechos que te correspondan."
  },
  {
    icon: <FaUserTie className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Accidentes y enfermedades laborales",
    description: "Reclamamos ante la ART por accidentes de trabajo, enfermedades profesionales, secuelas físicas o psicológicas. También iniciamos juicios por incapacidad y buscamos la máxima indemnización posible."
  },
  {
    icon: <FaCarCrash className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Accidente de tránsito",
    description: "Si sufriste un accidente de tránsito como conductor, acompañante o peatón, gestionamos tu indemnización ante la aseguradora. Nos ocupamos de todo: daños físicos, materiales y pérdida de ingresos."
  },
  {
    icon: <FaLandmark className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Defensas penales",
    description: "Brindamos defensa penal en todas las instancias: denuncias, detenciones, causas judiciales. Intervenimos con rapidez, seriedad y estrategia para proteger tus derechos y garantizar una defensa efectiva."
  },
  {
    icon: <FaPassport className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Ciudadanía argentina",
    description: "Tramitamos la ciudadanía argentina para extranjeros de forma completa. Te acompañamos en cada paso: documentación, presentación judicial, seguimiento del expediente y obtención de la sentencia."
  },
  {
    icon: <FaHandshake className="w-12 h-12 text-yellow-600 mb-4" />,
    title: "Sucesiones",
    description: "Realizamos sucesiones en todo el país, de forma simple y rápida. Regularizamos bienes, propiedades y cuentas bancarias para que los herederos puedan disponer de su parte legal sin demoras."
  }
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-white" id="servicios">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Nuestros Servicios Legales</h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-center">
                {service.icon}
                <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-black mb-4">
            Abogado con amplia experiencia en la defensa de tus derechos
          </h3>
          <p className="text-gray-600">
            Nuestro objetivo es acompañarte, asesorarte y representarte con compromiso, claridad y eficiencia en cada etapa del proceso legal. Trabajamos para que accedas a lo que te corresponde, con resultados concretos y soluciones reales.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
