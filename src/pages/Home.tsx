import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to StayHub
        </Typography>
        <Typography variant="body1" paragraph>
          Find your perfect stay with StayHub - your trusted platform for hotel bookings.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
