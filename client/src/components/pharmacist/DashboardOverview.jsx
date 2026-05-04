import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Description,
  ShoppingCart,
  Warning,
  LocalShipping,
  Assessment,
  NotificationsActive,
  Refresh,
  Assignment,
  Chat,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { pharmacistAPI } from '../../services/api';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#2C3E50',
    subtext: '#546E7A',
    border: 'rgba(147, 191, 199, 0.35)',
    paper: 'rgba(255,255,255,0.9)',
  };

  const basePaperSx = {
    p: 2.25,
    borderRadius: 3,
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.paper,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 12px 28px rgba(44,62,80,0.10)',
  };

  const primaryBtnSx = {
    backgroundColor: COLORS.green3,
    color: COLORS.text,
    textTransform: 'none',
    borderRadius: 2,
    '&:hover': { backgroundColor: COLORS.green2 },
  };

  const outlineBtnSx = {
    borderColor: COLORS.blue1,
    color: COLORS.text,
    textTransform: 'none',
    borderRadius: 2,
    '&:hover': { borderColor: COLORS.blue2, backgroundColor: 'rgba(236,244,232,0.7)' },
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        background: gradient,
        boxShadow: '0 14px 30px rgba(44,62,80,0.10)',
        transition: 'transform .25s ease, box-shadow .25s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 42px rgba(44,62,80,0.14)' },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: '1.9rem', color: COLORS.text, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 44, color: COLORS.blue2, opacity: 0.55 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && !stats) return (
    <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Paper
        sx={{
          ...basePaperSx,
          mb: 3,
          background: `linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 55%, rgba(147,191,199,0.18) 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.35rem', color: COLORS.text }}>
              Welcome back, {user?.name || 'Pharmacist'} 👋
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
              Today: {currentDate}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={fetchStats} sx={outlineBtnSx}>
            Refresh
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Pending Rx"
            value={stats?.pendingPrescriptions || 0}
            icon={Assignment}
            gradient={`linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 60%, rgba(147,191,199,0.18) 100%)`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Active Orders"
            value={stats?.activeOrders || 0}
            icon={ShoppingCart}
            gradient={`linear-gradient(135deg, ${COLORS.green1} 0%, rgba(147,191,199,0.22) 100%)`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Low Stock"
            value={stats?.lowStockAlerts || 0}
            icon={Warning}
            gradient={`linear-gradient(135deg, ${COLORS.green2} 0%, rgba(147,191,199,0.18) 100%)`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Today's Deliveries"
            value={stats?.todaysDeliveries || 0}
            icon={LocalShipping}
            gradient={`linear-gradient(135deg, rgba(147,191,199,0.28) 0%, ${COLORS.green1} 100%)`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={basePaperSx}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ color: COLORS.text, fontWeight: 600 }}>
                Recent Pending Prescriptions
              </Typography>
              <Button size="small" onClick={() => onNavigate?.(1)} sx={outlineBtnSx}>View All</Button>
            </Stack>
            <Divider sx={{ mb: 2, borderColor: COLORS.border }} />

            <Stack spacing={1.25}>
              {stats?.recentPrescriptionsList?.length > 0 ? (
                stats.recentPrescriptionsList.map((rx) => (
                  <Box
                    key={rx.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${COLORS.border}`,
                      background: 'rgba(255,255,255,0.75)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: COLORS.text, fontSize: '0.95rem', fontWeight: 600 }}>
                        {rx.patient}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rx.time).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Button size="small" variant="contained" sx={primaryBtnSx} onClick={() => onNavigate?.(1)}>
                      Process
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No pending prescriptions</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ ...basePaperSx, bgcolor: COLORS.blue1, color: 'white' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <NotificationsActive />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>System Status</Typography>
            </Stack>
            <Stack spacing={2}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2">Inventory Audit</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Last checked: 2 hours ago</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2">Delivery Team</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>All riders currently active.</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
