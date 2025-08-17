import { Outlet, useLocation } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Navbar from '@/components/Navbar'

const MainLayout = () => {
  return (
    <Box sx={{ pb: 8 }}>

      <Container sx={{ py: 2 }}>
        <Outlet />
      </Container>

      <Navbar />
    </Box>
  )
}

export default MainLayout