import type { Exercise } from '@/types/exercises';
import type { Training } from '@/types/trainings';
import type { Workout } from '@/types/workouts';

import type { Db, Id, Table } from './types';

const makeExercisesTable = (): Table<Exercise> => {
  const map = new Map<Id, Exercise>();

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
  const map = new Map<Id, Training>();

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

const makeWorkoutsTable = (): Table<Workout> => {
  const map = new Map<Id, Workout>();

  const list = async () => Array.from(map.values());
  const get = async (id: Id) => map.get(id);
  const put = async (item: Workout) => {
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
  workouts = makeWorkoutsTable();
}
