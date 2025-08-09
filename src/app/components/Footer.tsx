"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { feedbackRef } from "./FeedbackForm";
import { aboutMeRef } from "./About";

import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconTelegram from "../../../public/icons/iconTelegram.svg";
import IconWhatsapp from "../../../public/icons/iconWhatsapp.svg";
import IconPin from "../../../public/icons/iconPin.svg";

const scrollToRef = (ref: any) => {
  if (ref && ref.current) {
    const yOffset = ref.current.getBoundingClientRect().top;
    window.scrollBy({ top: yOffset, behavior: "smooth" });
  }
};

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const menuArray = [
    {
      title: "Quien es Fernando Rampazzo",
      OnClick: (e: any) => {
        e.preventDefault();
        if (pathname == "/") {
          scrollToRef(aboutMeRef);
        } else {
          router.push("/#aboutMe");
        }
      },
    },
  ];
  const services = [
    { title: "Jubilaciones", link: "/jubilaciones" },
    { title: "Laboral", link: "/laboral" },
    { title: "Servicios", link: "/servicios" },
  ];
  const socialArray = [
    // { src: IconTelegram, alt: "Telegram", link: "#" },
    { src: IconWhatsapp, alt: "Whatsapp", link: "https://api.whatsapp.com/send?phone=+5491121914149&text=Contacto%20WEB%20-%20Estoy%20Interesado%20en%20las%20jubilaciones%20y%20reajustes" },
  ];
  return (
    <footer className="border-t-[0.09vh] border-[#F0F0F5] bg-black text-white">
      <div className="md:mx-[12.5vw] md:mt-[2.22vh] md:mb-[4.44vh] text-[#1B1743] grid grid-cols-3 md:grid-cols-6 md:gap-x-[1.25vw]">
        <div className="hidden md:block md:col-span-2">
          <div className="flex items-center md:pb-[14.07vh] text-white">
            <div>
              <p className="text-[#FFD700] md:text-[1.11vh] md:leading-[1.38vh] ">
              Abogado
              </p>
              <p className=" font-bold md:text-[2.03vh] md:leading-[2.59vh] text-white">
                Fernando Rampazzo
              </p>
            </div>
          </div>
          <div className="md:pb-[2.59vh] w-fit">
            {/* <Link href="/privacy_policy" className="cursor-pointer">
              <p
                className={`md:text-[1.48vh] md:leading-[2.22vh] ${montserrat.className} font-medium text-[#807D9B]`}
              >
                  política de privacidad
              </p>
            </Link> */}
          </div>

          <p
            className={`md:text-[1.48vh] md:leading-[2.22vh] ${montserrat.className} font-medium text-white`}
          >
            © 2024 Servicios jurídicos Fernando Rampazzo
          </p>
        </div>
        <div
          className={`mx-3 pt-6 md:pt-0 col-span-3 md:col-span-1 ${montserrat.className}`}
        >
          <p className="hidden md:block md:text-[1.48vh] md:leading-[2.22vh] md:pb-[1.85vh] font-medium text-[white]">
          Servicios
          </p>
          <div className="grid gap-y-2 md:gap-y-[0.74vh] pb-6 md:pb-0 text-[white]">
            {services.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="py-3 md:py-[1.11vh] md:px-[0.62vh] md:text-[1.48vh] text-base leading-6 md:leading-[2.22vh] font-semibold md:w-fit w-full text-center md:text-start whitespace-nowrap md:mx-0 bg-[#F8F6F7] md:bg-white rounded-md text-[black] md:text-[black]"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="block md:hidden">
            {menuArray.map((item, index) => (
              <p
                key={index}
                onClick={(e) => {
                  item.OnClick(e);
                }}
                className=" w-full text-center text-[white] py-3 text-base leading-6 font-semibold pb-[60px]"
              >
                {item.title}
              </p>
            ))}
          </div>
        </div>
        <div
          className={`mx-3 md:mx-0 col-span-3 md:col-span-2 md:col-start-5 ${montserrat.className}`}
        >
          <div className="md:text-[1.48vh] text-[white] text-base leading-6 md:leading-[2.22vh] pb-5 md:pb-[1.85vh] font-semibold select-text">
                            <a href="mailto:estudiorampazzofernando@gmail.com">estudiorampazzofernando@gmail.com</a>
          </div>
          {/* <div
            className={`md:text-[3.33vh] text-[white] text-[24px] leading-[26px] md:leading-[3.51vh] pb-5 md:pb-[1.85vh] font-bold ${evolventa.className} select-text`}
          >
            <a href="tel:+5491121914149">+549 11 2191 4149</a>
          </div> */}

          <div className="flex gap-x-2 md:gap-x-[0.41vw] items-center pb-6 md:pb-[5.55vh]">
            {socialArray.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                className="bg-[white] h-fit w-full md:w-fit rounded-md"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={24}
                  className="mx-auto md:mx-[0.62vw] my-3 md:my-[1.11vh] md:h-[2.22vh] md:w-[1.25vw] object-contain"
                />
              </Link>
            ))}
          </div>
          <div className="flex md:gap-x-[0.62vw] gap-x-3 items-start pb-[60px] md:pb-0">
            <Image
              src={IconPin}
              alt={`IconPin`}
              width={24}
              className="md:h-[2.22vh] md:w-[1.25vw] object-contain"
            />
            <div>
              <p className="pb-2 text-[white] md:pb-[1.11vh] text-[18px] md:text-[1.66vh] leading-6 md:leading-[2.22vh] font-bold">
                Fernando Rampazzo
              </p>
              <p className="text-base text-[white] md:text-[1.48vh] leading-6 md:leading-[2.22vh] font-medium">
              Trabajo de forma remota en todo Argentina
              </p>
            </div>
          </div>
        </div>
        <div className="block md:hidden col-span-3 mx-3 pb-6 ">
          <p className=" text-xs leading-[14px] font-normal text-[#FFD700]">
          Abogado
          </p>
          <p className="text-[22px] leading-7 font-bold text-[white] pb-6">
            Fernando Rampazzo
          </p>
          <div
            className={`pb-3 text-xs leading-5 text-[white] font-medium ${montserrat.className}`}
          >
            <Link href="/privacy_policy">política de privacidad</Link>
          </div>
          <p
            className={`text-xs leading-5 text-[white] font-medium ${montserrat.className}`}
          >
            © 2024 Servicios jurídicos Fernando Rampazzo
          </p>
        </div>
      </div>
      <div
        className={`hidden text-white md:py-[2.22vh] md:flex justify-center md:gap-[1.25vw] md:text-[1.29vh] md:leading-[1.85vh] font-normal text-[#807D9B] ${montserrat.className}`}
      >
        <Link href="https://cv-sergio-scardigno.vercel.app" target="_blank">El sitio fue creado Sergio Scardigno</Link>
        <p>/ 2024</p>
        {/* <Link href="/photo_contributor"></Link> */}
      </div>
    </footer>
  );
};

export default Footer;
