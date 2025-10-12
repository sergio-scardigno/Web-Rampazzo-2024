"use client";

import { useState, useEffect } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number; // Porcentaje de scroll (0-100)
  triggerOnce?: boolean; // Solo disparar una vez
  delay?: number; // Delay en ms antes de disparar
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}) => {
  const { threshold = 50, triggerOnce = true, delay = 1000 } = options;
  const [hasTriggered, setHasTriggered] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (hasTriggered && triggerOnce) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;

      if (scrollPercentage >= threshold) {
        if (delay > 0) {
          setTimeout(() => {
            setShouldShow(true);
            setHasTriggered(true);
          }, delay);
        } else {
          setShouldShow(true);
          setHasTriggered(true);
        }
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [threshold, triggerOnce, delay, hasTriggered]);

  const close = () => {
    setShouldShow(false);
  };

  const reset = () => {
    setHasTriggered(false);
    setShouldShow(false);
  };

  return {
    shouldShow,
    close,
    reset,
    hasTriggered
  };
};
