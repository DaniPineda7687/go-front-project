import React, { useState, useEffect } from "react";
import weekDaysData  from "@/Days.json";
import { get } from "@/lib/api";
import { Exercise } from "@/entities/Exercise";
import { Routine } from "@/entities/Routine";
import { WeekDays } from "@/entities/WeekDays";

const RoutineForm: React.FC<{ onSave?: (routine: Routine) => Promise<void>; onCancel?: (active:boolean) => void }> = ({ onSave, onCancel }) => {
  const days: WeekDays = weekDaysData ;
  const [routine, setRoutine] = useState<Routine>({
    name: "",
    description: "",
    days: [],
    level: "",
    source: "predeterminada",
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const exerciseData = await getExercises();
      console.log(exerciseData);

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
      days: [...prev.days, { day: "", exercises: [] }],
    }));
  };

  const addExercise = (dayIndex: number) => {
    const updatedDays = [...routine.days];
    updatedDays[dayIndex].exercises.push({
      _id: "",
      title: "",
      image: "",
      level: "",
      muscles: [],
    });
    setRoutine((prev) => ({ ...prev, days: updatedDays }));
  };

  const selectExercise = (
    dayIndex: number,
    exerciseIndex: number,
    selectedExerciseId: string
  ) => {
    const selectedExercise = exercises.find(
      (exercise) => exercise._id === selectedExerciseId
    );
    if (selectedExercise) {
      const updatedDays = [...routine.days];
      updatedDays[dayIndex].exercises[exerciseIndex] = selectedExercise;
      setRoutine((prev) => ({ ...prev, days: updatedDays }));
    }
  };
  const handleSaveRoutine = () => {
    console.log("Rutina guardada:", routine);
    alert("Rutina guardada en la consola");
    if (onSave) {
      onSave(routine);
    }
  };
  const handleCancel = () => {
    console.log("Cancelar");
    setRoutine({
      name: "",
      description: "",
      days: [],
      level: "",
      source: "predeterminada",
    });
    setExercises([]);
    if (onCancel) {
      onCancel(false);
    }
  };
  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Crear Rutina</h2>
      <form className="space-y-6">
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

        <div>
          <label className="block font-medium text-gray-700">Origen</label>
          <select
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            value={routine.source}
            onChange={(e) => setRoutine({ ...routine, source: e.target.value })}
          >
            <option value="predeterminada">Predeterminada</option>
            <option value="personalizada">Personalizada</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Días de la Rutina
          </h3>
          {routine.days.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-4 rounded-md">
              <label className="block font-medium text-gray-700">Día</label>
              <select
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={day.day}
                onChange={(e) => {
                  const updatedDays = [...routine.days];
                  updatedDays[dayIndex].day = e.target.value;
                  setRoutine({ ...routine, days: updatedDays });
                }}
              >
                <option value="">Selecciona el día</option>
                {Object.keys(days).map((dayKey) => (
                  <option key={dayKey} value={dayKey}>
                    {days[dayKey as keyof WeekDays]}
                  </option>
                ))}
              </select>

              <h4 className="font-semibold mt-4 text-gray-700">Ejercicios</h4>
              {day.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="border p-4 rounded-md mt-2">
                  <label className="block font-medium text-gray-700">
                    Seleccionar Ejercicio
                  </label>
                  <select
                    onChange={(e) =>
                      selectExercise(dayIndex, exerciseIndex, e.target.value)
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    value={exercise._id}
                  >
                    <option value="">Selecciona un ejercicio</option>
                    {exercises.map((exerciseOption, index) => (
                      <option
                        key={`${dayIndex}-${exerciseIndex}-${exerciseOption._id}-${index}`}
                        value={exerciseOption._id}
                      >
                        {exerciseOption.title}
                      </option>
                    ))}
                  </select>

                  {exercise.title && (
                    <>
                      <p className="mt-2">Nivel: {exercise.level}</p>
                      <img
                        src={exercise.image}
                        alt={exercise.title}
                        className="w-full h-32 object-cover mt-2"
                      />
                      <h5 className="font-semibold mt-2 text-gray-700">
                        Músculos trabajados:
                      </h5>
                      {exercise.muscles.map((muscle, muscleIndex) => (
                        <div
                          key={muscleIndex}
                          className="flex justify-between mt-1"
                        >
                          <span>{muscle.name}</span>
                          <span>{muscle.percentage}%</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addExercise(dayIndex)}
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
