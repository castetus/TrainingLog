import { useCallback } from 'react';

import { mockWorkouts } from '@/mock/workouts';
import { useAppStore } from '@/store';
import type { Workout, CreateWorkoutData, UpdateWorkoutData } from '@/types/workouts';

export const useWorkoutsController = () => {
  const {
    workoutsById,
    setWorkouts,
    addWorkout,
    updateWorkout,
    removeWorkout,
    setLoading,
    setError,
    clearError,
  } = useAppStore();

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      setWorkouts(mockWorkouts);
    } catch (error) {
      setError('Failed to load workouts');
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [setWorkouts, setLoading, setError, clearError]);

  const findById = useCallback(
    async (id: string): Promise<Workout | null> => {
      try {
        // First check store
        const workout = workoutsById[id];
        if (workout) {
          return workout;
        }

        const foundWorkout = mockWorkouts.find((w) => w.id === id);
        if (foundWorkout) {
          addWorkout(foundWorkout);
          return foundWorkout;
        }
        return null;
      } catch (error) {
        setError('Failed to find workout');
        console.error('Error finding workout:', error);
        return null;
      }
    },
    [workoutsById, addWorkout, setError],
  );

  const create = useCallback(
    async (data: CreateWorkoutData): Promise<Workout> => {
      try {
        setLoading(true);
        clearError();

        const newWorkout: Workout = {
          ...data,
          id: `w-${Date.now()}`,
          exercises: data.exercises.map((ex) => ({
            ...ex,
            actualSets: ex.actualSets || [], // Use provided actualSets or initialize empty
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addWorkout(newWorkout);
        return newWorkout;
      } catch (error) {
        setError('Failed to create workout');
        console.error('Error creating workout:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addWorkout, setLoading, setError, clearError],
  );

  const update = useCallback(
    async (data: UpdateWorkoutData): Promise<Workout> => {
      try {
        setLoading(true);
        clearError();

        const existingWorkout = workoutsById[data.id];
        if (!existingWorkout) {
          throw new Error('Workout not found');
        }

        const updatedWorkout: Workout = {
          ...existingWorkout,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        updateWorkout(updatedWorkout);
        return updatedWorkout;
      } catch (error) {
        setError('Failed to update workout');
        console.error('Error updating workout:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [workoutsById, updateWorkout, setLoading, setError, clearError],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        clearError();

        removeWorkout(id);
      } catch (error) {
        setError('Failed to delete workout');
        console.error('Error deleting workout:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [removeWorkout, setLoading, setError, clearError],
  );

  const finishWorkout = useCallback(
    async (id: string): Promise<Workout> => {
      try {
        setLoading(true);
        clearError();

        const existingWorkout = workoutsById[id];
        if (!existingWorkout) {
          throw new Error('Workout not found');
        }

        // Mark workout as completed with current timestamp
        const finishedWorkout: Workout = {
          ...existingWorkout,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        updateWorkout(finishedWorkout);
        return finishedWorkout;
      } catch (error) {
        setError('Failed to finish workout');
        console.error('Error finishing workout:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [workoutsById, updateWorkout, setLoading, setError, clearError],
  );

  return {
    workoutsById,
    loadAll,
    findById,
    create,
    update,
    remove,
    finishWorkout,
  };
};
