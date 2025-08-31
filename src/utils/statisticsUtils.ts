import type { Workout } from '@/types/workouts';
import type { DateRange } from '@/components/Statistics/DateRangeSelector';

export interface WorkoutFrequencyData {
  date: string;
  count: number;
}

export interface ExerciseProgressData {
  date: string;
  weight?: number;
  reps?: number;
  duration?: number;
}

export interface LiftedWeightData {
  date: string;
  totalWeight: number;
}

export interface ExerciseCountData {
  date: string;
  exerciseCount: number;
}

export const filterWorkoutsByDateRange = (workouts: Workout[], dateRange: DateRange): Workout[] => {
  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= dateRange.start && workoutDate <= dateRange.end;
  });
};

export const generateWorkoutFrequencyData = (workouts: Workout[], dateRange: DateRange): WorkoutFrequencyData[] => {
  const filteredWorkouts = filterWorkoutsByDateRange(workouts, dateRange);
  
  // Create a map to count workouts per day
  const workoutCounts = new Map<string, number>();
  
  filteredWorkouts.forEach((workout) => {
    const date = new Date(workout.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    workoutCounts.set(dayName, (workoutCounts.get(dayName) || 0) + 1);
  });

  // Create data for all days of the week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return daysOfWeek.map((day) => ({
    date: day,
    count: workoutCounts.get(day) || 0,
  }));
};

export const generateExerciseProgressData = (
  workouts: Workout[],
  dateRange: DateRange,
  exerciseName: string,
  metric: 'weight' | 'reps' | 'duration' = 'weight'
): ExerciseProgressData[] => {
  const filteredWorkouts = filterWorkoutsByDateRange(workouts, dateRange);
  
  // Find the specific exercise in all workouts
  const exerciseData: ExerciseProgressData[] = [];
  
  filteredWorkouts.forEach((workout) => {
    const exercise = workout.exercises.find((ex) => ex.exercise.name === exerciseName);
    if (!exercise || !exercise.actualSets || exercise.actualSets.length === 0) {
      return;
    }

    // Get the last set (most recent performance)
    const lastSet = exercise.actualSets[exercise.actualSets.length - 1];
    if (!lastSet) {
      return;
    }

    const date = new Date(workout.date);
    const weekLabel = `Week ${Math.ceil((date.getTime() - dateRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

    const dataPoint: ExerciseProgressData = {
      date: weekLabel,
    };

    switch (metric) {
      case 'weight':
        if (lastSet.actualWeight) {
          dataPoint.weight = lastSet.actualWeight;
        }
        break;
      case 'reps':
        if (lastSet.actualReps) {
          dataPoint.reps = lastSet.actualReps;
        }
        break;
      case 'duration':
        if (lastSet.actualDuration) {
          dataPoint.duration = lastSet.actualDuration;
        }
        break;
    }

    if (dataPoint.weight || dataPoint.reps || dataPoint.duration) {
      exerciseData.push(dataPoint);
    }
  });

  return exerciseData;
};

export const generateLiftedWeightData = (workouts: Workout[], dateRange: DateRange): LiftedWeightData[] => {
  const filteredWorkouts = filterWorkoutsByDateRange(workouts, dateRange);
  
  // Group workouts by week
  const weeklyData = new Map<string, number>();
  
  filteredWorkouts.forEach((workout) => {
    const date = new Date(workout.date);
    const weekLabel = `Week ${Math.ceil((date.getTime() - dateRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
    
    let totalWeight = 0;
    
    workout.exercises.forEach((exercise) => {
      if (!exercise.actualSets || exercise.actualSets.length === 0) return;
      
      exercise.actualSets.forEach((set) => {
        if (set.actualWeight && set.actualReps) {
          totalWeight += set.actualWeight * set.actualReps;
        }
      });
    });
    
    weeklyData.set(weekLabel, (weeklyData.get(weekLabel) || 0) + totalWeight);
  });
  
  return Array.from(weeklyData.entries()).map(([date, totalWeight]) => ({
    date,
    totalWeight: Math.round(totalWeight),
  }));
};

export const generateExerciseCountData = (workouts: Workout[], dateRange: DateRange): ExerciseCountData[] => {
  const filteredWorkouts = filterWorkoutsByDateRange(workouts, dateRange);
  
  // Group workouts by week
  const weeklyData = new Map<string, number>();
  
  filteredWorkouts.forEach((workout) => {
    const date = new Date(workout.date);
    const weekLabel = `Week ${Math.ceil((date.getTime() - dateRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
    
    const exerciseCount = workout.exercises.length;
    weeklyData.set(weekLabel, (weeklyData.get(weekLabel) || 0) + exerciseCount);
  });
  
  return Array.from(weeklyData.entries()).map(([date, exerciseCount]) => ({
    date,
    exerciseCount,
  }));
};

export const getDateRangeForPreset = (preset: string): DateRange => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'current-week': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return { start: startOfWeek, end: today };
    }
    case 'last-week': {
      const endOfLastWeek = new Date(today);
      endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
      const startOfLastWeek = new Date(endOfLastWeek);
      startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
      return { start: startOfLastWeek, end: endOfLastWeek };
    }
    case 'last-month': {
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start: startOfLastMonth, end: endOfLastMonth };
    }
    case 'last-year': {
      const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
      return { start: startOfLastYear, end: endOfLastYear };
    }
    case 'all-time': {
      const startOfTime = new Date(2020, 0, 1);
      return { start: startOfTime, end: today };
    }
    default:
      return { start: today, end: today };
  }
};
