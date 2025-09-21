import { List, Input, Stack, Typography, Box } from '@mui/material';
import { useState, useMemo } from 'react';

import { useExercisesController } from '@/controllers/exercisesController';
import { useConfirm } from '@/providers/confirmProvider';

import ExercisesListItem from './ExercisesListItem';

export default function ExercisesList() {
  const [search, setSearch] = useState('');
  const confirm = useConfirm();
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const { remove: removeExercise, list: exercises } = useExercisesController();

  const items = useMemo(() => {
    return exercises;
  }, [exercises]);

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
      {/* Only show search if there are exercises */}
      {items.length > 0 && <Input placeholder="Search" onChange={handleSearch} size="small" />}

      {items.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Exercises Yet
          </Typography>
          <Typography variant="body2">
            Create your first exercise to get started with your training vocabulary.
          </Typography>
        </Box>
      ) : filteredExercises.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Exercises Found
          </Typography>
          <Typography variant="body2">No exercises match your search criteria.</Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {filteredExercises.map((exercise) => (
            <ExercisesListItem key={exercise.id} exercise={exercise} onDelete={handleDelete} />
          ))}
        </List>
      )}
    </Stack>
  );
}
