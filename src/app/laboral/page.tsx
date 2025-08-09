"use client";
import React from "react";
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";

const Laboral = () => {
  return (
    <>
      <PageLayout
      title="Derecho Laboral"
        description="Protección legal especializada en derecho laboral y accidentes de trabajo"
        breadcrumbText="volver"
        breadcrumbLink="/"
      defaultService="asesoramiento">
        <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
          <div className="md:col-span-4">
            <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
              Accidentes laborales
            </h1>
            <p className="pb-[60px] md:pb-[5.55vh] text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
              Nuestro equipo de abogados especialistas en derecho laboral está comprometido en proteger sus derechos y obtener la compensación justa que merece. Con años de experiencia y un enfoque centrado en el cliente, nos dedicamos a brindar asesoramiento legal integral y exhibición efectiva para ayudarte a superar las consecuencias de un accidente de trabajo. Nos encargaremos de presentar y gestionar su reclamo ante la Superintendencia de Riesgos del Trabajo (SRT) y/o la ART correspondiente.
            </p>
            
            <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
              Despidos
            </h1>
            <p className="pb-[60px] md:pb-[5.55vh] text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
              Juicios laborales sin costo para el trabajador. Para poder permitirle el acceso a la justicia, y obtener así la defensa de sus derechos laborales pese a no contar con recursos, asumimos la defensa en juicio sin costos iniciales ya que solo se cobra por resultado. Esto demuestra el grado de compromiso con el cliente.
            </p>
            
            <h1 className={`pb-4 md:pb-[2.59vh] text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
              Enfermedades laborales
            </h1>
            <p className="pb-[60px] md:pb-[5.55vh] text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
              Asesoramiento especializado en enfermedades profesionales y condiciones de trabajo que afectan la salud del trabajador. Te ayudamos a reclamar tus derechos ante la ART y obtener las prestaciones médicas e indemnizaciones que te corresponden.
            </p>
          </div>
        </div>
      </PageLayout>

      <FloatingWhatsApp
        phoneNumber="+5491121914149"
        accountName="Estudio Rampazzo"
        avatar={"/pics/logo.jpg"}
        statusMessage="Típicamente responde en 1 hora"
        chatMessage="¡Hola! 👋 ¿En qué podemos ayudarte hoy?"
        darkMode={false}
        allowClickAway={false}
        allowEsc={false}
        notification={true}
        notificationDelay={60}
        notificationSound={false}
      />
    </>
  );
};

export default Laboral;
