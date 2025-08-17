import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import WorkoutsPage from '@/pages/WorkoutsPage';
import TrainingsPage from '@/pages/TrainingsPage';
import ExercisesPage from '@/pages/ExercisesPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'workouts', element: <WorkoutsPage /> },
      { path: 'trainings', element: <TrainingsPage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);