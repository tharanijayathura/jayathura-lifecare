import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PortalHeader from '../components/common/PortalHeader';
import DeliveryDashboard from '../components/delivery/DeliveryDashboard';

const DeliveryPortal = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh', pb: 8 }}>
      <PortalHeader
        title="Delivery Portal"
        subtitle="Track and manage your deliveries"
        role="patient"
        onLogoClick={() => window.location.href = '/'}
      />
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 2 }}>
        <DeliveryDashboard />
      </Box>
    </Box>
  );
};

export default DeliveryPortal;
