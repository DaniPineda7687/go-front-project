'use client';

import { useAlert } from "@/context/AlertContext";
import { useLoader } from "@/context/LoaderContext";
import { get, post } from "@/lib/api";
import React, { useEffect, useState } from "react";

export interface UserProgress {
  _id?: string;
  gender: number;
  height: number;
  current_weight: number;
  current_body_fat: number;
  total_sets: number;
  exercise_weight: number;
  target_body_fat: number;
  target_weight: number;
  created_at: Date;
  updated_at: Date;
}

const FitnessFormPage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showAlert } = useAlert();
  const [fetch,setFetch] = useState<number>(0);
  const [daysAttended, setDaysAttended] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    gender: 0,
    height: 0,
    current_weight: 0,
    current_body_fat: 0,
    total_sets: 0,
    exercise_weight: 0,
    target_body_fat: 0,
    target_weight: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });
  const fetchMLModel = async () => {
    showLoader();
    try {
      const response = await post("/ml/predict", userProgress);
      console.log(response);
      showAlert("Lograrás tu meta en "+response.data+" Semanas aproximadamente", "success");
    } catch (error) {
      console.error(error);
      showAlert("Error al cargar el modelo de Machine Learning", "error");
    } finally {
      hideLoader();
    }
  }
  const fetchWorkouts = async () => {
    showLoader();
    try {
      const [workoutsResponse] = await Promise.all([get("/workout/get")]);
      const workouts = workoutsResponse.data || [];

      const uniqueDates = new Set(
        workouts.map((workout: { workout_date: string }) => workout.workout_date)
      );
      setDaysAttended(uniqueDates.size);

      let totalSets = 0;
      let totalWeight = 0;

      workouts.forEach((workout: any) => {
        workout.exercises.forEach((exercise: any) => {
          exercise.sets.forEach((set: any) => {
            totalSets += 1;
            totalWeight += set.weight;
          });
        });
      });

      setUserProgress((prev) => ({
        ...prev,
        total_sets: totalSets,
        exercise_weight: totalWeight / totalSets || 0,
      }));
    } catch (error) {
      console.error(error);
      showAlert("Error al cargar los entrenamientos", "error");
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setUserProgress((prev) => ({
      ...prev,
      [id]: id === "gender" ? parseInt(value) : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User Progress:", userProgress);
    await fetchMLModel();
    setUserProgress({
      gender: 0,
      height: 0,
      current_weight: 0,
      current_body_fat: 0,
      total_sets: 0,
      exercise_weight: 0,
      target_body_fat: 0,
      target_weight: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })
    setFetch(fetch+1);
  };

  useEffect(() => {
    fetchWorkouts();
  }, [fetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Cargando...</p>
      </div>
    );
  }

  if (daysAttended < 5) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Sigue así!</h1>
          <p className="text-gray-600">
            Necesitas asistir al menos a 5 entrenamientos antes de poder
            configurar tus metas. ¡Vamos, puedes lograrlo!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ¿En cuanto tiempo lograré mis metas?
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current_weight" className="block text-sm font-medium text-gray-700">
              Peso actual (kg)
            </label>
            <input
              type="number"
              id="current_weight"
              value={userProgress.current_weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Género
            </label>
            <select
              id="gender"
              value={userProgress.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value={0}>Masculino</option>
              <option value={1}>Femenino</option>
            </select>
          </div>
          <div>
            <label htmlFor="current_body_fat" className="block text-sm font-medium text-gray-700">
              % de grasa corporal
            </label>
            <input
              type="number"
              step="0.1"
              id="current_body_fat"
              value={userProgress.current_body_fat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Altura (cm)
            </label>
            <input
              type="number"
              id="height"
              value={userProgress.height}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="target_weight" className="block text-sm font-medium text-gray-700">
              Peso objetivo (kg)
            </label>
            <input
              type="number"
              id="target_weight"
              value={userProgress.target_weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="target_body_fat" className="block text-sm font-medium text-gray-700">
              % de grasa objetivo
            </label>
            <input
              type="number"
              step="0.1"
              id="target_body_fat"
              value={userProgress.target_body_fat}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Descubrir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitnessFormPage;
