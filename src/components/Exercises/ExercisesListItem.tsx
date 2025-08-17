import type { Exercise } from "@/types/exercises";
import { IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, type MouseEventHandler } from "react";
import { RowActions } from "@/components/Common";

interface ExercisesListItemProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: ({ id, name }: { id: string, name?: string }) => void;
}

export default function ExercisesListItem({ exercise, onEdit, onDelete }: ExercisesListItemProps) {
  
  const handleDelete: MouseEventHandler = useCallback(
    (e) => { e.stopPropagation(); onDelete?.({ id: exercise.id, name: exercise.name }) },
    [onDelete, { id: exercise.id, name: exercise.name }],
  );

  const handleEdit: MouseEventHandler = useCallback(
    (e) => { e.stopPropagation(); onEdit?.(exercise) },
    [onEdit, exercise],
  );

  return (
    <ListItem alignItems="flex-start" secondaryAction={<RowActions onEdit={handleEdit} onDelete={handleDelete} />}>
      <ListItemText primary={exercise.name} secondary={exercise.description} />
    </ListItem>
  );
};