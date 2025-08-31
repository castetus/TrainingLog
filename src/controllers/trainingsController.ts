import { useCallback } from 'react';

import { db } from '@/db';
import { useAppStore } from '@/store';
import type { Training, TrainingFormData } from '@/types/trainings';

export const useTrainingsController = () => {
  // Get store functions directly to avoid re-creation
  const store = useAppStore.getState();

  const loadAll = useCallback(async () => {
    try {
      const trainings = await db.trainings.list();
      store.upsertTrainings(trainings);
      return trainings;
    } catch (error) {
      console.error('Error loading trainings:', error);
      throw error;
    }
  }, []);

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
      store.upsertTrainings([savedTraining]);
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
        store.upsertTrainings([updatedTraining]);
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
      store.removeTraining(id);
    } catch (error) {
      console.error('Error removing training:', error);
      throw error;
    }
  }, []);

  const clear = useCallback(() => {
    store.clearTrainings();
  }, []);

  return {
    loadAll,
    findById,
    create,
    update,
    remove,
    clear,
  };
};
