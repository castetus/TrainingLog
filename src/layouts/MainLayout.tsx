import AddIcon from '@mui/icons-material/Add';
import NavigationIcon from '@mui/icons-material/Navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Container, Typography, Fab, AppBar, Toolbar, IconButton } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { BackButton } from '@/components/Common';
import Navbar from '@/components/Navbar';
import { Routes } from '@/router/routes';

type AddButtonVariant = 'circular' | 'extended';
interface AddButtonConfig {
  to: Routes;
  label: string;
  variant: AddButtonVariant;
}

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Check if we're on a nested route (has more than 2 segments, or is home with nested content)
  const isNestedRoute = pathname.split('/').length > 2;

  // Only show title for main routes, not nested ones
  const pageTitle = !isNestedRoute
    ? pathname === '/'
      ? 'Workouts'
      : pathname
          .split('/')
          .pop()
          ?.replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
    : null;

  // Determine which add button to show based on current route
  const getAddButtonConfig = (): AddButtonConfig | null => {
    if (isNestedRoute) return null;

    if (pathname === Routes.EXERCISES) {
      return {
        to: Routes.EXERCISE_NEW,
        label: 'Add Exercise',
        variant: 'circular',
      };
    }
    if (pathname === Routes.TRAININGS) {
      return {
        to: Routes.TRAINING_NEW,
        label: 'Add Training',
        variant: 'circular',
      };
    }
    if (pathname === Routes.HOME) {
      return {
        to: Routes.WORKOUT_NEW,
        label: 'Start Workout',
        variant: 'extended',
      };
    }

    return null;
  };

  const addButtonConfig = getAddButtonConfig();

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header with Settings */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isNestedRoute ? (
            <BackButton sx={{ mt: 0.5 }} />
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Training Log
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate(Routes.SETTINGS)}
            aria-label="Settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 1 }} className="main-container">
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
          variant={addButtonConfig.variant}
          onClick={() => navigate(addButtonConfig.to)}
          sx={{
            position: 'fixed',
            bottom: 80, // Above the navbar
            right: 16,
            zIndex: 1000,
          }}
        >
          {addButtonConfig.variant === 'circular' && <AddIcon />}
          {addButtonConfig.variant === 'extended' && <NavigationIcon />}
          {addButtonConfig.variant === 'extended' && addButtonConfig.label}
        </Fab>
      )}

      <Navbar />
    </Box>
  );
};

export default MainLayout;
