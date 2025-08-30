import type { StateCreator } from 'zustand';

import type { Training } from '@/types/trainings';

export type TrainingsSlice = {
  trainingsById: Record<string, Training>;
  trainingIds: string[];
  setTrainings: (trainings: Training[]) => void;
  upsertTrainings: (trainings: Training[]) => void;
  removeTraining: (id: string) => void;
  clearTrainings: () => void;
};

export const createTrainingsSlice: StateCreator<TrainingsSlice, [], [], TrainingsSlice> = (
  set,
) => ({
  trainingsById: {},
  trainingIds: [],

  setTrainings: (trainings) => {
    // Replace all trainings with new data
    set((state) => {
      console.log('setTrainings', trainings);
      const byId: Record<string, Training> = {};
      for (const training of trainings) byId[training.id] = training;
      const ids = trainings.map((x) => x.id);
      return { trainingsById: byId, trainingIds: ids };
    });
  },

  upsertTrainings: (trainings) => {
    // Only update local state - database operations should be handled by controllers
    set((state) => {
      console.log('upsertTrainings', trainings);
      const byId = { ...state.trainingsById };
      for (const training of trainings) byId[training.id] = training;
      const ids = Array.from(new Set([...state.trainingIds, ...trainings.map((x) => x.id)]));
      return { trainingsById: byId, trainingIds: ids };
    });
  },

  removeTraining: (id) => {
    // Only update local state - database operations should be handled by controllers
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
  },

  clearTrainings: () => {
    // Only update local state - database operations should be handled by controllers
    set({ trainingsById: {}, trainingIds: [] });
  },
});
