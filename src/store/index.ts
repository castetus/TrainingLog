import { create } from 'zustand'
import type { ExercisesSlice } from './exercisesSlice'
import { createExercisesSlice } from './exercisesSlice'
// import other slices as you add them

export type AppStore = ExercisesSlice /* & TrainingsSlice & SessionsSlice */

export const useAppStore = create<AppStore>()((...a) => ({
   ...createExercisesSlice(...a),
  // ...createTrainingsSlice(...a),
  // ...createSessionsSlice(...a),
}));