'use client'
import React, { useEffect, useState } from 'react';
import ProgressChart from '@/components/ProgressChart';
import { get } from "@/lib/api";
import { useLoader } from '@/context/LoaderContext';
import { useAlert } from '@/context/AlertContext';
import { Workout } from '@/entities/WorkOut';
import { Exercise } from '@/entities/Exercise';

const ProgressPage = () => {
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [formattedData, setFormattedData] = useState<Record<string, { date: string; weight: number }[]>>({});
  const [selectedData, setSelectedData] = useState<{ date: string; weight: number }[]>([]);
  const [tiempoPromedioEntreno, setTiempoPromedioEntreno] = useState('0m');
  const [diasAsistidos, setDiasAsistidos] = useState(0);
  const { showLoader, hideLoader } = useLoader();
  const { showAlert } = useAlert();

  const cambiarEjercicio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setEjercicioSeleccionado(selectedId);

    // Actualizar los datos del gráfico
    const exerciseTitle = exercises.find((exercise) => exercise._id === selectedId)?.title || '';
    setSelectedData(formattedData[exerciseTitle] || []);
  };

  const transformWorkoutsToDummyData = (workouts: Workout[], exercises: Exercise[]) => {
    const exerciseMap = exercises.reduce((map, exercise) => {
      map[exercise._id!] = exercise.title; // Relacionar ID con título
      return map;
    }, {} as Record<string, string>);

    const transformedData: Record<string, { date: string; weight: number }[]> = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exerciseWorkOut) => {
        const exerciseName = exerciseMap[exerciseWorkOut.exercise_id];
        if (!exerciseName) return;

        // Calcular peso promedio de las series
        const totalWeight = exerciseWorkOut.sets.reduce((sum, set) => sum + set.weight, 0);
        const averageWeight = totalWeight / exerciseWorkOut.sets.length;

        // Agregar al ejercicio correspondiente en el resultado
        if (!transformedData[exerciseName]) {
          transformedData[exerciseName] = [];
        }

        transformedData[exerciseName].push({
          date: new Date(workout.workout_date).toISOString().split('T')[0],
          weight: averageWeight,
        });
      });
    });

    return transformedData;
  };

  useEffect(() => {
    const fetchAndTransformData = async () => {
      showLoader();
      try {
        const [workoutsResponse, exercisesResponse] = await Promise.all([
          get("/workout/get"),
          get("/exercise/get"),
        ]);
        const workouts: Workout[] = workoutsResponse.data || [];
        const exercises: Exercise[] = exercisesResponse.data || [];
        const uniqueDates = new Set(workouts.map(workout => new Date(workout.workout_date).toISOString().split('T')[0]));
        const daysAttended = uniqueDates.size;
        setDiasAsistidos(daysAttended);
        const promedio : any = [];
        workouts.forEach((workout) => {
          const startTime = new Date(workout.start_time);
          console.log(startTime);
          
          const endTime = new Date(workout.end_time);
          console.log(endTime);
          const diff = endTime.getTime() - startTime.getTime();
          console.log(diff);
          const minutes = Math.floor(diff / 1000 / 60);
          console.log(minutes);
          promedio.push(minutes);
        });
        if(promedio.length === 0) {
          setTiempoPromedioEntreno('0m');
        }else{
          setTiempoPromedioEntreno(`${Math.round(promedio.reduce((a, b) => a + b, 0) / promedio.length)}m`);
        }
        const formattedData = transformWorkoutsToDummyData(workouts, exercises);
        setExercises(exercises);
        setFormattedData(formattedData);

        if (exercises.length > 0) {
          const defaultExercise = exercises[0]._id!;
          setEjercicioSeleccionado(defaultExercise);
          const defaultTitle = exercises[0].title;
          setSelectedData(formattedData[defaultTitle] || []);
        }
      } catch (error: any) {
        console.error("Error:", error);
        showAlert(
          error?.response?.data || "Ocurrió un error al cargar los datos.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchAndTransformData();
  }, []);

  const getExerciseName = (exerciseId: string) => {
    return exercises.find((exercise) => exercise._id === exerciseId)?.title || '';
  }


  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Progreso de Entrenamiento</h1>

      {/* Selector de Ejercicio */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-xl p-8">
  <div className="flex flex-col sm:flex-row justify-between items-center sm:space-x-4 mb-6">
    <label
      htmlFor="seleccionar-ejercicio"
      className="text-lg font-medium text-gray-800 sm:mb-0 mb-4"
    >
      Seleccionar Ejercicio:
    </label>
    <select
      id="seleccionar-ejercicio"
      value={ejercicioSeleccionado}
      onChange={cambiarEjercicio}
      className="p-3 w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 transition ease-in-out duration-200 hover:border-indigo-500"
    >
      <option value="">Selecciona un ejercicio</option>
      {exercises.map((exercise) => (
        <option
          key={exercise._id}
          value={exercise._id}
          className="break-words whitespace-normal"
        >
          {exercise.title}
        </option>
      ))}
    </select>
  </div>

  {/* Gráfico */}
  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
    {selectedData.length > 0 ? (
      <ProgressChart data={selectedData} exerciseName={getExerciseName(ejercicioSeleccionado)} />
    ) : (
      <p className="text-gray-600">No hay datos disponibles para este ejercicio.</p>
    )}
  </div>
</div>


      {/* Asistencia y Estadísticas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Días Asistidos</h3>
          <p className="text-3xl font-bold">{diasAsistidos}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Tiempo Promedio</h3>
          <p className="text-3xl font-bold">{tiempoPromedioEntreno}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
