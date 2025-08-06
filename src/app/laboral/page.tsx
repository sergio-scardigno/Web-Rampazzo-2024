"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import FeedbackForm from "../components/FeedbackForm";

import { FloatingWhatsApp } from 'react-floating-whatsapp';


import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconArrowLeft from "../../../public/icons/iconArrowLeft.svg";
import PicSupport from "../../../public/pics/picSupport.svg";

const support = () => {
  return (
    <main className={``}>
      <div className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD] md:h-[10.74vh] h-[128px]"></div>
      <div className={` bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD]`}>
        <h1
          className={`mx-4 md:mx-[12.5vw] py-6 md:py-[5.55vh] md:text-[7.4vh] text-[32px] leading-8 md:leading-[7.4vh] font-bold text-[#1B1743]`}
        >
          Derecho <br className="hidden md:block" /> Laboral
        </h1>
      </div>
      <section className=" md:mx-[12.5vw] grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="mx-4 md:mx-0 md:col-span-6">
          <Link
            href="/"
            className="flex md:gap-[0.62vw] gap-3 w-fit md:pt-[1.85vh] pt-6 pb-6 md:pb-[4.44vh]"
          >
            <Image
              src={IconArrowLeft}
              alt={`IconArrowLeft`}
              width={24}
              className="md:h-[2.22vh] md:w-[1.25vw]"
            />
            <p
              className={`${montserrat.className} md:text-[1.48vh] text-base leading-6 md:leading-[2.22vh] text-[#807D9B] font-semibold`}
            >
              volver
            </p>
          </Link>
        </div>
        <div className="md:col-span-2 md:relative hidden md:block">
          <div className=" absolute left-[-8.12vw]">
            {/* <Image
              src={PicSupport}
              alt="Bunkruptcy"
              height={1000}
              className="md:h-[42.87vh] md:w-[32.29vw] object-cover"
            /> */}
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD]">
  <div className="md:h-[10.74vh] h-[128px]"></div> 
  <div className="px-3 md:mx-[12.5vw]">
    <h1 className={`py-6 md:py-[5.55vh] text-[32px] md:text-[7.4vh] font-bold text-[#1B1743] ${montserrat.className}`}>
      Derecho Laboral
    </h1>
    <div className="grid md:grid-cols-6 gap-x-[1.25vw] text-[#1B1743]">
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
        
      </div>
    </div>
  </div>
</div>

      </section>
      <FeedbackForm />

      <FloatingWhatsApp
      phoneNumber="+5491121914149" // Número de teléfono en formato internacional
      accountName="Estudio Rampazzo" // Nombre de usuario de la cuenta
      avatar={"/pics/logo.jpg"} // Opcional: URL o path de la imagen del avatar
      statusMessage="Típicamente responde en 1 hora" // Opcional: Mensaje de estado
      chatMessage="¡Hola! 👋 ¿En qué podemos ayudarte hoy?" // Opcional: Mensaje inicial en el chat
      darkMode={false} // Opcional: Habilita el modo oscuro
      allowClickAway={false} // Opcional: Cierra el chat al hacer clic fuera
      allowEsc={false} // Opcional: Cierra el chat al presionar Esc
      notification={true} // Opcional: Habilita notificaciones
      notificationDelay={60} // Opcional: Retraso entre notificaciones en segundos
      notificationSound={false} // Opcional: Habilita sonido de notificaciones
      />
    </main>
  );
};

export default support;
