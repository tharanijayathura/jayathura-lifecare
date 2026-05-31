import React, { useState } from 'react';
import { Box, Container, Alert, Typography } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import PortalHeader from '../components/common/PortalHeader';
import DeliveryDashboard from '../components/delivery/DeliveryDashboard';
import DeliveryProfile from '../components/delivery/DeliveryProfile';

const DeliveryPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');

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
        subtitle={view === 'dashboard' ? 'Track and manage your deliveries' : 'Manage your profile and credentials'}
        role="delivery"
        onLogoClick={() => setView('dashboard')}
        onProfile={() => setView('profile')}
      />
      <Box sx={{ px: { xs: 2, md: 4 }, mt: 2 }}>
        {view === 'dashboard' ? <DeliveryDashboard /> : <DeliveryProfile />}
      </Box>
    </Box>
  );
};

export default DeliveryPortal;
