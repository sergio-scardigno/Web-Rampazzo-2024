import React from "react";
import { montserrat } from "../../fonts";
import { evolventa } from "../../fonts";
import PageLayout from "../../components/PageLayout";
import Testimonials from "../../components/Testimonials";
import SeniorOptimizedForm from "../../components/SeniorOptimizedForm";

const benefits = [
  {
    icon: "📋",
    title: "Evaluación Gratuita",
    description: "Analizamos tu situación previsional sin costo para determinar si podés jubilarte."
  },
  {
    icon: "⚖️",
    title: "Experiencia Legal",
    description: "Más de 15 años especializados en derecho previsional y laboral."
  },
  {
    icon: "📞",
    title: "Atención Personalizada",
    description: "Te acompañamos en cada paso del proceso con comunicación directa."
  },
  {
    icon: "💰",
    title: "Sin Costos Adelantados",
    description: "Solo cobramos cuando logramos resultados exitosos en tu caso."
  },
  {
    icon: "📄",
    title: "Gestión Completa",
    description: "Nos encargamos de toda la documentación y trámites ante ANSES."
  },
  {
    icon: "✅",
    title: "Garantía de Resultados",
    description: "95% de casos exitosos con más de 500 clientes satisfechos."
  }
];

const processSteps = [
  {
    number: "01",
    title: "Consulta Inicial Gratuita",
    description: "Evaluamos tu situación previsional y te explicamos las opciones disponibles."
  },
  {
    number: "02",
    title: "Análisis Documental",
    description: "Revisamos todos tus aportes y servicios computables para maximizar tu haber."
  },
  {
    number: "03",
    title: "Estrategia Personalizada",
    description: "Desarrollamos la mejor estrategia para tu caso específico."
  },
  {
    number: "04",
    title: "Presentación del Trámite",
    description: "Gestionamos toda la documentación y presentación ante ANSES."
  },
  {
    number: "05",
    title: "Seguimiento y Acompañamiento",
    description: "Te mantenemos informado del progreso y respondemos todas tus dudas."
  }
];

const faqItems = [
  {
    question: "¿Cuánto cuesta la consulta inicial?",
    answer: "La consulta inicial es completamente gratuita. Solo cobramos cuando logramos resultados exitosos en tu caso."
  },
  {
    question: "¿Cuánto tiempo tarda el trámite de jubilación?",
    answer: "El tiempo promedio es de 3 a 6 meses, dependiendo de la complejidad del caso y la documentación presentada."
  },
  {
    question: "¿Puedo jubilarme si no tengo todos los aportes?",
    answer: "Sí, existen moratorias y planes de pago que permiten regularizar la situación previsional. Analizamos tu caso en particular."
  },
  {
    question: "¿Qué documentos necesito para empezar?",
    answer: "DNI, constancia de CUIL, últimos recibos de sueldo y toda la documentación laboral que tengas disponible."
  },
  {
    question: "¿Trabajan en todo el país?",
    answer: "Sí, trabajamos de forma remota en todo Argentina. No necesitas venir presencialmente a nuestra oficina."
  }
];

export default function JubilacionesLandingPage() {
  return (
    <PageLayout
      title="Jubilaciones - Consulta Gratuita"
      description="¿Estás cerca de jubilarte? Consulta gratuita con especialistas en derecho previsional. Más de 15 años de experiencia. Sin costos adelantados."
      breadcrumbText="volver"
      breadcrumbLink="/servicios"
      defaultService="jubilacion"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] text-white py-16 px-4 rounded-lg mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Estás cerca de jubilarte?
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Consulta gratuita con especialistas en derecho previsional
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-sm opacity-90">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-300">15+</div>
              <div className="text-sm opacity-90">Años de experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-300">95%</div>
              <div className="text-sm opacity-90">Casos exitosos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Beneficios */}
          <section>
            <h2 className="senior-heading text-[#1B1743] text-center mb-8">
              ¿Por qué elegirnos?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="senior-card text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="senior-text font-semibold text-[#1B1743] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="senior-text text-gray-700">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Proceso */}
          <section>
            <h2 className="senior-heading text-[#1B1743] text-center mb-8">
              Nuestro Proceso de Trabajo
            </h2>
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#962C52] text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="senior-text font-semibold text-[#1B1743] mb-2">
                      {step.title}
                    </h3>
                    <p className="senior-text text-gray-700">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="senior-heading text-[#1B1743] text-center mb-8">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="senior-card">
                  <h3 className="senior-text font-semibold text-[#1B1743] mb-2">
                    {faq.question}
                  </h3>
                  <p className="senior-text text-gray-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonios */}
          <section>
            <Testimonials maxTestimonials={3} />
          </section>

        </div>

        {/* Sidebar con formulario */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <SeniorOptimizedForm
              defaultService="jubilacion"
              title="Consulta Gratuita"
              description="Complete el formulario y nos comunicaremos con usted en menos de 24 horas para una consulta gratuita sobre su situación previsional."
              className="shadow-2xl"
            />
            
            {/* Información adicional */}
            <div className="mt-8 senior-card bg-blue-50 border-blue-200">
              <h3 className="senior-text font-semibold text-blue-800 mb-4">
                Información de Contacto
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📞</span>
                  <a 
                    href="tel:+5491121914149" 
                    className="senior-text text-blue-700 hover:underline"
                  >
                    +54 9 11 2191-4149
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📧</span>
                  <a 
                    href="mailto:estudiorampazzofernando@gmail.com" 
                    className="senior-text text-blue-700 hover:underline"
                  >
                    estudiorampazzofernando@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">🕒</span>
                  <span className="senior-text text-blue-700">
                    Lun-Vie: 9:00-18:00<br />
                    Sáb: 9:00-13:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
