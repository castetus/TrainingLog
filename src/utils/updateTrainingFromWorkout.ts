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
      ({ exerciseIndex, shouldIncreaseWeight, shouldIncreaseTime, shouldIncreaseReps }) => {
        const trainingExercise = updatedTraining.exercises[exerciseIndex];

        if (!trainingExercise) {
          return; // Skip if exercise not found
        }

        // Get the actual values from the last set of the workout exercise
        const workoutExercise = analysis.exercisesToUpdate.find(
          (item) => item.exerciseIndex === exerciseIndex
        )?.exercise;

        if (!workoutExercise || !workoutExercise.actualSets || workoutExercise.actualSets.length === 0) {
          return; // Skip if no actual sets
        }

        const lastSet = workoutExercise.actualSets[workoutExercise.actualSets.length - 1];
        if (!lastSet) {
          return;
        }

        // Update the training exercise with actual values
        const updatedExercise = { ...trainingExercise };

        if (shouldIncreaseWeight && lastSet.actualWeight) {
          updatedExercise.plannedWeightKg = lastSet.actualWeight;
        }

        if (shouldIncreaseTime && lastSet.actualDuration) {
          updatedExercise.plannedSeconds = lastSet.actualDuration;
        }

        if (shouldIncreaseReps && lastSet.actualReps) {
          updatedExercise.plannedReps = lastSet.actualReps;
        }

        // Set the flag to indicate this exercise exceeded planned values
        updatedExercise.shouldUpdatePlannedValues = true;

        // Replace the exercise in the training
        updatedTraining.exercises[exerciseIndex] = updatedExercise;

        // Also update the exercise dictionary with last set values
        const exercise = trainingExercise.exercise;
        const updatedExerciseDict = { ...exercise };

        if (shouldIncreaseWeight && lastSet.actualWeight && exercise.type === 'weight') {
          (updatedExerciseDict as any).lastSetWeightKg = lastSet.actualWeight;
        }

        if (shouldIncreaseTime && lastSet.actualDuration && exercise.type === 'time') {
          (updatedExerciseDict as any).lastSetSeconds = lastSet.actualDuration;
        }

        if (shouldIncreaseReps && lastSet.actualReps && exercise.type === 'reps_only') {
          (updatedExerciseDict as any).lastSetReps = lastSet.actualReps;
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
