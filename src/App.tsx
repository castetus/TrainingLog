import "./App.css";
import { Button, Container, Typography } from "@mui/material";

import Navbar from "@/components/Navbar";

function App() {
  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          My Training Log
        </Typography>
        <Button variant="contained" color="primary">
          Start Workout
        </Button>
      </Container>

      <Navbar />
    </>
  );
}

export default App;
