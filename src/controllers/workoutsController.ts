import { useCallback, useState, useEffect } from 'react';

import { db } from '@/db';
import type { Workout, CreateWorkoutData, UpdateWorkoutData } from '@/types/workouts';

export const useWorkoutsController = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const workouts = await db.workouts.list();
      setWorkouts(workouts);
    } catch (error) {
      setError('Failed to load workouts');
      console.error('Error loading workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load workouts on mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const findById = useCallback(
    async (id: string): Promise<Workout | null> => {
      try {
        // First check local state
        const workout = workouts.find((w) => w.id === id);
        if (workout) {
          return workout;
        }

        // Try to find in database
        const dbWorkout = await db.workouts.get(id);
        if (dbWorkout) {
          setWorkouts((prev) => [...prev.filter((w) => w.id !== dbWorkout.id), dbWorkout]);
          return dbWorkout;
        }
        return null;
      } catch (error) {
        setError('Failed to find workout');
        console.error('Error finding workout:', error);
        return null;
      }
    },
    [workouts],
  );

  const create = useCallback(async (data: CreateWorkoutData): Promise<Workout> => {
    try {
      setIsLoading(true);
      setError(null);

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

      // Save to database first
      const savedWorkout = await db.workouts.put(newWorkout);

      // Then update local state
      setWorkouts((prev) => [...prev.filter((w) => w.id !== savedWorkout.id), savedWorkout]);
      return savedWorkout;
    } catch (error) {
      setError('Failed to create workout');
      console.error('Error creating workout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(
    async (data: UpdateWorkoutData): Promise<Workout> => {
      try {
        setIsLoading(true);
        setError(null);

        const existingWorkout = workouts.find((w) => w.id === data.id);
        if (!existingWorkout) {
          throw new Error('Workout not found');
        }

        const updatedWorkout: Workout = {
          ...existingWorkout,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // Save to database first
        const savedWorkout = await db.workouts.put(updatedWorkout);

        // Then update local state
        setWorkouts((prev) => prev.map((w) => (w.id === savedWorkout.id ? savedWorkout : w)));
        return savedWorkout;
      } catch (error) {
        setError('Failed to update workout');
        console.error('Error updating workout:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [workouts],
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Remove from database first
      await db.workouts.remove(id);

      // Then remove from local state
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const finishWorkout = useCallback(
    async (data: UpdateWorkoutData): Promise<Workout> => {
      try {
        setIsLoading(true);
        setError(null);

        const existingWorkout = workouts.find((w) => w.id === data.id);
        if (!existingWorkout) {
          throw new Error('Workout not found');
        }

        // Mark workout as completed with current timestamp
        const finishedWorkout: Workout = {
          ...existingWorkout,
          ...data,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save to database first
        const savedWorkout = await db.workouts.put(finishedWorkout);

        // Then update local state
        setWorkouts((prev) => prev.map((w) => (w.id === savedWorkout.id ? savedWorkout : w)));
        loadAll();
        return savedWorkout;
      } catch (error) {
        setError('Failed to finish workout');
        console.error('Error finishing workout:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [workouts],
  );

  return {
    list: workouts,
    isLoading,
    error,
    loadAll,
    findById,
    create,
    update,
    remove,
    finishWorkout,
  };
};
