"use client";

import { useState, useEffect } from 'react';

export const useExitIntent = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Solo activar si el mouse sale por la parte superior de la ventana
      // y no se ha mostrado antes en esta sesión
      if (e.clientY <= 0 && !hasShown) {
        setShowExitIntent(true);
        setHasShown(true);
      }
    };

    // Agregar event listener solo para mouseleave
    document.addEventListener('mouseleave', handleMouseLeave);

    // Limpiar event listener al desmontar
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const closeExitIntent = () => {
    setShowExitIntent(false);
  };

  return {
    showExitIntent,
    closeExitIntent,
  };
};
