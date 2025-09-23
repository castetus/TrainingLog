import { Stack, Box, Typography } from '@mui/material';

import { AchievedChip } from '@/components/Common';
import type { WorkoutExercise } from '@/types/workouts';
import { formatTime } from '@/utils';

export default function WorkoutViewItem(exercise: WorkoutExercise) {
  const lastSet =
    exercise.actualSets && exercise.actualSets.length > 0
      ? exercise.actualSets[exercise.actualSets.length - 1]
      : null;

  const exerciseViewData = {
    name: exercise.exercise.name,
    description: exercise.exercise.description,
    type: exercise.exercise.type,
    plannedSets: exercise.plannedSets,
    plannedReps: exercise.plannedReps,
    plannedWeight: exercise.plannedWeight,
    plannedDuration: exercise.plannedDuration,
    actualSets: exercise.actualSets?.length || 0,
    actualReps: lastSet?.actualReps,
    actualWeight: lastSet?.actualWeight,
    actualDuration: lastSet?.actualDuration,
  };

  return (
    <Box>
      <Stack direction="column" spacing={0.5}>
        <Typography variant="subtitle2" fontWeight="medium">
          {exerciseViewData.name}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {exerciseViewData.description}
        </Typography>
      </Stack>

      <Stack spacing={0.5} direction="row" alignItems="center" justifyContent="space-between">
        <AchievedChip show={exercise.plannedParametersAchieved} />
        <Typography variant="body2">{exerciseViewData.plannedSets}</Typography>

        <Typography variant="body2">
          {exerciseViewData.actualReps} × {' '}
          {exerciseViewData.actualWeight && exerciseViewData.actualWeight} kg
          {exerciseViewData.actualDuration && formatTime(exerciseViewData.actualDuration)}
        </Typography>
      </Stack>
    </Box>
  );
}
