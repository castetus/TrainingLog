import type { StateCreator } from 'zustand';

import { db } from '@/db';
import type { Workout } from '@/types/workouts';

export interface WorkoutsState {
  workoutsById: Record<string, Workout>;
  isLoading: boolean;
  error: string | null;
}

export interface WorkoutsActions {
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type WorkoutsSlice = WorkoutsState & WorkoutsActions;

export const createWorkoutsSlice: StateCreator<WorkoutsSlice> = (set) => ({
  workoutsById: {},
  isLoading: false,
  error: null,

  setWorkouts: async (workouts) => {
    try {
      // Save all workouts to IndexedDB
      for (const workout of workouts) {
        await db.workouts.put(workout);
      }

      const workoutsById = workouts.reduce(
        (acc, workout) => {
          acc[workout.id] = workout;
          return acc;
        },
        {} as Record<string, Workout>,
      );
      set({ workoutsById });
    } catch (error) {
      console.error('Error saving workouts to IndexedDB:', error);
      set({ error: 'Failed to save workouts to database' });
    }
  },

  addWorkout: async (workout) => {
    try {
      // Save to IndexedDB first
      await db.workouts.put(workout);

      // Then update local state
      set((state) => ({
        workoutsById: { ...state.workoutsById, [workout.id]: workout },
      }));
    } catch (error) {
      console.error('Error adding workout to IndexedDB:', error);
      set({ error: 'Failed to add workout to database' });
    }
  },

  updateWorkout: async (workout) => {
    try {
      // Update in IndexedDB first
      await db.workouts.put(workout);

      // Then update local state
      set((state) => ({
        workoutsById: { ...state.workoutsById, [workout.id]: workout },
      }));
    } catch (error) {
      console.error('Error updating workout in IndexedDB:', error);
      set({ error: 'Failed to update workout in database' });
    }
  },

  removeWorkout: async (id) => {
    try {
      // Remove from IndexedDB first
      await db.workouts.remove(id);

      // Then update local state
      set((state) => {
        const newWorkoutsById = { ...state.workoutsById };
        delete newWorkoutsById[id];
        return { workoutsById: newWorkoutsById };
      });
    } catch (error) {
      console.error('Error removing workout from IndexedDB:', error);
      set({ error: 'Failed to remove workout from database' });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
});
