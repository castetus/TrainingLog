import { useEffect } from 'react';
import { List, Typography, Box, CircularProgress } from '@mui/material';
import { useWorkoutsController } from '@/controllers/workoutsController';
import WorkoutListItem from './WorkoutListItem';

export default function WorkoutsList() {
  const { workoutsById, loadAll, isLoading } = useWorkoutsController();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const workouts = Object.values(workoutsById);

  if (isLoading && workouts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (workouts.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No workouts yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start tracking your training sessions to see your progress here.
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {workouts.map((workout) => (
        <WorkoutListItem key={workout.id} workout={workout} />
      ))}
    </List>
  );
}
