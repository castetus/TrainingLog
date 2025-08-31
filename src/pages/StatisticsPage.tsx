import BarChartIcon from '@mui/icons-material/BarChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Typography, Stack, Card, CardContent, Paper, IconButton, Collapse } from '@mui/material';
import { useState, useEffect } from 'react';

import {
  UniversalChart,
  DateRangeSelector,
  type DateRange,
  type DateRangePreset,
} from '@/components/Statistics';
import { useWorkoutsController } from '@/controllers/workoutsController';
import {
  generateWorkoutFrequencyData,
  generateExerciseProgressData,
  generateLiftedWeightData,
  generateExerciseCountData,
  getDateRangeForPreset,
} from '@/utils/statisticsUtils';

export default function StatisticsPage() {
  const { workoutsById, loadAll } = useWorkoutsController();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePreset>('all-time');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load workouts on component mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Get current date range
  const currentDateRange = customDateRange || getDateRangeForPreset(selectedDateRange);

  // Generate real data from workouts
  const workouts = Object.values(workoutsById);
  const workoutFrequencyData = generateWorkoutFrequencyData(workouts, currentDateRange);
  const exerciseProgressData = generateExerciseProgressData(
    workouts,
    currentDateRange,
    'Bench Press',
    'weight',
  );
  const liftedWeightData = generateLiftedWeightData(workouts, currentDateRange);
  const exerciseCountData = generateExerciseCountData(workouts, currentDateRange);

  // Calculate quick stats
  const totalWorkouts = workouts.length;
  const totalLiftedWeight = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((workoutTotal, exercise) => {
      if (!exercise.actualSets || exercise.actualSets.length === 0) return workoutTotal;
      return workoutTotal + exercise.actualSets.reduce((setTotal, set) => {
        if (set.actualWeight && set.actualReps) {
          return setTotal + (set.actualWeight * set.actualReps);
        }
        return setTotal;
      }, 0);
    }, 0);
  }, 0);

  const handleDateRangeChange = (preset: DateRangePreset, range?: DateRange) => {
    setSelectedDateRange(preset);
    if (preset === 'custom' && range) {
      setCustomDateRange(range);
    } else {
      setCustomDateRange(undefined);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <Stack spacing={3}>
      {/* Header with Filter Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Track your fitness progress and performance metrics
        </Typography>
        <IconButton onClick={toggleDatePicker} color="primary" size="small">
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Collapsible Date Range Selector */}
      <Collapse in={showDatePicker}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <DateRangeSelector
            value={selectedDateRange}
            onChange={handleDateRangeChange}
            customRange={customDateRange}
          />
        </Paper>
      </Collapse>

      {/* Quick Stats Cards */}
      <Stack direction="row" spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BarChartIcon color="primary" />
              <Box>
                <Typography variant="h6">{totalWorkouts}</Typography>
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
                  <Typography variant="h6">{Math.round(totalLiftedWeight)} kg</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Lifted Weight
                  </Typography>
                </Box>
              </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Workout Frequency Chart */}
      <Paper sx={{ p: 3 }}>
        <UniversalChart 
          data={workoutFrequencyData} 
          title="Workout Frequency" 
          type="bar"
          dataKeys={['count']}
          colors={['#8884d8']}
        />
      </Paper>

      {/* Exercise Progress Chart */}
      <Paper sx={{ p: 3 }}>
        <UniversalChart
          data={exerciseProgressData}
          title="Bench Press Progress"
          type="line"
          dataKeys={['weight']}
          colors={['#82ca9d']}
        />
      </Paper>

      {/* Lifted Weight Chart */}
      <Paper sx={{ p: 3 }}>
        <UniversalChart
          data={liftedWeightData}
          title="Total Weight Lifted"
          type="line"
          dataKeys={['totalWeight']}
          colors={['#ff7300']}
        />
      </Paper>

      {/* Exercise Count Chart */}
      <Paper sx={{ p: 3 }}>
        <UniversalChart
          data={exerciseCountData}
          title="Exercises per Workout"
          type="bar"
          dataKeys={['exerciseCount']}
          colors={['#ffc658']}
        />
      </Paper>
    </Stack>
  );
}
