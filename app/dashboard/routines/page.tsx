"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { get, post,del } from "@/lib/api";
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
  const deleteRoutine = async (routineId: string) => {
    showLoader();
    try {
      const response = await del("/routine/del", { routine_id: routineId });
      const updatedRoutines = await getRoutines(); // Actualiza la lista de rutinas después de borrar
      setRoutines(updatedRoutines);
      setErrorMessage(null); // Limpia mensajes de error si la eliminación es exitosa
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
          onCancel={() => setAddingRoutine(false)}
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
                        className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <CardContent className="p-4">
                          <CardTitle className="text-lg font-semibold mb-2">
                            {routine.name}
                          </CardTitle>
                          <Badge variant="outline" className="mb-2">
                            {routine.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {routine.description}
                          </p>
                        </CardContent>
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
                        className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <CardTitle className="text-lg font-semibold mb-2">
                            {routine.name}
                          </CardTitle>
                          <Badge variant="outline" className="mb-2">
                            {routine.level}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {routine.description}
                          </p>
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRoutine(routine._id)}
                            >
                              Borrar
                            </Button>
                          </div>
                        </CardContent>
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
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Button variant="ghost" onClick={() => setSelectedRoutine(null)}>
                ← Volver a las rutinas
              </Button>
              <h2 className="text-2xl font-bold mt-4 mb-2">
                {selectedRoutine.name}
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedRoutine.description}
              </p>
              <Badge variant="outline" className="mb-4">
                {selectedRoutine.level}
              </Badge>

              <Separator className="mb-4" />
              {selectedRoutine.days.map((day, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{day.day}</h3>
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {day.exercises.map((exercise, i) => (
                      <Card
                        key={i}
                        className="rounded-lg overflow-hidden shadow-lg"
                      >
                        <CardHeader className="p-0">
                          <img
                            src={exercise.image}
                            alt={exercise.title}
                            className="w-full h-56 object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg">
                            {exercise.title}
                          </h4>
                          <Badge variant="outline" className="mb-2">
                            {exercise.level}
                          </Badge>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {exercise.muscles.map((muscle, j) => (
                              <Badge key={j} variant="outline">
                                {muscle.name} ({muscle.percentage}%)
                              </Badge>
                            ))}
                          </div>
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
