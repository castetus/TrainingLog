import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';
import type { Training } from '@/types/trainings';

interface TrainingListItemProps {
  training: Training;
  onDelete?: ({ id, name }: { id: string; name?: string }) => void;
}

export default function TrainingListItem({ training, onDelete }: TrainingListItemProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(Routes.TRAINING_EDIT.replace(':id', training.id));
  };

  const getExerciseSummary = (exercises: Training['exercises']) => {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.plannedSets, 0);
    const exerciseCount = exercises.length;
    return `${exerciseCount} exercises, ${totalSets} sets`;
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      disableGutters
    >
      <ListItemButton sx={{ px: 0 }} onClick={handleEdit}>
        <ListItemText
          primary={training.name}
          secondary={
            <>
              {training.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {training.description}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {getExerciseSummary(training.exercises)}
              </Typography>

              {training.notes && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}

                >
                  "{training.notes}"
                </Typography>
              )}
            </>
          }
        />
      </ListItemButton>

      <Stack direction="row" spacing={1}>
        <IconButton size="small" onClick={handleEdit} sx={{ color: 'primary.main' }}>
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete?.({ id: training.id, name: training.name })}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
}
