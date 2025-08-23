import type { Workout } from '@/types/workouts';
import { mockExercises } from './exercises';

export const mockWorkouts: Workout[] = [
  {
    id: 'w-0001',
    name: 'Upper Body Strength',
    description: 'Focus on chest, shoulders, and triceps',
    date: '2024-01-15',
    duration: 75,
    exercises: [
      {
        exercise: mockExercises[0], // Bench Press
        plannedSets: 5,
        plannedReps: 5,
        plannedWeight: 80,
        actualSets: [
          { actualReps: 5, actualWeight: 80, notes: 'Felt strong' },
          { actualReps: 5, actualWeight: 80, notes: 'Good form' },
          { actualReps: 4, actualWeight: 80, notes: 'Failed last rep' },
          { actualReps: 5, actualWeight: 75, notes: 'Dropped weight' },
          { actualReps: 5, actualWeight: 75, notes: 'Solid finish' },
        ],
        notes: 'Good progress on bench press',
      },
      {
        exercise: mockExercises[2], // Push-ups
        plannedSets: 3,
        plannedReps: 15,
        actualSets: [
          { actualReps: 15, notes: 'Easy' },
          { actualReps: 12, notes: 'Getting tired' },
          { actualReps: 10, notes: 'Form breakdown' },
        ],
        notes: 'Need to work on endurance',
      },
    ],
    notes: 'Overall good workout. Bench press is improving, but need to work on push-up endurance.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w-0002',
    name: 'Core and Cardio',
    description: 'Core strength and cardiovascular endurance',
    date: '2024-01-17',
    duration: 45,
    exercises: [
      {
        exercise: mockExercises[6], // Plank
        plannedSets: 3,
        plannedReps: 1,
        plannedDuration: 60,
        actualSets: [
          { actualReps: 1, actualDuration: 75, notes: 'Held longer than planned' },
          { actualReps: 1, actualDuration: 60, notes: 'On target' },
          { actualReps: 1, actualDuration: 45, notes: 'Could not hold full time' },
        ],
        notes: 'Core is getting stronger',
      },
    ],
    notes: 'Good core workout. Plank endurance is improving.',
    createdAt: '2024-01-17T08:00:00Z',
    updatedAt: '2024-01-17T08:00:00Z',
  },
];
