import { Exercise } from "./Exercise";
import {ExerciseSet} from "./exerciseSet";

export interface Day {
    day: string;
    //exercises: Exercise[];
    exerciseSets: ExerciseSet[];
}
