import { Button, Stack, Typography } from '@mui/material'

const HomePage = () => (
  <Stack spacing={2}>
    <Typography variant="h5">Welcome back 👋</Typography>
    <Button variant="contained">Start Workout</Button>
  </Stack>
);

export default HomePage;