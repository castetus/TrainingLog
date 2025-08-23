import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const goHome = () => navigate('/')

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Typography variant="h5">Page not found</Typography>
      <Button variant="contained" onClick={goHome}>Go Home</Button>
    </Stack>
  )
}

export default NotFoundPage;