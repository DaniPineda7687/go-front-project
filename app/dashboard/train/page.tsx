'use client'
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import {useRouter} from "next/navigation"; 
const TrainDashboard = () => {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Entrenar</h1>
          <p className="text-gray-600">Planifica y empieza tus entrenamientos.</p>
        </div>

        {/* Quick Start Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inicio rápido</h2>
          <button className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow transition"
          onClick={()=>router.push("/dashboard/train/workout")}>
            <PlusCircleIcon className="w-6 h-6 mr-2"
             />
            Empezar entrenamiento vacío
          </button>
        </section>

        {/* Routines Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rutinas</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg shadow transition"
            onClick={()=>router.push("/dashboard/routines")}>
              <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
              Explorar Rutinas
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainDashboard;
