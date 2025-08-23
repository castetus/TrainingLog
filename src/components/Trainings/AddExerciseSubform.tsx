import { Box, Typography, TextField, Stack, Autocomplete } from '@mui/material';

import type { Exercise } from '@/types/exercises';
import { ExerciseType } from '@/types/exercises';

interface AddExerciseSubformProps {
  showAddExerciseForm: boolean;
  newExerciseData: {
    exercise: Exercise;
    plannedSets: number;
    plannedReps: number;
    plannedWeight?: number;
    plannedDuration?: number;
    notes: string;
  };
  onExerciseChange: (exercise: Exercise) => void;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
  onWeightChange?: (weight: number) => void;
  onDurationChange?: (duration: number) => void;
  onNotesChange: (notes: string) => void;
  mockExercises: Exercise[];
}

export default function AddExerciseSubform({
  showAddExerciseForm,
  newExerciseData,
  onExerciseChange,
  onSetsChange,
  onRepsChange,
  onWeightChange,
  onDurationChange,
  onNotesChange,
  mockExercises,
}: AddExerciseSubformProps) {
  if (!showAddExerciseForm) return null;

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Add Exercise to Training
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ minWidth: 80 }}>
            Exercise:
          </Typography>
          <Autocomplete
            value={newExerciseData.exercise}
            onChange={(event, newValue) => {
              if (newValue) {
                onExerciseChange(newValue);
              }
            }}
            options={mockExercises}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Stack>
                  <Typography variant="body2" fontWeight="medium">
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>
              </Box>
            )}
            size="small"
            sx={{ flexGrow: 1 }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ minWidth: 80 }}>
            Sets:
          </Typography>
          <TextField
            type="number"
            value={newExerciseData.plannedSets}
            onChange={(e) => onSetsChange(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: 20 }}
            size="small"
            sx={{ width: 100 }}
          />
        </Stack>

        {/* Weight-based exercise fields */}
        {newExerciseData.exercise.type === ExerciseType.WEIGHT && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Weight (kg):
            </Typography>
            <TextField
              type="number"
              value={newExerciseData.plannedWeight || 0}
              onChange={(e) => onWeightChange?.(parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 500, step: 0.5 }}
              size="small"
              sx={{ width: 100 }}
            />
          </Stack>
        )}

        {/* Time-based exercise fields */}
        {newExerciseData.exercise.type === ExerciseType.TIME && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Duration (sec):
            </Typography>
            <TextField
              type="number"
              value={newExerciseData.plannedDuration || 60}
              onChange={(e) => onDurationChange?.(parseInt(e.target.value) || 60)}
              inputProps={{ min: 10, max: 3600, step: 10 }}
              size="small"
              sx={{ width: 100 }}
            />
          </Stack>
        )}

        {/* Reps field - hidden for time-based exercises */}
        {newExerciseData.exercise.type !== ExerciseType.TIME && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Reps:
            </Typography>
            <TextField
              type="number"
              value={newExerciseData.plannedReps}
              onChange={(e) => onRepsChange(parseInt(e.target.value) || 10)}
              inputProps={{ min: 1, max: 100 }}
              size="small"
              sx={{ width: 100 }}
            />
          </Stack>
        )}

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ minWidth: 80 }}>
            Notes:
          </Typography>
          <TextField
            value={newExerciseData.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Optional notes"
            size="small"
            sx={{ flex: 1 }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
