import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Stack spacing={1.5}>
      <Button variant="contained" onClick={() => navigate(Routes.WORKOUT_NEW)}>
        Start Workout
      </Button>
    </Stack>
  );
};

export default HomePage;
