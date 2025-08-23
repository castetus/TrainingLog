import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useCallback, type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

import { RowActions } from '@/components/Common';
import { Routes } from '@/router/routes';
import type { Exercise } from '@/types/exercises';

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
    >
      <ListItemButton onClick={handleEdit} sx={{ px: 0 }}>
        <ListItemText primary={exercise.name} secondary={exercise.description} />
      </ListItemButton>
    </ListItem>
  );
}
