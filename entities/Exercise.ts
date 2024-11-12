import { Muscle } from "./Muscle";

  export interface Exercise {
    _id?: string;
    title: string;
    image: string;
    level: string;
    muscles: Muscle[];
  }
  
