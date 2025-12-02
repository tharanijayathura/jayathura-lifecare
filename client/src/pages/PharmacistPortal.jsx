// client/src/pages/PharmacistPortal.jsx
import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const PharmacistPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pharmacist Features:
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Prescription Verification<br/>
          • Medicine Catalog Management<br/>
          • Order Processing<br/>
          • Patient Management<br/>
          • Inventory Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/chat')}
          sx={{ mt: 2 }}
        >
          Open Chat with Patients
        </Button>
      </Paper>
    </Container>
  );
};

export default PharmacistPortal;