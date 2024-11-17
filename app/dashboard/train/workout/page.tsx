'use client'

import { useState, useEffect } from "react";
import { get, post } from "@/lib/api";
import { EyeIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useLoader } from "@/context/LoaderContext";
import { useAlert } from "@/context/AlertContext";
export interface Exercise {
  _id?: string;
  title: string;
  image: string;
  level: string;
  muscles: Muscle[];
}

export interface ExerciseSet {
  exercise: Exercise;
  sets: Set[];
}

export interface Set {
  Reps: number;
}

export interface Muscle {
  name: string;
  percentage: number;
}

export interface WorkoutSet {
  weight: number;
  repetitions: number;
}

export interface ExerciseWorkOut {
  exercise_id: string;
  sets: WorkoutSet[];
}
export interface Workout {
  workout_date: string; // Formato YYYY-MM-DD
  start_time: string; // Formato HH:mm
  end_time: string; // Formato HH:mm
  exercises: ExerciseWorkOut[];
}
const WorkoutForm = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workout, setWorkout] = useState<ExerciseWorkOut[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
    const { showAlert } = useAlert();
  const closeDetails = () => setSelectedExercise(null);
  useEffect(() => {
    // Registrar la hora de inicio solo si no existe ya en sessionStorage
    const now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
    setStartTime(now);

    // Cargar ejercicios
    const fetchExercises = async () => {
      const exerciseData = await getExercises();
      setExercises(exerciseData);
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    let initialExerciseSets: ExerciseSet[] = [];
    const storedExerciseSets = sessionStorage.getItem("selectedExerciseSets");
    if (storedExerciseSets) {
      initialExerciseSets = JSON.parse(storedExerciseSets);
      sessionStorage.removeItem("selectedExerciseSets");
    }
    if (initialExerciseSets.length > 0) {
      const convertedWorkout = initialExerciseSets.map((exerciseSet) => ({
        exercise_id: exerciseSet.exercise._id || "",
        sets: exerciseSet.sets.map((set) => ({
          weight: 0, // Por defecto, peso 0 ya que no viene en los datos iniciales
          repetitions: set.Reps,
        })),
      }));
      setWorkout(convertedWorkout);
    }
  }, []);

  const getExercises = async () => {
    showLoader();
    try {
      const response = await get("/exercise/get");
      return response.data;
    } catch (error:any) {
      console.error("Error fetching exercises:", error);
      showAlert(
        error?.response?.data || "Ocurrió un error al cargar los ejercicios."
      , "error");
      return [];
    }finally{
        hideLoader();
        }
  };
  const saveWorkout = async() => {
    let workoutData: Workout = {
      workout_date: startTime,
      start_time: startTime,
      end_time: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      exercises: workout,
    };
    showLoader();
    try {
      let resp = await post("/workout/add", workoutData);
      showAlert("Entreno guardado con éxito", "success");
      sessionStorage.removeItem("startTime");
    } catch (error:any) {
      console.error("Error saving workout:", error);
      showAlert(
        error?.response?.data || "Ocurrió un error al guardar la rutina."
      , "error");
    }finally{
        hideLoader();
        }
    console.log("Workout saved:", workoutData);
  };
  const addExerciseSet = () => {
    setWorkout([
      ...workout,
      { exercise_id: "", sets: [] }
    ]);
  };

  const selectExercise = (index: number, exerciseId: string) => {
    const updatedWorkout = [...workout];
    updatedWorkout[index].exercise_id = exerciseId;
    setWorkout(updatedWorkout);
  };

  const addSet = (index: number) => {
    const updatedWorkout = [...workout];
    updatedWorkout[index].sets.push({ weight: 0, repetitions: 0 });
    setWorkout(updatedWorkout);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: number) => {
    const updatedWorkout = [...workout];
    updatedWorkout[exerciseIndex].sets[setIndex][field] = value;
    setWorkout(updatedWorkout);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedWorkout = [...workout];
    updatedWorkout[exerciseIndex].sets.splice(setIndex, 1);
    setWorkout(updatedWorkout);
  };

  const removeExerciseSet = (index: number) => {
    const updatedWorkout = [...workout];
    updatedWorkout.splice(index, 1);
    setWorkout(updatedWorkout);
  };

  
  return (
    <div className="p-6 bg-gray-100 rounded-lg overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-700">Entreno</h1>
        </div>
        <button
          onClick={saveWorkout}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-500"
        >
          Terminar
        </button>
      </div>
      {/* <h4 className="font-semibold text-lg text-gray-700 mb-4">Ejercicios</h4> */}
      {workout.map((exerciseSet, exerciseIndex) => (
        <div
          key={exerciseIndex}
          className="border p-4 rounded-md bg-white mt-2 overflow-x-hidden"
        >
          <div className="flex justify-between items-center">
            <label className="block font-medium text-gray-700">
              Seleccionar Ejercicio
            </label>
            <button
              type="button"
              onClick={() => removeExerciseSet(exerciseIndex)}
              className="text-gray-600 hover:text-gray-800 relative group"
            >
              <TrashIcon className="h-5 w-5" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 text-xs text-white bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Eliminar Ejercicio
              </span>
            </button>
          </div>
          <select
            onChange={(e) => selectExercise(exerciseIndex, e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={exerciseSet.exercise_id}
          >
            <option value="">Selecciona un ejercicio</option>
            {exercises.map((exercise) => (
              <option key={exercise._id} value={exercise._id}>
                {exercise.title}
              </option>
            ))}
          </select>
          {exerciseSet.exercise_id && (
            <>
              <div className="flex justify-between items-center mt-4">
                <h5 className="font-semibold text-gray-700">Series</h5>
                <button
                  type="button"
                  onClick={() => {
                    const exercise = exercises.find(
                      (ex) => ex._id === exerciseSet.exercise_id
                    );
                    setSelectedExercise(exercise || null);
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <EyeIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                {exerciseSet.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex flex-wrap items-center space-x-4 mt-2 w-full"
                  >
                    <label className="text-sm">Peso (Kg):</label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "weight",
                          parseFloat(e.target.value || "0")
                        )
                      }
                      className="w-12 p-1 text-sm border border-gray-300 rounded-md"
                    />
                    <label className="text-sm">Reps:</label>
                    <input
                      type="number"
                      value={set.repetitions}
                      onChange={(e) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "repetitions",
                          parseInt(e.target.value || "0")
                        )
                      }
                      className="w-12 p-1 text-sm border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      className="text-gray-600 hover:text-gray-800 relative group"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 text-xs text-white bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Eliminar Serie
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addSet(exerciseIndex)}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                + Agregar Serie
              </button>
            </>
          )}
        </div>
      ))}
      {workout.length === 0 ?(
        <div className="flex flex-col items-center justify-center mt-8">
        <img
          src="https://th.bing.com/th/id/R.a7b0067b6719cdb9035e1851b030fee4?rik=h67AcyYBn5a2Sw&riu=http%3a%2f%2ffindicons.com%2ffiles%2ficons%2f2770%2fios_7_icons%2f512%2fdumbbell.png&ehk=Ygo0S%2f43iNuJUbaMbXCjNft9IEyhgQ02H0NN3UxvC0U%3d&risl=&pid=ImgRaw&r=0"
          className="h-16 w-16 mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-700">Empezar</h1>
      </div>
      ):(<></>)}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={addExerciseSet}
          className="text-sm text-blue-500 hover:underline"
        >
          + Agregar Ejercicio
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/train")}
          className="text-sm text-red-500 hover:underline"
        >
          Descartar entreno
        </button>
      </div>

      {/* Modal para ver detalles */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              {selectedExercise.title}
            </h2>
            <img
              src={selectedExercise.image}
              alt={selectedExercise.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-600 mb-2">Nivel: {selectedExercise.level}</p>
            <p className="text-gray-600 font-semibold">Músculos trabajados:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {selectedExercise.muscles.map((muscle, i) => (
                <li key={i}>
                  {muscle.name} ({muscle.percentage}%)
                </li>
              ))}
            </ul>
            <button
              onClick={closeDetails}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutForm;