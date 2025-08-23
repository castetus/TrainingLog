import type { Exercise } from './exercises';

export type TrainingID = string;

export interface TrainingExercise {
  /** Reference to the exercise from the exercise library */
  exercise: Exercise;
  /** Planned number of sets for this training session */
  plannedSets: number;
  /** Planned reps per set for this training session */
  plannedReps: number[];
  /** Planned weight per set (for weight-based exercises) */
  plannedWeightKg?: number[];
  /** Planned time per set (for time-based exercises) */
  plannedSeconds?: number[];
  /** Notes specific to this exercise in this training session */
  notes?: string;
}

export interface Training {
  id: TrainingID;
  name: string;
  description?: string;
  exercises: TrainingExercise[];
  notes?: string;
}

export interface TrainingFormData {
  name: string;
  description: string;
  exercises: TrainingExercise[];
  notes: string;
}
