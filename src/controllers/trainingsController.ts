import { useCallback, useState, useEffect } from 'react';

import { db } from '@/db';
import type { Training, TrainingFormData } from '@/types/trainings';

export const useTrainingsController = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const trainings = await db.trainings.list();
      setTrainings(trainings);
      return trainings;
    } catch (error) {
      console.error('Error loading trainings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load trainings on mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const findById = useCallback(async (id: string): Promise<Training | null> => {
    try {
      // Always try to get from database for now
      // We can optimize this later if needed
      const training = await db.trainings.get(id);
      return training || null;
    } catch (error) {
      console.error('Error finding training:', error);
      throw error;
    }
  }, []);

  const create = useCallback(async (trainingData: TrainingFormData): Promise<Training> => {
    try {
      // Generate a unique ID for the new training
      const newTraining: Training = {
        ...trainingData,
        id: crypto.randomUUID(),
      };

      const savedTraining = await db.trainings.put(newTraining);
      setTrainings(prev => [...prev.filter(t => t.id !== savedTraining.id), savedTraining]);
      return savedTraining;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }, []);

  const update = useCallback(
    async (id: string, trainingData: Partial<TrainingFormData>): Promise<Training> => {
      try {
        const updatedTraining = await db.trainings.put({ ...trainingData, id } as Training);
        setTrainings(prev => prev.map(t => t.id === id ? updatedTraining : t));
        return updatedTraining;
      } catch (error) {
        console.error('Error updating training:', error);
        throw error;
      }
    },
    [],
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await db.trainings.remove(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error removing training:', error);
      throw error;
    }
  }, []);

  return {
    list: trainings,
    isLoading,
    loadAll,
    findById,
    create,
    update,
    remove,
  };
};
