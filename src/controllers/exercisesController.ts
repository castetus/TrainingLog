import { useCallback, useState, useEffect } from 'react';

import { db } from '@/db'; // uses the current DB implementation
import type { Exercise } from '@/types/exercises';

export const useExercisesController = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await db.exercises.list();
      setExercises(items);
      return items;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load exercises on mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const findById = useCallback(async (id: string) => {
    return db.exercises.get(id);
  }, []);

  const create = useCallback(async (draft: Exercise) => {
    const withId = draft.id ? draft : { ...draft, id: crypto.randomUUID() };
    const saved = await db.exercises.put(withId);
    setExercises((prev) => [...prev.filter((e) => e.id !== saved.id), saved]);
    return saved;
  }, []);

  const update = useCallback(async (draft: Exercise) => {
    const saved = await db.exercises.put(draft);
    setExercises((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    return saved;
  }, []);

  const remove = useCallback(async (id: string) => {
    await db.exercises.remove(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    list: exercises,
    isLoading,
    loadAll,
    findById,
    create,
    update,
    remove,
  };
};
