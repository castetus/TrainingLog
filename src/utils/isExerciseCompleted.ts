import type { WorkoutExercise } from '@/types/workouts';

export const isExerciseCompleted = (workoutExercise: WorkoutExercise) => {
  if (!workoutExercise.actualSets || workoutExercise.actualSets.length === 0) return false;
  return workoutExercise.actualSets.every((set) => {
    // Reps are always required
    if (set.actualReps <= 0) return false;

    // Weight is required for weight-based exercises
    if (workoutExercise.exercise.type === 'weight' && !set.actualWeight) return false;

    // Duration is required for time-based exercises
    if (workoutExercise.exercise.type === 'time' && !set.actualDuration) return false;

    return true;
  });
};
