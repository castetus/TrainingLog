import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Typography, Stack, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';
import type { Workout } from '@/types/workouts';
import { formatLongDate, formatMediumDate, formatDuration } from '@/utils';
import { isExerciseCompleted } from '@/utils/isExerciseCompleted';

import WorkoutViewItem from './WorkoutViewItem';

interface WorkoutViewProps {
  workout: Workout;
}

export default function WorkoutView({ workout }: WorkoutViewProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return formatLongDate(dateString);
  };

  const handleContinueWorkout = () => {
    navigate(Routes.WORKOUT_FLOW.replace(':id', workout.id));
  };

  return (
    <Stack spacing={3}>
      {/* Header Info */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={formatDate(workout.date)} color="primary" />
          {workout.duration ? (
            <Chip label={formatDuration(workout.duration)} color="secondary" />
          ) : (
            ''
          )}
        </Stack>
        {workout.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {workout.description}
          </Typography>
        )}

        {/* Continue Workout Button for Incomplete Workouts */}
        {workout.incompleted && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={handleContinueWorkout}
              size="large"
            >
              Continue Workout
            </Button>
          </Box>
        )}
      </Box>

      {/* Exercises Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Exercise Results
        </Typography>
        <Stack direction="column" spacing={2}>
          {workout.exercises
            .filter((workoutExercise) => isExerciseCompleted(workoutExercise))
            .map((workoutExercise, index) => (
              <WorkoutViewItem key={index} {...workoutExercise} />
            ))}
        </Stack>
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
