import { Box, Typography, Stack, Chip } from '@mui/material';

import { ExerciseType } from '@/types/exercises';
import type { Exercise } from '@/types/exercises';

interface ExerciseViewProps {
  exercise: Exercise;
  showDescription?: boolean;
  showType?: boolean;
  showDetails?: boolean;
}

export default function ExerciseView({
  exercise,
  showDescription = true,
  showType = true,
  showDetails = true,
}: ExerciseViewProps) {
  const getTypeColor = (type: ExerciseType) => {
    switch (type) {
      case ExerciseType.WEIGHT:
        return 'primary';
      case ExerciseType.TIME:
        return 'secondary';
      case ExerciseType.REPS_ONLY:
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: ExerciseType) => {
    switch (type) {
      case ExerciseType.WEIGHT:
        return 'Weight';
      case ExerciseType.TIME:
        return 'Time';
      case ExerciseType.REPS_ONLY:
        return 'Bodyweight';
      default:
        return 'Unknown';
    }
  };



  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="medium">
            {exercise.name}
          </Typography>
          {showType && (
            <Chip
              label={getTypeLabel(exercise.type)}
              color={getTypeColor(exercise.type)}
              size="small"
            />
          )}
        </Stack>

        {/* Description */}
        {showDescription && exercise.description && (
          <Typography variant="body2" color="text.secondary">
            {exercise.description}
          </Typography>
        )}

        {/* Video Link */}
        {showDetails && exercise.videoUrl && (
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight="medium">
              Video Tutorial:
            </Typography>
            <Box>
              <a 
                href={exercise.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'none'
                    }
                  }}
                >
                  Watch exercise demonstration
                </Typography>
              </a>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
