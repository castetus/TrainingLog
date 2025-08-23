import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  FormHelperText,
  IconButton,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NestedPageLayout from '@/layouts/NestedPageLayout';
import { mockExercises } from '@/mock/exercises';
import { mockTrainings } from '@/mock/trainings';
import { Routes } from '@/router/routes';
import type { TrainingFormData, TrainingExercise } from '@/types/trainings';

export default function TrainingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = !!id;
  const title = isEditing ? 'Edit Training' : 'New Training';
  const subtitle = isEditing ? `Editing training with ID: ${id}` : 'Create a new training session';

  // Form state
  const [formData, setFormData] = useState<TrainingFormData>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    duration: 60,
    exercises: [],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load existing training data if editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      try {
        // Load from mock data for now
        const training = mockTrainings.find((t) => t.id === id);
        if (training) {
          setFormData({
            name: training.name,
            description: training.description || '',
            date: training.date,
            duration: training.duration || 60,
            exercises: training.exercises,
            notes: training.notes || '',
          });
        }
      } catch (error) {
        console.error('Error loading training:', error);
        setErrors({ load: 'Failed to load training data' });
      } finally {
        setIsLoading(false);
      }
    }
  }, [isEditing, id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addExercise = () => {
    const newExercise: TrainingExercise = {
      exercise: mockExercises[0], // Default to first exercise
      plannedSets: 1,
      plannedReps: [10],
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Training name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    if (formData.exercises.length === 0) {
      newErrors.exercises = 'At least one exercise is required';
    }

    // Validate that all exercises have valid planned values
    formData.exercises.forEach((exercise, index) => {
      if (exercise.plannedSets < 1) {
        newErrors[`exercise${index}Sets`] = 'Planned sets must be at least 1';
      }
      if (exercise.plannedReps.some((rep) => rep < 1)) {
        newErrors[`exercise${index}Reps`] = 'All planned reps must be at least 1';
      }
      if (
        exercise.exercise.type === 'weight' &&
        exercise.plannedWeightKg?.some((weight) => weight < 0)
      ) {
        newErrors[`exercise${index}Weight`] = 'Planned weight cannot be negative';
      }
      if (
        exercise.exercise.type === 'time' &&
        exercise.plannedSeconds?.some((second) => second < 1)
      ) {
        newErrors[`exercise${index}Time`] = 'Planned time must be at least 1 second';
      }
    });

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
      // TODO: Save training to store/database
      console.log('Saving training:', formData);

      // Navigate back to trainings list
      navigate(Routes.TRAININGS);
    } catch (error) {
      console.error('Error saving training:', error);
      setErrors({ submit: 'Failed to save training' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(Routes.TRAININGS);
  };

  return (
    <NestedPageLayout backTo={Routes.TRAININGS} title={title} subtitle={subtitle}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Stack spacing={2}>
              <Typography variant="h6">Basic Information</Typography>

              <TextField
                label="Training Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={2}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date}
                  sx={{ flex: 1 }}
                  required
                />

                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  inputProps={{ min: 1, max: 480 }}
                  sx={{ flex: 1 }}
                  required
                />
              </Stack>
            </Stack>

            <Divider />

            {/* Exercises */}
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Exercises</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addExercise}
                  variant="outlined"
                  size="small"
                >
                  Add Exercise
                </Button>
              </Stack>

              {errors.exercises && <FormHelperText error>{errors.exercises}</FormHelperText>}

              {formData.exercises.map((exercise, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1">Exercise {index + 1}</Typography>
                      <IconButton size="small" onClick={() => removeExercise(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <FormControl sx={{ flex: 2 }}>
                        <InputLabel>Exercise</InputLabel>
                        <Select
                          value={exercise.exercise.id}
                          onChange={(e) => {
                            const selectedExercise = mockExercises.find(
                              (ex) => ex.id === e.target.value,
                            );
                            if (selectedExercise) {
                              updateExercise(index, 'exercise', selectedExercise);
                              // Reset planned values to match exercise defaults
                              updateExercise(index, 'plannedSets', selectedExercise.sets);
                              updateExercise(index, 'plannedReps', selectedExercise.reps);
                              if (selectedExercise.type === 'weight' && selectedExercise.weightKg) {
                                updateExercise(index, 'plannedWeightKg', selectedExercise.weightKg);
                              }
                              if (selectedExercise.type === 'time' && selectedExercise.seconds) {
                                updateExercise(index, 'plannedSeconds', selectedExercise.seconds);
                              }
                            }
                          }}
                          label="Exercise"
                          required
                        >
                          {mockExercises.map((ex) => (
                            <MenuItem key={ex.id} value={ex.id}>
                              {ex.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Sets"
                        type="number"
                        value={exercise.plannedSets}
                        onChange={(e) =>
                          updateExercise(index, 'plannedSets', parseInt(e.target.value) || 1)
                        }
                        error={!!errors[`exercise${index}Sets`]}
                        helperText={errors[`exercise${index}Sets`]}
                        inputProps={{ min: 1, max: 10 }}
                        sx={{ flex: 1 }}
                        required
                      />
                      <TextField
                        label="Reps"
                        type="number"
                        value={exercise.plannedReps[0] || 10}
                        onChange={(e) =>
                          updateExercise(index, 'plannedReps', [parseInt(e.target.value) || 10])
                        }
                        error={!!errors[`exercise${index}Reps`]}
                        helperText={errors[`exercise${index}Reps`]}
                        inputProps={{ min: 1 }}
                        sx={{ flex: 1 }}
                        required
                      />
                    </Stack>

                    {/* Show weight fields for weight-based exercises */}
                    {exercise.exercise.type === 'weight' && (
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2" sx={{ minWidth: 60, pt: 1 }}>
                          Weight (kg):
                        </Typography>
                        {Array.from({ length: exercise.plannedSets }, (_, setIndex) => (
                          <TextField
                            key={setIndex}
                            label={`Set ${setIndex + 1}`}
                            type="number"
                            value={exercise.plannedWeightKg?.[setIndex] || 0}
                            onChange={(e) => {
                              const newWeight = [...(exercise.plannedWeightKg || [])];
                              newWeight[setIndex] = parseFloat(e.target.value) || 0;
                              updateExercise(index, 'plannedWeightKg', newWeight);
                            }}
                            inputProps={{ min: 0, step: 0.5 }}
                            sx={{ width: 100 }}
                          />
                        ))}
                      </Stack>
                    )}

                    {/* Show time fields for time-based exercises */}
                    {exercise.exercise.type === 'time' && (
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2" sx={{ minWidth: 60, pt: 1 }}>
                          Time (sec):
                        </Typography>
                        {Array.from({ length: exercise.plannedSets }, (setIndex) => (
                          <TextField
                            key={setIndex}
                            label={`Set ${setIndex + 1}`}
                            type="number"
                            value={exercise.plannedSeconds?.[setIndex] || 60}
                            onChange={(e) => {
                              const newSeconds = [...(exercise.plannedSeconds || [])];
                              newSeconds[setIndex] = parseInt(e.target.value) || 60;
                              updateExercise(index, 'plannedSeconds', newSeconds);
                            }}
                            inputProps={{ min: 1 }}
                            sx={{ width: 100 }}
                          />
                        ))}
                      </Stack>
                    )}

                    <TextField
                      label="Notes"
                      value={exercise.notes || ''}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider />

            {/* Notes */}
            <Stack spacing={2}>
              <Typography variant="h6">Session Notes</Typography>
              <TextField
                label="Training Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="How did the training go? Any observations or areas for improvement?"
              />
            </Stack>

            {/* Error Messages */}
            {errors.load && <FormHelperText error>{errors.load}</FormHelperText>}
            {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}

            {/* Form Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                    ? 'Update Training'
                    : 'Create Training'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </NestedPageLayout>
  );
}
