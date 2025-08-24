import type { Exercise } from '@/types/exercises'
import type { Training } from '@/types/trainings'
import type { Workout } from '@/types/workouts'

export type Id = string

export type Table<T> = {
  list: () => Promise<T[]>
  get: (id: Id) => Promise<T | undefined>
  put: (item: T) => Promise<T>        // create or update
  remove: (id: Id) => Promise<void>
}

export type Db = {
  exercises: Table<Exercise>
  trainings: Table<Training>
}