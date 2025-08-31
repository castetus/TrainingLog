import {
  Box,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import type { Training } from '@/types/trainings';
import { formatTime } from '@/utils';

interface TrainingViewProps {
  training: Training;
}

export default function TrainingView({ training }: TrainingViewProps) {
  const getDayOfWeek = (day?: number) => {
    if (day === undefined) return null;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <Stack spacing={3}>
      {/* Header Info */}
      <Box>
        <Typography variant="h5" gutterBottom>
          {training.name}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {training.dayOfTheWeek !== undefined && (
            <Chip label={getDayOfWeek(training.dayOfTheWeek)} color="primary" />
          )}
          <Chip label={`${training.exercises.length} exercises`} color="secondary" />
        </Stack>
        {training.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {training.description}
          </Typography>
        )}
      </Box>

      {/* Exercises Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Planned Exercises
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Exercise</TableCell>
                <TableCell align="center">Sets</TableCell>
                <TableCell align="center">Planned Details</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {training.exercises.map((trainingExercise, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {trainingExercise.exercise.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trainingExercise.exercise.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{trainingExercise.plannedSets}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={0.5}>
                      {trainingExercise.plannedSets > 0 && (
                        <Typography variant="body2">
                          {trainingExercise.plannedReps.map((reps, setIndex) => (
                            <Box key={setIndex}>
                              Set {setIndex + 1}: {reps} reps
                              {trainingExercise.plannedWeightKg?.[setIndex] && (
                                <span> @ {trainingExercise.plannedWeightKg[setIndex]}kg</span>
                              )}
                              {trainingExercise.plannedSeconds?.[setIndex] && (
                                <span>
                                  {' '}
                                  @ {formatTime(trainingExercise.plannedSeconds[setIndex])}
                                </span>
                              )}
                            </Box>
                          ))}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {trainingExercise.notes}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Overall Notes */}
      {training.notes && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Training Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {training.notes}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
