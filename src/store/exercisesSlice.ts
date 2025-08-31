import type { StateCreator } from 'zustand';

import type { Exercise } from '@/types/exercises';

export type ExercisesSlice = {
  exercisesById: Record<string, Exercise>;
  exerciseIds: string[];
  setExercises: (items: Exercise[]) => void;
  upsertExercises: (items: Exercise[]) => void;
  removeExercise: (id: string) => void;
  clearExercises: () => void;
};

export const createExercisesSlice: StateCreator<ExercisesSlice, [], [], ExercisesSlice> = (
  set,
) => ({
  exercisesById: {},
  exerciseIds: [],
  setExercises: (items) => {
    // Replace all exercises with new data
    set((state) => {

      const byId: Record<string, Exercise> = {};
      for (const ex of items) byId[ex.id] = ex;
      const ids = items.map((x) => x.id);
      return { exercisesById: byId, exerciseIds: ids };
    });
  },
  upsertExercises: (items) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => {

      const byId = { ...state.exercisesById };
      for (const ex of items) byId[ex.id] = ex;
      const ids = Array.from(new Set([...state.exerciseIds, ...items.map((x) => x.id)]));
      return { exercisesById: byId, exerciseIds: ids };
    });
  },
  removeExercise: (id) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => {

      if (!state.exercisesById[id]) return state;
      const newExercisesById = { ...state.exercisesById };
      delete newExercisesById[id];
      return {
        exercisesById: newExercisesById,
        exerciseIds: state.exerciseIds.filter((x) => x !== id),
      };
    });
  },
  clearExercises: () => {
    // Only update local state - database operations should be handled by controllers
    set({ exercisesById: {}, exerciseIds: [] });
  },
});
