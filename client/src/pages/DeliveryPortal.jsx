import React from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PageHeader from '../components/common/PageHeader';
import DeliveryDashboard from '../components/delivery/DeliveryDashboard';

const DeliveryPortal = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: '#F8FBF8', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <PageHeader 
          title="Delivery Portal"
          subtitle={`Welcome back, ${user?.name || 'Delivery Person'}`}
          showBack={false}
        />
        <Box sx={{ mt: 4 }}>
          <DeliveryDashboard />
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryPortal;
