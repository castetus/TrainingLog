import type { StateCreator } from 'zustand';

import { db } from '@/db';
import type { Exercise } from '@/types/exercises';

export type ExercisesSlice = {
  exercisesById: Record<string, Exercise>;
  exerciseIds: string[];
  upsertExercises: (items: Exercise[]) => void;
  removeExercise: (id: string) => void;
  clearExercises: () => void;
};

export const createExercisesSlice: StateCreator<ExercisesSlice, [], [], ExercisesSlice> = (
  set,
  get,
) => ({
  exercisesById: {},
  exerciseIds: [],
  upsertExercises: async (items) => {
    try {
      // Save to IndexedDB first
      for (const exercise of items) {
        await db.exercises.put(exercise);
      }
      
      // Then update local state
      set((state) => {
        console.log('upsertExercises', items);
        const byId = { ...state.exercisesById };
        for (const ex of items) byId[ex.id] = ex;
        const ids = Array.from(new Set([...state.exerciseIds, ...items.map((x) => x.id)]));
        return { exercisesById: byId, exerciseIds: ids };
      });
    } catch (error) {
      console.error('Error saving exercises to IndexedDB:', error);
    }
  },
  removeExercise: async (id) => {
    try {
      // Remove from IndexedDB first
      await db.exercises.remove(id);
      
      // Then update local state
      set((state) => {
        console.log('removeExercise', id);
        if (!state.exercisesById[id]) return state;
        const newExercisesById = { ...state.exercisesById };
        delete newExercisesById[id];
        return {
          exercisesById: newExercisesById,
          exerciseIds: state.exerciseIds.filter((x) => x !== id),
        };
      });
    } catch (error) {
      console.error('Error removing exercise from IndexedDB:', error);
    }
  },
  clearExercises: async () => {
    try {
      // Clear from IndexedDB first
      const exercises = Object.values(get().exercisesById);
      for (const exercise of exercises) {
        await db.exercises.remove((exercise as Exercise).id);
      }
      
      // Then update local state
      set({ exercisesById: {}, exerciseIds: [] });
    } catch (error) {
      console.error('Error clearing exercises from IndexedDB:', error);
    }
  },
});
