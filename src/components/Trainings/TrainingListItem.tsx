import { ListItem, ListItemText, ListItemButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';
import type { Training } from '@/types/trainings';

import { RowActions } from '../Common';

interface TrainingListItemProps {
  training: Training;
  onDelete?: ({ id, name }: { id: string; name?: string }) => void;
}

export default function TrainingListItem({ training, onDelete }: TrainingListItemProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(Routes.TRAINING_DETAIL.replace(':id', training.id));
  };

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
      secondaryAction={
        <RowActions
          onEdit={handleEdit}
          onDelete={() => onDelete?.({ id: training.id, name: training.name })}
        />
      }
      disableGutters
    >
      <ListItemButton sx={{ px: 0 }} onClick={handleView}>
        <ListItemText
          primary={training.name}
          secondary={
            <>
              {training.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {training.description}
                </Typography>
              )}

              {getExerciseSummary(training.exercises)}

              {training.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  "{training.notes}"
                </Typography>
              )}
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
