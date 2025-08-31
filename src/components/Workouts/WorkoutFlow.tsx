import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Accordion, AccordionSummary, Typography, Stack, Chip, Button } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWorkoutsController } from '@/controllers/workoutsController';
import { useConfirm } from '@/providers/confirmProvider';
import { Routes } from '@/router/routes';
import type { Workout, WorkoutExercise } from '@/types/workouts';
import type { WorkoutSet } from '@/types/workouts';

import { WorkoutExerciseContent } from './index';

interface WorkoutFlowProps {
  workout: Workout;
}

export default function WorkoutFlow({ workout }: WorkoutFlowProps) {
  const confirm = useConfirm();
  const { finishWorkout, update } = useWorkoutsController();
  const navigate = useNavigate();

  // Track workout duration
  const [startTime] = useState<Date>(new Date());
  const [currentDuration, setCurrentDuration] = useState<number>(0);

  // Track actual sets for all exercises - initialize with existing data
  const [actualSetsByExercise, setActualSetsByExercise] = useState<Record<number, WorkoutSet[]>>(
    () => {
      const initial: Record<number, WorkoutSet[]> = {};
      workout.exercises.forEach((exercise, index) => {
        if (exercise.actualSets && exercise.actualSets.length > 0) {
          initial[index] = exercise.actualSets;
        }
      });
      return initial;
    },
  );

  // Update duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setCurrentDuration(durationInSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle updating actual sets for an exercise
  const handleActualSetsUpdate = useCallback((exerciseIndex: number, actualSets: WorkoutSet[]) => {
    setActualSetsByExercise((prev) => ({
      ...prev,
      [exerciseIndex]: actualSets,
    }));
  }, []);

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
        // Calculate final duration when finishing (in minutes for database)
        const finalDurationMinutes = Math.floor(
          (new Date().getTime() - startTime.getTime()) / (1000 * 60),
        );

        // Prepare workout with actual sets data - ensure we have the latest data
        const workoutWithResults = {
          ...workout,
          exercises: workout.exercises.map((exercise, index) => ({
            ...exercise,
            actualSets: actualSetsByExercise[index] || exercise.actualSets || [],
          })),
        };

        // Update workout with duration and actual sets before finishing
        await update({
          id: workout.id,
          duration: finalDurationMinutes,
          exercises: workoutWithResults.exercises,
        });

        // Now finish the workout
        await finishWorkout({
          id: workout.id,
          duration: finalDurationMinutes,
          exercises: workoutWithResults.exercises,
        });
        navigate(Routes.WORKOUTS);
        console.log(
          'Workout finished successfully:',
          workout.id,
          'Duration:',
          finalDurationMinutes,
          'minutes',
        );
      } catch (error) {
        console.error('Failed to finish workout:', error);
        // Error is already handled by the controller
      }
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        {/* Workout Duration Display */}
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Workout Duration
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {formatDuration(currentDuration)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Started at {startTime.toLocaleTimeString()}
          </Typography>
        </Box>

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
            <WorkoutExerciseContent
              workoutExercise={workoutExercise}
              exerciseIndex={index}
              onActualSetsUpdate={handleActualSetsUpdate}
            />
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
