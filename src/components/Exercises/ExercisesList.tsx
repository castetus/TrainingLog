import { List, Input, Stack } from "@mui/material";
import type { Exercise } from "@/types/exercices";
import ExercisesListItem from "./ExercisesListItem";
import { useState, useMemo } from "react";
import { useConfirm } from "@/providers/confirmProvider";

interface ExercisesListProps {
  exercises: Exercise[];
}

export default function ExercisesList({ exercises }: ExercisesListProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState('');
  const confirm = useConfirm();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()));
  }, [exercises, search]);

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleDelete = async ({ id, name }: { id: string, name?: string }) => {
    console.log('delete', id, name);
    const ok = await confirm({
      title: `Delete “${name}”?`,
      danger: true,
    });
    if (ok) {
      await deleteController(id);
    }
  }

  
  return (
    <Stack spacing={2}>
      <Input placeholder="Search" onChange={handleSearch} />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {filteredExercises.map((exercise) => (
          <ExercisesListItem key={exercise.id} exercise={exercise} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </List>
    </Stack>
  );
};