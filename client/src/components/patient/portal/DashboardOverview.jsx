import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Stack, IconButton, Divider, Alert, Chip, Button, Container, Paper, Avatar, CircularProgress
} from '@mui/material';
import {
  Upload, ShoppingCart as ShoppingCartIcon, History, SupportAgent, ArrowForward, Info, LocalPharmacy, MedicalServices, DeliveryDining, Payment, CheckCircle, TrackChanges, ArrowRightAlt, VerifiedUser, Search, ReceiptLong, Star, AddCircleOutline
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';
import heroImage from '../../../assets/pcare.jpg';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [commonMedicines, setCommonMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    white: '#FFFFFF',
    accent: '#FFB74D',
    border: 'rgba(147, 191, 199, 0.25)',
  };

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
        borderRadius: 8,
        p: { xs: 4, md: 6 },
        mb: 6,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(171, 231, 178, 0.25)',
      }}>
        <Box sx={{ flex: 1.2, zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
          <Chip 
            label="Jayathura LifeCare Pharmacy" 
            size="small" 
            sx={{ mb: 2, bgcolor: COLORS.white, color: COLORS.blue2, fontWeight: 800, borderRadius: 2, fontSize: '0.7rem', px: 1 }} 
          />
          <Typography sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, color: COLORS.text, mb: 1, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Health matters,<br />
            <Box component="span" sx={{ color: COLORS.blue2 }}>{user?.name?.split(' ')[0] || 'Patient'}.</Box>
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontSize: { xs: '1rem', md: '1.25rem' }, mb: 5, maxWidth: 500, fontWeight: 500 }}>
            Your premium clinical hub. Seamlessly manage prescriptions, track wellness, and access expert pharmaceutical care.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<Upload />} 
              onClick={() => onNavigate?.(1)} 
              sx={{ 
                fontWeight: 900, 
                px: 4, 
                py: 2,
                borderRadius: 4,
                bgcolor: COLORS.text,
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' }
              }}
            >
              Upload Prescription
            </Button>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<ShoppingCartIcon />} 
              onClick={() => onNavigate?.(2)} 
              sx={{ 
                fontWeight: 900, 
                px: 4, 
                py: 2,
                borderRadius: 4,
                bgcolor: COLORS.white,
                color: COLORS.text,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' }
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
              maxWidth: 420, 
              borderRadius: 8, 
              boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
              transform: 'rotate(2deg) scale(1.05)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'rotate(0deg) scale(1.1)' }
            }} 
          />
        </Box>
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', top: -40, left: '35%', width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', zIndex: 1 }} />
      </Box>

      {/* QUICK STATS */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {[
          { label: 'Active Orders', value: stats.totalOrders || 0, icon: <History />, color: COLORS.blue1 },
          { label: 'Clinical Files', value: stats.totalPrescriptions || 0, icon: <LocalPharmacy />, color: COLORS.green3 },
          { label: 'Wellness Plans', value: stats.activeRefillPlans || 0, icon: <TrackChanges />, color: COLORS.accent },
          { label: 'Pending Bills', value: stats.pendingOrders || 0, icon: <Payment />, color: COLORS.blue2 },
        ].map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 2.5, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' } }}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: stat.color + '15', color: stat.color, display: 'flex' }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, lineHeight: 1 }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{stat.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* CORE UTILITIES */}
      <Grid container spacing={4} sx={{ mb: 10 }}>
        <Grid item xs={12} md={7}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            Frequently Accessed <AddCircleOutline sx={{ color: COLORS.blue2 }} />
          </Typography>
          <Grid container spacing={2}>
            {commonMedicines.slice(0, 4).map((medicine) => (
              <Grid item xs={12} sm={6} key={medicine.id}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', display: 'flex', gap: 2, alignItems: 'center', transition: 'all 0.2s', '&:hover': { borderColor: COLORS.blue2, bgcolor: '#f8fafc' } }}>
                  <Avatar variant="rounded" src={medicine.image} sx={{ width: 64, height: 64, bgcolor: COLORS.green1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, fontSize: '0.85rem' }}>{medicine.name}</Typography>
                    <Typography variant="caption" sx={{ color: COLORS.blue2, fontWeight: 700 }}>Rs. {medicine.price?.toFixed(2)}</Typography>
                  </Box>
                  <IconButton onClick={() => onNavigate?.(2)} sx={{ color: COLORS.blue2 }}><ArrowForward /></IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 8, bgcolor: COLORS.text, color: 'white', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, position: 'relative' }}>Clinical Support</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontWeight: 500, fontSize: '0.95rem' }}>
              Need expert advice? Our certified pharmacists are available for real-time consultation and prescription guidance.
            </Typography>
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                startIcon={<SupportAgent />} 
                fullWidth 
                sx={{ borderRadius: 4, py: 1.5, bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 900, '&:hover': { bgcolor: COLORS.green2 } }}
              >
                Start Consultation
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Info />} 
                fullWidth 
                sx={{ borderRadius: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' } }}
              >
                View FAQs
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* SERVICES GRID */}
      <Box sx={{ mb: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text, mb: 5, textAlign: 'center' }}>Jayathura Premium Services</Typography>
        <Grid container spacing={4}>
          {[
            { title: 'Digital RX', desc: 'Secure encryption for clinical documents.', icon: <VerifiedUser />, color: '#059669' },
            { title: 'Express Delivery', desc: 'Pharmacy direct to your coordinates.', icon: <DeliveryDining />, color: '#0284c7' },
            { title: 'Smart Refills', desc: 'Automated recurring health management.', icon: <TrackChanges />, color: '#d97706' },
            { title: 'Health Wallet', desc: 'Integrated medical expense tracking.', icon: <ReceiptLong />, color: COLORS.blue2 },
          ].map((service, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 3, 
                  borderRadius: '50%', 
                  bgcolor: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: service.color,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  border: `1px solid ${COLORS.border}`
                }}>
                  {React.cloneElement(service.icon, { sx: { fontSize: 36 } })}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5, color: COLORS.text }}>{service.title}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext, px: 2, fontWeight: 500, lineHeight: 1.6 }}>{service.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* GUIDELINES ALERT */}
      <Alert 
        severity="info" 
        icon={<Star sx={{ color: COLORS.accent, fontSize: 32 }} />}
        sx={{ 
          borderRadius: 8, 
          p: 4, 
          bgcolor: COLORS.green1, 
          color: COLORS.text,
          border: `1px solid ${COLORS.green3}`,
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: COLORS.text }}>Optimized Prescription Submission</Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600, maxWidth: 600 }}>
              Ensure your prescription is clear and includes the doctor's seal. Digital uploads are verified by our team in real-time, allowing for billing within minutes.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => onNavigate?.(1)}
            sx={{ bgcolor: COLORS.text, color: 'white', fontWeight: 900, borderRadius: 4, px: 5, py: 1.5, '&:hover': { bgcolor: '#000' } }}
          >
            Start Submission
          </Button>
        </Box>
      </Alert>
    </Container>
  );
};

export default DashboardOverview;
