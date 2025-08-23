import { List, Box, Divider } from '@mui/material';
import { useEffect } from 'react';

import { useTrainingsController } from '@/controllers/trainingsController';
import { useConfirm } from '@/providers/confirmProvider';
import { useAppStore } from '@/store';
import TrainingListItem from './TrainingListItem';

export default function TrainingsList() {
  const { remove: removeTraining, loadAll } = useTrainingsController();
  const trainingsById = useAppStore((s) => s.trainingsById);
  const confirm = useConfirm();

  // Load trainings from database when component mounts
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDelete = async ({ id, name }: { id: string; name?: string }) => {
    const ok = await confirm({
      title: `Delete "${name}"?`,
      danger: true,
    });
    if (ok) {
      await removeTraining(id);
    }
  };

  const trainings = Object.values(trainingsById);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {trainings.map((training, index) => (
        <Box key={training.id}>
          <TrainingListItem training={training} onDelete={handleDelete} />
          {index < trainings.length - 1 && <Divider component="li" />}
        </Box>
      ))}
    </List>
  );
}
