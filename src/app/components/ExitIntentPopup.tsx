"use client";

import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getClientTrackingData } from "@/lib/tracking";
import SeniorOptimizedForm from "./SeniorOptimizedForm";

interface ExitIntentPopupProps {
  onClose: () => void;
  isVisible: boolean;
}

type PopupFormData = {
  name: string;
  phone: string;
};

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, isVisible }) => {
  const { trackEvent } = useAnalytics();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PopupFormData>({
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (isVisible) {
      trackEvent('exit_intent_popup_shown');
    }
  }, [isVisible, trackEvent]);


  const handleConsultationClick = () => {
    trackEvent('free_consultation_clicked');
    setShowForm(true);
  };

  const onSubmit = async (data: PopupFormData) => {
    setIsSubmitting(true);
    trackEvent('popup_form_submitted', {
      source: 'exit_intent_popup',
      has_name: !!data.name,
      has_phone: !!data.phone,
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
          name: data.name,
          phone: data.phone,
          consultType: 'jubilacion',
          source: 'exit_intent_popup',
          tracking: trackingData,
        }),
      });
      
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
      onClose();
      
    } catch (error) {
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = async (data: PopupFormData) => {
    // Primero registrar en la base de datos
    trackEvent('popup_whatsapp_clicked', {
      source: 'exit_intent_popup',
      has_name: !!data.name,
      has_phone: !!data.phone,
    });

    const trackingData = getClientTrackingData();
    
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          consultType: 'jubilacion',
          source: 'exit_intent_popup_whatsapp',
          tracking: trackingData,
        }),
      });
    } catch (error) {
      console.error('Error registrando WhatsApp click:', error);
    }

    // Luego abrir WhatsApp
    const message = `Contacto WEB - Estoy Interesado en las jubilaciones y reajustes. Mi nombre es ${data.name || 'Usuario'}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5491121914149&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showForm ? (
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#1B1743] mb-2">
                  ¡Espera! ¿Necesitas ayuda con tu jubilación?
                </h2>
                <p className="text-lg text-gray-600">
                  Consulta gratuita con especialistas en derecho previsional
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-[#962C52] to-[#7a2342] text-white p-8 rounded-lg max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  ¿Necesitas ayuda con tu jubilación?
                </h3>
                <p className="text-lg mb-6 opacity-90 text-center">
                  Consulta gratuita con especialistas en derecho previsional
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      {...register('name', { required: 'El nombre es obligatorio' })}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                    />
                    {errors.name && <p className="text-red-200 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        +54
                      </span>
                      <input
                        type="tel"
                        {...register('phone', { 
                          required: 'El teléfono es obligatorio',
                          pattern: {
                            value: /^[0-9\s\-\(\)]{8,15}$/,
                            message: 'Ingrese un número válido'
                          }
                        })}
                        placeholder="11 2191 4149"
                        className="flex-1 px-4 py-3 rounded-r-lg text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    {errors.phone && <p className="text-red-200 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-[#962C52] font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Phone size={20} />
                      {isSubmitting ? 'Enviando...' : 'Consulta Gratuita'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleWhatsAppClick({ name: '', phone: '' })}
                      className="w-full bg-[#25D366] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#20b358] transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💬</span>
                      Chatear por WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <blockquote className="text-gray-700 italic mb-2">
                &ldquo;El Dr. Rampazzo me ayudó con todo el proceso de mi jubilación. 
                Su asesoramiento fue fundamental y el proceso fue mucho más claro y rápido.&rdquo;
              </blockquote>
              <cite className="text-sm text-gray-600 font-semibold">
                - María González, 62 años
              </cite>
            </div>

            {/* Contact info */}
            <div className="text-center text-sm text-gray-600">
              <p>¿Prefieres hablar directamente? Llámanos al</p>
              <a 
                href="tel:+5491121914149" 
                className="text-[#962C52] font-semibold text-lg hover:underline"
              >
                +54 9 11 2191-4149
              </a>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1B1743]">
                Consulta Gratuita
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>
            <SeniorOptimizedForm
              defaultService="jubilacion"
              title=""
              description="Complete el formulario y nos comunicaremos con usted en menos de 24 horas para una consulta gratuita."
              className="border-0 shadow-none p-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
