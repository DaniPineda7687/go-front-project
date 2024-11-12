import { Day } from "./Day";

export interface Routine {
    _id?: string;
    name: string;
    description: string;
    days: Day[];
    level: string;
    source: string;
    created_at?: string;
    updated_at?: string;
    userId?: string;
}
