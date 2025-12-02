// client/src/pages/PharmacistPortal.jsx
import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const PharmacistPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Pharmacist Dashboard"
        subtitle={`Welcome, ${user?.name || 'Pharmacist'}`}
        showBack={false}
      />
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