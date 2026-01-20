import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Stack, IconButton, Divider, Alert, Chip, Button, Container, TextField
} from '@mui/material';
import {
  Upload, ShoppingCart as ShoppingCartIcon, History, SupportAgent, ArrowForward, Info, LocalPharmacy, MedicalServices, DeliveryDining, Payment, CheckCircle, TrackChanges, ArrowRightAlt, VerifiedUser, Speed, Shield, Search
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';
import heroImage from '../../../assets/pcare.jpg';
import cartImage from '../../../assets/cart.jpg';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await patientAPI.getProfile();
        if (mounted) setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = profile?.stats || {};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Loading your dashboard...
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* HERO SECTION */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 55%, #ABE7B2 100%)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(44,62,80,0.10)',
          p: { xs: 3, md: 5 },
          mb: 5,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{ flex: 1, zIndex: 2 }}>
            <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: '#2C3E50', mb: 1 }}>
              Welcome, {user?.name?.split(' ')[0] || 'Patient'}!
            </Typography>
            <Typography sx={{ color: '#546E7A', fontSize: { xs: '1.1rem', md: '1.25rem' }, mb: 2 }}>
              Your health, our care. Manage prescriptions, shop medicines, and connect with your care team.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Button variant="contained" color="success" size="large" endIcon={<Upload />} onClick={() => onNavigate?.(1)} sx={{ fontWeight: 600, px: 4 }}>
                Upload Prescription
              </Button>
              <Button variant="outlined" color="success" size="large" endIcon={<ShoppingCartIcon />} onClick={() => onNavigate?.(2)} sx={{ fontWeight: 600, px: 4, bgcolor: '#fff' }}>
                Shop Medicines
              </Button>
            </Stack>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 260 }}>
            <Box component="img" src={heroImage} alt="Patient Care" sx={{ width: { xs: '100%', md: 380 }, maxWidth: 420, borderRadius: 4, boxShadow: '0 8px 32px rgba(44,62,80,0.10)' }} />
          </Box>
        </Box>

        {/* STATS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #ABE7B2 0%, #CBF3BB 100%)', color: '#2C3E50', fontWeight: 600 }}>
              <Typography variant="h5">{stats.totalOrders || 0}</Typography>
              <Typography variant="body2">Orders</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #CBF3BB 0%, #93BFC7 100%)', color: '#2C3E50', fontWeight: 600 }}>
              <Typography variant="h5">{stats.totalPrescriptions || 0}</Typography>
              <Typography variant="body2">Prescriptions</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #93BFC7 0%, #ABE7B2 100%)', color: '#2C3E50', fontWeight: 600 }}>
              <Typography variant="h5">{stats.activeRefillPlans || 0}</Typography>
              <Typography variant="body2">Active Refills</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #ABE7B2 0%, #ECF4E8 100%)', color: '#2C3E50', fontWeight: 600 }}>
              <Typography variant="h5">{stats.pendingOrders || 0}</Typography>
              <Typography variant="body2">Pending Orders</Typography>
            </Card>
          </Grid>
        </Grid>


        {/* OUR SERVICES SECTION */}
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.6rem' }, color: '#2C3E50', mb: 3 }}>
            Our Services
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <Upload sx={{ fontSize: 38, color: '#ABE7B2', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Prescription Upload</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Easily upload your doctor's prescription for pharmacist verification and order processing.</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <ShoppingCartIcon sx={{ fontSize: 38, color: '#CBF3BB', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Medicine Shopping</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Browse, select, and order medicines online with home delivery options.</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <History sx={{ fontSize: 38, color: '#93BFC7', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Order Tracking</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Track your prescription and medicine orders, and view your order history.</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <SupportAgent sx={{ fontSize: 38, color: '#9BD2DB', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Chat Support</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Get instant help and answers from our pharmacists and support team.</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <TrackChanges sx={{ fontSize: 38, color: '#ABE7B2', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Refill Reminders</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Receive timely reminders for prescription refills and medication schedules.</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4', height: '100%' }}>
                <Payment sx={{ fontSize: 38, color: '#CBF3BB', mb: 1 }} />
                <Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Secure Payments</Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>Pay securely online with multiple payment options, including cash on delivery.</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>


        {/* PATIENT GUIDELINES SECTION */}
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.6rem' }, color: '#2C3E50', mb: 3 }}>
            How to Use the System
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>1. Sign up or log in to your account.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>2. Upload a valid doctor’s prescription if you need prescription medicines.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>3. Add items to your cart and place your order. Non-prescription items can be ordered directly.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>4. Wait for the pharmacist to review your prescription and confirm your bill.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>5. Confirm your order. You may add audio instructions if needed.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>6. Proceed to payment: choose Cash on Delivery (COD) or online payment.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>7. Delivery charges depend on distance: 5 km = Rs. 300, 6 km = Rs. 400, 7 km = Rs. 500, etc.</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowForward sx={{ color: '#93BFC7', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#2C3E50' }}>8. Wait for the delivery person to arrive at your home with your order.</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>


        {/* FEATURED IMAGE SECTION REMOVED TO AVOID REDUNDANCY WITH OUR SERVICES */}


        {/* WHY CHOOSE US REMOVED TO AVOID REDUNDANCY WITH OUR SERVICES */}

        {/* IMPORTANT INFO */}
        <Alert severity="info" icon={<Info />} sx={{ borderRadius: 3, border: '1px solid #93BFC7', background: 'rgba(147,191,199,0.08)', color: '#2C3E50', mb: 4, textAlign: 'left', alignItems: 'flex-start' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'left' }}>Important Information</Typography>
          <ul style={{ margin: 0, paddingLeft: 24, textAlign: 'left' }}>
            <li>Prescription medicines require a valid doctor's prescription</li>
            <li>Non-prescription medicines can be ordered directly</li>
            <li>Orders processed within 2-4 hours</li>
            <li>Free delivery for orders above Rs. 10,000</li>
            <li>Chat with pharmacists for any questions</li>
          </ul>
        </Alert>
      </Container>
    );
  }


export default DashboardOverview;
