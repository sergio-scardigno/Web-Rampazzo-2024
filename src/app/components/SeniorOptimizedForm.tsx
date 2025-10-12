"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { getClientTrackingData } from "@/lib/tracking";
import { useAnalytics } from "@/hooks/useAnalytics";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import IconWhatsapp from "../../../public/icons/iconWhatsapp.svg";
import Image from "next/image";
import Link from "next/link";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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

type FormInput = {
  name: string;
  phone: string;
  consultType: 'general' | 'asesoramiento' | 'jubilacion' | 'despidos' | 'accidentes-laborales' | 'accidentes-transito' | 'defensas-penales' | 'ciudadania' | 'sucesiones' | 'divorcios' | 'asesoramiento-empresas' | 'trabajo-negro' | 'enfermedades-laborales' | 'mediacion' | 'personas-juridicas' | 'otro';
  consulta?: string;
  privacyAccepted: boolean;
};

interface SeniorOptimizedFormProps {
  defaultService?: FormInput['consultType'];
  title?: string;
  description?: string;
  className?: string;
}

const SeniorOptimizedForm: React.FC<SeniorOptimizedFormProps> = ({ 
  defaultService = 'general',
  title = "Formulario de contacto",
  description = "Te llamaré lo antes posible y responderé todas tus preguntas detalladamente.",
  className = ""
}) => {
  const pathname = usePathname();
  const { trackFormSubmission, trackContactAction, trackEvent } = useAnalytics();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
      privacyAccepted: true,
    },
  });

  const selectedConsultType = watch('consultType');

  async function onSubmit(formData: FormInput) {
    // Trackear envío de formulario
    trackFormSubmission('contact', {
      consult_type: formData.consultType,
      has_message: !!formData.consulta,
    });

    // Obtener información de tracking del cliente
    const trackingData = getClientTrackingData();
    
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tracking: trackingData,
        }),
      });
      
      setIsSubmitted(true);
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        reset({
          name: '',
          phone: '',
          consultType: defaultService,
          consulta: '',
          privacyAccepted: true,
        });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.");
    }
  }

  const handleWhatsAppClick = async () => {
    // Trackear el click de WhatsApp
    trackEvent('whatsapp_button_clicked', {
      source: 'sidebar_form',
      has_form_data: false
    });

    // Registrar en la base de datos
    const trackingData = getClientTrackingData();
    
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: 'Usuario WhatsApp',
          phone: '+5491121914149',
          consultType: 'jubilacion',
          source: 'sidebar_whatsapp_button',
          action: 'whatsapp_click',
          tracking: trackingData,
        }),
      });
    } catch (error) {
      console.error('Error registrando WhatsApp click:', error);
    }

    // Abrir WhatsApp
    const message = "Contacto WEB - Estoy Interesado en las jubilaciones y reajustes";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5491121914149&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = async () => {
    // Trackear el click de llamada
    trackEvent('phone_button_clicked', {
      source: 'sidebar_form',
      has_form_data: false
    });

    // Registrar en la base de datos
    const trackingData = getClientTrackingData();
    
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: 'Usuario Llamada',
          phone: '+5491121914149',
          consultType: 'jubilacion',
          source: 'sidebar_phone_button',
          action: 'phone_click',
          tracking: trackingData,
        }),
      });
    } catch (error) {
      console.error('Error registrando phone click:', error);
    }

    // Abrir teléfono
    window.location.href = 'tel:+5491121914149';
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center ${className}`}>
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="senior-heading text-green-800 mb-4">¡Mensaje enviado con éxito!</h3>
        <p className="senior-text text-green-700 mb-4">
          Gracias por contactarnos. Nos comunicaremos con usted en las próximas 24 horas.
        </p>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <p className="senior-text text-gray-700 font-semibold mb-2">Horarios de atención:</p>
          <p className="senior-text text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
          <p className="senior-text text-gray-600">Sábados: 9:00 - 13:00</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`bg-white border border-gray-200 rounded-lg p-8 shadow-sm ${className}`}
    >
      <div className="mb-8">
        <h1 className={`senior-heading text-[#1B1743] mb-4 ${evolventa.className}`}>
          {title}
        </h1>
        <p className="senior-text text-gray-700 mb-6">
          {description}
        </p>
        
        {/* Botones de contacto directo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            className="senior-button bg-green-600 text-white hover:bg-green-700 text-center"
            onClick={handlePhoneClick}
          >
            📞 Llamar ahora
          </button>
          <button
            type="button"
            className="senior-button bg-[#25D366] text-white hover:bg-[#20b358] text-center"
            onClick={handleWhatsAppClick}
          >
            <Image
              src={IconWhatsapp}
              alt="WhatsApp"
              width={24}
              height={24}
              className="object-contain"
            />
            Chatear por WhatsApp
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Campo Nombre */}
        <div>
          <Label htmlFor="name" className="senior-label">
            Nombre completo *
          </Label>
          <Input
            id="name"
            type="text"
            {...register('name', { 
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              }
            })}
            placeholder="Ingrese su nombre completo"
            className="senior-input"
          />
          {errors.name && <span className="senior-error">{errors.name.message}</span>}
        </div>

        {/* Campo Teléfono */}
        <div>
          <Label htmlFor="phone" className="senior-label">
            Teléfono *
          </Label>
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
                className="phone-input-sidebar"
              />
            )}
          />
          {errors.phone && <span className="senior-error">{errors.phone.message}</span>}
        </div>


        {/* Campo Tipo de consulta */}
        <div>
          <Label htmlFor="consultType" className="senior-label">
            Tipo de consulta *
          </Label>
          <Controller
            control={control}
            name="consultType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="consultType" className="senior-input">
                  <SelectValue placeholder="Seleccione el tipo de consulta" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200">
                  <SelectItem value="general" className="senior-text">Consulta general</SelectItem>
                  <SelectItem value="jubilacion" className="senior-text">Jubilación</SelectItem>
                  <SelectItem value="despidos" className="senior-text">Despidos</SelectItem>
                  <SelectItem value="accidentes-laborales" className="senior-text">Accidentes laborales</SelectItem>
                  <SelectItem value="accidentes-transito" className="senior-text">Accidentes de tránsito</SelectItem>
                  <SelectItem value="defensas-penales" className="senior-text">Defensas penales</SelectItem>
                  <SelectItem value="ciudadania" className="senior-text">Ciudadanía argentina</SelectItem>
                  <SelectItem value="sucesiones" className="senior-text">Sucesiones</SelectItem>
                  <SelectItem value="divorcios" className="senior-text">Divorcios</SelectItem>
                  <SelectItem value="asesoramiento-empresas" className="senior-text">Asesoramiento empresarial</SelectItem>
                  <SelectItem value="trabajo-negro" className="senior-text">Trabajo en negro</SelectItem>
                  <SelectItem value="enfermedades-laborales" className="senior-text">Enfermedades laborales</SelectItem>
                  <SelectItem value="mediacion" className="senior-text">Mediación</SelectItem>
                  <SelectItem value="personas-juridicas" className="senior-text">Personas jurídicas</SelectItem>
                  <SelectItem value="otro" className="senior-text">Otro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Campo consulta adicional */}
        {selectedConsultType === 'otro' && (
          <div>
            <Label htmlFor="consulta" className="senior-label">
              Describa su consulta
            </Label>
            <textarea
              id="consulta"
              {...register('consulta')}
              placeholder="Escriba aquí los detalles de su consulta..."
              className="senior-input min-h-[120px] resize-none"
              rows={4}
            />
          </div>
        )}

        {/* Checkbox de privacidad */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            {...register('privacyAccepted', { 
              required: 'Debe aceptar la política de privacidad' 
            })}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Label htmlFor="privacyAccepted" className="text-xs text-gray-600 leading-relaxed">
            Acepto el{" "}
            <Link href="/privacy_policy" className="text-blue-600 underline hover:text-blue-800">
              procesamiento de mis datos personales
            </Link>{" "}
            para recibir información sobre mis consultas legales.
          </Label>
        </div>
        {errors.privacyAccepted && <span className="senior-error">{errors.privacyAccepted.message}</span>}

        {/* Información de horarios */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="senior-text font-semibold text-blue-800 mb-2">Horarios de atención</h4>
          <p className="senior-text text-blue-700">Lunes a Viernes: 9:00 - 18:00</p>
          <p className="senior-text text-blue-700">Sábados: 9:00 - 13:00</p>
          <p className="senior-text text-blue-600 text-sm mt-2">
            Responderemos su consulta en menos de 24 horas.
          </p>
        </div>
      </div>

      <Button
        disabled={isSubmitting}
        type="submit"
        className="senior-button w-full bg-[#962C52] text-white hover:bg-[#7a2342] mt-8"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  );
};

export default SeniorOptimizedForm;
