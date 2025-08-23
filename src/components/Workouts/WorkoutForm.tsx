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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWorkoutsController } from '@/controllers/workoutsController';
import { useTrainingsController } from '@/controllers/trainingsController';
import { useAppStore } from '@/store';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import { formatShortDate } from '@/utils';
import type { CreateWorkoutData } from '@/types/workouts';

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { create } = useWorkoutsController();
  const { loadAll } = useTrainingsController();
  const trainingsById = useAppStore((s) => s.trainingsById);

  const [formData, setFormData] = useState<CreateWorkoutData>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    duration: undefined,
    exercises: [],
    notes: '',
  });

  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');

  // Load trainings on component mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
        setFormData(prev => ({
          ...prev,
          name: workoutName,
          description: training.description || '',
                  exercises: training.exercises.map(ex => ({
          exercise: ex.exercise,
          plannedSets: ex.plannedSets,
          plannedReps: ex.plannedReps[0] || 10, // Use first planned rep value
          plannedWeight: ex.plannedWeightKg?.[0], // Use first planned weight value
          plannedDuration: ex.plannedSeconds?.[0], // Use first planned duration value
          notes: ex.notes || '',
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
      setFormData(prev => ({ ...prev, name: workoutName }));
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
      await create(formData);
      navigate(Routes.WORKOUTS);
    } catch (error) {
      console.error('Error creating workout:', error);
      setErrors({ submit: 'Failed to create workout' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(Routes.WORKOUTS);
  };

  return (
    <NestedPageLayout title="New Workout" subtitle="Create a new workout session">
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Training Selection */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Training Plan</Typography>
            
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
                {Object.values(trainingsById).map((training) => (
                  <MenuItem key={training.id} value={training.id}>
                    {training.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.training && (
                <FormHelperText error>{errors.training}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          {/* Basic Information */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Basic Information</Typography>

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

            <TextField
              label="Duration (minutes)"
              type="number"
              value={formData.duration || ''}
              onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 480 }}
            />
          </Stack>

          {/* Notes */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Notes</Typography>
            <TextField
              label="Workout Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
              placeholder="Any notes about this workout session..."
            />
          </Stack>

          {/* Error Messages */}
          {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}

          {/* Form Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Workout'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </NestedPageLayout>
  );
}
