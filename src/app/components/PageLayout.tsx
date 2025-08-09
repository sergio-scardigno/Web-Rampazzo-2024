"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import FeedbackForm from "./FeedbackForm";
import IconArrowLeft from "../../../public/icons/iconArrowLeft.svg";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbText?: string;
  breadcrumbLink?: string;
  showBreadcrumb?: boolean;
  className?: string;
  defaultService?: 'general' | 'asesoramiento' | 'jubilacion' | 'despidos' | 'accidentes-laborales' | 'accidentes-transito' | 'defensas-penales' | 'ciudadania' | 'sucesiones' | 'divorcios' | 'asesoramiento-empresas' | 'trabajo-negro' | 'enfermedades-laborales' | 'mediacion' | 'personas-juridicas';
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  breadcrumbText = "volver",
  breadcrumbLink = "/",
  showBreadcrumb = true,
  className = "",
  defaultService = "general",
}) => {
  return (
    <main className={className}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD] md:h-[10.74vh] h-[128px]"></div>
      
      <div className="bg-gradient-to-r from-[#EBECF1] to-[#FCFCFD]">
        <div className="mx-4 md:mx-[12.5vw] py-6 md:py-[5.55vh]">
          {showBreadcrumb && (
            <Link
              href={breadcrumbLink}
              className="flex md:gap-[0.62vw] gap-3 w-fit mb-4 md:mb-[2.22vh]"
            >
              <Image
                src={IconArrowLeft}
                alt="IconArrowLeft"
                width={24}
                className="md:h-[2.22vh] md:w-[1.25vw]"
              />
              <p
                className={`${montserrat.className} md:text-[1.48vh] text-base leading-6 md:leading-[2.22vh] text-[#807D9B] font-semibold`}
              >
                {breadcrumbText}
              </p>
            </Link>
          )}
          
          <h1
            className={`md:text-[7.4vh] text-[32px] leading-8 md:leading-[7.4vh] font-bold text-[#1B1743] ${evolventa.className}`}
          >
            {title}
          </h1>
          
          {description && (
            <p className={`mt-4 md:mt-[2.22vh] md:text-[1.48vh] text-sm leading-5 md:leading-[2.22vh] text-[#1B1743] font-medium ${montserrat.className}`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="md:mx-[12.5vw] mx-4 md:pb-[11.11vh] pb-[68px]">
        {children}
      </section>

      {/* Feedback Form */}
      <FeedbackForm defaultService={defaultService} />
    </main>
  );
};

export default PageLayout;
