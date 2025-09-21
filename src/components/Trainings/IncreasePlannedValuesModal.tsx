import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  TextField,
  Chip,
  Divider,
} from '@mui/material';
import { useState } from 'react';

import { ExerciseType } from '@/types/exercises';
import type { TrainingExercise } from '@/types/trainings';

interface IncreasePlannedValuesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (updatedExercises: TrainingExercise[]) => void;
  exercises: TrainingExercise[];
}

export default function IncreasePlannedValuesModal({
  open,
  onClose,
  onConfirm,
  exercises,
}: IncreasePlannedValuesModalProps) {
  const [updatedExercises, setUpdatedExercises] = useState<TrainingExercise[]>(
    exercises.map((exercise) => ({ ...exercise }))
  );

  const handleValueChange = (exerciseIndex: number, field: string, value: number) => {
    setUpdatedExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise
      )
    );
  };

  const handleConfirm = () => {
    onConfirm(updatedExercises);
    onClose();
  };

  const handleClose = () => {
    setUpdatedExercises(exercises.map((exercise) => ({ ...exercise })));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6">Increase Planned Values</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body1">
            You've achieved your planned parameters for these exercises. Increase the planned values
            to continue your progress:
          </Typography>

          <Divider />

          {updatedExercises.map((exercise, exerciseIndex) => (
            <Box
              key={exercise.exercise.id}
              sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    {exercise.exercise.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {exercise.exercise.description}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label={`${exercise.plannedSets} sets`} size="small" variant="outlined" />
                  <Chip label={`${exercise.plannedReps} reps`} size="small" variant="outlined" />
                  {exercise.exercise.type === ExerciseType.WEIGHT && exercise.plannedWeightKg && (
                    <Chip label={`${exercise.plannedWeightKg}kg`} size="small" variant="outlined" />
                  )}
                  {exercise.exercise.type === ExerciseType.TIME && exercise.plannedSeconds && (
                    <Chip label={`${exercise.plannedSeconds}s`} size="small" variant="outlined" />
                  )}
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Reps"
                    type="number"
                    value={exercise.plannedReps}
                    onChange={(e) => handleValueChange(exerciseIndex, 'plannedReps', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{ minWidth: 100 }}
                  />

                  {exercise.exercise.type === ExerciseType.WEIGHT && (
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={exercise.plannedWeightKg || ''}
                      onChange={(e) =>
                        handleValueChange(exerciseIndex, 'plannedWeightKg', parseFloat(e.target.value) || 0)
                      }
                      size="small"
                      sx={{ minWidth: 120 }}
                    />
                  )}

                  {exercise.exercise.type === ExerciseType.TIME && (
                    <TextField
                      label="Duration (seconds)"
                      type="number"
                      value={exercise.plannedSeconds || ''}
                      onChange={(e) =>
                        handleValueChange(exerciseIndex, 'plannedSeconds', parseInt(e.target.value) || 0)
                      }
                      size="small"
                      sx={{ minWidth: 150 }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}

          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            These new values will be saved to your training plan for future workouts.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Update Training Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
