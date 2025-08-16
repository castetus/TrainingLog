import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useState } from 'react';

export default function Navbar() {
  const [value, setValue] = useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={(_, newValue) => setValue(newValue)}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Workouts" icon={<HistoryIcon />} />
        <BottomNavigationAction label="Trainings" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Exercises" icon={<MenuBookIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
