import { WorkoutSet } from "./WorkoutSet";

export interface ExerciseWorkOut {
    exercise_id: string;
    sets: WorkoutSet[];
}
