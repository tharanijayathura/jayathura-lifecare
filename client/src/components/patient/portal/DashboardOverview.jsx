import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Stack, IconButton, Divider, Alert, Chip, Button, Container, Paper, Avatar, CircularProgress
} from '@mui/material';
import {
  Upload, ShoppingCart as ShoppingCartIcon, History, SupportAgent, ArrowForward, Info, LocalPharmacy, MedicalServices, DeliveryDining, Payment, CheckCircle, TrackChanges, ArrowRightAlt, VerifiedUser, Search, ReceiptLong, Star
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';
import heroImage from '../../../assets/pcare.jpg';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  white: '#FFFFFF',
  accent: '#FFB74D',
};

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [commonMedicines, setCommonMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [profileRes, commonRes] = await Promise.all([
          patientAPI.getProfile(),
          patientAPI.getCommonMedicines()
        ]);
        if (mounted) {
          setProfile(profileRes.data);
          setCommonMedicines(commonRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
        <CircularProgress sx={{ color: COLORS.blue2 }} />
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
        background: `linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 100%)`,
        borderRadius: 6,
        p: { xs: 4, md: 6 },
        mb: 6,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(171, 231, 178, 0.2)',
      }}>
        <Box sx={{ flex: 1.2, zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
          <Chip 
            label="Jayathura LifeCare Pharmacy" 
            size="small" 
            sx={{ mb: 2, bgcolor: COLORS.white, color: COLORS.blue2, fontWeight: 700, borderRadius: 2 }} 
          />
          <Typography sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, fontWeight: 800, color: COLORS.text, mb: 1, lineHeight: 1.1 }}>
            Hello, {user?.name?.split(' ')[0] || 'Patient'}!
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontSize: { xs: '1rem', md: '1.2rem' }, mb: 4, maxWidth: 500 }}>
            Your personal health hub. Order medicines, upload prescriptions, and track your wellness journey with ease.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Upload />} 
              onClick={() => onNavigate?.(1)} 
              sx={{ 
                fontWeight: 800, 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                bgcolor: COLORS.text,
                color: 'white',
                '&:hover': { bgcolor: '#1a252f' }
              }}
            >
              Upload Prescription
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<ShoppingCartIcon />} 
              onClick={() => onNavigate?.(2)} 
              sx={{ 
                fontWeight: 800, 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                borderColor: COLORS.text,
                color: COLORS.text,
                bgcolor: 'rgba(255,255,255,0.4)',
                '&:hover': { borderColor: COLORS.text, bgcolor: 'rgba(255,255,255,0.6)' }
              }}
            >
              Shop Pharmacy
            </Button>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', zIndex: 2 }}>
          <Box 
            component="img" 
            src={heroImage} 
            alt="Wellness" 
            sx={{ 
              width: '100%', 
              maxWidth: 400, 
              borderRadius: 6, 
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              transform: 'rotate(2deg)'
            }} 
          />
        </Box>
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', top: -30, left: '40%', width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', zIndex: 1 }} />
      </Box>

      {/* QUICK STATS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Total Orders', value: stats.totalOrders || 0, icon: <ReceiptLong />, color: COLORS.blue1 },
          { label: 'Prescriptions', value: stats.totalPrescriptions || 0, icon: <LocalPharmacy />, color: COLORS.green3 },
          { label: 'Active Refills', value: stats.activeRefillPlans || 0, icon: <TrackChanges />, color: COLORS.accent },
          { label: 'Pending Bills', value: stats.pendingOrders || 0, icon: <Payment />, color: COLORS.blue2 },
        ].map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: stat.color + '22', color: stat.color, display: 'flex' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* COMMON MEDICINES */}
      {commonMedicines.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5 }}>Commonly Needed</Typography>
              <Typography variant="body2" sx={{ color: COLORS.subtext }}>Quickly add essential healthcare items to your cart.</Typography>
            </Box>
            <Button endIcon={<ArrowRightAlt />} onClick={() => onNavigate?.(2)} sx={{ fontWeight: 700, color: COLORS.blue2 }}>
              View All
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {commonMedicines.slice(0, 5).map((medicine) => (
              <Grid item xs={6} sm={4} md={2.4} key={medicine.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  height: '100%', 
                  border: `1px solid ${COLORS.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(0,0,0,0.08)', borderColor: COLORS.blue2 }
                }}>
                  <Box sx={{ p: 2, bgcolor: COLORS.green1 + '44', display: 'flex', justifyContent: 'center' }}>
                    <Box 
                      component="img" 
                      src={medicine.image || 'https://via.placeholder.com/150?text=Medicine'} 
                      alt={medicine.name}
                      sx={{ height: 120, width: '100%', objectFit: 'contain', borderRadius: 2 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5, height: '2.5rem', overflow: 'hidden' }}>
                      {medicine.name}
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: COLORS.blue2, mb: 1.5 }}>
                      Rs. {medicine.price?.toFixed(2)}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      onClick={() => onNavigate?.(2)}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', borderColor: COLORS.blue1, color: COLORS.text }}
                    >
                      View in Shop
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* SERVICES GRID */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 4 }}>Our Core Services</Typography>
        <Grid container spacing={3}>
          {[
            { title: 'Prescription Upload', desc: 'Fast digital verification by experts.', icon: <Upload />, color: COLORS.green3 },
            { title: 'Home Delivery', desc: 'Medicine delivered to your doorstep.', icon: <DeliveryDining />, color: COLORS.blue1 },
            { title: 'Live Chat', desc: 'Real-time support from pharmacists.', icon: <SupportAgent />, color: COLORS.blue2 },
            { title: 'History & Analytics', desc: 'Track your health spending and orders.', icon: <History />, color: COLORS.text },
          ].map((service, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper sx={{ p: 4, borderRadius: 5, textAlign: 'center', bgcolor: COLORS.white, border: `1px solid ${COLORS.border}`, height: '100%', transition: 'all 0.3s', '&:hover': { bgcolor: COLORS.green1 + '33' } }}>
                <Box sx={{ mb: 2, color: service.color }}>{React.cloneElement(service.icon, { sx: { fontSize: 40 } })}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: COLORS.text }}>{service.title}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>{service.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* GUIDELINES ALERT */}
      <Alert 
        severity="info" 
        icon={<Star sx={{ color: COLORS.accent }} />}
        sx={{ 
          borderRadius: 5, 
          p: 3, 
          bgcolor: COLORS.text, 
          color: 'white',
          '& .MuiAlert-icon': { fontSize: 32 }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Pro Tip for Faster Processing</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Upload high-resolution prescriptions with the doctor's name and signature clearly visible. This helps our pharmacists verify and generate your bill within minutes!
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => onNavigate?.(1)}
          sx={{ mt: 2, bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: COLORS.green2 } }}
        >
          Try Now
        </Button>
      </Alert>
    </Container>
  );
};

export default DashboardOverview;
