import { Box, Typography, Stack, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Outlet } from 'react-router-dom';

import TrainingsList from '@/components/Trainings/TrainingsList';
import TrainingView from '@/components/Trainings/TrainingView';
import { useTrainingsController } from '@/controllers/trainingsController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import type { Training } from '@/types/trainings';

const TrainingsPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById } = useTrainingsController();

  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isNestedRoute = location.pathname !== Routes.TRAININGS;
  const isDetailRoute =
    id &&
    !location.pathname.includes('/edit') &&
    !location.pathname.includes('/new');
  const isNewRoute = location.pathname.includes('/new');

  useEffect(() => {
    if (isDetailRoute && id) {
      setIsLoading(true);
      findById(id)
        .then((foundTraining) => {
          setTraining(foundTraining);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isDetailRoute, id, findById]);

  if (isNewRoute) {
    return <Outlet />;
  }

  if (isDetailRoute && training) {
    return (
      <NestedPageLayout title={training.name} subtitle="Training Details">
        <Stack spacing={3}>
          <TrainingView training={training} />

          {/* Edit button at bottom */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => navigate(Routes.TRAINING_EDIT?.replace(':id', id) || Routes.TRAININGS)}
            >
              Edit Training
            </Button>
          </Stack>
        </Stack>
      </NestedPageLayout>
    );
  }

  if (isDetailRoute && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading training...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      {/* Show trainings list only on main page, otherwise show nested route */}
      {isNestedRoute ? <Outlet /> : <TrainingsList />}
    </Stack>
  );
};

export default TrainingsPage;