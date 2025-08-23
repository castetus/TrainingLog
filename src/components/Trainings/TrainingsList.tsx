import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mockTrainings } from '@/mock/trainings';
import { Routes } from '@/router/routes';
import type { Training } from '@/types/trainings';

interface TrainingsListProps {
  onDelete?: (id: string) => void;
}

export default function TrainingsList({ onDelete }: TrainingsListProps) {
  const [trainings] = useState<Training[]>(mockTrainings);
  const navigate = useNavigate();

  const handleEdit = (training: Training) => {
    navigate(Routes.TRAINING_EDIT.replace(':id', training.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getExerciseSummary = (exercises: Training['exercises']) => {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.plannedSets, 0);
    const exerciseCount = exercises.length;
    return `${exerciseCount} exercises, ${totalSets} sets`;
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {trainings.map((training, index) => (
        <Box key={training.id}>
          <ListItem
            alignItems="flex-start"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemButton sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6" component="span">
                      {training.name}
                    </Typography>
                    {training.completed && <CheckCircleIcon color="success" fontSize="small" />}
                    <Chip
                      label={training.completed ? 'Completed' : 'Planned'}
                      color={training.completed ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                }
                secondary={
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {training.description && (
                      <Typography variant="body2" color="text.secondary">
                        {training.description}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(training.date)}
                        </Typography>
                      </Stack>

                      {training.duration && (
                        <Typography variant="body2" color="text.secondary">
                          {formatDuration(training.duration)}
                        </Typography>
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {getExerciseSummary(training.exercises)}
                    </Typography>

                    {training.notes && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        "{training.notes}"
                      </Typography>
                    )}
                  </Stack>
                }
              />
            </ListItemButton>

            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => handleEdit(training)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete?.(training.id)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </ListItem>

          {index < trainings.length - 1 && <Divider component="li" />}
        </Box>
      ))}
    </List>
  );
}
