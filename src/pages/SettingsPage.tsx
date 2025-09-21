import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton as MuiIconButton,
} from '@mui/material';
import { useState } from 'react';

import { useWorkoutsController } from '@/controllers/workoutsController';
import { formatShortDate } from '@/utils';

export default function SettingsPage() {
  const { list: workouts, loadAll, remove } = useWorkoutsController();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWorkoutManagement, setShowWorkoutManagement] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAutoSaveToggle = () => {
    setAutoSave(!autoSave);
  };

  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    setWorkoutToDelete({ id: workoutId, name: workoutName });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!workoutToDelete) return;
    
    setIsDeleting(true);
    try {
      await remove(workoutToDelete.id);
      await loadAll();
      setShowDeleteDialog(false);
      setWorkoutToDelete(null);
    } catch (error) {
      console.error('Failed to delete workout:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setWorkoutToDelete(null);
  };

  const toggleWorkoutManagement = () => {
    setShowWorkoutManagement(!showWorkoutManagement);
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="body1" color="text.secondary">
            Customize your training log experience
          </Typography>
        </Box>

        {/* Workout Management - Collapsible */}
        <Card>
          <CardHeader
            avatar={<DeleteIcon color="primary" />}
            title="Workout Management"
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <MuiIconButton
                onClick={toggleWorkoutManagement}
                aria-label="expand workout management"
                sx={{
                  transform: showWorkoutManagement ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                <ExpandMoreIcon />
              </MuiIconButton>
            }
          />
          <Collapse in={showWorkoutManagement} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your workout records. You can delete individual workouts that you no longer
                need.
              </Typography>
              {workouts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No workouts found. Start tracking your workouts to see them here.
                </Typography>
              ) : (
                <List>
                  {workouts.map((workout, index) => (
                    <div key={workout.id}>
                      <ListItem>
                        <ListItemText
                          primary={workout.name}
                          secondary={`${formatShortDate(workout.date)} • ${workout.exercises.length} exercises`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete workout"
                            onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < workouts.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </CardContent>
          </Collapse>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader
            avatar={<SettingsIcon color="primary" />}
            title="General Settings"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch checked={autoSave} onChange={handleAutoSaveToggle} color="primary" />
                }
                label="Auto-save workout progress"
              />
              <Typography variant="body2" color="text.secondary">
                Automatically save your workout progress as you complete exercises
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader
            avatar={<PaletteIcon color="primary" />}
            title="Appearance"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch checked={darkMode} onChange={handleDarkModeToggle} color="primary" />
                }
                label="Dark mode"
              />
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark themes
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader
            avatar={<NotificationsIcon color="primary" />}
            title="Notifications"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={handleNotificationToggle}
                    color="primary"
                  />
                }
                label="Enable notifications"
              />
              <Typography variant="body2" color="text.secondary">
                Get reminders for scheduled workouts and achievements
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader
            avatar={<StorageIcon color="primary" />}
            title="Data Management"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="Export Data"
                  secondary="Download your workout data as JSON"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="export">
                    <InfoIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Clear Cache"
                  secondary="Remove temporary data and refresh the app"
                />
                <ListItemSecondaryAction>
                  <Chip label="Safe" color="success" size="small" />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader
            avatar={<InfoIcon color="primary" />}
            title="About"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Training Log</strong> v1.0.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your fitness progress and workouts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Built with React, TypeScript, and Material-UI
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={handleCancelDelete} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="error" />
            <Typography variant="h6">Delete Workout</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete "{workoutToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            <strong>Warning:</strong> This action cannot be undone. The workout and all its data will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? undefined : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete Workout'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
