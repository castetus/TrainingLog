import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Accordion, AccordionSummary, Typography, Stack, Chip } from '@mui/material';

import type { Workout, WorkoutExercise } from '@/types/workouts';

import { WorkoutExerciseContent } from './index';

interface WorkoutFlowProps {
  workout: Workout;
}

export default function WorkoutFlow({ workout }: WorkoutFlowProps) {
  // Helper function to check if an exercise is completed
  const isExerciseCompleted = (workoutExercise: WorkoutExercise): boolean => {
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

  return (
    <Box>
      <Stack spacing={2}>
        {workout.exercises.map((workoutExercise, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {workoutExercise.exercise.name}
                </Typography>
                <Chip
                  label={`${workoutExercise.plannedSets} × ${workoutExercise.plannedReps}`}
                  color="primary"
                  size="small"
                />
                {workoutExercise.plannedWeight && (
                  <Chip
                    label={`${workoutExercise.plannedWeight}kg`}
                    color="secondary"
                    size="small"
                  />
                )}
                {workoutExercise.plannedDuration && (
                  <Chip
                    label={`${workoutExercise.plannedDuration}s`}
                    color="secondary"
                    size="small"
                  />
                )}
                {isExerciseCompleted(workoutExercise) && (
                  <Chip label="✓" color="success" size="small" sx={{ minWidth: 24, height: 24 }} />
                )}
              </Stack>
            </AccordionSummary>
            <WorkoutExerciseContent workoutExercise={workoutExercise} />
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
