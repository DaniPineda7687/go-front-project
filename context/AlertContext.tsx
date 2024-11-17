'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AlertContextType {
  showAlert: (message: string, type: "error" | "success") => void;
  hideAlert: () => void;
  alert: { message: string; type: "error" | "success" } | null;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showAlert = (message: string, type: "error" | "success") => {
    setAlert({ message, type });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};