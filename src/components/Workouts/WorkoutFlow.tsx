import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  Stack,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExercisesController } from '@/controllers/exercisesController';
import { useTrainingsController } from '@/controllers/trainingsController';
import { useWorkoutsController } from '@/controllers/workoutsController';
import { useConfirm } from '@/providers/confirmProvider';
import { Routes } from '@/router/routes';
import type { Workout, WorkoutExercise } from '@/types/workouts';
import type { WorkoutSet } from '@/types/workouts';
import { updateTrainingFromWorkout } from '@/utils/updateTrainingFromWorkout';
import { analyzeWorkoutPerformance } from '@/utils/workoutAnalysis';

import { WorkoutExerciseContent } from './index';
import UpdatePlannedValuesModal from './UpdatePlannedValuesModal';

interface WorkoutFlowProps {
  workout: Workout;
}

export default function WorkoutFlow({ workout }: WorkoutFlowProps) {
  const confirm = useConfirm();
  const { finishWorkout, update } = useWorkoutsController();
  const { findById: findTrainingById, update: updateTraining } = useTrainingsController();
  const { update: updateExercise } = useExercisesController();
  const navigate = useNavigate();

  // Track workout duration
  const [startTime] = useState<Date>(new Date());
  const [currentDuration, setCurrentDuration] = useState<number>(0);

  // State for performance analysis modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<ReturnType<
    typeof analyzeWorkoutPerformance
  > | null>(null);

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
    if (!workoutExercise.actualSets || workoutExercise.actualSets.length === 0) return false;
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

        // Update exercise lastSet values with actual performance
        await updateExerciseLastSetValues(workoutWithResults.exercises);

        const analysis = analyzeWorkoutPerformance(workoutWithResults);

        if (analysis.shouldUpdatePlannedValues) {
          // Show modal to confirm updating planned values
          setPerformanceAnalysis(analysis);
          setShowUpdateModal(true);
          return; // Don't finish workout yet, wait for user decision
        }

        navigate(Routes.WORKOUTS);
      } catch (error) {
        console.error('Failed to finish workout:', error);
        // Error is already handled by the controller
      }
    }
  };

  const updateExerciseLastSetValues = async (exercises: WorkoutExercise[]) => {
    const exercisesToUpdate: any[] = [];

    exercises.forEach((workoutExercise) => {
      if (!workoutExercise.actualSets || workoutExercise.actualSets.length === 0) {
        return; // Skip exercises with no actual sets
      }

      // Get the last actual set
      const lastSet = workoutExercise.actualSets[workoutExercise.actualSets.length - 1];
      if (!lastSet) {
        return;
      }

      // Create updated exercise with lastSet values
      const exercise = workoutExercise.exercise;
      const updatedExercise = { ...exercise };

      // Update lastSet values based on exercise type
      if (exercise.type === 'weight' && lastSet.actualWeight) {
        (updatedExercise as any).lastSetWeightKg = lastSet.actualWeight;
        exercisesToUpdate.push(updatedExercise);
      } else if (exercise.type === 'time' && lastSet.actualDuration) {
        (updatedExercise as any).lastSetSeconds = lastSet.actualDuration;
        exercisesToUpdate.push(updatedExercise);
      } else if (exercise.type === 'reps_only' && lastSet.actualReps) {
        (updatedExercise as any).lastSetReps = lastSet.actualReps;
        exercisesToUpdate.push(updatedExercise);
      }
    });

    // Update exercises in database
    for (const exercise of exercisesToUpdate) {
      await updateExercise(exercise);
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
              <Stack alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    flexGrow: 1,
                    color: isExerciseCompleted(workoutExercise) ? 'success.main' : 'inherit',
                  }}
                >
                  {workoutExercise.exercise.name}
                </Typography>
                {workoutExercise.exercise.videoUrl && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => window.open(workoutExercise.exercise.videoUrl, '_blank')}
                    sx={{ ml: 1 }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                )}
                <Stack direction="row" alignItems="start" width="100%" spacing={2}>
                  {isExerciseCompleted(workoutExercise) && (
                    <Chip
                      label="✓"
                      color="success"
                      size="small"
                      sx={{ minWidth: 24, height: 24 }}
                    />
                  )}
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
              </Stack>
            </AccordionSummary>
            <WorkoutExerciseContent
              workoutExercise={workoutExercise}
              exerciseIndex={index}
              workoutId={workout.id}
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

      {/* Performance Analysis Modal */}
      {performanceAnalysis && (
        <UpdatePlannedValuesModal
          open={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setPerformanceAnalysis(null);
            navigate(Routes.WORKOUTS);
          }}
          onConfirm={async () => {
            try {
              if (!workout.trainingId || !performanceAnalysis) {
                setShowUpdateModal(false);
                setPerformanceAnalysis(null);
                navigate(Routes.WORKOUTS);
                return;
              }

              // Find the original training
              const originalTraining = await findTrainingById(workout.trainingId);
              if (!originalTraining) {
                console.error('Training not found:', workout.trainingId);
                setShowUpdateModal(false);
                setPerformanceAnalysis(null);
                navigate(Routes.WORKOUTS);
                return;
              }

              // Update the training with suggested improvements
              const updateResult = updateTrainingFromWorkout(originalTraining, performanceAnalysis);
              if (!updateResult.success || !updateResult.updatedTraining) {
                console.error('Failed to update training:', updateResult.error);
                setShowUpdateModal(false);
                setPerformanceAnalysis(null);
                navigate(Routes.WORKOUTS);
                return;
              }

              // Save the updated training to database
              await updateTraining(originalTraining.id, updateResult.updatedTraining);

              // Also update exercises in the database and store if any were updated
              if (updateResult.updatedExercises && updateResult.updatedExercises.length > 0) {
                // Update each exercise in the database
                for (const exercise of updateResult.updatedExercises) {
                  await updateExercise(exercise);
                }
              }

              console.log('Training and exercises updated successfully with new planned values');
            } catch (error) {
              console.error('Failed to update training:', error);
            } finally {
              setShowUpdateModal(false);
              setPerformanceAnalysis(null);
              navigate(Routes.WORKOUTS);
            }
          }}
          analysis={performanceAnalysis}
        />
      )}
    </Box>
  );
}
