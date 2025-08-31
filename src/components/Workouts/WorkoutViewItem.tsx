import { Stack, TableCell, TableRow, Typography } from '@mui/material';

import type { WorkoutExercise } from '@/types/workouts';
import { formatTime } from '@/utils';

export default function WorkoutViewItem(exercise: WorkoutExercise) {
  const exerciseViewData = {
    name: exercise.exercise.name,
    description: exercise.exercise.description,
    type: exercise.exercise.type,
    sets: exercise.actualSets.length,
    reps: exercise.actualSets[exercise.actualSets.length - 1].actualReps,
    weight: exercise.actualSets[exercise.actualSets.length - 1].actualWeight,
    duration: exercise.actualSets[exercise.actualSets.length - 1].actualDuration,
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
        <Typography variant="body2">{exerciseViewData.sets}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">
          {exerciseViewData.reps} × {exerciseViewData.weight && exerciseViewData.weight}kg
          {exerciseViewData.duration && formatTime(exerciseViewData.duration)}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack spacing={0.5}>
          <Typography variant="body2">
            {exerciseViewData.weight && ` x ${exerciseViewData.weight}kg`}
            {exerciseViewData.duration && ` x ${formatTime(exerciseViewData.duration)}`}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
