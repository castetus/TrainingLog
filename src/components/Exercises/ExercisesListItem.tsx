import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useCallback, type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { RowActions } from '@/components/Common';
import { Routes } from '@/router/routes';
import { ExerciseType, type Exercise } from '@/types/exercises';

interface ExercisesListItemProps {
  exercise: Exercise;
  onDelete: ({ id, name }: { id: string; name?: string }) => void;
}

export default function ExercisesListItem({ exercise, onDelete }: ExercisesListItemProps) {
  const navigate = useNavigate();

  const handleDelete: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete?.({ id: exercise.id, name: exercise.name });
    },
    [onDelete, { id: exercise.id, name: exercise.name }],
  );

  const handleView: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      navigate(Routes.EXERCISE_DETAIL.replace(':id', exercise.id));
    },
    [navigate, exercise.id],
  );

  const handleEdit: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      navigate(Routes.EXERCISE_EDIT.replace(':id', exercise.id));
    },
    [navigate, exercise.id],
  );

  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={<RowActions onEdit={handleEdit} onDelete={handleDelete} />}
      disableGutters
    >
      <ListItemButton onClick={handleView} sx={{ px: 0 }}>
        <ListItemText primary={exercise.name} secondary={exercise.description} />
        {exercise.type === ExerciseType.WEIGHT && exercise.lastSetWeightKg && (
          <Typography variant="body2">{exercise.lastSetWeightKg} kg</Typography>
        )}
        {exercise.type === ExerciseType.TIME && exercise.lastSetSeconds && (
          <Typography variant="body2">{exercise.lastSetSeconds} s</Typography>
        )}
        {exercise.type === ExerciseType.REPS_ONLY && exercise.lastSetReps && (
          <Typography variant="body2">{exercise.lastSetReps} reps</Typography>
        )}
      </ListItemButton>
    </ListItem>
  );
}
