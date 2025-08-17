import type { StateCreator } from 'zustand'
import type { Exercise } from '@/types/exercises'

export type ExercisesSlice = {
  exercisesById: Record<string, Exercise>
  exerciseIds: string[]
  upsertExercises: (items: Exercise[]) => void
  removeExercise: (id: string) => void
  clearExercises: () => void
}

export const createExercisesSlice: StateCreator<
  ExercisesSlice,
  [],
  [],
  ExercisesSlice
> = (set, get) => ({
  exercisesById: {},
  exerciseIds: [],
  upsertExercises: (items) =>
    set((state) => {
      console.log('upsertExercises', items);
      const byId = { ...state.exercisesById }
      for (const ex of items) byId[ex.id] = ex
      const ids = Array.from(new Set([...state.exerciseIds, ...items.map((x) => x.id)]))
      return { exercisesById: byId, exerciseIds: ids }
    }),
  removeExercise: (id) =>
    set((state) => {
      console.log('removeExercise', id);
      if (!state.exercisesById[id]) return state
      const { [id]: _, ...rest } = state.exercisesById
      return {
        exercisesById: rest,
        exerciseIds: state.exerciseIds.filter((x) => x !== id),
      }
    }),
  clearExercises: () => set({ exercisesById: {}, exerciseIds: [] }),
});
