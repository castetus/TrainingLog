import { Stack, TableCell, TableRow, Typography } from '@mui/material';

import type { WorkoutExercise } from '@/types/workouts';
import { formatTime } from '@/utils';

export default function WorkoutViewItem(exercise: WorkoutExercise) {
  const exerciseViewData = {
    name: exercise.exercise.name,
    description: exercise.exercise.description,
    type: exercise.exercise.type,
    plannedSets: exercise.plannedSets,
    plannedReps: exercise.plannedReps,
    plannedWeight: exercise.plannedWeight,
    plannedDuration: exercise.plannedDuration,
    actualSets: exercise.actualSets.length,
    actualReps: exercise.actualSets[exercise.actualSets.length - 1].actualReps,
    actualWeight: exercise.actualSets[exercise.actualSets.length - 1].actualWeight,
    actualDuration: exercise.actualSets[exercise.actualSets.length - 1].actualDuration,
  };

  return (
    <TableRow>
      <TableCell>
        <Stack>
          <Typography variant="subtitle2" fontWeight="medium">
            {exerciseViewData.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {exerciseViewData.description}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{exerciseViewData.plannedSets}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">
          {exerciseViewData.plannedReps} ×{' '}
          {exerciseViewData.plannedWeight && exerciseViewData.plannedWeight}kg
          {exerciseViewData.plannedDuration && formatTime(exerciseViewData.plannedDuration)}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack spacing={0.5}>
          <Typography variant="body2">
            {exerciseViewData.actualReps && `${exerciseViewData.actualReps}`}
            {exerciseViewData.actualReps && ` x ${exerciseViewData.actualWeight}kg`}
            {exerciseViewData.plannedDuration &&
              ` x ${formatTime(exerciseViewData.plannedDuration)}`}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
