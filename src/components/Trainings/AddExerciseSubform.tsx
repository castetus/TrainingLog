import { Box, Typography, TextField, Stack, Autocomplete, FormHelperText } from '@mui/material';

import type { Exercise } from '@/types/exercises';
import { ExerciseType } from '@/types/exercises';

interface AddExerciseSubformProps {
  showAddExerciseForm: boolean;
  newExerciseData: {
    exercise: Exercise | null;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    plannedDuration: number;
    notes: string;
  };
  onExerciseChange: (exercise: Exercise) => void;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
  onWeightChange: (weight: number) => void;
  onDurationChange: (duration: number) => void;
  onNotesChange: (notes: string) => void;
  mockExercises: Exercise[];
  errors?: {
    exercise?: string;
    sets?: string;
    reps?: string;
  };
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
  errors = {},
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
            onChange={(_event, newValue) => {
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
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                error={!!errors.exercise}
                helperText={errors.exercise}
              />
            )}
          />
          {errors.exercise && <FormHelperText error>{errors.exercise}</FormHelperText>}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ minWidth: 80 }}>
            Sets:
          </Typography>
          <TextField
            type="number"
            value={newExerciseData.plannedSets}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                // Don't call onSetsChange - let it stay empty temporarily
                return;
              } else {
                const parsed = parseInt(value);
                if (!isNaN(parsed)) {
                  onSetsChange(parsed);
                }
              }
            }}
            disabled={!newExerciseData.exercise}
            size="small"
            sx={{ width: 100 }}
            error={!!errors.sets}
            helperText={errors.sets}
          />
        </Stack>

        {/* Weight-based exercise fields */}
        {newExerciseData.exercise?.type === ExerciseType.WEIGHT && (
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Weight (kg):
              </Typography>
              <TextField
                type="number"
                value={newExerciseData.plannedWeight}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === '') {
                    // Don't call onWeightChange - let it stay empty temporarily
                    return;
                  } else {
                    const parsed = parseFloat(value);
                    if (!isNaN(parsed)) {
                      onWeightChange(parsed);
                    }
                  }
                }}
                disabled={!newExerciseData.exercise}
                size="small"
                sx={{ width: 100 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 10 }}>
              Last set:{' '}
              {newExerciseData.exercise?.lastSetWeightKg
                ? `${newExerciseData.exercise.lastSetWeightKg}kg`
                : '—'}
            </Typography>
          </Stack>
        )}

        {/* Time-based exercise fields */}
        {newExerciseData.exercise?.type === ExerciseType.TIME && (
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Duration (sec):
              </Typography>
              <TextField
                type="number"
                value={newExerciseData.plannedDuration}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    // Don't call onDurationChange - let it stay empty temporarily
                    return;
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      onDurationChange(parsed);
                    }
                  }
                }}
                disabled={!newExerciseData.exercise}
                size="small"
                sx={{ width: 100 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 10 }}>
              Last set:{' '}
              {newExerciseData.exercise?.lastSetSeconds
                ? `${newExerciseData.exercise.lastSetSeconds}s`
                : '—'}
            </Typography>
          </Stack>
        )}

        {/* Reps field - hidden for time-based exercises */}
        {newExerciseData.exercise?.type !== ExerciseType.TIME && (
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                Reps:
              </Typography>
              <TextField
                type="number"
                value={newExerciseData.plannedReps}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    // Don't call onRepsChange - let it stay empty temporarily
                    return;
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      onRepsChange(parsed);
                    }
                  }
                }}
                disabled={!newExerciseData.exercise}
                size="small"
                sx={{ width: 100 }}
                error={!!errors.reps}
                helperText={errors.reps}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 10 }}>
              Last set:{' '}
              {newExerciseData.exercise?.type === ExerciseType.REPS_ONLY &&
              newExerciseData.exercise?.lastSetReps
                ? `${newExerciseData.exercise.lastSetReps} reps`
                : '—'}
            </Typography>
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
            disabled={!newExerciseData.exercise}
            size="small"
            sx={{ flex: 1 }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
