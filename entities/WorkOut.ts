import { ExerciseWorkOut } from "./ExerciseWorkOut";

export interface Workout {
    _id?: string; // Equivalente a `primitive.ObjectID`
    user_id: string;
    workout_date: string; // Formato YYYY-MM-DD
    start_time: string; // Formato HH:mm
    end_time: string; // Formato HH:mm
    exercises: ExerciseWorkOut[];
    created_at: string;
    updated_at: string;
  }
  
