import React, { useState, useEffect } from "react";
import weekDaysData from "@/Days.json";
import { get } from "@/lib/api";
import { Exercise } from "@/entities/Exercise";
import { Routine } from "@/entities/Routine";
import { WeekDays } from "@/entities/WeekDays";
import { Set } from "@/entities/Set";

const RoutineForm: React.FC<{
  onSave?: (routine: Routine) => Promise<void>;
  onCancel?: (active: boolean) => void;
  errorMessage?: string;
}> = ({ onSave, onCancel, errorMessage }) => {
  const days: WeekDays = weekDaysData;
  const [routine, setRoutine] = useState<Routine>({
    name: "",
    description: "",
    days: [],
    level: "",
    source: "personalizada",
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const exerciseData = await getExercises();
      setExercises(exerciseData);
    };
    fetchExercises();
  }, []);

  const getExercises = async () => {
    try {
      const response = await get("/exercise/get");
      return response.data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return [];
    }
  };

  const addDay = () => {
    setRoutine((prev) => ({
      ...prev,
      days: [...prev.days, { day: "", exerciseSets: [] }],
    }));
  };

  const removeDay = (dayIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays.splice(dayIndex, 1);
    setRoutine({ ...routine, days: updatedDays });
  };

  const addExerciseSet = (dayIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exerciseSets.push({
      exercise: {
        _id: "",
        title: "",
        image: "",
        level: "",
        muscles: [],
      },
      sets: [],
    });
    setRoutine({ ...routine, days: updatedDays });
  };

  const removeExerciseSet = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exerciseSets.splice(exerciseIndex, 1);
    setRoutine({ ...routine, days: updatedDays });
  };

  const addSet = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exerciseSets[exerciseIndex].sets.push({ Reps: 0 });
    setRoutine({ ...routine, days: updatedDays });
  };

  const updateSetReps = (
    dayIndex: number,
    exerciseIndex: number,
    setIndex: number,
    reps: number
  ) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exerciseSets[exerciseIndex].sets[setIndex].Reps =
      reps;
    setRoutine({ ...routine, days: updatedDays });
  };
  const selectExercise = (
    dayIndex: number,
    exerciseSetIndex: number,
    selectedExerciseId: string
  ) => {
    const selectedExercise = exercises.find(
      (exercise) => exercise._id === selectedExerciseId
    );

    if (selectedExercise) {
      const updatedDays = [...routine.days];
      const existingExercise = updatedDays[dayIndex].exerciseSets.find(
        (ex) => ex.exercise._id === selectedExerciseId
      );

      if (existingExercise) {
        setLocalError(
          "No puedes agregar el mismo ejercicio más de una vez en el mismo día."
        );
        return;
      }

      updatedDays[dayIndex].exerciseSets[exerciseSetIndex].exercise = selectedExercise;
      setRoutine({ ...routine, days: updatedDays });
    }
  };

  const handleDayChange = (dayIndex: number, dayValue: string) => {
    const isDuplicateDay = routine.days.some((day, index) => {
      return index !== dayIndex && day.day === dayValue;
    });

    if (isDuplicateDay) {
      setLocalError(
        "No puedes agregar el mismo día más de una vez en la rutina."
      );
      return;
    }

    const updatedDays = [...routine.days];
    updatedDays[dayIndex].day = dayValue;
    setRoutine({ ...routine, days: updatedDays });
  };
  const removeSet = (dayIndex: number, exerciseIndex: number, setIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exerciseSets[exerciseIndex].sets.splice(setIndex, 1);
    setRoutine({ ...routine, days: updatedDays });
  };
  
  const handleSaveRoutine = () => {
    if (onSave) {
      onSave(routine);
    }
  };

  const handleCancel = () => {
    setRoutine({
      name: "",
      description: "",
      days: [],
      level: "",
      source: "personalizada",
    });
    setExercises([]);
    if (onCancel) {
      onCancel(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Crear Rutina</h2>
      {(errorMessage || localError) && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded relative">
          {localError || errorMessage}
          {localError && (
            <button
              type="button"
              onClick={() => setLocalError(null)}
              className="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full bg-red-200 hover:bg-red-300"
            >
              ×
            </button>
          )}
        </div>
      )}

      <form className="space-y-6">
        {/* Inputs de rutina */}
        <div>
          <label className="block font-medium text-gray-700">
            Nombre de la Rutina
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={routine.name}
            onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Descripción</label>
          <textarea
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={routine.description}
            onChange={(e) =>
              setRoutine({ ...routine, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Nivel</label>
          <select
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={routine.level}
            onChange={(e) => setRoutine({ ...routine, level: e.target.value })}
          >
            <option value="">Selecciona el nivel</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        {/* Días y ejercicios */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Días de la Rutina
          </h3>
          {routine.days.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <label className="block font-medium text-gray-700">Día</label>
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar Día
                </button>
              </div>
              <select
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={day.day}
                onChange={(e) => handleDayChange(dayIndex, e.target.value)}
              >
                <option value="">Selecciona el día</option>
                {Object.keys(days).map((dayKey) => (
                  <option key={dayKey} value={dayKey}>
                    {days[dayKey as keyof WeekDays]}
                  </option>
                ))}
              </select>

              <h4 className="font-semibold mt-4 text-gray-700">Ejercicios</h4>
              {day.exerciseSets.map((exerciseSet, exerciseIndex) => (
                <div key={exerciseIndex} className="border p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <label className="block font-medium text-gray-700">
                      Seleccionar Ejercicio
                    </label>
                    <button
                      type="button"
                      onClick={() => removeExerciseSet(dayIndex, exerciseIndex)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Eliminar Ejercicio
                    </button>
                  </div>
                  <select
                    onChange={(e) =>
                      selectExercise(dayIndex, exerciseIndex, e.target.value)
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    value={exerciseSet.exercise._id}
                  >
                    <option value="">Selecciona un ejercicio</option>
                    {exercises.map((exerciseOption, index) => (
                      <option key={index} value={exerciseOption._id}>
                        {exerciseOption.title}
                      </option>
                    ))}
                  </select>
                  {exerciseSet.exercise.title && (
                    <>
                      <p className="mt-2">
                        Nivel: {exerciseSet.exercise.level}
                      </p>
                      <img
                        src={exerciseSet.exercise.image}
                        alt={exerciseSet.exercise.title}
                        className="w-full h-32 object-cover mt-2"
                      />
                      <h5 className="font-semibold mt-2 text-gray-700">
                        Músculos trabajados:
                      </h5>
                      {exerciseSet.exercise.muscles.map(
                        (muscle, muscleIndex) => (
                          <div
                            key={muscleIndex}
                            className="flex justify-between mt-1"
                          >
                            <span>{muscle.name}</span>
                            <span>{muscle.percentage}%</span>
                          </div>
                        )
                      )}
                    </>
                  )}
                  <h5 className="font-semibold mt-4 text-gray-700">Series</h5>
                  {exerciseSet.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center space-x-4 mt-2"
                    >
                      <label>Reps:</label>
                      <input
                        type="number"
                        value={set.Reps}
                        onChange={(e) =>
                          updateSetReps(
                            dayIndex,
                            exerciseIndex,
                            setIndex,
                            parseInt(
                              e.target.value === "" ? "0" : e.target.value
                            )
                          )
                        }
                        className="w-16 p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeSet(dayIndex, exerciseIndex, setIndex)
                        }
                        className="text-red-500 hover:underline text-sm"
                      >
                        Eliminar Serie
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSet(dayIndex, exerciseIndex)}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    + Agregar Serie
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addExerciseSet(dayIndex)}
                className="mt-4 text-sm text-blue-500 hover:underline"
              >
                + Agregar Ejercicio
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDay}
            className="mt-4 text-sm text-blue-500 hover:underline"
          >
            + Agregar Día
          </button>
        </div>

        {/* Botones de guardar y cancelar */}
        <div>
          <button
            type="button"
            onClick={handleSaveRoutine}
            className="mt-6 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-lg transform transition duration-300 hover:scale-105"
          >
            Guardar Rutina
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-6 w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 hover:text-gray-800 shadow-md transform transition duration-300 hover:scale-105"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineForm;
