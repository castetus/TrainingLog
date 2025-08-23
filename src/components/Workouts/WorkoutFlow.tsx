import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Workout } from '@/types/workouts';
import { WorkoutExerciseContent } from './index';

interface WorkoutFlowProps {
  workout: Workout;
}

export default function WorkoutFlow({ workout }: WorkoutFlowProps) {
  return (
    <Box>
      <Stack spacing={2}>
        {workout.exercises.map((workoutExercise, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {workoutExercise.exercise.name}
                </Typography>
                <Chip
                  label={`${workoutExercise.plannedSets} × ${workoutExercise.plannedReps}`}
                  color="primary"
                  size="small"
                />
                {workoutExercise.plannedWeight && (
                  <Chip
                    label={`${workoutExercise.plannedWeight}kg`}
                    color="secondary"
                    size="small"
                  />
                )}
                {workoutExercise.plannedDuration && (
                  <Chip
                    label={`${workoutExercise.plannedDuration}s`}
                    color="secondary"
                    size="small"
                  />
                )}
              </Stack>
            </AccordionSummary>
            <WorkoutExerciseContent workoutExercise={workoutExercise} />
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
