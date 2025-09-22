import type { ID } from './common';

export enum ExerciseType {
  WEIGHT = 'weight',
  TIME = 'time',
  REPS_ONLY = 'reps_only',
}

export interface BaseExercise {
  id: ID;
  name: string;
  description?: string;
  /** optional video tutorial URL */
  videoUrl?: string;
}

/** Weight-based exercise */
export interface WeightExercise extends BaseExercise {
  type: ExerciseType.WEIGHT;
  /** last set weight in kg */
  lastSetWeightKg?: number;
}

/** Time-based exercise */
export interface TimeExercise extends BaseExercise {
  type: ExerciseType.TIME;
  /** last set duration in seconds */
  lastSetSeconds?: number;
}

/** Reps-only exercise (no weight or time dimension) */
export interface RepsOnlyExercise extends BaseExercise {
  type: ExerciseType.REPS_ONLY;
  lastSetReps?: number;
}

export type Exercise = WeightExercise | RepsOnlyExercise | TimeExercise;
