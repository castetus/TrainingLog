import './App.css';
import { Button, Container, Typography } from '@mui/material';
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { ConfirmProvider } from '@/providers/confirmProvider'

function App() {
  return (
    <>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </>
  );
}

export default App;
