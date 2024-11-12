"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { get, post } from "@/lib/api";
import RoutineForm from "../components/AddRoutine";
import { Routine } from "@/entities/Routine";

const getRoutines = async (): Promise<Routine[]> => {
  try {
    const response = await get("/routine/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching routines:", error);
    return [];
  }
};

const createRoutine = async (routine: Routine) => {
  try {
    const response = await post("/routine/pos", routine);
     response.data;
  } catch (error) {
    console.error("Error creating routine:", error);
     null;
  }
};

export default function RoutineGallery() {
  const router = useRouter(); // Inicializa useRouter
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [addingRoutine, setAddingRoutine] = useState(false);

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
          <Button variant="ghost" onClick={() => router.push("/dashboard/exercises")}>
            Ejercicios
          </Button>
          <Button variant="default">Rutinas</Button>
        </div>
        <Button variant="outline" onClick={() => setAddingRoutine(!addingRoutine)} className="text-sm">
          + Añadir rutina
        </Button>
      </div>

      {addingRoutine ? (
        <div>
          <RoutineForm onCancel={setAddingRoutine} onSave={createRoutine} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-1">Explora Rutinas</h2>
          <p className="text-muted-foreground mb-6">Rutinas destacadas para ti. Actualizado diariamente.</p>
          <Separator className="mb-6" />

          {!selectedRoutine ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {routines.map((routine) => (
                <Card
                  key={routine._id}
                  onClick={() => setSelectedRoutine(routine)}
                  className="relative rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold mb-2">{routine.name}</CardTitle>
                    <Badge variant="outline" className="mb-2">{routine.level}</Badge>
                    <p className="text-sm text-muted-foreground">{routine.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Button variant="ghost" onClick={() => setSelectedRoutine(null)}>
                ← Volver a las rutinas
              </Button>
              <h2 className="text-2xl font-bold mt-4 mb-2">{selectedRoutine.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedRoutine.description}</p>
              <Badge variant="outline" className="mb-4">{selectedRoutine.level}</Badge>

              <Separator className="mb-4" />
              {selectedRoutine.days.map((day, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{day.day}</h3>
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {day.exercises.map((exercise, i) => (
                      <Card key={i} className="rounded-lg overflow-hidden shadow-lg">
                        <CardHeader className="p-0">
                          <img src={exercise.image} alt={exercise.title} className="w-full h-56 object-cover" />
                        </CardHeader>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg">{exercise.title}</h4>
                          <Badge variant="outline" className="mb-2">{exercise.level}</Badge>
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
