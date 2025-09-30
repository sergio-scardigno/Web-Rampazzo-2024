'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extender el objeto window para incluir plausible
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views automáticamente
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: pathname,
          timestamp: new Date().toISOString(),
        }
      });
    }
  }, [pathname]);

  // Función para trackear eventos personalizados
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { 
        props: {
          ...props,
          timestamp: new Date().toISOString(),
        }
      });
    }
  };

  // Eventos específicos para el estudio jurídico
  const trackFormSubmission = (formType: string, additionalProps?: Record<string, any>) => {
    trackEvent('form_submit', {
      form_type: formType,
      page: pathname,
      ...additionalProps,
    });
  };

  const trackCalculation = (calculationType: string, result?: any) => {
    trackEvent('calculation_completed', {
      calculation_type: calculationType,
      page: pathname,
      result_amount: result?.total || result?.indemnizacionCalculada,
      ...result,
    });
  };

  const trackContactAction = (action: string, method?: string) => {
    trackEvent('contact_action', {
      action,
      method,
      page: pathname,
    });
  };

  const trackServiceView = (service: string) => {
    trackEvent('service_viewed', {
      service,
      page: pathname,
    });
  };

  return {
    trackEvent,
    trackFormSubmission,
    trackCalculation,
    trackContactAction,
    trackServiceView,
  };
}
