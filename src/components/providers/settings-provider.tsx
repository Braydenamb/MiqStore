"use client";

import React, { createContext, useContext, ReactNode } from "react";

type SettingsContextType = {
  settings: Record<string, string>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: Record<string, string>;
}) {
  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
