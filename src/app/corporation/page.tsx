"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";
import { getClientTrackingData } from "@/lib/tracking";

type FormInput = {
  name: string;
  phone: string;
};

const Corporation = () => {
  const [isModal, setIsModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormInput>();

  async function onSubmit(formData: FormInput) {
    // Obtener información de tracking del cliente
    const trackingData = getClientTrackingData();
    
    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        consultType: 'asesoramiento-empresas',
        tracking: trackingData,
      }),
    }).then(() => {
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
      setIsModal(false);
    });

    reset();
  }

  return (
    <>
      {/* Modal */}
      {isModal && (
        <div className="fixed z-[33]">
          <div className="relative">
            <div
              className="bg-[#1B1743] h-screen w-screen opacity-35 absolute z-[33]"
              onClick={() => setIsModal(false)}
            ></div>
            <div className="absolute top-[128px] md:top-[30.53vh] md:left-[36.91vw] z-[44] w-[100vw] md:w-[24.16vw]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`px-4 py-6 bg-[#962C52] md:py-[2.22vh] md:px-[1.25vw] md:rounded-md text-white ${montserrat.className}`}
              >
                <div className="pb-6 md:pb-[4.44vh]">
                  <h1
                    className={`text-2xl leading-[26px] pb-3 md:text-[3.33vh] md:leading-[3.51vh] md:pb-[1.11vh] font-bold ${evolventa.className}`}
                  >
                    Contáctame
                  </h1>
                  <p
                    className={`text-sm leading-5 md:text-[1.48vh] md:leading-[2.22vh] font-medium`}
                  >
                    Te llamaré lo antes posible y responderé todas tus preguntas detalladamente
                  </p>
                </div>
                <div className="grid gap-y-2 pb-3 md:gap-y-[0.74vh] md:pb-[1.11vh]">
                  <label
                    htmlFor="usernameInput"
                    className="text-xs leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-normal"
                  >
                    Nombre
                  </label>
                  <input
                    id="usernameInput"
                    type="text"
                    placeholder="Tu nombre"
                    required
                    className="py-3 px-5 md:px-[1.04vw] md:py-[1.11vh] rounded-md text-[#1B1743] md:text-[1.48vh] md:placeholder:text-[1.48vh] placeholder:leading-[2.22vh] placeholder:font-medium placeholder:text-[#D3D3E3]"
                    {...register("name")}
                  />
                </div>
                <div className="grid gap-y-2 pb-7 md:gap-y-[0.74vh] md:pb-[2.59vh]">
                  <label
                    htmlFor="usernphoneInput"
                    className="text-xs leading-5 md:text-[1.29vh] md:leading-[1.85vh] font-normal"
                  >
                    Teléfono
                  </label>
                  <input
                    id="usernphoneInput"
                    type="text"
                    placeholder="+54 9 11 1234-5678"
                    required
                    className="py-3 px-5 md:px-[1.04vw] md:py-[1.11vh] rounded-md text-[#1B1743] md:text-[1.48vh] md:placeholder:text-[1.48vh] placeholder:leading-[2.22vh] placeholder:font-medium placeholder:text-[#D3D3E3]"
                    {...register("phone")}
                  />
                </div>
                <p className="text-xs leading-5 font-medium pb-3 md:pb-[1.11vh] md:text-[1.29vh] md:leading-[1.85vh] md:font-normal">
                  Al hacer clic en el botón &quot;Enviar&quot;, doy mi consentimiento para{" "}
                  <span>
                    <Link href="/privacy_policy" className="underline">
                      procesamiento de datos personales
                    </Link>
                  </span>
                </p>
                <button
                  disabled={isSubmitting}
                  className="py-3 px-6 text-base leading-6 bg-white text-[#1B1743] md:py-[1.48vh] md:px-[1.25vw] rounded-md md:text-[1.48vh] md:leading-[2.22vh] font-semibold hover:shadow-md active:scale-[97%] transition-all"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <PageLayout
      title="Personas Jurídicas"
        description="Servicios legales especializados para empresas y organizaciones"
        breadcrumbText="volver"
        breadcrumbLink="/"
      defaultService="personas-juridicas">
        <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
          <div className="md:col-span-6 md:pb-[5.55vh]">
            <h1
              className={`text-2xl leading-[26px] pb-4 ${evolventa.className} md:pb-[1.85vh] md:text-[3.33vh] md:leading-[3.51vh] font-bold`}
            >
              Elegir servicio
            </h1>
            <div className="flex pb-10 md:pb-0">
              <p className={`md:text-[1.48vh] md:leading-[2.22vh] font-medium text-sm leading-5`}>
                <span
                  className="text-[#962C52] underline cursor-pointer"
                  onClick={() => setIsModal(true)}
                >
                  Contáctame
                </span>
                , si tienes dificultades para elegir
              </p>
            </div>
          </div>
          
          <Link
            href="/outsourcing"
            className="mb-4 md:mb-0 md:col-span-3 shadow-md border-[0.09vh] hover:border-[#962C52] rounded-md"
          >
            <div className="py-[35px] md:py-[9.44vh] md:px-[1.25vw] text-center">
              <p className="text-base leading-[22px] pb-2 md:pb-[1.11vh] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Asesoramiento legal empresarial
              </p>
              <p className="text-xs leading-5 font-medium md:text-[1.29vh] md:leading-[1.85vh] md:font-normal">
                (Outsourcing legal)
              </p>
            </div>
          </Link>
          
          <Link
            href="/mediation"
            className="md:col-span-3 shadow-md border-[0.09vh] hover:border-[#962C52] rounded-md"
          >
            <div className="py-[60px] md:py-[10.92vh] md:px-[1.25vw] text-center">
              <p className="text-base leading-[22px] md:text-[1.66vh] md:leading-[2.22vh] font-bold">
                Resolución de conflictos y mediación
              </p>
            </div>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default Corporation;
