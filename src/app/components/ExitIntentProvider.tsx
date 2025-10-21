"use client";

import React from "react";

interface ExitIntentProviderProps {
  children: React.ReactNode;
}

const ExitIntentProvider: React.FC<ExitIntentProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default ExitIntentProvider;
