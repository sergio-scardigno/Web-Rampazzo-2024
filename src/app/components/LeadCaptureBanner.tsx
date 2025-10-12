"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Phone, Mail, Download } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface LeadCaptureBannerProps {
  variant?: 'top' | 'bottom' | 'floating';
  message?: string;
  ctaText?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  autoHide?: boolean;
  hideDelay?: number;
}

const LeadCaptureBanner: React.FC<LeadCaptureBannerProps> = ({
  variant = 'top',
  message = "¿Necesitas ayuda con tu jubilación? Consulta gratuita disponible",
  ctaText = "Consultar Ahora",
  onClose,
  showCloseButton = true,
  autoHide = false,
  hideDelay = 10000
}) => {
  const { trackEvent } = useAnalytics();
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    trackEvent('banner_close_clicked');
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [trackEvent, onClose]);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleClose();
      }, hideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, handleClose]);

  const handleCTAClick = (action: string) => {
    trackEvent('banner_cta_clicked', { action });
  };

  if (!isVisible) return null;

  const baseClasses = `
    transition-all duration-300 ease-in-out
    ${isClosing ? 'opacity-0 transform -translate-y-full' : 'opacity-100 transform translate-y-0'}
  `;

  const variantClasses = {
    top: 'fixed top-0 left-0 right-0 z-50',
    bottom: 'fixed bottom-0 left-0 right-0 z-50',
    floating: 'fixed top-4 right-4 z-50 max-w-sm'
  };

  if (variant === 'floating') {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] text-white p-4 rounded-lg shadow-lg">
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          )}
          <div className="pr-6">
            <h3 className="font-semibold text-sm mb-2">{message}</h3>
            <div className="flex flex-col space-y-2">
              <a
                href="tel:+5491121914149"
                onClick={() => handleCTAClick('phone')}
                className="flex items-center space-x-2 text-xs bg-white text-[#962C52] px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <Phone size={14} />
                <span>Llamar</span>
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=+5491121914149&text=Contacto%20WEB%20-%20Estoy%20Interesado%20en%20las%20jubilaciones%20y%20reajustes"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCTAClick('whatsapp')}
                className="flex items-center space-x-2 text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <p className="font-medium">{message}</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="tel:+5491121914149"
              onClick={() => handleCTAClick('phone')}
              className="bg-white text-[#962C52] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Phone size={16} />
              <span>Llamar</span>
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=+5491121914149&text=Contacto%20WEB%20-%20Estoy%20Interesado%20en%20las%20jubilaciones%20y%20reajustes"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCTAClick('whatsapp')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureBanner;
