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
  /** total number of sets (must equal reps.length) */
  sets: number;
  /** repeats per set */
  reps: number[];
}

/** Weight-based exercise */
export interface WeightExercise extends BaseExercise {
  type: ExerciseType.WEIGHT;
  /** weight per set, length must equal sets */
  weightKg: number[];
  lastSetWeightKg?: number;
}

/** Time-based exercise */
export interface TimeExercise extends BaseExercise {
  type: ExerciseType.TIME;
  /** duration per set, in seconds */
  seconds: number[];
  lastSetSeconds?: number;
}

/** Reps-only exercise (no weight or time dimension) */
export interface RepsOnlyExercise extends BaseExercise {
  type: ExerciseType.REPS_ONLY;
  lastSetReps?: number;
}

export type Exercise = WeightExercise | RepsOnlyExercise | TimeExercise;
