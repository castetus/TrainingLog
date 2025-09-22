import type { ID } from './common';
import type { Exercise } from './exercises';

export interface WorkoutSet {
  /** Actual reps completed in this set */
  actualReps: number;
  /** Actual weight used in this set (for weight-based exercises) */
  actualWeight?: number;
  /** Actual duration in seconds (for time-based exercises) */
  actualDuration?: number;
  /** Notes for this specific set */
  notes?: string;
}

export interface WorkoutExercise {
  /** Reference to the exercise definition */
  exercise: Exercise;
  /** Planned parameters for this exercise */
  plannedSets: number;
  plannedReps: number;
  plannedWeight?: number;
  plannedDuration?: number;
  /** Actual results for each set */
  actualSets: WorkoutSet[];
  /** Notes for this exercise in the workout */
  notes?: string;
  /** Whether planned parameters have been achieved (actual >= planned) */
  plannedParametersAchieved?: boolean;
}

export interface Workout {
  id: ID;
  /** Name of the workout */
  name: string;
  /** Description of the workout */
  description?: string;
  /** Date when the workout was performed */
  date: string; // ISO date string
  /** Duration of the workout in minutes */
  duration?: number;
  /** Exercises performed with actual results */
  exercises: WorkoutExercise[];
  /** Overall workout notes */
  notes?: string;
  /** ID of the training plan this workout was based on */
  trainingId?: string;
  /** When the workout was created */
  createdAt: string;
  /** When the workout was last updated */
  updatedAt: string;
  /** When the workout was completed (optional) */
  completedAt?: string;
  /** Whether the workout is fully completed */
  completed?: boolean;
  /** Whether the workout was saved in an incomplete state */
  incompleted?: boolean;
}

export interface CreateWorkoutData {
  name: string;
  description?: string;
  date: string;
  duration?: number;
  exercises: WorkoutExercise[];
  trainingId?: string;
  /** Whether the workout is fully completed */
  completed?: boolean;
  /** Whether the workout was saved in an incomplete state */
  incompleted?: boolean;
}

export interface UpdateWorkoutData extends Partial<CreateWorkoutData> {
  id: ID;
}
