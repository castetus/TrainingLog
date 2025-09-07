const BASE_URL = '/TrainingLog';

export enum Routes {
  HOME = `${BASE_URL}/`,
  WORKOUT_NEW = `${BASE_URL}/workouts/new`,
  WORKOUT_FLOW = `${BASE_URL}/workouts/:id/flow`,
  WORKOUT_DETAIL = `${BASE_URL}/workouts/:id`,
  WORKOUT_EDIT = `${BASE_URL}/workouts/:id/edit`,
  TRAININGS = `/trainings`,
  TRAINING_NEW = `${BASE_URL}/trainings/new`,
  TRAINING_DETAIL = `${BASE_URL}/trainings/:id`,
  TRAINING_EDIT = `${BASE_URL}/trainings/:id/edit`,
  EXERCISES = `/exercises`,
  EXERCISE_NEW = `${BASE_URL}/exercises/new`,
  EXERCISE_DETAIL = `${BASE_URL}/exercises/:id`,
  EXERCISE_EDIT = `${BASE_URL}/exercises/:id/edit`,
  STATISTICS = `/statistics`,
}