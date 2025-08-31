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

    // Update each exercise that has suggested improvements
    analysis.exercisesToUpdate.forEach(
      ({ exerciseIndex, suggestedWeight, suggestedTime, suggestedReps }) => {
        const trainingExercise = updatedTraining.exercises[exerciseIndex];

        if (!trainingExercise) {
          return; // Skip if exercise not found
        }

        // Update the training exercise with suggested values
        const updatedExercise = { ...trainingExercise };

        if (suggestedWeight !== undefined) {
          updatedExercise.plannedWeightKg = suggestedWeight;
        }

        if (suggestedTime !== undefined) {
          updatedExercise.plannedSeconds = suggestedTime;
        }

        if (suggestedReps !== undefined) {
          updatedExercise.plannedReps = suggestedReps;
        }

        // Replace the exercise in the training
        updatedTraining.exercises[exerciseIndex] = updatedExercise;

        // Also update the exercise dictionary with last set values
        const exercise = trainingExercise.exercise;
        const updatedExerciseDict = { ...exercise };

        if (suggestedWeight !== undefined && exercise.type === 'weight') {
          (updatedExerciseDict as any).lastSetWeightKg = suggestedWeight;
        }

        if (suggestedTime !== undefined && exercise.type === 'time') {
          (updatedExerciseDict as any).lastSetSeconds = suggestedTime;
        }

        if (suggestedReps !== undefined && exercise.type === 'reps_only') {
          (updatedExerciseDict as any).lastSetReps = suggestedReps;
        }

        updatedExercises.push(updatedExerciseDict);
      },
    );

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
