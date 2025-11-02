// client/src/pages/PharmacistPortal.jsx
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/useAuth';

const PharmacistPortal = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pharmacist Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.name}
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pharmacist Features Coming Soon:
        </Typography>
        <Typography variant="body2">
          • Prescription Verification<br/>
          • Medicine Catalog Management<br/>
          • Order Processing<br/>
          • Patient Management<br/>
          • Inventory Management
        </Typography>
      </Paper>
    </Container>
  );
};

export default PharmacistPortal;