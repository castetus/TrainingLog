import { List, Input, Stack } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';

import { useExercisesController } from '@/controllers/exercisesController';
import { useConfirm } from '@/providers/confirmProvider';
import { useAppStore } from '@/store';

import ExercisesListItem from './ExercisesListItem';

export default function ExercisesList() {
  const [search, setSearch] = useState('');
  const confirm = useConfirm();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const { remove: removeExercise, loadAll } = useExercisesController();

  // Load exercises from database when component mounts
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const exercisesById = useAppStore((s) => s.exercisesById);

  const items = useMemo(() => {
    const exercises = Object.values(exercisesById);

    return exercises;
  }, [exercisesById]);

  const filteredExercises = useMemo(() => {
    return items.filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const handleDelete = async ({ id, name }: { id: string; name?: string }) => {
    const ok = await confirm({
      title: `Delete “${name}”?`,
      danger: true,
    });
    if (ok) {
      await removeExercise(id);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Input placeholder="Search" onChange={handleSearch} size="small" />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {filteredExercises.map((exercise) => (
          <ExercisesListItem key={exercise.id} exercise={exercise} onDelete={handleDelete} />
        ))}
      </List>
    </Stack>
  );
}
