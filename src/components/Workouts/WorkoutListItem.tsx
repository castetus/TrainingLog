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

  return (
    <ListItem alignItems="flex-start" divider>
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
              {workout.duration && (
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
              <Typography variant="body2" color="text.secondary">
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
              </Typography>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}
