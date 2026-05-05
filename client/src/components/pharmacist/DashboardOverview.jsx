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
  NotificationsActive,
  Refresh,
  Assignment,
  ShoppingCart,
  Warning,
  LocalShipping,
  CheckCircle,
  BarChart as DailyReportIcon,
  Error as ErrorIcon,
  Person
} from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
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
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
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

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 5,
        bgcolor: 'white',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `slideUp 0.6s ease-out ${delay}s both`,
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
          borderColor: color,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 4, 
          bgcolor: `${color}15`, 
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon />
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: COLORS.text, mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2, height: 4, borderRadius: 2, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: '70%', bgcolor: color, borderRadius: 2 }} />
      </Box>
    </Paper>
  );

  if (loading && !stats) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1, letterSpacing: '-0.5px' }}>
            Welcome, {user?.name?.split(' ')[0] || 'Pharmacist'} ✨
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActive sx={{ fontSize: 18, color: COLORS.blue2 }} />
            Today is {currentDate}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Refresh />} 
          onClick={fetchStats}
          sx={{ 
            borderRadius: 4, 
            px: 3, 
            py: 1.2, 
            bgcolor: COLORS.blue2, 
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(122, 168, 176, 0.25)',
            '&:hover': { bgcolor: COLORS.blue1 }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Rx" value={stats?.pendingPrescriptions || 0} icon={Assignment} color="#7AA8B0" delay={0.1} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Orders" value={stats?.activeOrders || 0} icon={ShoppingCart} color="#ABE7B2" delay={0.2} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Low Stock" value={stats?.lowStockAlerts || 0} icon={Warning} color="#f43f5e" delay={0.3} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Deliveries" value={stats?.todaysDeliveries || 0} icon={LocalShipping} color="#93BFC7" delay={0.4} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>
                Recent Prescriptions
              </Typography>
              <Chip label="Live Feed" size="small" sx={{ bgcolor: COLORS.green1, color: COLORS.blue2, fontWeight: 700 }} />
            </Stack>

            <Stack spacing={2}>
              {stats?.recentPrescriptionsList?.length > 0 ? (
                stats.recentPrescriptionsList.map((rx, idx) => (
                  <Box
                    key={rx.id}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      border: '1px solid #f1f5f9',
                      bgcolor: '#f8fafc',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        borderColor: COLORS.blue1,
                        transform: 'scale(1.01)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'white', color: COLORS.blue2 }}>
                        <Person />
                      </Box>
                      <Box>
                        <Typography sx={{ color: COLORS.text, fontWeight: 700 }}>
                          {rx.patient}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                          {new Date(rx.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • New Upload
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => onNavigate?.(1)}
                      sx={{ 
                        borderRadius: 3, 
                        fontWeight: 700, 
                        color: COLORS.blue2, 
                        borderColor: COLORS.blue2,
                        '&:hover': { bgcolor: COLORS.green1, borderColor: COLORS.blue2 }
                      }}
                    >
                      Process
                    </Button>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Assignment sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                  <Typography color="text.secondary">All prescriptions processed!</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Actions / System Health */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: COLORS.blue2, color: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>System Health</Typography>
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>INVENTORY STATUS</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>94%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>DELIVERY PERFORMANCE</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>88%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={88} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
                </Box>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 14 }} /> All pharmacy systems operational
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, mb: 3 }}>Quick Links</Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Generate Daily Report', icon: <DailyReportIcon /> },
                  { label: 'Manage Delivery Staff', icon: <LocalShipping /> },
                  { label: 'Broadcast Inventory Alert', icon: <Warning /> }
                ].map((action, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      p: 2, 
                      borderRadius: 4, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: COLORS.green1, color: COLORS.blue2 }
                    }}
                  >
                    <Box sx={{ color: 'inherit' }}>{action.icon}</Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{action.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
