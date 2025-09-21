import { ListItem, ListItemButton, ListItemText, Chip, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/router/routes';
import type { Workout } from '@/types/workouts';
import { formatShortDate, formatDuration } from '@/utils';

interface WorkoutListItemProps {
  workout: Workout;
}

export default function WorkoutListItem({ workout }: WorkoutListItemProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(Routes.WORKOUT_DETAIL.replace(':id', workout.id));
  };

  const formatDate = (dateString: string) => {
    return formatShortDate(dateString);
  };

  const shouldShowDuration = () => {
    if (!workout.duration || workout.duration <= 0) return false;
    const formatted = formatDuration(workout.duration);
    return formatted && formatted !== '0' && formatted.trim() !== '';
  };

  return (
    <ListItem alignItems="flex-start" divider disableGutters>
      <ListItemButton onClick={handleView} sx={{ px: 0 }}>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
              <span>{workout.name}</span>
              <Chip
                label={formatDate(workout.date)}
                size="small"
                variant="outlined"
                color="primary"
              />
              {shouldShowDuration() && (
                <Chip
                  label={formatDuration(workout.duration)}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
          }
          secondary={
            <>
              {workout.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {workout.description}
                </Typography>
              )}
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
