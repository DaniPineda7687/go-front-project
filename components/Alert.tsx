'use client';
import React, { useEffect, useState } from "react";
import { useAlert } from "@/context/AlertContext";
import { XMarkIcon } from "@heroicons/react/24/solid"; // Asegúrate de tener Heroicons instalado

const Alert = () => {
  const { alert, hideAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        hideAlert();
      }, 5000); // Autoocultar después de 5 segundos
      return () => clearTimeout(timeout);
    }
  }, [alert, hideAlert]);

  if (!alert || !isVisible) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        alert.type === "error"
          ? "bg-red-600 text-white"
          : "bg-green-600 text-white"
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate(-50%, 0)"
          : "translate(-50%, 20px)",
      }}
    >
      <div className="flex items-center justify-between space-x-4">
        <p className="text-sm font-medium">{alert.message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            hideAlert();
          }}
          className="flex items-center justify-center w-6 h-6 text-white bg-transparent hover:text-gray-300 transition"
          aria-label="Cerrar alerta"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
