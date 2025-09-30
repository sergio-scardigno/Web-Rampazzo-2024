'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extender el objeto window para incluir plausible y matomo
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
    _paq?: any[];
  }
}

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views automáticamente en Plausible
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: pathname,
          timestamp: new Date().toISOString(),
        }
      });
    }

    // Track page views automáticamente en Matomo
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['setCustomUrl', pathname]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [pathname]);

  // Función para trackear eventos personalizados
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    // Trackear en Plausible
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { 
        props: {
          ...props,
          timestamp: new Date().toISOString(),
        }
      });
    }

    // Trackear en Matomo
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['trackEvent', eventName, JSON.stringify(props || {})]);
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
