import { AccordionDetails, Typography, Stack, TextField, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState, useMemo } from 'react';

import { ExerciseType } from '@/types';
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
            {isExerciseCompleted && (
              <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 'medium' }} />
            )}
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}></TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Set</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reps</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {workoutExercise.exercise.type === ExerciseType.WEIGHT ? 'kg' : 
                     workoutExercise.exercise.type === ExerciseType.TIME ? 'sec' : 'Field'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actualSets.map((set, setIndex) => {
                  const isSetCompleted =
                    set.actualReps > 0 &&
                    (workoutExercise.exercise.type !== ExerciseType.WEIGHT || set.actualWeight) &&
                    (workoutExercise.exercise.type !== ExerciseType.TIME || set.actualDuration);

                  return (
                    <TableRow key={setIndex}>
                      <TableCell align="center">
                        {isSetCompleted ? (
                          <Chip label="✓" color="success" size="small" sx={{ minWidth: 24, height: 24 }} />
                        ) : (
                          <Chip label="—" color="default" size="small" sx={{ minWidth: 24, height: 24 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">{setIndex + 1}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={set.actualReps || ''}
                          onChange={(e) =>
                            handleSetChange(setIndex, 'actualReps', parseInt(e.target.value) || 0)
                          }
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 0, max: 100 }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {workoutExercise.exercise.type === ExerciseType.WEIGHT && (
                          <TextField
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
                            sx={{ width: 80 }}
                            inputProps={{ min: 0, step: 0.5 }}
                            variant="outlined"
                          />
                        )}
                        {workoutExercise.exercise.type === ExerciseType.TIME && (
                          <TextField
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
                            sx={{ width: 80 }}
                            inputProps={{ min: 0 }}
                            variant="outlined"
                          />
                        )}
                        {workoutExercise.exercise.type !== ExerciseType.WEIGHT && workoutExercise.exercise.type !== ExerciseType.TIME && (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </AccordionDetails>
  );
}
