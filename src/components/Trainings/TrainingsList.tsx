import { List, Box, Divider, Typography } from '@mui/material';

import { useTrainingsController } from '@/controllers/trainingsController';
import { useConfirm } from '@/providers/confirmProvider';

import TrainingListItem from './TrainingListItem';

export default function TrainingsList() {
  const { remove: removeTraining, list: trainings } = useTrainingsController();
  const confirm = useConfirm();

  const handleDelete = async ({ id, name }: { id: string; name?: string }) => {
    const ok = await confirm({
      title: `Delete "${name}"?`,
      danger: true,
    });
    if (ok) {
      await removeTraining(id);
    }
  };

  return (
    <>
      {trainings.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Trainings Yet
          </Typography>
          <Typography variant="body2">
            Create your first training plan to organize your exercises and workouts.
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {trainings.map((training, index) => (
            <Box key={training.id}>
              <TrainingListItem training={training} onDelete={handleDelete} />
              {index < trainings.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}
    </>
  );
}
