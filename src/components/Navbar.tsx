import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current route by checking the pathname
  const getCurrentRoute = (): Routes => {
    const pathname = location.pathname;

    // Check exact matches first, then check if path starts with route
    if (pathname === Routes.HOME) return Routes.HOME;
    if (pathname === Routes.WORKOUTS || pathname.startsWith(Routes.WORKOUTS + '/'))
      return Routes.WORKOUTS;
    if (pathname === Routes.TRAININGS || pathname.startsWith(Routes.TRAININGS + '/'))
      return Routes.TRAININGS;
    if (pathname === Routes.EXERCISES || pathname.startsWith(Routes.EXERCISES + '/'))
      return Routes.EXERCISES;

    return Routes.HOME; // Default fallback
  };

  const changeRoute = (event: React.SyntheticEvent, newValue: Routes) => {
    navigate(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={getCurrentRoute()}
        onChange={changeRoute}
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} value={Routes.HOME} />
        <BottomNavigationAction label="Workouts" icon={<HistoryIcon />} value={Routes.WORKOUTS} />
        <BottomNavigationAction
          label="Trainings"
          icon={<FitnessCenterIcon />}
          value={Routes.TRAININGS}
        />
        <BottomNavigationAction
          label="Exercises"
          icon={<MenuBookIcon />}
          value={Routes.EXERCISES}
        />
      </BottomNavigation>
    </Paper>
  );
}
