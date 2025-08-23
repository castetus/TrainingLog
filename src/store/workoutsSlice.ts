import { create } from 'zustand';
import type { StateCreator } from 'zustand';

import type { Workout, CreateWorkoutData, UpdateWorkoutData } from '@/types/workouts';

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

export const createWorkoutsSlice: StateCreator<WorkoutsSlice> = (set, get) => ({
  workoutsById: {},
  isLoading: false,
  error: null,

  setWorkouts: (workouts) => {
    const workoutsById = workouts.reduce((acc, workout) => {
      acc[workout.id] = workout;
      return acc;
    }, {} as Record<string, Workout>);
    set({ workoutsById });
  },

  addWorkout: (workout) => {
    set((state) => ({
      workoutsById: { ...state.workoutsById, [workout.id]: workout },
    }));
  },

  updateWorkout: (workout) => {
    set((state) => ({
      workoutsById: { ...state.workoutsById, [workout.id]: workout },
    }));
  },

  removeWorkout: (id) => {
    set((state) => {
      const { [id]: removed, ...remaining } = state.workoutsById;
      return { workoutsById: remaining };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
});
