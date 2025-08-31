import BarChartIcon from '@mui/icons-material/BarChart';
import { Box, Typography, Stack, Card, CardContent, Paper } from '@mui/material';

export default function StatisticsPage() {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="body1" color="text.secondary">
          Track your fitness progress and performance metrics
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Stack direction="row" spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BarChartIcon color="primary" />
              <Box>
                <Typography variant="h6">0</Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Workouts
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BarChartIcon color="secondary" />
              <Box>
                <Typography variant="h6">0</Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Trainings
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Placeholder for Charts */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Workout Frequency
        </Typography>
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Chart will be implemented here
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Exercise Performance
        </Typography>
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Performance metrics will be displayed here
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}
