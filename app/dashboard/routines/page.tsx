"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { get, post, del } from "@/lib/api";
import RoutineForm from "../components/AddRoutine";
import { Routine } from "@/entities/Routine";
import { useLoader } from "@/context/LoaderContext";

export default function RoutineGallery() {
  const router = useRouter(); // Inicializa useRouter
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [addingRoutine, setAddingRoutine] = useState(false);
  const customRoutines = routines.filter(
    (routine) => routine.source === "personalizada"
  );
  const defaultRoutines = routines.filter(
    (routine) => routine.source === "predeterminada"
  );

  const { showLoader, hideLoader } = useLoader();
  const getRoutines = async (): Promise<Routine[]> => {
    showLoader();
    try {
      const response = await get("/routine/get");
      return response.data;
    } catch (error) {
      console.error("Error fetching routines:", error);
      return [];
    } finally {
      hideLoader();
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createRoutine = async (routine: Routine) => {
    showLoader();
    try {
      const response = await post("/routine/pos", routine);
      const routines = await getRoutines();
      setRoutines(routines);
      setAddingRoutine(false);
      setSelectedRoutine(null);
      setErrorMessage(null); // Limpia mensajes de error si se guarda correctamente
    } catch (error: any) {
      console.error("Error creating routine:", error);
      setErrorMessage(
        error?.response?.data || "Ocurrió un error al guardar la rutina."
      );
    } finally {
      hideLoader();
    }
  };
  const getLevelBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
      case "principiante":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg ring-2 ring-green-500";
      case "intermedio":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg ring-2 ring-yellow-500";
      case "avanzado":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg ring-2 ring-red-500";
      default:
        return "bg-gray-200 text-gray-800 shadow-md ring-1 ring-gray-400";
    }
  };

  const deleteRoutine = async (routineId: string) => {
    showLoader();
    try {
      const response = await del("/routine/del", { routine_id: routineId });
      const updatedRoutines = await getRoutines(); // Actualiza la lista de rutinas después de borrar
      setRoutines(updatedRoutines);
      setAddingRoutine(false);
      setSelectedRoutine(null);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Error deleting routine:", error);
      setErrorMessage(
        error?.response?.data || "Ocurrió un error al eliminar la rutina."
      );
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const fetchRoutines = async () => {
      const data = await getRoutines();
      setRoutines(data);
    };
    fetchRoutines();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/exercises")}
          >
            Ejercicios
          </Button>
          <Button variant="default">Rutinas</Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setAddingRoutine(!addingRoutine)}
          className="text-sm"
        >
          + Añadir rutina
        </Button>
      </div>

      {addingRoutine ? (
        <RoutineForm
          onCancel={() => {
            setAddingRoutine(false);
            setSelectedRoutine(null);
            setErrorMessage(null);
          }}
          onSave={createRoutine}
          errorMessage={errorMessage}
        />
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-1">Explora Rutinas</h2>
          <p className="text-muted-foreground mb-6">
            Rutinas destacadas para ti. Actualizado diariamente.
          </p>
          <Separator className="mb-6" />

          {!selectedRoutine ? (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  Rutinas creadas para ti
                </h3>
                {defaultRoutines.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {defaultRoutines.map((routine) => (
                      <Card
                      key={routine._id}
                      onClick={() => setSelectedRoutine(routine)}
                      className="relative flex items-center rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Contenedor de la imagen */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white flex items-center justify-center">
                        <img
                          src="https://cdn.shopify.com/s/files/1/0463/5803/6638/files/png-transparent-fitness-centre-physical-fitness-logo-work-out-hand-sticker-sports_480x480.png?v=1624498543"
                          alt="Gym Icon"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    
                      {/* Contenido de la tarjeta */}
                      <div className="flex-grow">
                        <CardContent className="p-4">
                          <CardTitle className="text-lg font-semibold mb-2">{routine.name}</CardTitle>
                          <Badge
                            className={`mb-2 px-3 py-1 rounded-full font-semibold text-sm ${getLevelBadgeClass(
                              routine.level
                            )}`}
                          >
                            {routine.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{routine.description}</p>
                        </CardContent>
                      </div>
                    </Card>
                    
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay rutinas predeterminadas disponibles.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  Rutinas creadas por mi
                </h3>
                {customRoutines.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {customRoutines.map((routine) => (
                      <Card
                      key={routine._id}
                      onClick={() => setSelectedRoutine(routine)}
                      className="relative flex items-center rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Contenedor de la imagen */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white flex items-center justify-center">
                        <img
                          src="https://cdn.shopify.com/s/files/1/0463/5803/6638/files/png-transparent-fitness-centre-physical-fitness-logo-work-out-hand-sticker-sports_480x480.png?v=1624498543"
                          alt="Gym Icon"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    
                      {/* Contenido de la tarjeta */}
                      <div className="flex-grow">
                        <CardContent className="p-4">
                          <CardTitle className="text-lg font-semibold mb-2">{routine.name}</CardTitle>
                          <Badge
                            className={`mb-2 px-3 py-1 rounded-full font-semibold text-sm ${getLevelBadgeClass(
                              routine.level
                            )}`}
                          >
                            {routine.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{routine.description}</p>
                        </CardContent>
                      </div>
                    </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tienes rutinas personalizadas aún.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              {/* Barra superior con botones */}
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedRoutine(null)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  ← <span>Volver a las rutinas</span>
                </Button>
                {selectedRoutine.source === "personalizada" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => deleteRoutine(selectedRoutine._id)}
                  >
                    Borrar
                  </Button>
                ) : (
                  ""
                )}
              </div>

              {/* Detalle de la rutina */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedRoutine.name}
                </h2>
                <p className="text-gray-500 text-lg mt-2">
                  {selectedRoutine.description}
                </p>
                <Badge
                  variant="outline"
                  className="mt-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                >
                  {selectedRoutine.level}
                </Badge>
              </div>

              <Separator className="mb-6" />

              {/* Días y ejercicios */}
              {/* Días y ejercicios */}
              {selectedRoutine.days.map((day, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {day.day}
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {day.exerciseSets.map((exerciseSet, i) => (
                      <Card
                        key={i}
                        className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardHeader className="p-0">
                          <img
                            src={exerciseSet.exercise.image}
                            alt={exerciseSet.exercise.title}
                            className="w-full h-48 object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg text-gray-800">
                            {exerciseSet.exercise.title}
                          </h4>
                          <Badge
                            className={`mt-4 px-3 py-1 rounded-full font-semibold text-sm ${getLevelBadgeClass(
                              exerciseSet.exercise.level
                            )}`}
                          >
                            {exerciseSet.exercise.level}
                          </Badge>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {exerciseSet.exercise.muscles.map((muscle, j) => (
                              <Badge
                                key={j}
                                variant="outline"
                                className="text-sm bg-gray-50 text-gray-600 px-2 py-1 rounded"
                              >
                                {muscle.name} ({muscle.percentage}%)
                              </Badge>
                            ))}
                          </div>
                          {/* Sets y Repeticiones */}
                          <h5 className="text-md font-semibold text-gray-700 mb-2">
                            Series:
                          </h5>
                          <ul className="list-disc list-inside">
                            {exerciseSet.sets.map((set, k) => (
                              <li key={k} className="text-sm text-gray-600">
                                {set.Reps} repeticiones
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
