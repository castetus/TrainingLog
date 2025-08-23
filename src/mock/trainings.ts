import type { Training } from '@/types/trainings';
import { mockExercises } from './exercises';

export const mockTrainings: Training[] = [
  {
    id: 'tr-0001',
    name: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and triceps',
    exercises: [
      {
        exercise: mockExercises[0], // Bench Press
        plannedSets: 5,
        plannedReps: [5, 5, 5, 5, 5],
        plannedWeightKg: [60, 70, 80, 80, 70],
        notes: 'Focus on form, last set was challenging',
      },
      {
        exercise: mockExercises[3], // Overhead Press
        plannedSets: 4,
        plannedReps: [8, 8, 8, 8],
        plannedWeightKg: [40, 40, 35, 35],
        notes: 'Good shoulder activation',
      },
      {
        exercise: mockExercises[4], // Pull-ups
        plannedSets: 4,
        plannedReps: [10, 8, 7, 6],
        notes: 'Bodyweight only, good for balance',
      },
    ],
    notes: 'Great session, felt strong today. Need to work on bench press form.',
    completed: true,
  },
  {
    id: 'tr-0002',
    name: 'Lower Body Power',
    description: 'Squats and deadlifts focus',
    exercises: [
      {
        exercise: mockExercises[1], // Back Squat
        plannedSets: 5,
        plannedReps: [5, 5, 5, 5, 5],
        plannedWeightKg: [80, 90, 100, 100, 90],
        notes: 'Heavy but manageable',
      },
      {
        exercise: mockExercises[2], // Deadlift
        plannedSets: 3,
        plannedReps: [5, 5, 5],
        plannedWeightKg: [100, 110, 120],
        notes: 'Last set was max effort',
      },
      {
        exercise: mockExercises[7], // Hollow Hold
        plannedSets: 3,
        plannedReps: [1, 1, 1],
        plannedSeconds: [45, 45, 45],
        notes: 'Core stability work',
      },
    ],
    notes: 'Legs were tired but pushed through. Good progress on squats.',
    completed: true,
  },
  {
    id: 'tr-0003',
    name: 'Full Body Circuit',
    description: 'High intensity circuit training',
    exercises: [
      {
        exercise: mockExercises[5], // Push-ups
        plannedSets: 3,
        plannedReps: [20, 15, 12],
        notes: 'Quick sets, minimal rest',
      },
      {
        exercise: mockExercises[6], // Plank
        plannedSets: 3,
        plannedReps: [1, 1, 1],
        plannedSeconds: [60, 60, 45],
        notes: 'Hold until failure',
      },
      {
        exercise: mockExercises[8], // Biceps Curl
        plannedSets: 3,
        plannedReps: [12, 12, 12],
        plannedWeightKg: [12, 12, 12],
        notes: 'Light weight, high reps',
      },
    ],
    notes: 'Quick but effective workout. Good cardio component.',
    completed: false,
  },
];
