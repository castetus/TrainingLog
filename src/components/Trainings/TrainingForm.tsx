import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
  FormHelperText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useTrainingsController } from '@/controllers/trainingsController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { mockExercises } from '@/mock/exercises';
import { Routes } from '@/router/routes';
import type { TrainingFormData, TrainingExercise } from '@/types/trainings';

export default function TrainingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById, create, update } = useTrainingsController();

  const isEditing = !!id;
  const title = isEditing ? 'Edit Training' : 'New Training';
  const subtitle = isEditing ? `Editing training with ID: ${id}` : 'Create a new training session';

  // Form state
  const [formData, setFormData] = useState<TrainingFormData>({
    name: '',
    description: '',
    exercises: [],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load existing training data if editing
  useEffect(() => {
    const loadTraining = async () => {
      if (isEditing && id) {
        setIsLoading(true);
        try {
          const training = await findById(id);
          if (training) {
            setFormData({
              name: training.name,
              description: training.description || '',
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
    };

    loadTraining();
  }, [isEditing, id, findById]);

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

    // Clear field-specific errors
    const errorKey = `exercise${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Training name is required';
    }

    if (formData.exercises.length === 0) {
      newErrors.exercises = 'At least one exercise is required';
    }

    // Validate each exercise
    formData.exercises.forEach((exercise, index) => {
      if (!exercise.exercise) {
        newErrors[`exercise${index}Exercise`] = 'Exercise selection is required';
      }
      if (exercise.plannedSets < 1) {
        newErrors[`exercise${index}Sets`] = 'Sets must be at least 1';
      }
      if (
        !exercise.plannedReps ||
        exercise.plannedReps.length === 0 ||
        exercise.plannedReps[0] < 1
      ) {
        newErrors[`exercise${index}Reps`] = 'Reps must be at least 1';
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
      if (isEditing && id) {
        // Update existing training
        await update(id, formData);
      } else {
        // Create new training
        await create(formData);
      }

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
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Basic Information */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Basic Information</Typography>

            <TextField
              label="Training Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              size="small"
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
          </Stack>

          {/* Exercises */}
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Exercises</Typography>
              <Button startIcon={<AddIcon />} onClick={addExercise} variant="outlined" size="small">
                Add Exercise
              </Button>
            </Stack>

            {errors.exercises && <FormHelperText error>{errors.exercises}</FormHelperText>}

            {formData.exercises.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No exercises added yet. Add your first exercise below.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '35%' }}>Exercise</TableCell>
                      <TableCell align="center" sx={{ width: '12%' }}>
                        Sets
                      </TableCell>
                      <TableCell align="center" sx={{ width: '12%' }}>
                        Reps
                      </TableCell>
                      <TableCell sx={{ width: '35%' }}>Notes</TableCell>
                      <TableCell align="center" sx={{ width: '6%' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.exercises.map((exercise, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormControl fullWidth size="small">
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
                                }
                              }}
                              required
                            >
                              {mockExercises.map((ex) => (
                                <MenuItem key={ex.id} value={ex.id}>
                                  {ex.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={exercise.plannedSets}
                            onChange={(e) =>
                              updateExercise(index, 'plannedSets', parseInt(e.target.value) || 1)
                            }
                            error={!!errors[`exercise${index}Sets`]}
                            helperText={errors[`exercise${index}Sets`]}
                            inputProps={{ min: 1, max: 20 }}
                            size="small"
                            sx={{ width: 70 }}
                            required
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={exercise.plannedReps[0] || 10}
                            onChange={(e) =>
                              updateExercise(index, 'plannedReps', [parseInt(e.target.value) || 10])
                            }
                            error={!!errors[`exercise${index}Reps`]}
                            helperText={errors[`exercise${index}Reps`]}
                            inputProps={{ min: 1, max: 100 }}
                            size="small"
                            sx={{ width: 70 }}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={exercise.notes || ''}
                            onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                            placeholder="Optional notes"
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => removeExercise(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>

          {/* Notes */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Session Notes</Typography>
            <TextField
              label="Training Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
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
    </NestedPageLayout>
  );
}
