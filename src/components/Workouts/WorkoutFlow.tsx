import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Accordion, AccordionSummary, Typography, Stack, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useWorkoutsController } from '@/controllers/workoutsController';
import { useConfirm } from '@/providers/confirmProvider';
import { Routes } from '@/router/routes';
import type { Workout, WorkoutExercise } from '@/types/workouts';

import { WorkoutExerciseContent } from './index';

interface WorkoutFlowProps {
  workout: Workout;
}

export default function WorkoutFlow({ workout }: WorkoutFlowProps) {
  const confirm = useConfirm();
  const { finishWorkout } = useWorkoutsController();
  const navigate = useNavigate();

  // Helper function to check if an exercise is completed
  const isExerciseCompleted = (workoutExercise: WorkoutExercise): boolean => {
    return workoutExercise.actualSets.every((set) => {
      // Reps are always required
      if (set.actualReps <= 0) return false;

      // Weight is required for weight-based exercises
      if (workoutExercise.exercise.type === 'weight' && !set.actualWeight) return false;

      // Duration is required for time-based exercises
      if (workoutExercise.exercise.type === 'time' && !set.actualDuration) return false;

      return true;
    });
  };

  const handleFinishWorkout = async () => {
    const confirmed = await confirm({
      title: 'Finish Workout',
      message: 'Are you sure you want to finish this workout? This action cannot be undone.',
      confirmText: 'Finish',
      cancelText: 'Cancel',
      danger: false,
    });

    if (confirmed) {
      try {
        await finishWorkout(workout.id);
        navigate(Routes.WORKOUTS);
        console.log('Workout finished successfully:', workout.id);
      } catch (error) {
        console.error('Failed to finish workout:', error);
        // Error is already handled by the controller
      }
    }
  };

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
                {isExerciseCompleted(workoutExercise) && (
                  <Chip label="✓" color="success" size="small" sx={{ minWidth: 24, height: 24 }} />
                )}
              </Stack>
            </AccordionSummary>
            <WorkoutExerciseContent workoutExercise={workoutExercise} />
          </Accordion>
        ))}

        {/* Finish Workout Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleFinishWorkout}
            sx={{ px: 4, py: 1.5 }}
          >
            Finish Workout
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
