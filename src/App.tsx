import './App.css';
import { Button, Container, Typography } from '@mui/material';
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'

function App() {
  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          My Training Log
        </Typography>
      </Container>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
