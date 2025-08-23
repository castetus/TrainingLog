import { create } from 'zustand';

import type { ExercisesSlice } from './exercisesSlice';
import { createExercisesSlice } from './exercisesSlice';
import type { TrainingsSlice } from './trainingsSlice';
import { createTrainingsSlice } from './trainingsSlice';
import type { WorkoutsSlice } from './workoutsSlice';
import { createWorkoutsSlice } from './workoutsSlice';
// import other slices as you add them

export type AppStore = ExercisesSlice & TrainingsSlice & WorkoutsSlice; /* & SessionsSlice */

export const useAppStore = create<AppStore>()((...a) => ({
  ...createExercisesSlice(...a),
  ...createTrainingsSlice(...a),
  ...createWorkoutsSlice(...a),
  // ...createSessionsSlice(...a),
}));
