const BASE_URL = '/TrainingLog';

export enum Routes {
  HOME = `/`,
  WORKOUT_NEW = `/workouts/new`,
  WORKOUT_FLOW = `/workouts/:id/flow`,
  WORKOUT_DETAIL = `/workouts/:id`,
  WORKOUT_EDIT = `/workouts/:id/edit`,
  TRAININGS = `/trainings`,
  TRAINING_NEW = `/trainings/new`,
  TRAINING_DETAIL = `/trainings/:id`,
  TRAINING_EDIT = `/trainings/:id/edit`,
  EXERCISES = `/exercises`,
  EXERCISE_NEW = `/exercises/new`,
  EXERCISE_DETAIL = `/exercises/:id`,
  EXERCISE_EDIT = `/exercises/:id/edit`,
  STATISTICS = `/statistics`,
}