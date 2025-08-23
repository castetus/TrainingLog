import {
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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useExercisesController } from '@/controllers/exercisesController';
import { useAppStore } from '@/store';
import NestedPageLayout from '@/layouts/NestedPageLayout';
import { Routes } from '@/router/routes';

export default function ExerciseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById, create, update } = useExercisesController();
  const exercisesById = useAppStore((s) => s.exercisesById);

  const isEditing = !!id;
  const title = isEditing ? 'Edit Exercise' : 'New Exercise';
  const subtitle = isEditing
    ? `Editing exercise with ID: ${id}`
    : 'Create a new exercise definition for your training vocabulary';

  // Form state - simplified for vocabulary only
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: 'weight' | 'time' | undefined;
  }>({
    name: '',
    description: '',
    type: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load existing exercise data if editing
  useEffect(() => {
    const loadExercise = async () => {
      if (isEditing && id) {
        setIsLoading(true);
        try {
          // First try to get from store
          const exerciseFromStore = exercisesById[id];
          if (exerciseFromStore) {
            setFormData({
              name: exerciseFromStore.name,
              description: exerciseFromStore.description || '',
              type: exerciseFromStore.type,
            });
          } else {
            // If not in store, try to load from database
            const exerciseFromDb = await findById(id);
            if (exerciseFromDb) {
              setFormData({
                name: exerciseFromDb.name,
                description: exerciseFromDb.description || '',
                type: exerciseFromDb.type,
              });
            }
          }
        } catch (error) {
          console.error('Error loading exercise:', error);
          setErrors({ load: 'Failed to load exercise data' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExercise();
  }, [isEditing, id, exercisesById, findById]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTypeChange = (newType: 'weight' | 'time' | undefined) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Exercise name is required';
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
      if (isEditing && id) {
        // Update existing exercise
        await update({
          id,
          ...formData,
        } as any); // Type assertion needed due to simplified form data
      } else {
        // Create new exercise
        await create(formData as any); // Type assertion needed due to simplified form data
      }
      
      // Navigate back to exercises list
      navigate(Routes.EXERCISES);
    } catch (error) {
      console.error('Error saving exercise vocabulary:', error);
      setErrors({ submit: 'Failed to save exercise vocabulary' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(Routes.EXERCISES);
  };

  return (
    <NestedPageLayout backTo={Routes.EXERCISES} title={title} subtitle={subtitle}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Basic Information */}
          <Stack spacing={1.5}>
            <Typography variant="h6">Basic Information</Typography>

            <TextField
              label="Exercise Name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />

            <FormControl fullWidth size="small">
              <InputLabel>Exercise Type</InputLabel>
              <Select
                value={formData.type || ''}
                onChange={(e) =>
                  handleTypeChange(e.target.value as 'weight' | 'time' | undefined)
                }
                label="Exercise Type"
              >
                <MenuItem value="">Reps Only</MenuItem>
                <MenuItem value="weight">Weight-based</MenuItem>
                <MenuItem value="time">Time-based</MenuItem>
              </Select>
            </FormControl>
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
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Exercise' : 'Create Exercise')
              }
            </Button>
          </Stack>
        </Stack>
      </Box>
    </NestedPageLayout>
  );
}
