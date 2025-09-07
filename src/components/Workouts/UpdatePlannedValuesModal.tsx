import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Chip,
  Divider,
} from '@mui/material';

import type { PerformanceAnalysis } from '@/utils/workoutAnalysis';

interface UpdatePlannedValuesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  analysis: PerformanceAnalysis;
}

export default function UpdatePlannedValuesModal({
  open,
  onClose,
  onConfirm,
  analysis,
}: UpdatePlannedValuesModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUpIcon color="success" />
          <Typography variant="h6">Update Training Plan?</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            Great job! You exceeded your planned values in this workout. Would you like to update
            your training plan with these improved targets?
          </Typography>

          <Divider />

          <Typography variant="subtitle1" fontWeight="medium">
            Exercises Ready for Increase:
          </Typography>

          {analysis.exercisesToUpdate.map(
            ({ exercise, shouldIncreaseWeight, shouldIncreaseTime, shouldIncreaseReps }) => (
              <Box
                key={exercise.exercise.id}
                sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
              >
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  {exercise.exercise.name}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  {shouldIncreaseWeight && (
                    <Chip
                      label="Weight increase needed"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}

                  {shouldIncreaseTime && (
                    <Chip
                      label="Time increase needed"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}

                  {shouldIncreaseReps && (
                    <Chip
                      label="Reps increase needed"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            ),
          )}

          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            This will update the planned values in your training plan with your actual performance
            to help you continue progressing.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Keep Current Plan
        </Button>
        <Button onClick={onConfirm} variant="contained" color="success">
          Update Training Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
