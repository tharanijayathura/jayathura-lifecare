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
  CheckCircle,
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

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" color={color} fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 48, color: `${color}.main`, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Welcome, {user?.name || 'Dr. Perera'}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shift: 8:00 AM - 4:00 PM | Today: {currentDate}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Refresh />}>
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="PENDING PRESCRIPTIONS"
            value={mockData.pendingPrescriptions}
            icon={Assignment}
            color="error"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="ACTIVE ORDERS"
            value={mockData.activeOrders}
            icon={ShoppingCart}
            color="primary"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="LOW STOCK ALERTS"
            value={mockData.lowStockAlerts}
            icon={Warning}
            color="warning"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="TODAY'S DELIVERIES"
            value={mockData.todaysDeliveries}
            icon={LocalShipping}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          QUICK ACTIONS
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Button variant="contained" size="small">
            Process Prescriptions
          </Button>
          <Button variant="outlined" size="small">
            Check Inventory
          </Button>
          <Button variant="outlined" size="small">
            Assign Deliveries
          </Button>
          <Button variant="outlined" size="small" startIcon={<Chat />}>
            View Chat Queue
          </Button>
          <Button variant="outlined" size="small">
            Check Refills
          </Button>
          <Button variant="outlined" size="small">
            Generate Report
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Pending Prescriptions Queue */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              PENDING PRESCRIPTIONS QUEUE (Urgent First)
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {mockData.pendingPrescriptionsList.map((prescription) => (
                <Box
                  key={prescription.id}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      #{prescription.id} - {prescription.patient}
                    </Typography>
                    <Chip
                      label={prescription.priority}
                      size="small"
                      color={getPriorityColor(prescription.priority)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {prescription.items} meds • {prescription.time}
                    </Typography>
                    <Button size="small" variant="contained">
                      Process
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Button fullWidth sx={{ mt: 2 }} variant="outlined">
              View All {mockData.pendingPrescriptions} Prescriptions →
            </Button>
          </Paper>
        </Grid>

        {/* Today's Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              TODAY'S PERFORMANCE
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Prescriptions Processed
                </Typography>
                <Typography variant="h6">
                  {mockData.prescriptionsProcessed} | Avg Time: {mockData.avgProcessingTime} min
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Orders Completed
                </Typography>
                <Typography variant="h6">
                  {mockData.ordersCompleted} | Customer Rating: {mockData.customerRating}/5
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Issues Resolved
                </Typography>
                <Typography variant="h6">
                  {mockData.issuesResolved} | Chat Response Time: {mockData.chatResponseTime} min
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Critical Alerts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              CRITICAL ALERTS
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {mockData.criticalAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  severity={alert.severity}
                  icon={alert.severity === 'error' ? <ErrorIcon /> : <Warning />}
                >
                  {alert.message}
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

