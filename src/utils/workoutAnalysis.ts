import { ExerciseType } from '@/types';
import type { WorkoutExercise } from '@/types/workouts';

export interface PerformanceAnalysis {
  hasAchievedExercises: boolean;
  achievedExercises: Array<{
    exerciseIndex: number;
    exercise: WorkoutExercise;
    achievedWeight?: boolean;
    achievedTime?: boolean;
    achievedReps?: boolean;
  }>;
  hasExceededExercises: boolean;
  exceededExercises: Array<{
    exerciseIndex: number;
    exercise: WorkoutExercise;
    exceededWeight?: boolean;
    exceededTime?: boolean;
    exceededReps?: boolean;
  }>;
}

export const analyzeWorkoutPerformance = (workout: {
  exercises: WorkoutExercise[];
}): PerformanceAnalysis => {
  const achievedExercises: PerformanceAnalysis['achievedExercises'] = [];
  const exceededExercises: PerformanceAnalysis['exceededExercises'] = [];

  const checkAchievement = (exercise: WorkoutExercise): { achieved: boolean; exceeded: boolean } => {
    if (!exercise.actualSets || exercise.actualSets.length === 0) {
      return { achieved: false, exceeded: false };
    }

    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];

    if (!lastSet) {
      return { achieved: false, exceeded: false };
    }

    // Check if planned parameters were met or exceeded
    const achieved = !!(
      lastSet.actualReps >= exercise.plannedReps &&
      (exercise.exercise.type === ExerciseType.REPS_ONLY ||
        (exercise.exercise.type === ExerciseType.WEIGHT &&
          lastSet.actualWeight &&
          exercise.plannedWeight &&
          lastSet.actualWeight >= exercise.plannedWeight) ||
        (exercise.exercise.type === ExerciseType.TIME &&
          lastSet.actualDuration &&
          exercise.plannedDuration &&
          lastSet.actualDuration >= exercise.plannedDuration))
    );

    // Check if parameters were exceeded (for automatic updates)
    const exceeded = !!(
      lastSet.actualReps > exercise.plannedReps ||
      (exercise.exercise.type === ExerciseType.WEIGHT &&
        lastSet.actualWeight &&
        exercise.plannedWeight &&
        lastSet.actualWeight > exercise.plannedWeight) ||
      (exercise.exercise.type === ExerciseType.TIME &&
        lastSet.actualDuration &&
        exercise.plannedDuration &&
        lastSet.actualDuration > exercise.plannedDuration)
    );

    return { achieved, exceeded };
  };

  workout.exercises.forEach((exercise, exerciseIndex) => {
    const { achieved, exceeded } = checkAchievement(exercise);

    if (achieved) {
      const achievementFlags: { weight?: boolean; time?: boolean; reps?: boolean } = {};

      switch (exercise.exercise.type) {
        case ExerciseType.WEIGHT:
          achievementFlags.weight = true;
          break;
        case ExerciseType.TIME:
          achievementFlags.time = true;
          break;
        case ExerciseType.REPS_ONLY:
          achievementFlags.reps = true;
          break;
      }

      achievedExercises.push({
        exerciseIndex,
        exercise,
        achievedWeight: achievementFlags.weight,
        achievedTime: achievementFlags.time,
        achievedReps: achievementFlags.reps,
      });
    }

    if (exceeded) {
      const exceededFlags: { weight?: boolean; time?: boolean; reps?: boolean } = {};

      if (exercise.exercise.type === ExerciseType.WEIGHT) {
        exceededFlags.weight = true;
      } else if (exercise.exercise.type === ExerciseType.TIME) {
        exceededFlags.time = true;
      } else if (exercise.exercise.type === ExerciseType.REPS_ONLY) {
        exceededFlags.reps = true;
      }

      exceededExercises.push({
        exerciseIndex,
        exercise,
        exceededWeight: exceededFlags.weight,
        exceededTime: exceededFlags.time,
        exceededReps: exceededFlags.reps,
      });
    }
  });

  return {
    hasAchievedExercises: achievedExercises.length > 0,
    achievedExercises,
    hasExceededExercises: exceededExercises.length > 0,
    exceededExercises,
  };
};
