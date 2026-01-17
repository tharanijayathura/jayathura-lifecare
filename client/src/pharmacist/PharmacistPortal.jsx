import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';

const PharmacistPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'pharmacist' && !user.isSuperAdmin))) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Box>Loading...</Box>
      </Container>
    );
  }

  if (!user || (user.role !== 'pharmacist' && !user.isSuperAdmin)) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Access denied. Pharmacist privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Pharmacist Portal"
        subtitle={`Welcome, ${user?.name || 'Pharmacist'}`}
        showBack={false}
      />
      <PharmacistDashboard />
    </Box>
  );
};

export default PharmacistPortal;
