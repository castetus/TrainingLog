import { Outlet, useLocation } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'

const MainLayout = () => {
  const { pathname } = useLocation();
  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return (
    <Box sx={{ pb: 8 }}>
        <Typography variant="h4" gutterBottom>
          {pageTitle}
        </Typography>
      <Container sx={{ py: 2 }}>
        <Outlet />
      </Container>

      <Navbar />
    </Box>
  )
}

export default MainLayout