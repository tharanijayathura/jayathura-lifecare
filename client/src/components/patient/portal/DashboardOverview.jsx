import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, IconButton, Divider, Alert } from '@mui/material';
import { Upload, ShoppingCart as ShoppingCartIcon, History, SupportAgent, ArrowForward, Info, LocalPharmacy, MedicalServices, DeliveryDining, Payment, CheckCircle, TrackChanges } from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const quickActions = [
    { icon: <Upload sx={{ fontSize: 40 }} />, title: 'Upload Prescription', description: "Upload your doctor's prescription for verification", color: '#4CAF50', tabIndex: 1 },
    { icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />, title: 'Shop Medicines', description: 'Browse and order non prescription medicines and health products', color: '#2196F3', tabIndex: 2 },
    { icon: <History sx={{ fontSize: 40 }} />, title: 'Order History', description: 'View your past orders and track deliveries', color: '#FF9800', tabIndex: 3 },
    { icon: <SupportAgent sx={{ fontSize: 40 }} />, title: 'Chat Support', description: 'Get help from our pharmacists anytime', color: '#9C27B0', tabIndex: null, action: () => window.location.href = '/chat' },
  ];

  const howToSteps = [
    { step: 1, title: 'Upload Your Prescription', description: 'Take a clear photo of your prescription and upload it. Our pharmacists will verify it within minutes.', icon: <Upload color="primary" /> },
    { step: 2, title: 'Browse & Add to Cart', description: 'Explore our medicine catalog. Add non prescription medicines, vitamins, and health products to your cart.', icon: <MedicalServices color="primary" /> },
    { step: 3, title: 'Review & Confirm', description: 'Review your order, attach prescription if needed, and confirm. You can pay online or choose cash on delivery.', icon: <CheckCircle color="primary" /> },
    { step: 4, title: 'Track Delivery', description: 'Monitor your order status in real-time. Get notified when your medicines are out for delivery.', icon: <TrackChanges color="primary" /> },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Alert severity="info">Loading dashboard...</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Welcome, {user?.name || 'Patient'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your one-stop solution for all your healthcare needs. Get started by following the steps below.
        </Typography>
      </Box>

      {profile && profile.stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Total Orders', value: profile.stats.totalOrders || 0, icon: <History sx={{ fontSize: 48, opacity: 0.3 }} />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { label: 'Pending Orders', value: profile.stats.pendingOrders || 0, icon: <DeliveryDining sx={{ fontSize: 48, opacity: 0.3 }} />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { label: 'Prescriptions', value: profile.stats.totalPrescriptions || 0, icon: <LocalPharmacy sx={{ fontSize: 48, opacity: 0.3 }} />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { label: 'Active Refills', value: profile.stats.activeRefillPlans || 0, icon: <MedicalServices sx={{ fontSize: 48, opacity: 0.3 }} />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ background: card.gradient, color: 'white' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{card.label}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>{card.value}</Typography>
                    </Box>
                    {card.icon}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ height: '100%', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}
                onClick={() => {
                  if (action.tabIndex !== null) {
                    onNavigate?.(action.tabIndex);
                  } else if (action.action) {
                    action.action();
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: action.color, mb: 2 }}>{action.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{action.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{action.description}</Typography>
                  <IconButton sx={{ mt: 1, color: action.color }} onClick={(e) => { e.stopPropagation(); action.tabIndex !== null ? onNavigate?.(action.tabIndex) : action.action?.(); }}>
                    <ArrowForward />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Info color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>How to Use This App</Typography>
        </Box>
        <Grid container spacing={3}>
          {howToSteps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ minWidth: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {step.step}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      {step.icon}
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{step.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Important Information</Typography>
        <Typography variant="body2" component="div">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Prescription medicines require a valid doctor's prescription</li>
            <li>Non prescription medicines can be ordered directly without a prescription</li>
            <li>Orders are typically processed within 2-4 hours</li>
            <li>Free delivery for orders above Rs. 1,000</li>
            <li>Chat with our pharmacists for any questions or concerns</li>
          </ul>
        </Typography>
      </Alert>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Why Choose Jayathura LifeCare?</Typography>
        <Grid container spacing={2}>
          {[
            { icon: <LocalPharmacy sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />, title: 'Verified Pharmacists', desc: 'Expert verification of all prescriptions' },
            { icon: <DeliveryDining sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />, title: 'Fast Delivery', desc: 'Same-day or next-day delivery available' },
            { icon: <Payment sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />, title: 'Flexible Payment', desc: 'Online payment or cash on delivery' },
            { icon: <SupportAgent sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />, title: '24/7 Support', desc: 'Always here to help you' },
          ].map((f, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                {f.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardOverview;
