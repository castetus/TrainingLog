export type ID = string

export interface BaseExercise {
  id: ID
  name: string
  description?: string
  /** total number of sets (must equal reps.length) */
  sets: number
  /** repeats per set */
  reps: number[]
}

/** Weight-based exercise */
export interface WeightExercise extends BaseExercise {
  type: 'weight'
  /** weight per set, length must equal sets */
  weightKg: number[]
}

/** Time-based exercise */
export interface TimeExercise extends BaseExercise {
  type: 'time'
  /** duration per set, in seconds */
  seconds: number[]
}

/** Reps-only exercise (no weight or time dimension) */
export interface RepsOnlyExercise extends BaseExercise {
  type?: undefined
}

export type Exercise = WeightExercise | TimeExercise | RepsOnlyExercise

