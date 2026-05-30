import React, { useEffect, useState } from 'react';
import { Container, Box, Tabs, Tab, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import PortalHeader from '../components/common/PortalHeader';
import { useNotification } from '../contexts/NotificationContext';
import AdminAnalytics from './AdminAnalytics';
import MedicineManager from './MedicineManager';
import UserApprovals from './UserApprovals';
import UserList from './UserList';
import AdminProfile from './AdminProfile';

const TAB_ANALYTICS   = 0;
const TAB_MEDICINES   = 1;
const TAB_USERS       = 2;
const TAB_PROFILE     = 3;

const AdminPortal = () => {
  const { showNotification } = useNotification();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(TAB_ANALYTICS);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin' && !user.isSuperAdmin) {
      showNotification('Access denied. Admin privileges required.', { type: 'error' });
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fffbeb', pb: 6 }}>
      <PortalHeader
        title="Admin Console"
        subtitle="System management and analytics"
        role="admin"
        onLogoClick={() => setActiveTab(TAB_ANALYTICS)}
        onProfile={() => setActiveTab(TAB_PROFILE)}
      />

      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            border: '1px solid rgba(245,158,11,0.12)',
            bgcolor: 'white',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          {/* Tab Bar */}
          <Box sx={{ borderBottom: '1px solid #fef3c7', px: { xs: 2, md: 4 }, pt: 0.5 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              TabIndicatorProps={{ sx: { bgcolor: '#f59e0b', height: 3, borderRadius: '3px 3px 0 0' } }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  color: '#64748b',
                  minWidth: 'auto',
                  px: 2.5,
                  py: 2.2,
                  transition: 'color 0.2s',
                  '&.Mui-selected': { color: '#f59e0b' },
                  '&:hover': { color: '#f59e0b' },
                },
              }}
            >
              <Tab label="Analytics" />
              <Tab label="Medicines" />
              <Tab label="Users" />
              <Tab label="Profile" />
            </Tabs>
          </Box>

          {/* Content Area */}
          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {activeTab === TAB_ANALYTICS && <AdminAnalytics />}
            {activeTab === TAB_MEDICINES && <MedicineManager />}
            {activeTab === TAB_USERS && (
              <>
                <UserApprovals />
                <Box sx={{ mt: 3 }}>
                  <UserList />
                </Box>
              </>
            )}
            {activeTab === TAB_PROFILE && <AdminProfile />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminPortal;
