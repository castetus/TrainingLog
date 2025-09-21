import { Stack, TableCell, TableRow, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import type { WorkoutExercise } from '@/types/workouts';
import { formatTime } from '@/utils';

export default function WorkoutViewItem(exercise: WorkoutExercise) {
  const lastSet = exercise.actualSets && exercise.actualSets.length > 0 
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
    <TableRow>
      <TableCell>
        <Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" fontWeight="medium">
              {exerciseViewData.name}
            </Typography>
            {exercise.plannedParametersAchieved && (
              <Chip
                icon={<TrendingUpIcon />}
                label="Achieved"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
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
            {lastSet ? (
              <>
                {exerciseViewData.actualReps && `${exerciseViewData.actualReps}`}
                {exerciseViewData.actualReps && exerciseViewData.actualWeight && ` x ${exerciseViewData.actualWeight}kg`}
                {exerciseViewData.actualReps && exerciseViewData.actualDuration && ` x ${formatTime(exerciseViewData.actualDuration)}`}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No data
              </Typography>
            )}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
