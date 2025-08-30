import type { StateCreator } from 'zustand';

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

  setWorkouts: (workouts) => {
    // Only update local state - database operations should be handled by controllers
    const workoutsById = workouts.reduce(
      (acc, workout) => {
        acc[workout.id] = workout;
        return acc;
      },
      {} as Record<string, Workout>,
    );
    set({ workoutsById });
  },

  addWorkout: (workout) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => ({
      workoutsById: { ...state.workoutsById, [workout.id]: workout },
    }));
  },

  updateWorkout: (workout) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => ({
      workoutsById: { ...state.workoutsById, [workout.id]: workout },
    }));
  },

  removeWorkout: (id) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => {
      const newWorkoutsById = { ...state.workoutsById };
      delete newWorkoutsById[id];
      return { workoutsById: newWorkoutsById };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
});
