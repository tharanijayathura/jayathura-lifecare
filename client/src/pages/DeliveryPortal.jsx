import React from 'react';
import { Container } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PageHeader from '../components/common/PageHeader';

const DeliveryPortal = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Delivery Portal"
        subtitle={`Welcome, ${user?.name || 'Delivery Person'}`}
        showBack={false}
      />
      {/* Add delivery portal content here */}
    </Container>
  );
};

export default DeliveryPortal;
