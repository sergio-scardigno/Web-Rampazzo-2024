"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { feedbackRef } from "./FeedbackForm";

import { montserrat } from "../fonts";
import PicMain from "../../../public/pics/picMain.jpg";
import IconArrow from "../../../public/icons/iconArrowRight.svg";

const Main = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState(0);
  const handleItemClick = (index: any) => {
    setSelectedItem(index);
  };
  const scrollToRef = (ref: any) => {
    if (ref && ref.current) {
      const yOffset = ref.current.getBoundingClientRect().top;
      window.scrollBy({ top: yOffset, behavior: "smooth" });
    }
  };
  const mainArray = [
    {
      title: "Jubilaciones",
      description:
        "Tengo más de 10 años ayudando a argentinos y argentinas, logrando que consigan jubilaciones y pensiones",
      services: [
        {
          title: "Jubilaciones",
          link: "/jubilaciones",
        },
        {
          title: "Reajuste de haberes",
          link: "/jubilaciones",
        },
        {
          title: "Pensión por fallecimiento",
          link: "/jubilaciones",
        },
        {
          title: "Rentas vitalicias",
          link: "/jubilaciones",
        },
        {
          title: "Reconocimiento de servicios",
          link: "/jubilaciones",
        },
        {
          title: "Retiro por invalidez",
          link: "/jubilaciones",
        },
        {
          title: "Tramites ante IPS",
          link: "/jubilaciones",
        },
      ],
    },
    {
      title: "Laboral",
      description:
        "Esta sección legal aborda diversas áreas laborales, desde accidentes y despidos hasta trabajo en negro y enfermedades laborales. Ofrecemos defensa legal en sucesiones y divorcios laborales, así como asesoramiento integral a empresas en contratos y cumplimiento normativo.",
      services: [
        {
          title: "Accidentes laborales.",
          link: "/laboral",
        },
        {
          title: "Despido.",
          link: "/laboral",
        },
        {
          title: "Trabajo en negro.",
          link: "/laboral",
        },
        {
          title: "Enfermedades laborales.",
          link: "/laboral",
        },

      ],
    },
    {
      title: "Servicios",
      description: "Esta sección legal abarca una amplia variedad de servicios especializados. Ofrecemos asesoramiento y representación en accidentes laborales, despidos, trabajo no registrado, enfermedades laborales, sucesiones y divorcios. Además, brindamos defensas penales, asesoramiento a empresas en contratos y cumplimiento normativo, así como representación en casos de accidentes de tránsito laborales.",
      services: [
        {
          title: "Sucesiones",
          link: "/servicio",
        },
        {
          title: "Divorcios",
          link: "/servicio",
        },
        {
          title: "Defensas Penales",
          link: "/servicio",
        },
        {
          title: "Asesorammiento a empresas / Constratos",
          link: "/servicio",
        },
        {
          title: "Accidente de Transito",
          link: "/servicio",
        },
      ],
    },
  ];

  const objectPositionStyle = { objectPosition: "center 18%" };

  return (
    <main className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD] bg-black">
      <div className="mx-4 md:mx-[12.5vw] grid gird-cols-3 md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743] md:pb-[11.11vh]">
        <div className="md:col-span-2 col-span-3">
          <div className="md:relative">
            <div className="z-[22] md:absolute pb-[48px] md:pb-0">
              <Image
                src={PicMain}
                alt="main portrait"
                width={600}
                className="w-full h-[264px] md:w-[20.72vw] md:h-[61.11vh] object-cover rounded-md  transform scale-x-[-1]"
                style={objectPositionStyle}
              />
            </div>
            <div className="hidden md:block bg-[#D8CACF] md:absolute md:top-[1.85vh] md:left-[1.04vw] md:w-[20.72vw] md:h-[61.11vh] rounded-md "></div>
          </div>
        </div>
        <div className="md:col-start-3 md:col-span-4 col-span-3 md:my-[14.6vh] overflow-hidden">
          <div className="flex md:md:gap-x-[0.05vw] gap-x-[1px] pb-12 md:pb-[5.55vh]  overflow-x-auto focus:overflow-x-scroll scrollbar-hide">
            {mainArray.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(index)}
                className={`border-[1.5px] md:border-[0.11vh] px-4 py-3 md:px-[0.83vw] md:py-[1.11vh] first:rounded-l-md last:rounded-r-md  ${
                  selectedItem === index
                    ? "border-[#000000]"
                    : "border-[#D3D3E3]"
                } cursor-pointer`}
              >
                <p
                  className={` ${
                    selectedItem === index ? "text-[#fffff]" : "text-[#D3D3E3]"
                  } md:text-[1.48vh] md:leading-[2.22vh] font-semibold whitespace-nowrap ${
                    montserrat.className
                  }`}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
          <h1 className="font-bold text-black text-[32px] md:text-[7.40vh] leading-[32px] md:leading-[7.40vh] pb-7 md:pb-[4.44vh]">
          Jubilaciones, pensiones <br />y reajuste de haberes
                      </h1>
          <div className="pb-[60px] md:pb-0" onClick={() => scrollToRef(feedbackRef)}>
            <Button title="Regístrese para una consulta" />
          </div>
        </div>
        <div className="col-span-3 md:col-span-2 md:mt-[7.40vh]">
          <h1 className="text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] pb-2 md:pb-[1.85vh] font-bold">
            {mainArray[selectedItem].title}
          </h1>
          <p
            className={` text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] pb-7 md:pb-0 font-medium ${montserrat.className}`}
          >
            {mainArray[selectedItem].description}
          </p>
        </div>
        <div className="col-span-3 md:col-span-4 md:mt-[7.40vh] grid gap-y-2 md:gap-y-[0.74vh] pb-[60px] md:pb-0">
          {mainArray[selectedItem].services.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`group transition-all duration-300 h-fit flex items-center md:px-[1.25vw] px-7 py-7 md:py-[2.22vh] bg-white hover:bg-[#000000] hover:text-white border-[1px] border-[#F0F0F5] font-bold md:text-[1.66vh] text-base leading-[22px] md:leading-[2.22vh] rounded-md ${montserrat.className}`}
            >
              <div className="w-full flex justify-between">
                <p>{item.title}</p>
                <Image
                  src={IconArrow}
                  alt="arrow right"
                  width={24}
                  className="md:h-[2.22vh] md:w-[1.25vw] group-hover:visible invisible hidden md:flex"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
