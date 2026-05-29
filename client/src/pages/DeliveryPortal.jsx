import React from 'react';
import { Box, Container, Alert, Typography } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PortalHeader from '../components/common/PortalHeader';
import DeliveryDashboard from '../components/delivery/DeliveryDashboard';

const DeliveryPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'delivery' && !user.isSuperAdmin))) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0fdf4' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user || (user.role !== 'delivery' && !user.isSuperAdmin)) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Access denied. Delivery agent privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh', pb: 8 }}>
      <PortalHeader
        title="Delivery Portal"
        subtitle="Track and manage your deliveries"
        role="delivery"
        onLogoClick={() => window.location.href = '/'}
      />
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 2 }}>
        <DeliveryDashboard />
      </Box>
    </Box>
  );
};

export default DeliveryPortal;
