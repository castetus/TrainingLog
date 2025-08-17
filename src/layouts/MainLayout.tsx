import { Outlet, useLocation } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'

const titles: Record<string, string> = {
  '/': 'Home',
  '/workouts': 'Workouts',
  '/trainings': 'Trainings',
  '/exercises': 'Exercises',
}

const MainLayout = () => {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Training Log'

  return (
    <Box sx={{ pb: 8 }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap>{title}</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 2 }}>
        <Outlet />
      </Container>

      <Navbar />
    </Box>
  )
}

export default MainLayout