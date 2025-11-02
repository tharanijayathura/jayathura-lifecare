// client/src/pages/PatientPortal.jsx
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/useAuth';

const PatientPortal = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Patient Dashboard - Under Development
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Patient Features Coming Soon:
        </Typography>
        <Typography variant="body2">
          • Prescription Upload<br/>
          • Medicine Catalog<br/>
          • Order Management<br/>
          • Delivery Tracking<br/>
          • Chat with Pharmacist
        </Typography>
      </Paper>
    </Container>
  );
};

export default PatientPortal;