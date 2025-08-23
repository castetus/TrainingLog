import { Stack } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';

import TrainingsList from '@/components/Trainings/TrainingsList';
import { Routes } from '@/router/routes';

const TrainingsPage = () => {
  const location = useLocation();

  // Check if we're on a nested route
  const isNestedRoute = location.pathname !== Routes.TRAININGS;

  return (
    <Stack spacing={2}>
      {/* Show trainings list only on main page, otherwise show nested route */}
      {isNestedRoute ? <Outlet /> : <TrainingsList />}
    </Stack>
  );
};

export default TrainingsPage;