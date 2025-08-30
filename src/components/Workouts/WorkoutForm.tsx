import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTrainingsController } from '@/controllers/trainingsController';
import { useWorkoutsController } from '@/controllers/workoutsController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import { useAppStore } from '@/store';
import type { CreateWorkoutData } from '@/types/workouts';
import { formatShortDate } from '@/utils';

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { create } = useWorkoutsController();
  const { loadAll } = useTrainingsController();
  const trainingsById = useAppStore((s) => s.trainingsById);

  const [formData, setFormData] = useState<CreateWorkoutData>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    exercises: [],
  });

  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');

  // Load trainings on component mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Auto-select training based on day of the week
  useEffect(() => {
    if (Object.keys(trainingsById).length > 0 && !selectedTrainingId) {
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Find training that matches today's day of the week
      const matchingTraining = Object.values(trainingsById).find(
        (training) => training.dayOfTheWeek === today,
      );

      if (matchingTraining) {
        handleTrainingChange(matchingTraining.id);
      }
    }
  }, [trainingsById, selectedTrainingId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const getDayName = (dayOfTheWeek?: number): string => {
    if (dayOfTheWeek === undefined) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfTheWeek];
  };

  const generateWorkoutName = (trainingId: string, date: string) => {
    if (!trainingId || !date) return '';

    const training = trainingsById[trainingId];
    if (!training) return '';

    const formattedDate = formatShortDate(date);

    return `${training.name} - ${formattedDate}`;
  };

  const handleTrainingChange = (trainingId: string) => {
    setSelectedTrainingId(trainingId);

    if (trainingId) {
      const training = trainingsById[trainingId];
      if (training) {
        // Auto-generate workout name
        const workoutName = generateWorkoutName(trainingId, formData.date);
        setFormData((prev) => ({
          ...prev,
          name: workoutName,
          description: training.description || '',
          exercises: training.exercises.map((ex) => ({
            exercise: ex.exercise,
            plannedSets: ex.plannedSets,
            plannedReps: ex.plannedReps[0] || 10, // Use first planned rep value
            plannedWeight: ex.plannedWeightKg?.[0], // Use first planned weight value
            plannedDuration: ex.plannedSeconds?.[0], // Use first planned duration value
            actualSets: [], // Initialize with empty actual sets
          })),
        }));
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // If date changes, regenerate workout name
    if (field === 'date' && selectedTrainingId) {
      const workoutName = generateWorkoutName(selectedTrainingId, value);
      setFormData((prev) => ({ ...prev, name: workoutName }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTrainingId) {
      newErrors.training = 'Please select a training plan';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Workout name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newWorkout = await create(formData);
      navigate(Routes.WORKOUT_FLOW.replace(':id', newWorkout.id));
    } catch (error) {
      console.error('Error creating workout:', error);
      setErrors({ submit: 'Failed to create workout' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NestedPageLayout
      title="Start Workout"
      subtitle="Begin a new workout session based on a training plan"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Training Selection */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Select Training Plan</Typography>

            {Object.keys(trainingsById).length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 3,
                  px: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No Training Plans Available
                </Typography>
                <Typography variant="body2" gutterBottom>
                  You need to create at least one training plan before starting a workout.
                </Typography>
                <Typography variant="body2">
                  Go to the Trainings page to create your first training plan.
                </Typography>
              </Box>
            ) : (
              <FormControl fullWidth size="small" error={!!errors.training}>
                <InputLabel>Select Training</InputLabel>
                <Select
                  value={selectedTrainingId}
                  onChange={(e) => handleTrainingChange(e.target.value)}
                  label="Select Training"
                >
                  <MenuItem value="">
                    <em>Choose a training plan...</em>
                  </MenuItem>
                  {Object.values(trainingsById).map((training) => {
                    const today = new Date().getDay();
                    const isToday = training.dayOfTheWeek === today;

                    return (
                      <MenuItem key={training.id} value={training.id}>
                        <Stack>
                          <Typography variant="body2" component="div">
                            {training.name}
                            {isToday && (
                              <Chip
                                label="Today"
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Typography>
                          {training.dayOfTheWeek !== undefined && (
                            <Typography variant="caption" color="text.secondary">
                              {getDayName(training.dayOfTheWeek)}
                            </Typography>
                          )}
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.training && <FormHelperText error>{errors.training}</FormHelperText>}
              </FormControl>
            )}
          </Stack>

          {/* Workout Details */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Workout Details</Typography>

            <TextField
              label="Workout Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              size="small"
              placeholder="Auto-generated from training and date"
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              fullWidth
              required
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {/* Error Messages */}
          {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}

          {/* Form Actions */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || Object.keys(trainingsById).length === 0}
              startIcon={<PlayArrowIcon />}
            >
              {isLoading ? 'Starting...' : 'Start Workout'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </NestedPageLayout>
  );
}
