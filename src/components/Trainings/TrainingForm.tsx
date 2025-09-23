import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Typography,
  TextField,
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
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { AchievedChip } from '@/components/Common';
import { useExercisesController } from '@/controllers/exercisesController';
import { useTrainingsController } from '@/controllers/trainingsController';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';
import type { Exercise } from '@/types/exercises';
import { ExerciseType } from '@/types/exercises';
import type { TrainingFormData, TrainingExercise } from '@/types/trainings';

import AddExerciseSubform from './AddExerciseSubform';

export default function TrainingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById, create, update } = useTrainingsController();
  const { list: exercises } = useExercisesController();

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
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    plannedSets: number;
    plannedReps: number;
    plannedWeightKg?: number;
    plannedSeconds?: number;
  }>({
    plannedSets: 0,
    plannedReps: 0,
    plannedWeightKg: undefined,
    plannedSeconds: undefined,
  });

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

  const handleExerciseChange = useCallback(
    (exercise: Exercise) => {
      setNewExerciseData((prev) => ({
        ...prev,
        exercise,
        plannedSets: 0,
        plannedReps: 0,
        plannedWeight: 0,
        plannedDuration: 0,
      }));
      if (errors.newExercise) {
        setErrors((prev) => ({ ...prev, newExercise: '' }));
      }
    },
    [errors.newExercise],
  );

  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [newExerciseData, setNewExerciseData] = useState<{
    exercise: Exercise | null;
    plannedSets: number;
    plannedReps: number;
    plannedWeight: number;
    plannedDuration: number;
    notes: string;
  }>({
    exercise: null,
    plannedSets: 0,
    plannedReps: 0,
    plannedWeight: 0,
    plannedDuration: 0,
    notes: '',
  });

  const addExercise = () => {
    setShowAddExerciseForm(true);
  };

  const validateNewExercise = () => {
    const newErrors: Record<string, string> = {};

    if (!newExerciseData.exercise) {
      newErrors.newExercise = 'Exercise selection is required';
    }
    if (newExerciseData.plannedSets < 1) {
      newErrors.newSets = 'Sets must be at least 1';
    }
    if (newExerciseData.plannedReps < 1) {
      newErrors.newReps = 'Reps must be at least 1';
    }

    return newErrors;
  };

  const handleAddExercise = () => {
    const validationErrors = validateNewExercise();

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return; // Don't add if validation fails
    }

    const newExercise: TrainingExercise = {
      exercise: newExerciseData.exercise!,
      plannedSets: newExerciseData.plannedSets,
      plannedReps: newExerciseData.plannedReps,
      plannedWeightKg:
        newExerciseData.plannedWeight > 0 ? newExerciseData.plannedWeight : undefined,
      plannedSeconds:
        newExerciseData.plannedDuration > 0 ? newExerciseData.plannedDuration : undefined,
      notes: newExerciseData.notes,
      plannedParametersAchieved: false, // Initialize as false for new exercises
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    // Clear exercises error if it exists
    if (errors.exercises) {
      setErrors((prev) => ({ ...prev, exercises: '' }));
    }

    // Clear any previous validation errors for new exercise
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.newExercise;
      delete rest.newSets;
      delete rest.newReps;
      return rest;
    });

    setShowAddExerciseForm(false);
    // Reset form data
    setNewExerciseData({
      exercise: null,
      plannedSets: 0,
      plannedReps: 0,
      plannedWeight: 0,
      plannedDuration: 0,
      notes: '',
    });
  };

  const cancelAddExercise = () => {
    setShowAddExerciseForm(false);
    setNewExerciseData({
      exercise: null,
      plannedSets: 0,
      plannedReps: 0,
      plannedWeight: 0,
      plannedDuration: 0,
      notes: '',
    });
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const startEditExercise = (index: number) => {
    const exercise = formData.exercises[index];
    setEditingExerciseIndex(index);
    setEditFormData({
      plannedSets: exercise.plannedSets,
      plannedReps: exercise.plannedReps,
      plannedWeightKg: exercise.plannedWeightKg,
      plannedSeconds: exercise.plannedSeconds,
    });
  };

  const cancelEditExercise = () => {
    setEditingExerciseIndex(null);
    setEditFormData({
      plannedSets: 0,
      plannedReps: 0,
      plannedWeightKg: undefined,
      plannedSeconds: undefined,
    });
  };

  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};

    if (editFormData.plannedSets <= 0) {
      newErrors.editSets = 'Sets must be greater than 0';
    }

    if (editFormData.plannedReps <= 0) {
      newErrors.editReps = 'Reps must be greater than 0';
    }

    const exercise = formData.exercises[editingExerciseIndex!];
    if (
      exercise?.exercise.type === ExerciseType.WEIGHT &&
      editFormData.plannedWeightKg !== undefined &&
      editFormData.plannedWeightKg <= 0
    ) {
      newErrors.editWeight = 'Weight must be greater than 0';
    }

    if (
      exercise?.exercise.type === ExerciseType.TIME &&
      editFormData.plannedSeconds !== undefined &&
      editFormData.plannedSeconds <= 0
    ) {
      newErrors.editTime = 'Duration must be greater than 0';
    }

    return newErrors;
  };

  const saveEditExercise = (index: number) => {
    const validationErrors = validateEditForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    // Clear any previous edit errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.editSets;
      delete newErrors.editReps;
      delete newErrors.editWeight;
      delete newErrors.editTime;
      return newErrors;
    });

    const originalExercise = formData.exercises[index];

    // Check if any parameters were increased
    const parametersIncreased =
      editFormData.plannedSets > originalExercise.plannedSets ||
      editFormData.plannedReps > originalExercise.plannedReps ||
      (editFormData.plannedWeightKg !== undefined &&
        originalExercise.plannedWeightKg !== undefined &&
        editFormData.plannedWeightKg > originalExercise.plannedWeightKg) ||
      (editFormData.plannedSeconds !== undefined &&
        originalExercise.plannedSeconds !== undefined &&
        editFormData.plannedSeconds > originalExercise.plannedSeconds);

    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      plannedSets: editFormData.plannedSets,
      plannedReps: editFormData.plannedReps,
      plannedWeightKg: editFormData.plannedWeightKg,
      plannedSeconds: editFormData.plannedSeconds,
      // Reset achieved flag if parameters were increased
      plannedParametersAchieved: parametersIncreased ? false : false, // Always reset to false when editing
    };

    setFormData((prev) => ({
      ...prev,
      exercises: updatedExercises,
    }));

    setEditingExerciseIndex(null);
    setEditFormData({
      plannedSets: 0,
      plannedReps: 0,
      plannedWeightKg: undefined,
      plannedSeconds: undefined,
    });
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
      if (!exercise.plannedReps || exercise.plannedReps < 1) {
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
              {!showAddExerciseForm ? (
                <Button
                  startIcon={<AddIcon />}
                  onClick={addExercise}
                  variant="outlined"
                  size="small"
                  disabled={exercises.length === 0}
                >
                  Add Exercise
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={cancelAddExercise} color="error" size="small" title="Cancel">
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleAddExercise}
                    color="primary"
                    size="small"
                    title="Add Exercise"
                  >
                    <CheckIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>

            <AddExerciseSubform
              showAddExerciseForm={showAddExerciseForm}
              newExerciseData={newExerciseData}
              onExerciseChange={handleExerciseChange}
              onSetsChange={(sets) => {
                setNewExerciseData((prev) => ({ ...prev, plannedSets: sets }));
                if (errors.newSets) {
                  setErrors((prev) => ({ ...prev, newSets: '' }));
                }
              }}
              onRepsChange={(reps) => {
                setNewExerciseData((prev) => ({ ...prev, plannedReps: reps }));
                if (errors.newReps) {
                  setErrors((prev) => ({ ...prev, newReps: '' }));
                }
              }}
              onWeightChange={(weight) =>
                setNewExerciseData((prev) => ({ ...prev, plannedWeight: weight }))
              }
              onDurationChange={(duration) =>
                setNewExerciseData((prev) => ({ ...prev, plannedDuration: duration }))
              }
              onNotesChange={(notes) => setNewExerciseData((prev) => ({ ...prev, notes }))}
              mockExercises={exercises}
              errors={{
                exercise: errors.newExercise,
                sets: errors.newSets,
                reps: errors.newReps,
              }}
            />

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
                      <TableCell sx={{ width: '30%' }}>Exercise</TableCell>
                      <TableCell align="center" sx={{ width: '10%' }}>
                        Sets
                      </TableCell>
                      <TableCell align="center" sx={{ width: '10%' }}>
                        Reps
                      </TableCell>
                      <TableCell align="center" sx={{ width: '12%' }}>
                        Weight/Duration
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.exercises.map((exercise, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Stack>
                            <Typography
                              variant="subtitle2"
                              fontWeight="medium"
                              sx={{
                                cursor: 'pointer',
                                color: 'primary.main',
                                '&:hover': {
                                  textDecoration: 'underline',
                                  color: 'primary.dark',
                                },
                              }}
                              onClick={() =>
                                navigate(
                                  Routes.EXERCISE_DETAIL.replace(':id', exercise.exercise.id),
                                )
                              }
                            >
                              {exercise.exercise.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {exercise.exercise.description}
                            </Typography>
                            {errors[`exercise${index}Exercise`] && (
                              <FormHelperText error sx={{ mt: 0.5 }}>
                                {errors[`exercise${index}Exercise`]}
                              </FormHelperText>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack alignItems="center">
                            {editingExerciseIndex === index ? (
                              <Stack alignItems="center">
                                <TextField
                                  type="number"
                                  value={editFormData.plannedSets || ''}
                                  onChange={(e) =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      plannedSets: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  size="small"
                                  sx={{ width: 60 }}
                                  error={!!errors.editSets}
                                />
                                {errors.editSets && (
                                  <FormHelperText error sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                                    {errors.editSets}
                                  </FormHelperText>
                                )}
                              </Stack>
                            ) : (
                              <Typography variant="body2">{exercise.plannedSets}</Typography>
                            )}
                            {errors[`exercise${index}Sets`] && (
                              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                                {errors[`exercise${index}Sets`]}
                              </FormHelperText>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack alignItems="center">
                            {editingExerciseIndex === index ? (
                              <Stack alignItems="center">
                                <TextField
                                  type="number"
                                  value={editFormData.plannedReps || ''}
                                  onChange={(e) =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      plannedReps: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  size="small"
                                  sx={{ width: 60 }}
                                  error={!!errors.editReps}
                                />
                                {errors.editReps && (
                                  <FormHelperText error sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                                    {errors.editReps}
                                  </FormHelperText>
                                )}
                              </Stack>
                            ) : (
                              <Typography variant="body2">{exercise.plannedReps || 10}</Typography>
                            )}
                            {errors[`exercise${index}Reps`] && (
                              <FormHelperText error sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                                {errors[`exercise${index}Reps`]}
                              </FormHelperText>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack alignItems="center">
                            {editingExerciseIndex === index ? (
                              <Stack alignItems="center">
                                <Stack direction="row" spacing={1}>
                                  {exercise.exercise.type === ExerciseType.WEIGHT && (
                                    <TextField
                                      type="number"
                                      value={editFormData.plannedWeightKg || ''}
                                      onChange={(e) =>
                                        setEditFormData((prev) => ({
                                          ...prev,
                                          plannedWeightKg: parseFloat(e.target.value) || undefined,
                                        }))
                                      }
                                      size="small"
                                      sx={{ width: 70 }}
                                      placeholder="kg"
                                      error={!!errors.editWeight}
                                    />
                                  )}
                                  {exercise.exercise.type === ExerciseType.TIME && (
                                    <TextField
                                      type="number"
                                      value={editFormData.plannedSeconds || ''}
                                      onChange={(e) =>
                                        setEditFormData((prev) => ({
                                          ...prev,
                                          plannedSeconds: parseInt(e.target.value) || undefined,
                                        }))
                                      }
                                      size="small"
                                      sx={{ width: 70 }}
                                      placeholder="s"
                                      error={!!errors.editTime}
                                    />
                                  )}
                                  {exercise.exercise.type === ExerciseType.REPS_ONLY && (
                                    <Typography variant="body2">—</Typography>
                                  )}
                                </Stack>
                                {(errors.editWeight || errors.editTime) && (
                                  <FormHelperText error sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                                    {errors.editWeight || errors.editTime}
                                  </FormHelperText>
                                )}
                              </Stack>
                            ) : (
                              <Typography variant="body2">
                                {exercise.exercise.type === ExerciseType.WEIGHT &&
                                exercise.plannedWeightKg
                                  ? `${exercise.plannedWeightKg}kg`
                                  : exercise.exercise.type === ExerciseType.TIME &&
                                      exercise.plannedSeconds
                                    ? `${exercise.plannedSeconds}s`
                                    : '—'}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <AchievedChip show={exercise.plannedParametersAchieved} />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            {editingExerciseIndex === index ? (
                              <>
                                <IconButton
                                  onClick={() => saveEditExercise(index)}
                                  color="success"
                                  size="small"
                                  title="Save changes"
                                >
                                  <SaveIcon />
                                </IconButton>
                                <IconButton
                                  onClick={cancelEditExercise}
                                  color="inherit"
                                  size="small"
                                  title="Cancel editing"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  onClick={() => startEditExercise(index)}
                                  color="primary"
                                  size="small"
                                  title="Edit exercise parameters"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => removeExercise(index)}
                                  color="error"
                                  size="small"
                                  title="Remove exercise"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Stack>
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
            <Button type="submit" variant="contained" disabled={isLoading} onClick={handleSubmit}>
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
