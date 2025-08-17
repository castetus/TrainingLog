import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useState } from 'react';
import { Routes } from '@/router/routes';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [value, setValue] = useState(Routes.HOME);
  const navigate = useNavigate()

  const changeRoute = (event: React.SyntheticEvent, newValue: Routes) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={changeRoute}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} value={Routes.HOME} />
        <BottomNavigationAction label="Workouts" icon={<HistoryIcon />} value={Routes.WORKOUTS} />
        <BottomNavigationAction label="Trainings" icon={<FitnessCenterIcon />} value={Routes.TRAININGS} />
        <BottomNavigationAction label="Exercises" icon={<MenuBookIcon />} value={Routes.EXERCISES} />
      </BottomNavigation>
    </Paper>
  );
}
