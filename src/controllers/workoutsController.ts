import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { mockWorkouts } from '@/mock/workouts';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      setWorkouts(mockWorkouts);
    } catch (error) {
      setError('Failed to load workouts');
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [setWorkouts, setLoading, setError, clearError]);

  const findById = useCallback(async (id: string): Promise<Workout | null> => {
    try {
      // First check store
      const workout = workoutsById[id];
      if (workout) {
        return workout;
      }

      // If not in store, simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      const foundWorkout = mockWorkouts.find(w => w.id === id);
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
  }, [workoutsById, addWorkout, setError]);

  const create = useCallback(async (data: CreateWorkoutData): Promise<Workout> => {
    try {
      setLoading(true);
      clearError();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newWorkout: Workout = {
        ...data,
        id: `w-${Date.now()}`,
        exercises: data.exercises.map(ex => ({
          ...ex,
          actualSets: [], // Initialize with empty actual sets
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
  }, [addWorkout, setLoading, setError, clearError]);

  const update = useCallback(async (data: UpdateWorkoutData): Promise<Workout> => {
    try {
      setLoading(true);
      clearError();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
  }, [workoutsById, updateWorkout, setLoading, setError, clearError]);

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      clearError();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      removeWorkout(id);
    } catch (error) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [removeWorkout, setLoading, setError, clearError]);

  return {
    workoutsById,
    loadAll,
    findById,
    create,
    update,
    remove,
  };
};
