import type { StateCreator } from 'zustand';

import { db } from '@/db';
import type { Training } from '@/types/trainings';

export type TrainingsSlice = {
  trainingsById: Record<string, Training>;
  trainingIds: string[];
  upsertTrainings: (trainings: Training[]) => void;
  removeTraining: (id: string) => void;
  clearTrainings: () => void;
};

export const createTrainingsSlice: StateCreator<TrainingsSlice, [], [], TrainingsSlice> = (
  set,
  get,
) => ({
  trainingsById: {},
  trainingIds: [],

  upsertTrainings: async (trainings) => {
    try {
      // Save to IndexedDB first
      for (const training of trainings) {
        await db.trainings.put(training);
      }
      
      // Then update local state
      set((state) => {
        console.log('upsertTrainings', trainings);
        const byId = { ...state.trainingsById };
        for (const training of trainings) byId[training.id] = training;
        const ids = Array.from(new Set([...state.trainingIds, ...trainings.map((x) => x.id)]));
        return { trainingsById: byId, trainingIds: ids };
      });
    } catch (error) {
      console.error('Error saving trainings to IndexedDB:', error);
    }
  },

  removeTraining: async (id) => {
    try {
      // Remove from IndexedDB first
      await db.trainings.remove(id);
      
      // Then update local state
      set((state) => {
        console.log('removeTraining', id);
        if (!state.trainingsById[id]) return state;
        const newTrainingsById = { ...state.trainingsById };
        delete newTrainingsById[id];
        return {
          trainingsById: newTrainingsById,
          trainingIds: state.trainingIds.filter((x) => x !== id),
        };
      });
    } catch (error) {
      console.error('Error removing training from IndexedDB:', error);
    }
  },

  clearTrainings: async () => {
    try {
      // Clear from IndexedDB first
      const trainings = Object.values(get().trainingsById);
      for (const training of trainings) {
        await db.trainings.remove(training.id);
      }
      
      // Then update local state
      set({ trainingsById: {}, trainingIds: [] });
    } catch (error) {
      console.error('Error clearing trainings from IndexedDB:', error);
    }
  },
});
