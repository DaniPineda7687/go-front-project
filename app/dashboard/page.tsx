'use client';
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Importamos useRouter

const Welcome = () => {
  const router = useRouter(); // Instancia de useRouter
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    setUserName(Cookies.get("username") || "");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido de vuelta, {userName}!</h1>
        <p className="text-lg text-gray-600">{currentDate}</p>
        <p className="mt-4 text-gray-500">
          Prepárate para dar lo mejor de ti 💪. Tu próxima meta te espera.
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard/train")} // Redirige a /dashboard/train
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
      >
        Entrenar ahora
      </button>
      <button
        onClick={() => router.push("#")} // Redirige a /dashboard/progreso (o a la ruta que quieras)
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
      >
        Ver tu progreso
      </button>
    </div>
  );
};

export default Welcome;
