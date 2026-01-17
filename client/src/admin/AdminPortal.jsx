import React, { useEffect, useState } from 'react';
import { Container, Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import PageHeader from '../components/common/PageHeader';
import AdminAnalytics from './AdminAnalytics';
import MedicineManager from './MedicineManager';
import GroceryManager from './GroceryManager';
import UserApprovals from './UserApprovals';

const AdminPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mainTabIndex, setMainTabIndex] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin' && !user.isSuperAdmin) { alert('Access denied. Admin privileges required.'); navigate('/'); }
  }, [user, authLoading, navigate]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader title="Admin Portal" subtitle="Manage analytics, medicines, groceries, and user approvals" />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={mainTabIndex} onChange={(e, v) => setMainTabIndex(v)} variant={isMobile ? 'scrollable' : 'standard'} scrollButtons={isMobile ? 'auto' : false}>
          <Tab label="Analytics" />
          <Tab label="Medicines" />
          <Tab label="Groceries" />
          <Tab label="Users" />
        </Tabs>
      </Box>

      {mainTabIndex === 0 && <AdminAnalytics />}
      {mainTabIndex === 1 && <MedicineManager />}
      {mainTabIndex === 2 && <GroceryManager />}
      {mainTabIndex === 3 && <UserApprovals />}
    </Container>
  );
};

export default AdminPortal;
