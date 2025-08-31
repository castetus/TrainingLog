import { ExerciseType } from '@/types';
import type { WorkoutExercise } from '@/types/workouts';

export interface PerformanceAnalysis {
  shouldUpdatePlannedValues: boolean;
  exercisesToUpdate: Array<{
    exerciseIndex: number;
    exercise: WorkoutExercise;
    suggestedWeight?: number;
    suggestedTime?: number;
    suggestedReps?: number;
  }>;
}

export const analyzeWorkoutPerformance = (workout: {
  exercises: WorkoutExercise[];
}): PerformanceAnalysis => {
  const exercisesToUpdate: PerformanceAnalysis['exercisesToUpdate'] = [];

  const suggestWeightIncrease = (exercise: WorkoutExercise): number | undefined => {
    if (!exercise.plannedWeight || !exercise.actualSets || exercise.actualSets.length === 0) {
      return undefined;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet) {
      return undefined;
    }

    const shouldIncrease =
      lastSet.actualWeight &&
      lastSet.actualWeight >= exercise.plannedWeight &&
      lastSet.actualReps &&
      lastSet.actualReps >= exercise.plannedReps;

    if (shouldIncrease) {
      return Math.round(exercise.plannedWeight + Math.max(exercise.plannedWeight * 0.05, 2.5));
    }
    return undefined;
  };

  const suggestTimeIncrease = (exercise: WorkoutExercise): number | undefined => {
    if (!exercise.plannedDuration || !exercise.actualSets || exercise.actualSets.length === 0) {
      return undefined;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    const shouldIncrease =
      lastSet.actualDuration &&
      lastSet.actualDuration >= exercise.plannedDuration &&
      lastSet.actualReps &&
      lastSet.actualReps >= exercise.plannedReps;

    if (shouldIncrease) {
      return Math.round(exercise.plannedDuration + Math.max(exercise.plannedDuration * 0.05, 2.5));
    }
    return undefined;
  };

  const suggestRepsIncrease = (exercise: WorkoutExercise): number | undefined => {
    if (!exercise.plannedReps || !exercise.actualSets || exercise.actualSets.length === 0) {
      return undefined;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet || !lastSet.actualReps || lastSet.actualReps < exercise.plannedReps) {
      return undefined;
    }

    return exercise.plannedReps + Math.max(Math.round(exercise.plannedReps * 0.1), 1);
  };

  workout.exercises.forEach((exercise, exerciseIndex) => {
    if (!exercise.actualSets || exercise.actualSets.length === 0) {
      return; // Skip exercises with no actual sets
    }

    // Get the last actual set (most recent performance)
    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet) {
      return;
    }

    let shouldUpdateThisExercise = false;
    const suggestedUpdates: { weight?: number; reps?: number; time?: number } = {};

    switch (exercise.exercise.type) {
      case ExerciseType.WEIGHT:
        suggestedUpdates.weight = suggestWeightIncrease(exercise);
        if (suggestedUpdates.weight) shouldUpdateThisExercise = true;
        break;
      case ExerciseType.TIME:
        suggestedUpdates.time = suggestTimeIncrease(exercise);
        if (suggestedUpdates.time) shouldUpdateThisExercise = true;
        break;
      case ExerciseType.REPS_ONLY:
        suggestedUpdates.reps = suggestRepsIncrease(exercise);
        if (suggestedUpdates.reps) shouldUpdateThisExercise = true;
        break;
    }

    if (shouldUpdateThisExercise) {
      exercisesToUpdate.push({
        exerciseIndex,
        exercise,
        suggestedWeight: suggestedUpdates.weight,
        suggestedTime: suggestedUpdates.time,
        suggestedReps: suggestedUpdates.reps,
      });
    }
  });

  return {
    shouldUpdatePlannedValues: exercisesToUpdate.length > 0,
    exercisesToUpdate,
  };
};
