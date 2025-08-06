"use client";

import React, { RefObject, createRef, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { POST } from "../api/send/route";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconTelegram from "../../../public/icons/iconTelegram.svg";
import IconWhatsapp from "../../../public/icons/iconWhatsapp.svg";
import IconPin from "../../../public/icons/iconPin.svg";

import PicFeedback from "../../../public/pics/footer-inicio.jpg";
import PicFeedbackClean from "../../../public/pics/footer-inicio.jpg";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const feedbackRef: RefObject<HTMLDivElement> = createRef();

const socialArray = [
  // { src: IconTelegram, alt: "Telegram", link: "https://t.me/olga_drapeko" },
  { src: IconWhatsapp, alt: "Whatsapp", link: "https://api.whatsapp.com/send?phone=+5491121914149&text=Contacto%20WEB%20-%20Estoy%20Interesado%20en%20las%20jubilaciones%20y%20reajustes" },
];

type FormInput = {
  name: string;
  phone: string;
  consultType: 'general' | 'asesoramiento' | 'jubilacion' | 'otro';
  consulta?: string;
};

const FeedbackForm = () => {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    watch,
  } = useForm<FormInput>({
    defaultValues: {
      phone: '',
      consultType: 'general',
    },
  });

  const selectedConsultType = watch('consultType');

  async function onSubmit(formData: FormInput) {
    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(() => {
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
    });

    reset({
      name: '',
      phone: '',
      consultType: 'general',
      consulta: '',
    });
  }

  return (
    <section id="feedback" ref={feedbackRef}>
      <div className="md:px-[12.5vw] md:py-[11.11vh] grid grid-cols-3 md:grid-cols-6 md:gap-x-[1.25vw]">
        <form
          id="username"
          onSubmit={handleSubmit(onSubmit)}
          className={`col-span-3 md:col-span-2 bg-black md:py-[2.22vh] py-6 md:px-[1.25vw] px-4 md:rounded-md text-white ${montserrat.className}`}
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
          <div className="grid gap-y-4 md:pb-[1.11vh] pb-3">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                {...register('name', { required: 'Este campo es obligatorio' })}
                placeholder="Tu nombre"
                className="bg-zinc-900 text-white"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'El teléfono es obligatorio' }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    id="phone"
                    defaultCountry="AR"
                    international
                    placeholder="Tu teléfono"
                    className="phone-input-custom"
                  />
                )}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="consultType">Tipo de consulta</Label>
              <Controller
                control={control}
                name="consultType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="consultType" className="bg-zinc-900 text-white">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="general" className="text-white">Consulta general</SelectItem>
                      <SelectItem value="asesoramiento" className="text-white">Asesoramiento</SelectItem>
                      <SelectItem value="jubilacion" className="text-white">Jubilación</SelectItem>
                      <SelectItem value="otro" className="text-white">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {selectedConsultType === 'otro' && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="consulta">Tu consulta</Label>
                <Input
                  id="consulta"
                  {...register('consulta')}
                  placeholder="Escribe tu consulta aquí..."
                  className="bg-zinc-900 text-white"
                />
              </div>
            )}
          </div>

          <p className="text-xs md:text-[1.2vh] leading-5 md:leading-[1.9vh] font-medium text-[#969696] md:pb-[2.22vh] pb-4">
            Al hacer clic en el botón &quot;Enviar&quot;, doy mi consentimiento para <span> <Link href="/privacy_policy" className=" underline">procesamiento de datos personales</Link></span> &nbsp;datos
          </p>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-white text-[#1B1743] hover:bg-gray-200"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
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
