import type { StateCreator } from 'zustand';
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

  upsertTrainings: (trainings) =>
    set((state) => {
      console.log('upsertTrainings', trainings);
      const byId = { ...state.trainingsById };
      for (const training of trainings) byId[training.id] = training;
      const ids = Array.from(new Set([...state.trainingIds, ...trainings.map((x) => x.id)]));
      return { trainingsById: byId, trainingIds: ids };
    }),

  removeTraining: (id) =>
    set((state) => {
      console.log('removeTraining', id);
      if (!state.trainingsById[id]) return state;
      const { [id]: _, ...rest } = state.trainingsById;
      return {
        trainingsById: rest,
        trainingIds: state.trainingIds.filter((x) => x !== id),
      };
    }),

  clearTrainings: () => set({ trainingsById: {}, trainingIds: [] }),
});
