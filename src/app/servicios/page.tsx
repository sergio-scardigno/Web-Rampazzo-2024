"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FeedbackForm from "../components/FeedbackForm";

import { FloatingWhatsApp } from 'react-floating-whatsapp';


import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconArrowLeft from "../../../public/icons/iconArrowLeft.svg";
import PicBankruptcy from "../../../public/pics/picBankruptcy.svg";

const bankruptcy = () => {
  return (
    <main>
      <div className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD] md:h-[10.74vh] h-[128px]"></div>
      <div className={` bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD]`}>
        <h1
          className={`mx-3 py-6 md:mx-[12.5vw] md:py-[5.55vh] text-[32px] leading-[32px] md:text-[7.4vh] md:leading-[7.4vh] font-bold text-[#1B1743]`}
        >
          Derecho Civil y de Familia
        </h1>
      </div>
      <section className="px-3 md:mx-[12.5vw] grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
        <div className="md:col-span-6">
          <Link
            href="/"
            className="flex gap-3 md:gap-[0.62vw] w-fit md:pt-[1.85vh] pt-6 pb-6 md:pb-[4.44vh]"
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
          <div className="absolute left-[-7.08vw] right-[-0.83vw]">
            {/* <Image
              src={PicBankruptcy}
              alt="Bunkruptcy"
              height={1000}
              className="md:h-[57.68vh] md:w-[32.29vw] object-contain"
            /> */}
          </div>
        </div>
        <div className={`md:col-span-4 ${montserrat.className}`}>
          <h1
            className={`md:pb-[2.59vh] pb-4 ${evolventa.className} md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] font-bold `}
          >
            Sucesiones
          </h1>
          <p className="md:pb-[5.55vh] pb-[60px] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
          Nuestro estudio brinda un servicio rápido y flexible para dar inicio al trámite sucesorio.
          Según su preferencia, podrá coordinar una entrevista personal con uno de nuestros abogados o ser asesorado telefónicamente sobre cualquier duda respecto al juicio sucesorio.
          Luego de interiorizarnos sobre las particularidades de su caso, le enviaremos un formulario con la documentación necesaria para dar comienzo al trámite.
          </p>
          <br className="hidden md:block" />
          

          <h1
            className={`md:pb-[2.59vh] pb-4 ${evolventa.className} md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] font-bold `}
          >
            Divorcios
          </h1>
          <p className="md:pb-[5.55vh] pb-[60px] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
          Cuando llega la disolución del vinculo conyugal entra en juego los divorcios. El más común y más aplicado con la nueva legislación es el divorcio express.

          Es un tipo de divorcio previsto por el código civil argentino que permite divorciarse bastando solo la voluntad de uno de los cónyuges, sin tener nada que demostrar y tampoco requiriendo tiempo mínimo de sociedad conyugal.

          Requisitos

          DNI de ambos esposos
          Libreta, acta o certificado de Matrimonio
          Partida de nacimiento y DNI de los hijos matrimoniales si los hubiere
          Fecha y lugar de la celebración del matrimonio y ultimo domicilio conyugal donde convivieron.
          </p>
          <br className="hidden md:block" />


          <h1
            className={`md:pb-[2.59vh] pb-4 ${evolventa.className} md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] font-bold `}
          >
            Defensas Penales

          </h1>
          <p className="md:pb-[5.55vh] pb-[60px] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
          Ante acusaciones o imputaciones de delitos o ante la eventualidad de convertirse en víctima, no hay tiempo que perder. Una acción inmediata para proteger uno de los derechos más importantes prima, el derecho a la libertar.

          Mis colaboradores penalistas trabajan en equipo para representar los intereses de nuestros clientes.

          Logramos en la mayoría de los casos la rápida libertad de nuestros representados, estamos al momento de la detención y durante todo el proceso, con asistencia y asesoramiento familiar.
          </p>
          <br className="hidden md:block" />


          <h1
            className={`md:pb-[2.59vh] pb-4 ${evolventa.className} md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] font-bold `}
          >
            Asesoramiento a empresas

          </h1>
          <p className="md:pb-[5.55vh] pb-[60px] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
          Mis colaboradores asesoran a empresas en orden legal en todas las etapas, para que pueda evitar contrariedades y usted solo se centre en gestionarla, procurando que su negocio prospere.

          Ya sea cuando la empresa comienza, vendiéndola o retirándose, necesita asesoramiento legal previniendo futuras contrariedades.

          Mi equipo trabaja de forma directa, con respuestas rápidas y con un enfoque personalizado, para garantizar tus derechos y el de tu empresa.

          Manejamos todo tipo de cuestiones y casos, tanto extraordinarios o complejos.
          </p>
          <br className="hidden md:block" />


          <h1
            className={`md:pb-[2.59vh] pb-4 ${evolventa.className} md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] font-bold `}
          >
            Accidente de transito

          </h1>
          <p className="md:pb-[5.55vh] pb-[60px] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
          Los accidentes de transito no siembre ocurren arriba de un auto. Pueden ocurrir yendo en caminando, en bicicleta, moto, taxi o colectivo. Si sufrimos lesiones físicas o en nuestro patrimonio como consecuencia de un accidente de tránsito. Tenemos derechos a ser indemnizados.

          Mis colaboradores se ocuparán de la defensa de tus derechos y de tus intereses frente al o los responsables del mismo, como también de la aseguradora.

          Contamos con consultores médicos, psicológicos e ingenieros mecánicos, para abordar de punto de vista profesional, todos y cada uno de los daños sufridos en el siniestro.

          Te representaremos en todas las etapas del proceso, actuando de acuerdo a tus intereses.

          Accidente de transito
          Accidente en trasporte publico
          Accidente en motocicleta
          Accidentes como peatón</p>
          <br className="hidden md:block" />






          {/* <div className="md:pb-[4.44vh] pb-10">
            <p className="md:pb-[1.85vh] pb-4 md:text-[1.66vh] text-base leading-5 md:leading-[2.22vh] font-bold">
              Имею опыт сопровождения процедур банкротства со стороны
              <br className="hidden md:block" /> арбитражного управляющего и
              представляю интересы:
            </p>
            <ul className=" text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw]  marker:text-[#D8CACF] font-medium">
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                При оспаривании сомнительных сделок
              </li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                При привлечении контролирующих лиц к субсидиарной
                ответственности
                <br className="hidden md:block" /> и убыткам
              </li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                При проверке обоснованности требований кредиторов
              </li>
              <li className="md:pl-[0.62vw] pl-1">
                Консультирую по иным вопросам
              </li>
            </ul>
          </div>
          <div className="md:pb-[4.44vh] pb-10">
            <p className="md:pb-[1.85vh] pb-4 md:text-[1.66vh] text-base leading-5 md:leading-[2.22vh] font-bold">
              Представляю интересы кредиторов:
            </p>
            <ul className="md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] ml-[16px] marker:text-[#D8CACF] font-medium">
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                Инициирование дела о банкротстве
              </li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                Рассмотрение вопросов включения требований в реестр и
                оспаривания
                <br className="hidden md:block" /> требований недобросовестных
                кредиторов
              </li>
              <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                Участие в собрании кредиторов
              </li>
              <li className="md:pl-[0.62vw] pl-1">
                Противодействие недобросовестным должникам
              </li>
            </ul>
          </div>
          <p className="md:pb-[4.44vh] pb-10 md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium">
            Консультирую руководителей и собственников бизнеса при банкротстве
            компаний, представляю <br className="hidden md:block" /> интересы
            при оспаривании сделок и привлечении к субсидиарной ответственности,
            а также оказываю <br className="hidden md:block" />
            правовую поддержку при защите от недобросовестных действий
            кредиторов и арбитражных <br className="hidden md:block" />
            управляющих
          </p>
          <div
            className={`hidden md:block h-fit md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5]  rounded-md shadow-md`}
          >
            <div className="md:pb-[1.11vh] flex items-center text-[#962C52]">
              <p className="md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                от 20 000 ₽&nbsp;
              </p>
              <p className="md:text-[1.29vh] md:leading-[1.85vh] font-normal">
                / в месяц
              </p>
            </div>
            <p className="md:text-[1.29vh] md:leading-[1.85vh] font-normal">
              Стоимость определяется индивидуально в каждой ситуации
            </p>
          </div> */}
        </div>
      </section>
      <div
        className={` block md:hidden h-fit mb-[60px] bg-[#F8F6F7] border-[1px] border-[#F0F0F5]  rounded-md shadow-md ${montserrat.className}`}
      >
        {/* <div className="py-4 px-4">
          <div className=" flex items-center text-[#962C52] pb-2">
            <p className="text-base leading-[22px] font-bold">
              от 20 000 ₽&nbsp;
            </p>
            <p className=" text-xs leading-5 font-normal">/ в месяц</p>
          </div>
          <p className=" text-sm leading-5 font-normal">
            Стоимость определяется индивидуально в каждой ситуации
          </p>
        </div> */}
      </div>
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

export default bankruptcy;
