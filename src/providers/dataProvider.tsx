import { useEffect, useState } from 'react';

import { db } from '@/db';
import { useAppStore } from '@/store';

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setExercises,
    setTrainings,
    setWorkouts,
  } = useAppStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing data from database...');
        
        // Load all data in parallel
        const [exercises, trainings, workouts] = await Promise.all([
          db.exercises.list(),
          db.trainings.list(),
          db.workouts.list(),
        ]);

        console.log(`Loaded ${exercises.length} exercises, ${trainings.length} trainings, ${workouts.length} workouts`);

        // Update store with loaded data
        setExercises(exercises);
        setTrainings(trainings);
        setWorkouts(workouts);

        setIsInitialized(true);
        console.log('Data initialization completed');
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsInitialized(true); // Still set as initialized to prevent infinite loading
      }
    };

    initializeData();
  }, [setExercises, setTrainings, setWorkouts]);

  if (error) {
    console.error('Data initialization error:', error);
    // Continue with empty store rather than crashing the app
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading application data...
      </div>
    );
  }

  return <>{children}</>;
}
