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

        {/* QUICK ACTIONS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#fff', boxShadow: '0 4px 18px rgba(44,62,80,0.08)', cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px #ABE7B2' } }} onClick={() => onNavigate?.(1)}>
              <Upload sx={{ fontSize: 38, color: '#ABE7B2', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Upload Prescription</Typography>
              <Typography variant="body2" sx={{ color: '#546E7A' }}>Upload and manage your prescriptions</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#fff', boxShadow: '0 4px 18px rgba(44,62,80,0.08)', cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px #CBF3BB' } }} onClick={() => onNavigate?.(2)}>
              <ShoppingCartIcon sx={{ fontSize: 38, color: '#CBF3BB', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Shop Medicines</Typography>
              <Typography variant="body2" sx={{ color: '#546E7A' }}>Browse and order medicines easily</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#fff', boxShadow: '0 4px 18px rgba(44,62,80,0.08)', cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px #93BFC7' } }} onClick={() => onNavigate?.(3)}>
              <History sx={{ fontSize: 38, color: '#93BFC7', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Order History</Typography>
              <Typography variant="body2" sx={{ color: '#546E7A' }}>View your past orders and status</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#fff', boxShadow: '0 4px 18px rgba(44,62,80,0.08)', cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px #9BD2DB' } }} onClick={() => window.location.href = '/chat'}>
              <SupportAgent sx={{ fontSize: 38, color: '#9BD2DB', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Chat Support</Typography>
              <Typography variant="body2" sx={{ color: '#546E7A' }}>Get help from our pharmacists</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* DEPARTMENT/SERVICE CATEGORIES */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' }, color: '#2C3E50', mb: 2 }}>Department & Service Categories</Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item><Chip icon={<LocalPharmacy />} label="Pharmacy" sx={{ bgcolor: '#ABE7B2', color: '#2C3E50', fontWeight: 600 }} /></Grid>
            <Grid item><Chip icon={<MedicalServices />} label="Lab" sx={{ bgcolor: '#CBF3BB', color: '#2C3E50', fontWeight: 600 }} /></Grid>
            <Grid item><Chip icon={<DeliveryDining />} label="Delivery" sx={{ bgcolor: '#93BFC7', color: '#2C3E50', fontWeight: 600 }} /></Grid>
            <Grid item><Chip icon={<Payment />} label="Payments" sx={{ bgcolor: '#9BD2DB', color: '#2C3E50', fontWeight: 600 }} /></Grid>
            <Grid item><Chip icon={<SupportAgent />} label="Support" sx={{ bgcolor: '#ECF4E8', color: '#2C3E50', fontWeight: 600 }} /></Grid>
          </Grid>
        </Box>

        {/* FEATURED IMAGE SECTION */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, mb: 4, background: '#fff', borderRadius: 4, boxShadow: '0 4px 18px rgba(44,62,80,0.08)', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' }, color: '#2C3E50', mb: 1 }}>Your Cart</Typography>
            <Typography sx={{ color: '#546E7A', mb: 2 }}>Easily manage your selected medicines and checkout securely.</Typography>
            <Button variant="contained" color="success" endIcon={<ShoppingCartIcon />} sx={{ fontWeight: 600, px: 4 }} onClick={() => onNavigate?.(2)}>
              Go to Cart
            </Button>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Box component="img" src={cartImage} alt="Cart" sx={{ width: { xs: '100%', md: 320 }, maxWidth: 380, borderRadius: 4, boxShadow: '0 8px 32px rgba(44,62,80,0.10)' }} />
          </Box>
        </Box>

        {/* WHY CHOOSE US */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' }, color: '#2C3E50', mb: 2 }}>Why Choose Jayathura LifeCare?</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4' }}><VerifiedUser sx={{ fontSize: 34, color: '#93BFC7', mb: 1 }} /><Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Certified Pharmacists</Typography><Typography variant="body2" sx={{ color: '#546E7A' }}>Expert verification of all prescriptions by licensed professionals</Typography></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4' }}><Speed sx={{ fontSize: 34, color: '#ABE7B2', mb: 1 }} /><Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Fast Delivery</Typography><Typography variant="body2" sx={{ color: '#546E7A' }}>Same-day delivery with real-time tracking and updates</Typography></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4' }}><Payment sx={{ fontSize: 34, color: '#CBF3BB', mb: 1 }} /><Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>Flexible Payment</Typography><Typography variant="body2" sx={{ color: '#546E7A' }}>Multiple payment options including cash on delivery</Typography></Card></Grid>
            <Grid item xs={12} sm={6} md={3}><Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', background: '#F3F9F4' }}><SupportAgent sx={{ fontSize: 34, color: '#9BD2DB', mb: 1 }} /><Typography sx={{ fontWeight: 700, color: '#2C3E50' }}>24/7 Support</Typography><Typography variant="body2" sx={{ color: '#546E7A' }}>Round-the-clock assistance from our healthcare team</Typography></Card></Grid>
          </Grid>
        </Box>

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
