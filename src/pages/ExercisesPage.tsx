import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/router/routes';

import ExercisesList from '@/components/Exercises/ExercisesList';
import { mockExercises } from '@/components/Exercises/mock';

const ExercisesPage = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Fab color="primary" aria-label="add" className='fab-button' onClick={() => navigate(Routes.EXERCISE_NEW)}>
          <AddIcon />
        </Fab>
      </Stack>
      <ExercisesList exercises={mockExercises} />
    </Stack>
  );
}

export default ExercisesPage;