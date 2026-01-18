import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Assignment,
  ShoppingCart,
  Warning,
  LocalShipping,
  Chat,
  Refresh,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';

// Mock data - replace with real API calls later
const mockData = {
  pendingPrescriptions: 12,
  activeOrders: 8,
  lowStockAlerts: 5,
  todaysDeliveries: 15,
  prescriptionsProcessed: 24,
  avgProcessingTime: 8.5,
  ordersCompleted: 18,
  customerRating: 4.7,
  issuesResolved: 3,
  chatResponseTime: 2.3,
  criticalAlerts: [
    { type: 'stock', message: 'Metformin 500mg stock critical (12 units left)', severity: 'error' },
    { type: 'delivery', message: 'Delivery person #3 running late (2 deliveries pending)', severity: 'warning' },
    { type: 'patient', message: 'Patient ID 4567 has allergy alert - check prescriptions', severity: 'error' },
  ],
  pendingPrescriptionsList: [
    { id: 'P2456', patient: 'Kumar', priority: 'High', time: '15 min ago', items: 3 },
    { id: 'P2455', patient: 'Silva', priority: 'Medium', time: '25 min ago', items: 2 },
    { id: 'P2454', patient: 'Fernando', priority: 'Normal', time: '30 min ago', items: 1 },
    { id: 'P2453', patient: 'Rajapakse', priority: 'Normal', time: '45 min ago', items: 4 },
  ],
};

const DashboardOverview = () => {
  const { user } = useAuth();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ✅ SAME palette (green + blue) used across your app
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

  const getPriorityChipSx = (priority) => {
    if (priority === 'High') {
      return { bgcolor: 'rgba(122,168,176,0.20)', color: COLORS.text, border: `1px solid ${COLORS.blue1}` };
    }
    if (priority === 'Medium') {
      return { bgcolor: 'rgba(203,243,187,0.45)', color: COLORS.text, border: `1px solid ${COLORS.green3}` };
    }
    return { bgcolor: 'rgba(236,244,232,0.9)', color: COLORS.subtext, border: `1px solid ${COLORS.border}` };
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Paper
        sx={{
          ...basePaperSx,
          mb: 3,
          background: `linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 55%, rgba(147,191,199,0.18) 100%)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '1.35rem', color: COLORS.text }}>
              Welcome, {user?.name || 'Dr. Perera'} 👋
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
              Shift: 8:00 AM - 4:00 PM • Today: {currentDate}
            </Typography>
          </Box>

          <Button variant="outlined" size="small" startIcon={<Refresh />} sx={outlineBtnSx}>
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Pending Prescriptions"
            value={mockData.pendingPrescriptions}
            icon={Assignment}
            gradient={`linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 60%, rgba(147,191,199,0.18) 100%)`}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <StatCard
            title="Active Orders"
            value={mockData.activeOrders}
            icon={ShoppingCart}
            gradient={`linear-gradient(135deg, ${COLORS.green1} 0%, rgba(147,191,199,0.22) 100%)`}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <StatCard
            title="Low Stock Alerts"
            value={mockData.lowStockAlerts}
            icon={Warning}
            gradient={`linear-gradient(135deg, ${COLORS.green2} 0%, rgba(147,191,199,0.18) 100%)`}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <StatCard
            title="Today's Deliveries"
            value={mockData.todaysDeliveries}
            icon={LocalShipping}
            gradient={`linear-gradient(135deg, rgba(147,191,199,0.28) 0%, ${COLORS.green1} 100%)`}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ ...basePaperSx, mb: 3 }}>
        <Typography sx={{ color: COLORS.text, mb: 1.5 }}>
          Quick Actions
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Button variant="contained" size="small" sx={primaryBtnSx}>
            Process Prescriptions
          </Button>
          <Button variant="outlined" size="small" sx={outlineBtnSx}>
            Check Inventory
          </Button>
          <Button variant="outlined" size="small" sx={outlineBtnSx}>
            Assign Deliveries
          </Button>
          <Button variant="outlined" size="small" startIcon={<Chat />} sx={outlineBtnSx}>
            View Chat Queue
          </Button>
          <Button variant="outlined" size="small" sx={outlineBtnSx}>
            Check Refills
          </Button>
          <Button variant="outlined" size="small" sx={outlineBtnSx}>
            Generate Report
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Pending Prescriptions Queue */}
        <Grid item xs={12} md={6}>
          <Paper sx={basePaperSx}>
            <Typography sx={{ color: COLORS.text }}>
              Pending Prescriptions Queue
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 1 }}>
              Urgent first
            </Typography>
            <Divider sx={{ my: 2, borderColor: COLORS.border }} />

            <Stack spacing={1.25}>
              {mockData.pendingPrescriptionsList.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    background: 'rgba(255,255,255,0.75)',
                    transition: 'transform .2s ease, box-shadow .2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 20px rgba(44,62,80,0.10)',
                      background: 'rgba(236,244,232,0.9)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ color: COLORS.text, fontSize: '0.95rem' }}>
                      #{p.id} • {p.patient}
                    </Typography>

                    <Chip
                      label={p.priority}
                      size="small"
                      sx={{
                        ...getPriorityChipSx(p.priority),
                        borderRadius: 2,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                      {p.items} meds • {p.time}
                    </Typography>

                    <Button size="small" variant="contained" sx={primaryBtnSx}>
                      Process
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button fullWidth sx={{ mt: 2 }} variant="outlined" size="small" style={{ borderRadius: 10 }} color="inherit">
              View All {mockData.pendingPrescriptions} Prescriptions →
            </Button>
          </Paper>
        </Grid>

        {/* Today's Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={basePaperSx}>
            <Typography sx={{ color: COLORS.text }}>
              Today’s Performance
            </Typography>
            <Divider sx={{ my: 2, borderColor: COLORS.border }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                  Prescriptions Processed
                </Typography>
                <Typography sx={{ color: COLORS.text }}>
                  {mockData.prescriptionsProcessed} • Avg: {mockData.avgProcessingTime} min
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                  Orders Completed
                </Typography>
                <Typography sx={{ color: COLORS.text }}>
                  {mockData.ordersCompleted} • Rating: {mockData.customerRating}/5
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                  Issues Resolved
                </Typography>
                <Typography sx={{ color: COLORS.text }}>
                  {mockData.issuesResolved} • Chat response: {mockData.chatResponseTime} min
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Critical Alerts */}
        <Grid item xs={12}>
          <Paper sx={basePaperSx}>
            <Typography sx={{ color: COLORS.text, mb: 1 }}>
              Critical Alerts
            </Typography>
            <Divider sx={{ my: 2, borderColor: COLORS.border }} />

            <Stack spacing={1.25}>
              {mockData.criticalAlerts.map((a, i) => (
                <Alert
                  key={i}
                  severity={a.severity}
                  icon={a.severity === 'error' ? <ErrorIcon /> : <Warning />}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor:
                      a.severity === 'error'
                        ? 'rgba(147,191,199,0.20)'
                        : 'rgba(203,243,187,0.45)',
                    color: COLORS.text,
                    '& .MuiAlert-icon': { color: COLORS.blue2 },
                  }}
                >
                  {a.message}
                </Alert>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
