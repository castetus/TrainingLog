import { Box, Typography, Stack, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Outlet } from 'react-router-dom';

import { WorkoutsList, WorkoutView, WorkoutForm, WorkoutFlow } from '@/components/Workouts';
import { useWorkoutsController } from '@/controllers/workoutsController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import type { Workout } from '@/types/workouts';

export default function WorkoutsPage() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById } = useWorkoutsController();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isNestedRoute = location.pathname !== Routes.WORKOUTS;
  const isDetailRoute =
    id && !location.pathname.includes('/edit') && !location.pathname.includes('/new') && !location.pathname.includes('/flow');
  const isNewRoute = location.pathname.includes('/new');
  const isFlowRoute = location.pathname.includes('/flow');

  useEffect(() => {
    if ((isDetailRoute || isFlowRoute) && id) {
      setIsLoading(true);
      findById(id)
        .then((foundWorkout) => {
          setWorkout(foundWorkout);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isDetailRoute, isFlowRoute, id, findById]);

  if (isNewRoute) {
    return <WorkoutForm />;
  }

  if (isFlowRoute && workout) {
    return (
      <NestedPageLayout title={workout.name} subtitle="Workout Session">
        <WorkoutFlow workout={workout} />
      </NestedPageLayout>
    );
  }

  if (isDetailRoute && workout) {
    return (
      <NestedPageLayout title={workout.name} subtitle="Workout Details">
        <Stack spacing={3}>
          <WorkoutView workout={workout} />

          {/* Edit button at bottom */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => navigate(Routes.WORKOUT_EDIT?.replace(':id', id) || Routes.WORKOUTS)}
            >
              Edit Workout
            </Button>
          </Stack>
        </Stack>
      </NestedPageLayout>
    );
  }

  if (isDetailRoute && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading workout...</Typography>
      </Box>
    );
  }

  return <Stack spacing={1}>{isNestedRoute ? <Outlet /> : <WorkoutsList />}</Stack>;
}
