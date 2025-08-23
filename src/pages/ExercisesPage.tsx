import { Stack } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';

import ExercisesList from '@/components/Exercises/ExercisesList';
import { Routes } from '@/router/routes';

const ExercisesPage = () => {
  const location = useLocation();

  // Check if we're on a nested route
  const isNestedRoute = location.pathname !== Routes.EXERCISES;

  return (
    <Stack spacing={2}>
      {/* Always show the add button */}
      <Stack direction="row" alignItems="center" justifyContent="space-between"></Stack>

      {/* Show exercises list only on main page, otherwise show nested route */}
      {isNestedRoute ? <Outlet /> : <ExercisesList />}
    </Stack>
  );
};

export default ExercisesPage;
