import {
  Box,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { formatLongDate, formatMediumDate, formatDuration, formatTime } from '@/utils';
import type { Workout } from '@/types/workouts';

interface WorkoutViewProps {
  workout: Workout;
}

export default function WorkoutView({ workout }: WorkoutViewProps) {
  const formatDate = (dateString: string) => {
    return formatLongDate(dateString);
  };

  return (
    <Stack spacing={3}>
      {/* Header Info */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {workout.name}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={formatDate(workout.date)} color="primary" />
          {workout.duration ? (
            <Chip label={formatDuration(workout.duration)} color="secondary" />
          ) : (
            <Chip label="Not recorded" color="default" variant="outlined" />
          )}
        </Stack>
        {workout.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {workout.description}
          </Typography>
        )}
      </Box>

      {/* Exercises Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Exercise Results
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Exercise</TableCell>
                <TableCell align="center">Planned</TableCell>
                <TableCell align="center">Actual Results</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workout.exercises.map((workoutExercise, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {workoutExercise.exercise.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {workoutExercise.exercise.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {workoutExercise.plannedSets} × {workoutExercise.plannedReps}
                      {/* {workoutExercise.exercise.type === ExerciseType.WEIGHT && workoutExercise.plannedWeight && (
                        <br /> + {workoutExercise.plannedWeight}kg
                      )}
                      {workoutExercise.exercise.type === ExerciseType.TIME && workoutExercise.plannedDuration && (
                        <br /> + {formatTime(workoutExercise.plannedDuration)}
                      )} */}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={0.5}>
                      {workoutExercise.actualSets.map((set, setIndex) => (
                        <Typography key={setIndex} variant="body2">
                          Set {setIndex + 1}: {set.actualReps}
                          {set.actualWeight && ` @ ${set.actualWeight}kg`}
                          {set.actualDuration && ` @ ${formatTime(set.actualDuration)}`}
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {workoutExercise.notes}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Overall Notes */}
      {workout.notes && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Workout Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {workout.notes}
          </Typography>
        </Box>
      )}

      {/* Metadata */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          Created: {formatMediumDate(workout.createdAt)}
          {workout.updatedAt !== workout.createdAt &&
            ` • Updated: ${formatMediumDate(workout.updatedAt)}`}
        </Typography>
      </Box>
    </Stack>
  );
}
