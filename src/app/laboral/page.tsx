import Link from "next/link";
import Image from "next/image";
import React from "react";
import FeedbackForm from "../components/FeedbackForm";

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
            <Image
              src={PicSupport}
              alt="Bunkruptcy"
              height={1000}
              className="md:h-[42.87vh] md:w-[32.29vw] object-cover"
            />
          </div>
        </div>
        <div className={`md:col-span-4 ${montserrat.className}`}>
          <div className="md:pb-[7.4vh] pb-10">
            <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh]  ${evolventa.className} md:text-[3.33vh]  md:leading-[3.51vh] font-bold `}
            >
              Accidentes laborales
            </h1>
            <p className="mx-4 md:mx-0 text-sm leading-4 md:pb-[7.4vh] pb-[60px] md:text-[1.48vh]  md:leading-[2.22vh] font-medium">
            Están considerados accidentes laborales a cualquier hecho inesperado y violento que se genere en el puesto de trabajo o en el trayecto del domicilio del trabajador a su lugar de trabajo.  Se debe comunicar el suceso a la aseguradora de riesgo del trabajo A.R.T. contratada por el empleador, para que tome conocimiento del hecho. Inmediatamente otorgue las prestaciones médicas, pecuniarias, necesarias y correspondientes.
            Cuando el ART da el alta, se debe evaluar las secuelas físicas o psicologías, para fijar un porcentaje de incapacidad del trabajador o trabajadora y según lo que se determine abonar la indemnización correspondiente.
            Algunas veces las ART dan el alta médica, sin establecer una incapacidad laboral, otorgando un porcentaje mucho menor al real. Ante esta situación mis colaboradores inician un reclamo laboral a la ART, para lograr que reconozcan la incapacidad correspondiente y el cobro de la indemnización              
            
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            <br className="hidden md:block" />

            <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh]  ${evolventa.className} md:text-[3.33vh]  md:leading-[3.51vh] font-bold `}
            >
              Despidos
            </h1>

            Es una situación traumática que sufren los trabajadores y trabajadoras, cuando el empleador los desvincula de su puesto laboral. Encuadrándolo en un despido laboral.

            Me echaron del trabajo ¿qué hago? Quieren que firme y envíe un telegrama, que tengo ¿qué hacer antes de enviar el telegrama?

            Son preguntas que me hacen a diario y brindo información legal necesaria en cada caso.

            Colaboran en mi estudio, abogados especializados en despido laboral.

            Te invito a que te pongas en contacto, tomo casos de TODO EL PAIS.

            Tenes derechos ante un despido laboral en “blanco” o si trabajabas en “negro”. Te responderé rápidamente una respuesta que se ajusta a tu caso en particular.

            Tus derechos son importantes, tenes que conocerlos y hacerlos valer.

            <br className="hidden md:block" />
            <br className="hidden md:block" />
            <br className="hidden md:block" />

            <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh]  ${evolventa.className} md:text-[3.33vh]  md:leading-[3.51vh] font-bold `}
            >
              Trabajo en negro
            </h1>

            Existen leyes que amparan y protegen a los trabajadores que se encuentra en negro o en la clandestinidad.

            La ley Nacional de Empleo la 24.013 y la ley 25.323.

            Ambas leyes protegen y crean un marco indemnizatorio para los trabajadores y trabajadoras que acrediten en un proceso legal haber presentado tareas en esta situación.

            Para poder reclamar en base a estas disposiciones, es necesario enviar una serie de telegramas efectuando una serie de denuncias y aclaraciones.

            Mis colaboradores están preparados y listos para llevar adelante este tipo de reclamos.

            Este tipo de situaciones de indemnización por trabajo en “negro” o clandestino, suelen agregar a las que corresponde a cualquier trabajador ordinario, en algunos casos las sumas adeudadas suelen ser de hasta tres veces mayor.

            Es muy importante aclarar, que cualquier despido laboral. Debe asesorarte extrajudicial o judicialmente un abogado especialista en despidos.

            Recibirás el monto indemnizatorio que te corresponde, NO FIRMES acuerdos propuestos por el empleador sin que un abogado asesor te acompañe o patrocine en el proceso.

            <br className="hidden md:block" />
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            
             <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh]  ${evolventa.className} md:text-[3.33vh]  md:leading-[3.51vh] font-bold `}
            >
              Enfermedades laborales
            </h1>
            La enfermedad laboral sucede cuando el trabajador contrae una enfermedad a causa de su lugar de trabajo o por el tipo de trabajo que desarrolla.

            Existen muchas enfermedades profesionales que se identifican, en cuadros clínicos y están en una lista.

            Todas las enfermedades que contrae el trabajador por exposición o por las actividades que realiza se encuentran en esta lista.

            Los factores presentes en el lugar de trabajo, que pueden afectar a todo ser humano, como la temperatura, la humedad, iluminación, ventilación, hasta la presencia de ruidos, sustancias químicas, cargas pesadas entre muchas otras.

            Si la enfermedad que contra el trabajador no se encuentra en el listado y se sospecha que puede ser producida por el puesto de trabajo, se pueden iniciar acciones legales a la ART.

            En el caso que la aseguradora desconozca o rechace la denuncia, se puede iniciar un juicio laboral a la ART para que reconozcan la enfermedad laboral y que el trabajador pueda cobrar la indemnización correspondiente.

            </p>
            
            
            
            
            
            
            
            
            {/* <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh] ${evolventa.className} md:text-[3.33vh] md:leading-[3.51vh] font-bold `}
            >
              Досудебное
              <br className="hidden md:block"/> урегулирование споров
            </h1>
            <p className="mx-4 md:mx-0 text-sm leading-4 pb-10 md:pb-[5.55vh] md:text-[1.48vh] md:leading-[2.22vh] font-medium">
              В некоторых случаях достичь компромисса в споре можно во
              внесудебном
              <br className="hidden md:block"/> порядке. Имею успешный опыт урегулирования споров и решения
              юридических
              <br className="hidden md:block"/> вопросов во внесудебных процедурах.
            </p> */}
            {/* <div className="mx-4 md:mx-0 pb-10 md:pb-[4.44vh] ">
              <p className=" text-base leading-[22px] pb-4 md:pb-[1.85vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Услуги
              </p>
              <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Выработка стратегии для разрешения конфликтной ситуации
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Переговоры с оппонентом, в том числе в рамках процедуры
                  медиации,
                  <br className="hidden md:block"/> составление претензии или ответа на претензию
                </li>
                <li className="md:pl-[0.62vw] pl-1">
                  Юридическое оформление договоренностей
                </li>
              </ul>
            </div> */}
            {/* <div
              className={`h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5]  rounded-md shadow-md`}
            >
              <div className="pb-2 md:pb-[1.11vh] flex items-center text-[#962C52]">
                <p className="text-base leading-[22px] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                  от 5 000 ₽
                </p>
              </div>
              <p className="text-sm leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-medium md:font-normal">
                Стоимость определяется индивидуально в каждой ситуации
              </p>
            </div> */}
          </div>
          {/* <div className="pb-[60px] md:pb-0">
            <h1
              className={`mx-4 md:mx-0 text-2xl leading-[26px] pb-4 md:pb-[1.85vh] ${evolventa.className} md:text-[3.33vh] md:leading-[3.51vh] font-bold `}
            >
              Судебная защита
              <br className="hidden md:block"/> и представительство
            </h1>
            <p className="mx-4 md:mx-0 text-sm leading-4 pb-10 md:pb-[5.55vh] md:text-[1.48vh] md:leading-[2.22vh] font-medium">
              Представляю интересы клиентов в судах и административных органах.
              Имею <br className="hidden md:block"/> постоянный опыт представительства по разным правовым
              вопросам
            </p>
            <div className="mx-4 md:mx-0 pb-6 md:pb-[4.44vh]">
              <p className="text-base leading-[22px] pb-4 md:pb-[1.85vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Услуги
              </p>
              <ul className="text-sm leading-5 ml-[16px] md:text-[1.48vh] md:leading-[2.22vh] list-disc box-content md:ml-[1.04vw] marker:text-[#D8CACF] font-medium">
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Оценка перспектив спора, консультирование
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Сбор доказательств
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Подготовка иных необходимых процессуальных документов
                  <br /> при рассмотрении дела в суде и иных органах
                </li>
                <li className="md:pb-[1.11vh] pb-2 md:pl-[0.62vw] pl-1">
                  Выработка правовой позиции
                </li>
                <li className="md:pl-[0.62vw] pl-1">
                  Представление интересов в судах и иных органах
                </li>
              </ul>
            </div>
            <p className="mx-4 md:mx-0 text-sm leading-4 pb-10 md:pb-[4.44vh] md:text-[1.48vh] md:leading-[2.22vh] font-medium">
              Занимаюсь также юридическим сопровождением
              <br className="hidden md:block"/> на стадии исполнения судебных актов
            </p>
            <div
              className={`h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5]  rounded-md shadow-md`}
            >
              <div className="pb-2 md:pb-[1.11vh] flex items-center text-[#962C52]">
                <p className="text-base leading-[22px] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                  от 10 000 ₽
                </p>
              </div>
              <p className="text-sm leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-medium md:font-normal">
                Стоимость определяется индивидуально в каждой ситуации
              </p>
            </div>
          </div> */}
        </div>
      </section>
      <FeedbackForm />
    </main>
  );
};

export default support;
