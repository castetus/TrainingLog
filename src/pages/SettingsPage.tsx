import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import UploadIcon from '@mui/icons-material/Upload';
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton as MuiIconButton,
} from '@mui/material';
import { useState } from 'react';

import { useExercisesController } from '@/controllers/exercisesController';
import { useWorkoutsController } from '@/controllers/workoutsController';
import { useTheme } from '@/providers/themeProvider';
import { formatShortDate } from '@/utils';
import {
  importExercisesFromFile,
  createImportTemplate,
  type ImportResult,
} from '@/utils/exerciseImport';

export default function SettingsPage() {
  const { list: workouts, loadAll, remove } = useWorkoutsController();
  const { create: createExercise, loadAll: loadExercises } = useExercisesController();
  const { mode, toggleMode } = useTheme();
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWorkoutManagement, setShowWorkoutManagement] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);

  // const handleNotificationToggle = () => {
  //   setNotificationsEnabled(!notificationsEnabled);
  // };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportExercises(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleImportExercises = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importExercisesFromFile(file);
      setImportResult(result);

      if (result.success && result.exercises.length > 0) {
        // Save exercises to database
        for (const exercise of result.exercises) {
          await createExercise(exercise);
        }
        await loadExercises(); // Refresh exercises list
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: false,
        importedCount: 0,
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        exercises: [],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = createImportTemplate();
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exercise-template.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
    setImportResult(null);
  };

  const handleOpenClearCache = () => setShowClearCacheDialog(true);
  const handleCancelClearCache = () => setShowClearCacheDialog(false);
  
  const handleConfirmClearCache = async () => {
    setIsClearingCache(true);
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearingCache(false);
      setShowClearCacheDialog(false);
      // Reload the app to get fresh files
      window.location.reload();
    }
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
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete workout"
                            onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={workout.name}
                          secondary={`${formatShortDate(workout.date)} • ${workout.exercises.length} exercises`}
                        />
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
                control={<Switch checked={mode === 'dark'} onChange={toggleMode} color="primary" />}
                label="Dark mode"
              />
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark themes
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        {/* <Card>
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
        </Card> */}

        {/* Data Management */}
        <Card>
          <CardHeader
            avatar={<StorageIcon color="primary" />}
            title="Data Management"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent style={{ padding: 0 }}>
            <List>
              <ListItem
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <ListItemText
                  primary="Import Exercises"
                  secondary="Upload exercise data from JSON file"
                />
                <Stack direction="row" spacing={1} gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadTemplate}
                  >
                    Template
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<UploadIcon />}
                    onClick={() => setShowImportDialog(true)}
                    disabled={isImporting}
                  >
                    Import
                  </Button>
                </Stack>
              </ListItem>
              {/* <Divider />
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="export">
                    <InfoIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary="Export Data"
                  secondary="Download your workout data as JSON"
                />
              </ListItem> */}
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Clear Cache"
                  secondary="Remove temporary cached assets and refresh the app (data is preserved)"
                />
                <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleOpenClearCache}
                    disabled={isClearingCache}
                  >
                    {isClearingCache ? 'Clearing...' : 'Clear cached files'}
                  </Button>
                </Stack>
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
            <strong>Warning:</strong> This action cannot be undone. The workout and all its data
            will be permanently deleted.
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

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onClose={handleCloseImportDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <UploadIcon color="primary" />
            <Typography variant="h6">Import Exercises</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              Upload a JSON file containing exercise data. The file should contain an array of
              exercises with the following structure:
            </Typography>
            <Box
              sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, fontFamily: 'monospace' }}
            >
              <pre>{`[
  {
    "name": "Bench Press",
    "type": "weight",
    "description": "Classic chest exercise"
  },
  {
    "name": "Push-ups",
    "type": "reps_only",
    "description": "Bodyweight chest exercise"
  }
]`}</pre>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
              <Typography variant="body2" color="text.secondary">
                Download a template file to see the correct format
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
                disabled={isImporting}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={isImporting}
                >
                  {isImporting ? 'Importing...' : 'Choose File'}
                </Button>
              </label>
            </Box>

            {importResult && (
              <Box sx={{ mt: 2 }}>
                {importResult.success ? (
                  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body1" color="success.contrastText">
                      ✅ Successfully imported {importResult.importedCount} exercises!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="body1" color="error.contrastText" gutterBottom>
                      ❌ Import failed
                    </Typography>
                    {importResult.errors.map((error, index) => (
                      <Typography key={index} variant="body2" color="error.contrastText">
                        • {error}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog} disabled={isImporting}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cache Confirmation Dialog */}
      <Dialog open={showClearCacheDialog} onClose={handleCancelClearCache} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="warning" />
            <Typography variant="h6">Clear Cached Files</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This will clear all cached files and force the app to download fresh assets.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Note:</strong> Your workout data, exercises, and settings will be preserved. 
            The app will reload automatically after clearing the cache.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearCache} disabled={isClearingCache}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClearCache}
            color="warning"
            variant="contained"
            disabled={isClearingCache}
            startIcon={isClearingCache ? undefined : <WarningIcon />}
          >
            {isClearingCache ? 'Clearing...' : 'Clear Cache'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
