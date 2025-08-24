import { useCallback } from 'react';

import { db } from '@/db'; // uses the current DB implementation
import { useAppStore } from '@/store';
import type { Exercise } from '@/types/exercises';

export const useExercisesController = () => {
  const upsertExercises = useAppStore((s) => s.upsertExercises);
  const removeExercise = useAppStore((s) => s.removeExercise);

  const loadAll = useCallback(async () => {
    const items = await db.exercises.list();
    upsertExercises(items);
    return items;
  }, [upsertExercises]);

  const findById = useCallback(async (id: string) => {
    return db.exercises.get(id);
  }, []);

  const create = useCallback(
    async (draft: Exercise) => {
      const withId = draft.id ? draft : { ...draft, id: crypto.randomUUID() };
      const saved = await db.exercises.put(withId);
      upsertExercises([saved]);
      return saved;
    },
    [upsertExercises],
  );

  const update = useCallback(
    async (draft: Exercise) => {
      const saved = await db.exercises.put(draft);
      upsertExercises([saved]);
      return saved;
    },
    [upsertExercises],
  );

  const remove = useCallback(
    async (id: string) => {
      await db.exercises.remove(id);
      removeExercise(id);
    },
    [removeExercise],
  );

  return { loadAll, findById, create, update, remove };
};
