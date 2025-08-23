import { mockExercises } from '@/mock/exercises';
import { mockTrainings } from '@/mock/trainings';
import type { Exercise } from '@/types/exercises';
import type { Training } from '@/types/trainings';

import type { Db, Id, Table } from './types';

const makeExercisesTable = (): Table<Exercise> => {
  const map = new Map<Id, Exercise>(mockExercises.map((x) => [x.id, x]));

  const list = async () => Array.from(map.values());
  const get = async (id: Id) => map.get(id);
  const put = async (item: Exercise) => {
    const id = item.id || crypto.randomUUID();
    const saved = { ...item, id };
    map.set(id, saved);
    return saved;
  };
  const remove = async (id: Id) => {
    map.delete(id);
  };

  return { list, get, put, remove };
};

const makeTrainingsTable = (): Table<Training> => {
  const map = new Map<Id, Training>(mockTrainings.map((x) => [x.id, x]));

  const list = async () => Array.from(map.values());
  const get = async (id: Id) => map.get(id);
  const put = async (item: Training) => {
    const id = item.id || crypto.randomUUID();
    const saved = { ...item, id };
    map.set(id, saved);
    return saved;
  };
  const remove = async (id: Id) => {
    map.delete(id);
  };

  return { list, get, put, remove };
};

export class MockDb implements Db {
  exercises = makeExercisesTable();
  trainings = makeTrainingsTable();
}
