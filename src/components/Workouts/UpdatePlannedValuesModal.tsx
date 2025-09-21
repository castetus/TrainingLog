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
            Great job! You achieved your planned parameters in this workout. Would you like to
            manually increase your training targets for these exercises?
          </Typography>

          <Divider />

          <Typography variant="subtitle1" fontWeight="medium">
            Exercises That Achieved Planned Parameters:
          </Typography>

          {analysis.achievedExercises.map(
            ({ exercise, achievedWeight, achievedTime, achievedReps }) => (
              <Box
                key={exercise.exercise.id}
                sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
              >
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  {exercise.exercise.name}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  {achievedWeight && (
                    <Chip label="Weight achieved" color="success" size="small" variant="outlined" />
                  )}

                  {achievedTime && (
                    <Chip label="Time achieved" color="success" size="small" variant="outlined" />
                  )}

                  {achievedReps && (
                    <Chip label="Reps achieved" color="success" size="small" variant="outlined" />
                  )}
                </Stack>
              </Box>
            ),
          )}

          {analysis.hasExceededExercises && (
            <>
              <Divider />
              <Typography variant="subtitle1" fontWeight="medium">
                Exercises That Exceeded Planned Parameters (will be auto-updated):
              </Typography>

              {analysis.exceededExercises.map(
                ({ exercise, exceededWeight, exceededTime, exceededReps }) => (
                  <Box
                    key={exercise.exercise.id}
                    sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, opacity: 0.1 }}
                  >
                    <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                      {exercise.exercise.name}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      {exceededWeight && (
                        <Chip
                          label="Weight exceeded"
                          color="success"
                          size="small"
                          variant="filled"
                        />
                      )}

                      {exceededTime && (
                        <Chip label="Time exceeded" color="success" size="small" variant="filled" />
                      )}

                      {exceededReps && (
                        <Chip label="Reps exceeded" color="success" size="small" variant="filled" />
                      )}
                    </Stack>
                  </Box>
                ),
              )}
            </>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            This will mark these exercises as achieved and allow you to manually increase the
            planned values in your training plan to continue progressing.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Skip for Now
        </Button>
        <Button onClick={onConfirm} variant="contained" color="success">
          Mark as Achieved
        </Button>
      </DialogActions>
    </Dialog>
  );
}
