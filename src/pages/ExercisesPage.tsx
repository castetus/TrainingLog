import EditIcon from '@mui/icons-material/Edit';
import { Stack, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';

import { ExerciseView } from '@/components/Exercises';
import ExercisesList from '@/components/Exercises/ExercisesList';
import { useExercisesController } from '@/controllers/exercisesController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import type { Exercise } from '@/types/exercises';

const ExercisesPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById } = useExercisesController();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're on a nested route
  const isNestedRoute = location.pathname !== Routes.EXERCISES;
  const isDetailRoute =
    id && !location.pathname.includes('/edit') && !location.pathname.includes('/new');

  // Load exercise data for detail view
  useEffect(() => {
    if (isDetailRoute && id) {
      setIsLoading(true);
      findById(id)
        .then((foundExercise) => {
          setExercise(foundExercise || null);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isDetailRoute, id, findById]);

  const handleEdit = () => {
    if (id) {
      navigate(Routes.EXERCISE_EDIT.replace(':id', id));
    }
  };

  if (isDetailRoute && exercise) {
    return (
      <NestedPageLayout title={exercise.name} subtitle="Exercise Details">
        <Stack spacing={3}>
          <ExerciseView exercise={exercise} />

          {/* Edit button at bottom */}
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
              Edit Exercise
            </Button>
          </Stack>
        </Stack>
      </NestedPageLayout>
    );
  }

  if (isDetailRoute && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading exercise...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      {/* Show exercises list only on main page, otherwise show nested route */}
      {isNestedRoute ? <Outlet /> : <ExercisesList />}
    </Stack>
  );
};

export default ExercisesPage;
