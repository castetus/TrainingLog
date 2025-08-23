import { createBrowserRouter } from 'react-router-dom';

import ExerciseForm from '@/components/Exercises/ExerciseForm';
import TrainingForm from '@/components/Trainings/TrainingForm';
import MainLayout from '@/layouts/MainLayout';
import ExercisesPage from '@/pages/ExercisesPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import TrainingsPage from '@/pages/TrainingsPage';
import WorkoutsPage from '@/pages/WorkoutsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'workouts', element: <WorkoutsPage /> },
      {
        path: 'trainings',
        element: <TrainingsPage />,
        children: [
          { path: 'new', element: <TrainingForm /> },
          { path: ':id/edit', element: <TrainingForm /> },
        ],
      },
      {
        path: 'exercises',
        element: <ExercisesPage />,
        children: [
          { path: 'new', element: <ExerciseForm /> },
          { path: ':id/edit', element: <ExerciseForm /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
