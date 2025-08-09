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
  consultType: 'general' | 'asesoramiento' | 'jubilacion' | 'despidos' | 'accidentes-laborales' | 'accidentes-transito' | 'defensas-penales' | 'ciudadania' | 'sucesiones' | 'divorcios' | 'asesoramiento-empresas' | 'trabajo-negro' | 'enfermedades-laborales' | 'mediacion' | 'personas-juridicas' | 'otro';
  consulta?: string;
};

interface FeedbackFormProps {
  defaultService?: FormInput['consultType'];
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ defaultService = 'general' }) => {
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
      consultType: defaultService,
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
      consultType: defaultService,
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
                      <SelectItem value="despidos" className="text-white">Despidos</SelectItem>
                      <SelectItem value="accidentes-laborales" className="text-white">Accidentes laborales</SelectItem>
                      <SelectItem value="accidentes-transito" className="text-white">Accidentes de tránsito</SelectItem>
                      <SelectItem value="defensas-penales" className="text-white">Defensas penales</SelectItem>
                      <SelectItem value="ciudadania" className="text-white">Ciudadanía argentina</SelectItem>
                      <SelectItem value="sucesiones" className="text-white">Sucesiones</SelectItem>
                      <SelectItem value="divorcios" className="text-white">Divorcios</SelectItem>
                      <SelectItem value="asesoramiento-empresas" className="text-white">Asesoramiento empresarial</SelectItem>
                      <SelectItem value="trabajo-negro" className="text-white">Trabajo en negro</SelectItem>
                      <SelectItem value="enfermedades-laborales" className="text-white">Enfermedades laborales</SelectItem>
                      <SelectItem value="mediacion" className="text-white">Mediación</SelectItem>
                      <SelectItem value="personas-juridicas" className="text-white">Personas jurídicas</SelectItem>
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
          className={`hidden md:block px-6 md:px-8 pt-[48px] md:pt-0 pb-[60px] md:pb-0 col-span-3 md:col-span-2 ${
            montserrat.className
          } bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] rounded-lg shadow-sm border border-gray-100`}
        >
                     {/* Email Section */}
           <div className="mb-8 md:mb-[3.7vh]">
             <h3 className={`text-lg md:text-[1.85vh] font-semibold text-[#1B1743] mb-3 md:mb-[1.11vh] ${evolventa.className}`}>
               Contacto Directo
             </h3>
             <div className="flex items-center p-3 md:p-[1.11vh] bg-white rounded-lg border border-gray-200 hover:border-[#962C52] transition-colors duration-300">
               <Link
                 href="mailto:estudiorampazzofernando@gmail.com"
                 className="flex items-center gap-3 md:gap-[0.83vw] w-full"
               >
                 <div className="bg-[#962C52] p-2 md:p-[0.74vh] rounded-full">
                   <svg 
                     width="20" 
                     height="20" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor" 
                     strokeWidth="2" 
                     strokeLinecap="round" 
                     strokeLinejoin="round"
                     className="text-white md:h-[1.66vh] md:w-[0.93vw]"
                   >
                     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                     <polyline points="22,6 12,13 2,6"/>
                   </svg>
                 </div>
                 <span className="text-[#1B1743] font-medium">Enviar email</span>
               </Link>
             </div>
           </div>

          {/* WhatsApp Section */}
          <div className="mb-8 md:mb-[3.7vh]">
            <h3 className={`text-lg md:text-[1.85vh] font-semibold text-[#1B1743] mb-3 md:mb-[1.11vh] ${evolventa.className}`}>
              WhatsApp
            </h3>
            <div className="flex items-center p-3 md:p-[1.11vh] bg-white rounded-lg border border-gray-200 hover:border-[#962C52] transition-colors duration-300">
              {socialArray.map((item, index) => (
                <Link
                  href={item.link}
                  target="_blank"
                  key={index}
                  className="flex items-center gap-3 md:gap-[0.83vw] w-full"
                >
                  <div className="bg-[#25D366] p-2 md:p-[0.74vh] rounded-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={20}
                      className="md:h-[1.66vh] md:w-[0.93vw] object-contain"
                    />
                  </div>
                  <span className="text-[#1B1743] font-medium">Chatear por WhatsApp</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8 md:mb-[3.7vh]">
            <h3 className={`text-lg md:text-[1.85vh] font-semibold text-[#1B1743] mb-3 md:mb-[1.11vh] ${evolventa.className}`}>
              Ubicación
            </h3>
            <div className="flex items-start gap-3 md:gap-[0.83vw] p-3 md:p-[1.11vh] bg-white rounded-lg border border-gray-200">
              <div className="bg-[#962C52] p-2 md:p-[0.74vh] rounded-full mt-1">
                <Image
                  src={IconPin}
                  alt="IconPin"
                  width={16}
                  className="md:h-[1.29vh] md:w-[0.74vw] object-contain"
                />
              </div>
              <div className="flex-1">
                <p className={`text-[#1B1743] font-bold text-base md:text-[1.66vh] leading-[22px] md:leading-[2.22vh] mb-1 md:mb-[0.37vh] ${evolventa.className}`}>
                  Estudio Rampazzo
                </p>
                <p className="text-[#6B7280] text-sm md:text-[1.29vh] leading-5 md:leading-[1.85vh] font-medium">
                  Trabajo de forma remota en todo Argentina
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] rounded-lg p-4 md:p-[1.48vh] text-white">
            <h4 className={`text-base md:text-[1.48vh] font-semibold mb-2 md:mb-[0.74vh] ${evolventa.className}`}>
              ¿Por qué elegirnos?
            </h4>
            <ul className="text-sm md:text-[1.29vh] space-y-1 md:space-y-[0.37vh]">
              <li className="flex items-center gap-2">
                <span className="text-[#FFD700]">✓</span>
                Más de 15 años de experiencia
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FFD700]">✓</span>
                Atención personalizada
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FFD700]">✓</span>
                Compromiso total
              </li>
            </ul>
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
