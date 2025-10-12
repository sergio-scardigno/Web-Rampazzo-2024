"use client";

import React, { useState } from "react";
import { X, Phone } from "lucide-react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getClientTrackingData } from "@/lib/tracking";

interface ScrollTriggeredPopupProps {
  threshold?: number;
  delay?: number;
  onClose?: () => void;
}

type PopupFormData = {
  name: string;
  phone: string;
};

const ScrollTriggeredPopup: React.FC<ScrollTriggeredPopupProps> = ({
  threshold = 30,
  delay = 2000,
  onClose
}) => {
  const { trackEvent } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { shouldShow, close } = useScrollTrigger({
    threshold,
    delay,
    triggerOnce: true
  });

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

  const handleClose = () => {
    close();
    onClose?.();
    trackEvent('scroll_popup_close_clicked');
  };


  const onSubmit = async (data: PopupFormData) => {
    setIsSubmitting(true);
    trackEvent('popup_form_submitted', {
      source: 'scroll_popup',
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
          source: 'scroll_popup',
          tracking: trackingData,
        }),
      });
      
      toast.success("¡Gracias! Nos comunicaremos con usted en breve.");
      handleClose();
      
    } catch (error) {
      toast.error("Hubo un error al enviar el formulario. Por favor, inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = async (data: PopupFormData) => {
    // Primero registrar en la base de datos
    trackEvent('popup_whatsapp_clicked', {
      source: 'scroll_popup',
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
          source: 'scroll_popup_whatsapp',
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
    handleClose();
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1B1743] mb-2">
                ¿Necesitas ayuda con tu jubilación?
              </h2>
              <p className="text-gray-600">
                Consulta gratuita con especialistas en derecho previsional
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] text-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Consulta Gratuita de Jubilaciones</h3>
              <p className="text-sm opacity-90 mb-4">
                Asesoramiento personalizado con especialistas en derecho previsional
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#962C52] focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#962C52] focus:border-transparent"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#962C52] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#7a2342] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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


          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Horarios de atención: Lun-Vie 9:00-18:00, Sáb 9:00-13:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollTriggeredPopup;
