import type { Exercise } from '@/types/exercises';
import type { Training } from '@/types/trainings';

import type { PerformanceAnalysis } from './workoutAnalysis';

export interface UpdateTrainingResult {
  success: boolean;
  updatedTraining?: Training;
  updatedExercises?: Exercise[];
  error?: string;
}

export const updateTrainingFromWorkout = (
  training: Training,
  analysis: PerformanceAnalysis,
): UpdateTrainingResult => {
  try {
    // Create a copy of the training to modify
    const updatedTraining: Training = {
      ...training,
      exercises: [...training.exercises],
    };

    const updatedExercises: Exercise[] = [];

    // 1. Set achieved flag for exercises that met planned parameters
    analysis.achievedExercises.forEach(({ exerciseIndex }) => {
      const trainingExercise = updatedTraining.exercises[exerciseIndex];
      if (trainingExercise) {
        updatedTraining.exercises[exerciseIndex] = {
          ...trainingExercise,
          plannedParametersAchieved: true,
        };
      }
    });

    // 2. Auto-update training for exercises that exceeded planned parameters
    analysis.exceededExercises.forEach(({ exerciseIndex, exceededWeight, exceededTime, exceededReps }) => {
      const trainingExercise = updatedTraining.exercises[exerciseIndex];

      if (!trainingExercise) {
        return; // Skip if exercise not found
      }

      // Get the actual values from the last set of the workout exercise
      const workoutExercise = analysis.exceededExercises.find(
        (item) => item.exerciseIndex === exerciseIndex
      )?.exercise;

      if (!workoutExercise || !workoutExercise.actualSets || workoutExercise.actualSets.length === 0) {
        return; // Skip if no actual sets
      }

      const lastSet = workoutExercise.actualSets[workoutExercise.actualSets.length - 1];
      if (!lastSet) {
        return;
      }

      // Update the training exercise with actual values (only if exceeded)
      const updatedExercise = { ...trainingExercise };

      if (exceededWeight && lastSet.actualWeight) {
        updatedExercise.plannedWeightKg = lastSet.actualWeight;
      }

      if (exceededTime && lastSet.actualDuration) {
        updatedExercise.plannedSeconds = lastSet.actualDuration;
      }

      if (exceededReps && lastSet.actualReps) {
        updatedExercise.plannedReps = lastSet.actualReps;
      }

      // Reset achieved flag since parameters were increased to new targets
      updatedExercise.plannedParametersAchieved = false;

      // Replace the exercise in the training
      updatedTraining.exercises[exerciseIndex] = updatedExercise;

      // Also update the exercise dictionary with last set values
      const exercise = trainingExercise.exercise;
      const updatedExerciseDict = { ...exercise };

      if (exceededWeight && lastSet.actualWeight && exercise.type === 'weight') {
        (updatedExerciseDict as any).lastSetWeightKg = lastSet.actualWeight;
      }

      if (exceededTime && lastSet.actualDuration && exercise.type === 'time') {
        (updatedExerciseDict as any).lastSetSeconds = lastSet.actualDuration;
      }

      if (exceededReps && lastSet.actualReps && exercise.type === 'reps_only') {
        (updatedExerciseDict as any).lastSetReps = lastSet.actualReps;
      }

      updatedExercises.push(updatedExerciseDict);
    });

    return {
      success: true,
      updatedTraining,
      updatedExercises,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
