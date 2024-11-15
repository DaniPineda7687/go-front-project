// components/GlobalLoader.tsx
"use client";

import { useLoader } from "@/context/LoaderContext";

const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-blue-500 border-white rounded-full animate-spin"></div>
        {/* Optional text */}
        <p className="text-white text-lg font-semibold">Cargando...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
