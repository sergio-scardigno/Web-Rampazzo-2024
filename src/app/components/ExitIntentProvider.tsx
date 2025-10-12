"use client";

import React from "react";
import { useExitIntent } from "@/hooks/useExitIntent";
import ExitIntentPopup from "./ExitIntentPopup";
import ScrollTriggeredPopup from "./ScrollTriggeredPopup";

interface ExitIntentProviderProps {
  children: React.ReactNode;
}

const ExitIntentProvider: React.FC<ExitIntentProviderProps> = ({ children }) => {
  const { showExitIntent, closeExitIntent } = useExitIntent();

  return (
    <>
      {children}
      <ExitIntentPopup 
        isVisible={showExitIntent} 
        onClose={closeExitIntent} 
      />
      <ScrollTriggeredPopup 
        threshold={40}
        delay={3000}
      />
    </>
  );
};

export default ExitIntentProvider;
