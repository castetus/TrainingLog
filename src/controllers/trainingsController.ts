import { useCallback } from 'react';
import { db } from '@/db';
import { useAppStore } from '@/store';
import type { Training, TrainingFormData } from '@/types/trainings';

export const useTrainingsController = () => {
  const trainingsById = useAppStore(s => s.trainingsById);
  const upsertTrainings = useAppStore(s => s.upsertTrainings);
  const removeTraining = useAppStore(s => s.removeTraining);
  const clearTrainings = useAppStore(s => s.clearTrainings);

  const loadAll = useCallback(async () => {
    try {
      const trainings = await db.trainings.list();
      upsertTrainings(trainings);
      return trainings;
    } catch (error) {
      console.error('Error loading trainings:', error);
      throw error;
    }
  }, [upsertTrainings]);

  const findById = useCallback(async (id: string): Promise<Training | null> => {
    try {
      // First check if we have it in store
      if (trainingsById[id]) {
        return trainingsById[id];
      }

      // If not in store, try to get from database
      const training = await db.trainings.get(id);
      if (training) {
        upsertTrainings([training]);
      }
      return training || null;
    } catch (error) {
      console.error('Error finding training:', error);
      throw error;
    }
  }, [upsertTrainings, trainingsById]);

  const create = useCallback(async (trainingData: TrainingFormData): Promise<Training> => {
    try {
      const newTraining = await db.trainings.put(trainingData as Training);
      upsertTrainings([newTraining]);
      return newTraining;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }, [upsertTrainings]);

  const update = useCallback(async (id: string, trainingData: Partial<TrainingFormData>): Promise<Training> => {
    try {
      const updatedTraining = await db.trainings.put({ ...trainingData, id } as Training);
      upsertTrainings([updatedTraining]);
      return updatedTraining;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  }, [upsertTrainings]);

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await db.trainings.remove(id);
      removeTraining(id);
    } catch (error) {
      console.error('Error removing training:', error);
      throw error;
    }
  }, [removeTraining]);

  const clear = useCallback(() => {
    clearTrainings();
  }, [clearTrainings]);

  return {
    loadAll,
    findById,
    create,
    update,
    remove,
    clear,
  };
};
