"use client";

import React, { RefObject, createRef, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { POST } from "../api/send/route";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconTelegram from "../../../public/icons/iconTelegram.svg";
import IconWhatsapp from "../../../public/icons/iconWhatsapp.svg";
import IconPin from "../../../public/icons/iconPin.svg";


import PicFeedback from "../../../public/pics/footer-inicio.jpg";
import PicFeedbackClean from "../../../public/pics/footer-inicio.jpg";

import Link from "next/link";

export const feedbackRef: RefObject<HTMLDivElement> = createRef();

const socialArray = [
  // { src: IconTelegram, alt: "Telegram", link: "https://t.me/olga_drapeko" },
  { src: IconWhatsapp, alt: "Whatsapp", link: "https://api.whatsapp.com/send?phone=+5491121914149&text=Contacto%20WEB%20-%20Estoy%20Interesado%20en%20las%20jubilaciones%20y%20reajustes" },
];
type FormInput = {
  name: string;
  phone: string;
};

const FeedbackForm = () => {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormInput>();
  async function onSubmit(formData: FormInput) {
    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
      }),
    }).then(() => {
      // Toast notification
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
    });

    reset();
  }

  return (
    <section id="feedback" ref={feedbackRef}>
      <div className="md:px-[12.5vw] md:py-[11.11vh] grid grid-cols-3 md:grid-cols-6 md:gap-x-[1.25vw]">
        <form
          id="username"
          onSubmit={handleSubmit(onSubmit)}
          className={`col-span-3 md:col-span-2 bg-[black] md:py-[2.22vh] py-6 md:px-[1.25vw] px-4 md:rounded-md text-white ${montserrat.className}`}
        >
          <div className="md:pb-[4.44vh] pb-6">
            <h1
              className={`md:text-[3.33vh] text-[24px] leading-[26px] md:leading-[3.51vh] pb-3 md:pb-[1.11vh] font-bold ${evolventa.className}`}
            >
              Formulario de contacto
            </h1>
            <p
              className={`md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] font-medium`}
            >
              Te llamaré lo antes posible y responderé todas tus preguntas detalladamente.
            </p>
          </div>
          <div className="grid md:gap-y-[0.74vh] gap-y-2 md:pb-[1.11vh] pb-3">
            <label
              htmlFor="usernameInput"
              className="md:text-[1.29vh] text-[12px] leading-5 md:leading-[1.85vh] font-normal"
            >
              Nombre
            </label>
            <input
              id="usernameInput"
              type="text"
              placeholder="Su nombre"
              required
              className="px-5 py-3 text-sm leading-5 md:px-[1.04vw] md:py-[1.11vh] rounded-md text-[#1B1743] text-[1.48vh] md:placeholder:text-[1.48vh] placeholder:leading-[2.22vh] placeholder:font-medium placeholder:text-[#D3D3E3]"
              {...register("name")}
            />
          </div>
          <div className="grid md:gap-y-[0.74vh] gap-y-2 md:pb-[2.59vh] pb-7">
            <label
              htmlFor="usernphoneInput"
              className="md:text-[1.29vh] text-[12px] leading-5 md:leading-[1.85vh] font-normal"
            >
              Número
            </label>
            <input
              id="usernphoneInput"
              type="text"
              placeholder="+54 999 9999"
              required
              className="px-5 py-3 text-sm leading-5 md:px-[1.04vw] md:py-[1.11vh] rounded-md text-[#1B1743] text-[1.48vh] md:placeholder:text-[1.48vh] placeholder:leading-[2.22vh] placeholder:font-medium placeholder:text-[#D3D3E3]"
              {...register("phone")}
            />
          </div>
          <p className="text-xs leading-5 font-medium pb-3 md:pb-[1.11vh] md:text-[1.29vh] md:leading-[1.85vh] md:font-normal">
            Al hacer clic en el botón &quot;Enviar&quot;, doy mi consentimiento para <span> <Link href="/privacy_policy" className=" underline">procesamiento de datos personales</Link></span> &nbsp;datos
          </p>

          <button
            disabled={isSubmitting}
            className="bg-white text-[#1B1743] md:py-[1.48vh] py-4 md:px-[1.25vw] px-6 rounded-md md:text-[1.48vh] text-base leading-6 md:leading-[2.22vh] font-semibold hover:shadow-md active:scale-[97%] transition-all"
          >
            Enviar
          </button>
        </form>
        <div
          className={`hidden md:block px-3 md:px-0 pt-[48px] md:pt-0 pb-[60px] md:pb-0 col-span-3 md:col-span-2 ${
            montserrat.className
          } ${"bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD] md:from-transparent md:to-transparent lg:from-transparent lg:to-transparent"}`}
        >
          <div className="md:text-[1.48vh] text-base leading-6 md:leading-[2.22vh] pb-5 md:pb-[1.85vh] font-semibold">
            <a href="mailto:estudiorampazzof@gmail.com">estudiorampazzof@gmail.com</a>
          </div>
          {/* <div
            className={`text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] pb-5 md:pb-[1.85vh] font-bold ${evolventa.className}`}
          >
            <a href="tel:+541147091266">+54 11 4709-1266</a>
          </div> */}

          <div className="flex md:gap-x-[0.41vw] gap-x-2 items-center pb-7 md:pb-[5.55vh]">
            {socialArray.map((item, index) => (
              <Link
                href={item.link}
                target="_blank"
                key={index}
                className="bg-[#F8F6F7] h-fit rounded-md"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={24}
                  className="mx-3 md:mx-[0.62vw] my-3 md:my-[1.11vh] md:h-[2.22vh] md:w-[1.25vw] object-contain"
                />
              </Link>
            ))}
          </div>
          <div className="flex md:gap-x-[0.62vw] gap-x-[12px] items-start">
            <Image
              src={IconPin}
              alt={`IconPin`}
              width={24}
              className="md:h-[2.22vh] md:w-[1.25vw] object-contain"
            />
            <div className="">
              <p className="pb-3 md:pb-[1.11vh] text-base md:text-[1.66vh] leading-[22px] md:leading-[2.22vh] font-bold">
                Rampazzo
              </p>
              <p className="text-base md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
              Trabajo de forma remota en todo Argentina.
              </p>
            </div>
          </div>
        </div>
        {pathname == "/" ? (
          <div className="hidden md:block col-span-2 relative">
            <div className="z-[22] absolute md:top-[-9.25vh] py-4">
              <Image
                src={PicFeedback}
                alt="feedback full portrait"
                width={1000}
                className="md:w-[24.16] md:h-[63.05vh] object-cover rounded-md"
              />
            </div>
            <div className="bg-[#D8CACF] absolute top-[-7.2vh] left-[1vw] md:w-[23.66vw] md:h-[63.05vh] rounded-md "></div>
          </div>
        ) : (
          <div className="hidden md:block col-span-2 relative">
            <div className="absolute z-[22] md:top-[-6.01vh] md:left-[3.6vw] py-4">
              <Image
                src={PicFeedbackClean}
                alt="feedback clean portrait"
                height={1000}
                className="md:w-[17.96vw] md:h-[46.85vh] object-contain "
              />
            </div>
            <div className="bg-gradient-to-r from-[#EBECF1] to-[#EBECF1] md:h-[40.83vh] md:w-[24.16vw] rounded-md absolute z-[21]"></div>
            <div className="bg-[#D8CACF] md:h-[40.83vh] md:w-[24.16vw] rounded-md absolute top-[1.85vh] left-[1.04vw] z-[20]"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackForm;
