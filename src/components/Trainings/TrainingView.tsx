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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';
import type { Training } from '@/types/trainings';
import { formatTime } from '@/utils';

interface TrainingViewProps {
  training: Training;
}

export default function TrainingView({ training }: TrainingViewProps) {
  const navigate = useNavigate();

  const getDayOfWeek = (day?: number) => {
    if (day === undefined) return null;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  const handleExerciseClick = (exerciseId: string) => {
    navigate(Routes.EXERCISE_DETAIL.replace(':id', exerciseId));
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
                <TableCell align="center">Details</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {training.exercises.map((trainingExercise, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="medium"
                          sx={{ 
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }}
                          onClick={() => handleExerciseClick(trainingExercise.exercise.id)}
                        >
                          {trainingExercise.exercise.name}
                        </Typography>
                        {trainingExercise.shouldUpdatePlannedValues && (
                          <Chip
                            icon={<TrendingUpIcon />}
                            label="Ready for increase"
                            color="warning"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
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
                          {trainingExercise.plannedReps} reps
                          {trainingExercise.plannedWeightKg &&
                            ` x ${trainingExercise.plannedWeightKg}kg`}
                          {trainingExercise.plannedSeconds &&
                            ` x ${formatTime(trainingExercise.plannedSeconds)}`}
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
