import React, { useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Box } from '@mui/material';
import PortalHeader from '../components/common/PortalHeader';
import PharmacistDashboard from '../components/pharmacist/PharmacistDashboard';

const PharmacistPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  // dashboardRef exposes a setActiveTab function from PharmacistDashboard
  const dashboardRef = useRef(null);

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

  const handleProfileClick = () => {
    if (dashboardRef.current?.goToProfile) {
      dashboardRef.current.goToProfile();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f0ff', pb: 6 }}>
      <PortalHeader
        title="Pharmacist Console"
        subtitle="Medical fulfillment and order verification"
        role="pharmacist"
        onLogoClick={() => dashboardRef.current?.goToTab?.(0)}
        onProfile={handleProfileClick}
      />
      <PharmacistDashboard ref={dashboardRef} />
    </Box>
  );
};

export default PharmacistPortal;
