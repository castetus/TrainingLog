import { List, Input, Stack } from "@mui/material";
import type { Exercise } from "@/types/exercices";
import ExercisesListItem from "./ExercisesListItem";
import { useState, useMemo } from "react";
import DeleteConfirmationModal from "../Common/DeleteConfirmationModal";

interface ExercisesListProps {
  exercises: Exercise[];
}

export default function ExercisesList({ exercises }: ExercisesListProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()));
  }, [exercises, search]);

  const handleEdit = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleDelete = (exerciseId: string) => {
    console.log('delete', exerciseId);
  };

  
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