import { ExerciseType } from '@/types';
import type { WorkoutExercise } from '@/types/workouts';

export interface PerformanceAnalysis {
  shouldUpdatePlannedValues: boolean;
  exercisesToUpdate: Array<{
    exerciseIndex: number;
    exercise: WorkoutExercise;
    shouldIncreaseWeight?: boolean;
    shouldIncreaseTime?: boolean;
    shouldIncreaseReps?: boolean;
  }>;
}

export const analyzeWorkoutPerformance = (workout: {
  exercises: WorkoutExercise[];
}): PerformanceAnalysis => {
  const exercisesToUpdate: PerformanceAnalysis['exercisesToUpdate'] = [];

  const shouldIncreaseWeight = (exercise: WorkoutExercise): boolean => {
    if (!exercise.plannedWeight || !exercise.actualSets || exercise.actualSets.length === 0) {
      return false;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet) {
      return false;
    }

    return !!(
      lastSet.actualWeight &&
      lastSet.actualWeight >= exercise.plannedWeight &&
      lastSet.actualReps &&
      lastSet.actualReps >= exercise.plannedReps
    );
  };

  const shouldIncreaseTime = (exercise: WorkoutExercise): boolean => {
    if (!exercise.plannedDuration || !exercise.actualSets || exercise.actualSets.length === 0) {
      return false;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet) {
      return false;
    }

    return !!(
      lastSet.actualDuration &&
      lastSet.actualDuration >= exercise.plannedDuration &&
      lastSet.actualReps &&
      lastSet.actualReps >= exercise.plannedReps
    );
  };

  const shouldIncreaseReps = (exercise: WorkoutExercise): boolean => {
    if (!exercise.plannedReps || !exercise.actualSets || exercise.actualSets.length === 0) {
      return false;
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet || !lastSet.actualReps || lastSet.actualReps < exercise.plannedReps) {
      return false;
    }

    return lastSet.actualReps >= exercise.plannedReps;
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
    const increaseFlags: { weight?: boolean; reps?: boolean; time?: boolean } = {};

    switch (exercise.exercise.type) {
      case ExerciseType.WEIGHT:
        increaseFlags.weight = shouldIncreaseWeight(exercise);
        if (increaseFlags.weight) shouldUpdateThisExercise = true;
        break;
      case ExerciseType.TIME:
        increaseFlags.time = shouldIncreaseTime(exercise);
        if (increaseFlags.time) shouldUpdateThisExercise = true;
        break;
      case ExerciseType.REPS_ONLY:
        increaseFlags.reps = shouldIncreaseReps(exercise);
        if (increaseFlags.reps) shouldUpdateThisExercise = true;
        break;
    }

    if (shouldUpdateThisExercise) {
      exercisesToUpdate.push({
        exerciseIndex,
        exercise,
        shouldIncreaseWeight: increaseFlags.weight,
        shouldIncreaseTime: increaseFlags.time,
        shouldIncreaseReps: increaseFlags.reps,
      });
    }
  });

  return {
    shouldUpdatePlannedValues: exercisesToUpdate.length > 0,
    exercisesToUpdate,
  };
};
