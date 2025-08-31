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

import type { Workout } from '@/types/workouts';
import { formatLongDate, formatMediumDate, formatDuration } from '@/utils';
import WorkoutViewItem from './WorkoutViewItem';

interface WorkoutViewProps {
  workout: Workout;
}

export default function WorkoutView({ workout }: WorkoutViewProps) {
  const formatDate = (dateString: string) => {
    return formatLongDate(dateString);
  };
  console.log('Workout:', workout);
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
                <TableCell>Sets</TableCell>
                <TableCell align="center">Planned</TableCell>
                <TableCell align="center">Actual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workout.exercises.map((workoutExercise, index) => (
                <WorkoutViewItem key={index} {...workoutExercise} />
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
