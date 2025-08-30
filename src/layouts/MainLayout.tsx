import AddIcon from '@mui/icons-material/Add';
import { Box, Container, Typography, Fab } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import { Routes } from '@/router/routes';

const MainLayout = () => {
  const { pathname } = useLocation();

  // Check if we're on a nested route (has more than 2 segments)
  const isNestedRoute = pathname.split('/').length > 2;

  // Only show title for main routes, not nested ones
  const pageTitle = !isNestedRoute
    ? pathname
        .split('/')
        .pop()
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : null;

  // Determine which add button to show based on current route
  const getAddButtonConfig = () => {
    if (isNestedRoute) return null;

    if (pathname === Routes.EXERCISES) {
      return {
        to: Routes.EXERCISE_NEW,
        label: 'Add Exercise',
      };
    }
    if (pathname === Routes.TRAININGS) {
      return {
        to: Routes.TRAINING_NEW,
        label: 'Add Training',
      };
    }
    if (pathname === Routes.WORKOUTS) {
      return {
        to: Routes.WORKOUT_NEW,
        label: 'Add Workout',
      };
    }

    return null;
  };

  const addButtonConfig = getAddButtonConfig();

  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="xl" sx={{ py: 1 }} className="main-container" >
        {pageTitle && (
          <Typography variant="h4" gutterBottom>
            {pageTitle}
          </Typography>
        )}
        <Outlet />
      </Container>

      {/* Add button - only shown on main routes, not nested routes */}
      {addButtonConfig && (
        <Fab
          color="primary"
          aria-label={addButtonConfig.label}
          className="fab-button"
          onClick={() => (window.location.href = addButtonConfig.to)}
          sx={{
            position: 'fixed',
            bottom: 80, // Above the navbar
            right: 16,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <Navbar />
    </Box>
  );
};

export default MainLayout;
