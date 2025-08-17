import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/router/routes';

import ExercisesList from '@/components/Exercises/ExercisesList';

const ExercisesPage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Fab color="primary" aria-label="add" className='fab-button' onClick={() => navigate(Routes.EXERCISE_NEW)}>
          <AddIcon />
        </Fab>
      </Stack>
      <ExercisesList />
    </Stack>
  );
}

export default ExercisesPage;