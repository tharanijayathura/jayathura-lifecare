import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Divider,
  Alert,
  Chip,
  Button,
  Container,
} from '@mui/material';
import {
  Upload,
  ShoppingCart as ShoppingCartIcon,
  History,
  SupportAgent,
  ArrowForward,
  Info,
  LocalPharmacy,
  MedicalServices,
  DeliveryDining,
  Payment,
  CheckCircle,
  TrackChanges,
  ArrowRightAlt,
  VerifiedUser,
  Speed,
  Shield,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';

import heroImage from '../../../assets/hero.png';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile
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

    return () => {
      mounted = false;
    };
  }, []);

  const stats = profile?.stats || {};

  // ✅ Config (memoized to avoid recreation)
  const quickActions = useMemo(
    () => [
      {
        key: 'upload',
        icon: <Upload sx={{ fontSize: 28 }} />,
        title: 'Upload Prescription',
        description: "Upload your doctor's prescription for verification",
        accent: '#ABE7B2',
        tabIndex: 1,
      },
      {
        key: 'shop',
        icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />,
        title: 'Shop Medicines',
        description: 'Browse and order non-prescription medicines',
        accent: '#CBF3BB',
        tabIndex: 2,
      },
      {
        key: 'history',
        icon: <History sx={{ fontSize: 28 }} />,
        title: 'Order History',
        description: 'View your past orders and track deliveries',
        accent: '#93BFC7',
        tabIndex: 3,
      },
      {
        key: 'chat',
        icon: <SupportAgent sx={{ fontSize: 28 }} />,
        title: 'Chat Support',
        description: 'Get help from our pharmacists anytime',
        accent: '#9BD2DB',
        tabIndex: null,
        action: () => (window.location.href = '/chat'),
      },
    ],
    []
  );

  const howToSteps = useMemo(
    () => [
      {
        step: 1,
        title: 'Upload Prescription',
        description: 'Take a clear photo and upload. Pharmacists verify within minutes.',
        icon: <Upload sx={{ fontSize: 28 }} />,
      },
      {
        step: 2,
        title: 'Browse & Add to Cart',
        description: 'Explore medicines, vitamins, and health products.',
        icon: <MedicalServices sx={{ fontSize: 28 }} />,
      },
      {
        step: 3,
        title: 'Review & Confirm',
        description: 'Review order, attach prescription, and confirm payment.',
        icon: <CheckCircle sx={{ fontSize: 28 }} />,
      },
      {
        step: 4,
        title: 'Track Delivery',
        description: 'Monitor order status in real-time with notifications.',
        icon: <TrackChanges sx={{ fontSize: 28 }} />,
      },
    ],
    []
  );

  const statCards = useMemo(
    () => [
      {
        key: 'totalOrders',
        label: 'Total Orders',
        value: stats.totalOrders || 0,
        icon: <History sx={{ fontSize: 38 }} />,
        gradient: 'linear-gradient(135deg, #93BFC7 0%, #6FA5AF 100%)',
      },
      {
        key: 'pendingOrders',
        label: 'Pending Orders',
        value: stats.pendingOrders || 0,
        icon: <DeliveryDining sx={{ fontSize: 38 }} />,
        gradient: 'linear-gradient(135deg, #ABE7B2 0%, #6FD39C 100%)',
      },
      {
        key: 'prescriptions',
        label: 'Prescriptions',
        value: stats.totalPrescriptions || 0,
        icon: <LocalPharmacy sx={{ fontSize: 38 }} />,
        gradient: 'linear-gradient(135deg, #CBF3BB 0%, #A7E89A 100%)',
      },
      {
        key: 'refills',
        label: 'Active Refills',
        value: stats.activeRefillPlans || 0,
        icon: <MedicalServices sx={{ fontSize: 38 }} />,
        gradient: 'linear-gradient(135deg, #9BD2DB 0%, #7AA8B0 100%)',
      },
    ],
    [stats.totalOrders, stats.pendingOrders, stats.totalPrescriptions, stats.activeRefillPlans]
  );

  const whyChoose = useMemo(
    () => [
      {
        key: 'certified',
        icon: <VerifiedUser sx={{ fontSize: 34 }} />,
        title: 'Certified Pharmacists',
        desc: 'Expert verification of all prescriptions by licensed professionals',
      },
      {
        key: 'fast',
        icon: <Speed sx={{ fontSize: 34 }} />,
        title: 'Fast Delivery',
        desc: 'Same-day delivery with real-time tracking and updates',
      },
      {
        key: 'payment',
        icon: <Payment sx={{ fontSize: 34 }} />,
        title: 'Flexible Payment',
        desc: 'Multiple payment options including cash on delivery',
      },
      {
        key: 'support',
        icon: <SupportAgent sx={{ fontSize: 34 }} />,
        title: '24/7 Support',
        desc: 'Round-the-clock assistance from our healthcare team',
      },
    ],
    []
  );

  const infoList = useMemo(
    () => [
      "Prescription medicines require a valid doctor's prescription",
      'Non-prescription medicines can be ordered directly',
      'Orders processed within 2-4 hours',
      'Free delivery for orders above Rs. 1,000',
      'Chat with pharmacists for any questions',
    ],
    []
  );

  const handleAction = (action) => {
    if (action.tabIndex !== null && action.tabIndex !== undefined) {
      onNavigate?.(action.tabIndex);
      return;
    }
    action.action?.();
  };

  const sx = {
    page: { py: { xs: 2, md: 4 } },

    hero: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: { xs: 3, md: 4 },
      mb: 5,
      minHeight: { xs: 260, md: 320 },
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(236,244,232,0.98) 0%, rgba(203,243,187,0.92) 100%)',
      boxShadow: '0 18px 50px rgba(44,62,80,0.10)',
      border: '1px solid rgba(171,231,178,0.28)',
    },

    heroBg: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: { xs: '46%', md: '48%' },
      backgroundImage: `url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(236,244,232,0.55) 0%, rgba(236,244,232,0.0) 70%)',
      },
    },

    heroContent: {
      position: 'relative',
      zIndex: 2,
      p: { xs: 2.5, md: 4 },
      width: { xs: '100%', md: '58%' },
    },

    heroTitle: {
      color: '#2C3E50',
      fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.2rem' },
      fontWeight: 600, // ✅ not bold
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      mb: 1.25,
    },

    heroText: {
      color: '#546E7A',
      lineHeight: 1.7,
      fontSize: { xs: '0.98rem', md: '1.05rem' },
      mb: 2.25,
      maxWidth: 560,
    },

    chip: (bg, border) => ({
      bgcolor: bg,
      color: '#2C3E50',
      border: `1px solid ${border}`,
      fontWeight: 500, // ✅ not bold
      '& .MuiChip-icon': { color: '#2C3E50' },
    }),

    cta: {
      background: 'linear-gradient(135deg, #93BFC7, #7AA8B0)',
      color: 'white',
      fontWeight: 600, // ✅ not bold
      px: 3.5,
      py: 1.25,
      borderRadius: 2,
      '&:hover': {
        background: 'linear-gradient(135deg, #7AA8B0, #93BFC7)',
        boxShadow: '0 10px 22px rgba(147,191,199,0.28)',
      },
    },

    sectionTitle: {
      color: '#2C3E50',
      fontSize: { xs: '1.25rem', md: '1.45rem' },
      fontWeight: 600, // ✅ not bold
      mb: 2.5,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: 54,
        height: 4,
        background: 'linear-gradient(90deg, #93BFC7, #ABE7B2)',
        borderRadius: 2,
      },
    },

    statCard: {
      borderRadius: 3,
      color: 'white',
      height: '100%',
      border: '1px solid rgba(255,255,255,0.22)',
      boxShadow: '0 10px 26px rgba(44,62,80,0.12)',
      transition: 'transform .25s ease, box-shadow .25s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 34px rgba(44,62,80,0.16)' },
    },

    liftCard: {
      height: '100%',
      borderRadius: 3,
      border: '1px solid rgba(171,231,178,0.28)',
      background: 'rgba(255,255,255,0.86)',
      transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 18px 40px rgba(44,62,80,0.12)',
        borderColor: 'rgba(147,191,199,0.55)',
      },
    },

    iconBubble: (bg) => ({
      width: 56,
      height: 56,
      borderRadius: 3,
      display: 'grid',
      placeItems: 'center',
      background: `linear-gradient(135deg, ${bg} 0%, ${bg}CC 100%)`,
      boxShadow: '0 8px 18px rgba(44,62,80,0.12)',
      color: '#2C3E50',
      flexShrink: 0,
    }),

    stepCard: {
      height: '100%',
      borderRadius: 3,
      border: '1px solid rgba(171,231,178,0.28)',
      background: 'rgba(255,255,255,0.86)',
      transition: 'transform .25s ease, box-shadow .25s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 32px rgba(44,62,80,0.10)' },
    },

    stepBadge: {
      minWidth: 48,
      height: 48,
      borderRadius: 2.5,
      background: 'linear-gradient(135deg, #93BFC7, #7AA8B0)',
      color: 'white',
      display: 'grid',
      placeItems: 'center',
      fontWeight: 600, // ✅ not bold
      fontSize: '1.1rem',
      boxShadow: '0 8px 18px rgba(147,191,199,0.25)',
      flexShrink: 0,
    },

    whyCard: {
      height: '100%',
      borderRadius: 3,
      border: '1px solid rgba(171,231,178,0.28)',
      background: 'rgba(255,255,255,0.86)',
      transition: 'transform .25s ease, box-shadow .25s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 32px rgba(44,62,80,0.10)' },
    },

    infoAlert: {
      mb: 4,
      borderRadius: 3,
      border: '1px solid rgba(147,191,199,0.48)',
      background: 'rgba(147,191,199,0.08)',
      color: '#2C3E50',
      '& .MuiAlert-icon': { color: '#93BFC7', fontSize: 26 },
    },
  };

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
    <Container maxWidth="xl" sx={sx.page}>
      {/* HERO */}
      <Box sx={sx.hero}>
        <Box sx={sx.heroBg} />
        <Box sx={sx.heroContent}>
          <Typography sx={sx.heroTitle}>
            Welcome back, <Box component="span" sx={{ color: '#93BFC7' }}>{user?.name || 'Patient'}!</Box>
          </Typography>

          <Typography sx={sx.heroText}>
            Your trusted healthcare companion. Manage prescriptions, track orders, and connect with pharmacists — all in one seamless experience.
          </Typography>

          <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap', gap: 1, mb: 2.25 }}>
            <Chip icon={<VerifiedUser sx={{ fontSize: 18 }} />} label="Certified Pharmacists" sx={sx.chip('rgba(171,231,178,0.22)', 'rgba(171,231,178,0.45)')} />
            <Chip icon={<Speed sx={{ fontSize: 18 }} />} label="2-Hour Delivery" sx={sx.chip('rgba(203,243,187,0.22)', 'rgba(203,243,187,0.45)')} />
            <Chip icon={<Shield sx={{ fontSize: 18 }} />} label="Safe & Secure" sx={sx.chip('rgba(147,191,199,0.22)', 'rgba(147,191,199,0.45)')} />
          </Stack>

          <Button variant="contained" endIcon={<ArrowRightAlt />} sx={sx.cta} onClick={() => onNavigate?.(1)}>
            Get Started
          </Button>
        </Box>
      </Box>

      {/* STATS */}
      {profile?.stats && (
        <Box sx={{ mb: 5 }}>
          <Typography sx={sx.sectionTitle}>Your Health Stats</Typography>
          <Grid container spacing={3}>
            {statCards.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c.key}>
                <Card sx={{ ...sx.statCard, background: c.gradient }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.95, mb: 0.5 }}>
                          {c.label}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
                          {c.value}
                        </Typography>
                      </Box>
                      <Box sx={{ opacity: 0.85 }}>{c.icon}</Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* QUICK ACTIONS */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={sx.sectionTitle}>Quick Actions</Typography>

        <Grid container spacing={3}>
          {quickActions.map((a) => (
            <Grid item xs={12} sm={6} md={3} key={a.key}>
              <Card sx={sx.liftCard} onClick={() => handleAction(a)}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Stack spacing={2.25} sx={{ height: '100%' }}>
                    <Box sx={sx.iconBubble(a.accent)}>{a.icon}</Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.75 }}>
                        {a.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#546E7A', lineHeight: 1.65 }}>
                        {a.description}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(a);
                        }}
                        sx={{
                          bgcolor: 'rgba(147,191,199,0.14)',
                          '&:hover': { bgcolor: 'rgba(147,191,199,0.24)' },
                        }}
                      >
                        <ArrowForward sx={{ color: '#2C3E50' }} />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 5, borderColor: 'rgba(147,191,199,0.25)' }} />

      {/* HOW IT WORKS */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={sx.sectionTitle}>How It Works</Typography>

        <Grid container spacing={3}>
          {howToSteps.map((s) => (
            <Grid item xs={12} md={3} key={s.step}>
              <Card sx={sx.stepCard}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2} alignItems="flex-start">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={sx.stepBadge}>{s.step}</Box>
                      <Box sx={{ color: '#93BFC7' }}>{s.icon}</Box>
                    </Stack>

                    <Box>
                      <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 600, mb: 0.75 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#546E7A', lineHeight: 1.65 }}>
                        {s.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* IMPORTANT INFO */}
      <Alert severity="info" icon={<Info />} sx={sx.infoAlert}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Important Information
        </Typography>

        <Grid container spacing={1.5}>
          {infoList.map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <CheckCircle sx={{ color: '#93BFC7', fontSize: 20, mt: '2px' }} />
                <Typography variant="body2" sx={{ color: '#546E7A', lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Alert>

      {/* WHY CHOOSE */}
      <Box sx={{ mt: 5 }}>
        <Typography sx={sx.sectionTitle}>Why Choose Jayathura LifeCare?</Typography>

        <Grid container spacing={3}>
          {whyChoose.map((w) => (
            <Grid item xs={12} sm={6} md={3} key={w.key}>
              <Card sx={sx.whyCard}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.5} alignItems="center" textAlign="center">
                    <Box sx={{ color: '#93BFC7' }}>{w.icon}</Box>
                    <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 600 }}>
                      {w.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#546E7A', lineHeight: 1.65 }}>
                      {w.desc}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardOverview;
