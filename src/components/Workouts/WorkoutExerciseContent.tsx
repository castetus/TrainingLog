import { AccordionDetails, Typography, Stack, TextField, Box, Divider, Chip } from '@mui/material';
import { useState, useMemo } from 'react';

import type { WorkoutExercise, WorkoutSet } from '@/types/workouts';

interface WorkoutExerciseContentProps {
  workoutExercise: WorkoutExercise;
}

export default function WorkoutExerciseContent({ workoutExercise }: WorkoutExerciseContentProps) {
  const [actualSets, setActualSets] = useState<WorkoutSet[]>(
    Array(workoutExercise.plannedSets)
      .fill(null)
      .map(() => ({
        actualReps: 0,
        actualWeight: undefined,
        actualDuration: undefined,
      })),
  );

  const handleSetChange = (setIndex: number, field: keyof WorkoutSet, value: any) => {
    setActualSets((prev) =>
      prev.map((set, index) => (index === setIndex ? { ...set, [field]: value } : set)),
    );
  };

  // Check if exercise is completed (all sets have required fields filled)
  const isExerciseCompleted = useMemo(() => {
    return actualSets.every((set) => {
      // Reps are always required
      if (set.actualReps <= 0) return false;

      // Weight is required for weight-based exercises
      if (workoutExercise.exercise.type === 'weight' && !set.actualWeight) return false;

      // Duration is required for time-based exercises
      if (workoutExercise.exercise.type === 'time' && !set.actualDuration) return false;

      return true;
    });
  }, [actualSets, workoutExercise.exercise.type]);

  return (
    <AccordionDetails>
      <Stack spacing={3}>
        {/* Exercise Information */}
        <Stack spacing={2}>
          {workoutExercise.exercise.description && (
            <Typography variant="body2" color="text.secondary">
              {workoutExercise.exercise.description}
            </Typography>
          )}

          <Typography variant="body2">
            <strong>Planned:</strong> {workoutExercise.plannedSets} sets of{' '}
            {workoutExercise.plannedReps} reps
            {workoutExercise.plannedWeight && ` at ${workoutExercise.plannedWeight}kg`}
            {workoutExercise.plannedDuration && ` for ${workoutExercise.plannedDuration} seconds`}
          </Typography>

          {workoutExercise.notes && (
            <Typography variant="body2" color="text.secondary">
              <strong>Notes:</strong> {workoutExercise.notes}
            </Typography>
          )}
        </Stack>

        <Divider />

        {/* Actual Results Form */}
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">Actual Results</Typography>
            {isExerciseCompleted && (
              <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 'medium' }} />
            )}
          </Stack>

          {actualSets.map((set, setIndex) => (
            <Box key={setIndex} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Set {setIndex + 1}</Typography>
                {(() => {
                  const set = actualSets[setIndex];
                  const isSetCompleted =
                    set.actualReps > 0 &&
                    (workoutExercise.exercise.type !== 'weight' || set.actualWeight) &&
                    (workoutExercise.exercise.type !== 'time' || set.actualDuration);

                  return isSetCompleted ? (
                    <Chip
                      label="✓"
                      color="success"
                      size="small"
                      sx={{ minWidth: 24, height: 24 }}
                    />
                  ) : null;
                })()}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Reps"
                  type="number"
                  value={set.actualReps || ''}
                  onChange={(e) =>
                    handleSetChange(setIndex, 'actualReps', parseInt(e.target.value) || 0)
                  }
                  size="small"
                  sx={{ width: 100 }}
                  inputProps={{ min: 0, max: 100 }}
                />

                {workoutExercise.exercise.type === 'weight' && (
                  <TextField
                    label="Weight (kg)"
                    type="number"
                    value={set.actualWeight || ''}
                    onChange={(e) =>
                      handleSetChange(
                        setIndex,
                        'actualWeight',
                        parseFloat(e.target.value) || undefined,
                      )
                    }
                    size="small"
                    sx={{ width: 120 }}
                    inputProps={{ min: 0, step: 0.5 }}
                  />
                )}

                {workoutExercise.exercise.type === 'time' && (
                  <TextField
                    label="Duration (sec)"
                    type="number"
                    value={set.actualDuration || ''}
                    onChange={(e) =>
                      handleSetChange(
                        setIndex,
                        'actualDuration',
                        parseInt(e.target.value) || undefined,
                      )
                    }
                    size="small"
                    sx={{ width: 120 }}
                    inputProps={{ min: 0 }}
                  />
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </AccordionDetails>
  );
}
