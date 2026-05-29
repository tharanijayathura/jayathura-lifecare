import React, { useEffect, useState } from 'react';
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
  Paper,
  Avatar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Upload,
  ShoppingCart as ShoppingCartIcon,
  History,
  SupportAgent,
  ArrowForward,
  Info,
  LocalPharmacy,
  TrackChanges,
  VerifiedUser,
  ReceiptLong,
  Star,
  AddCircleOutline,
  Remove,
  Add,
  PhoneIphone,
  HealthAndSafety,
  NotificationsActive,
  CheckCircle,
  DeliveryDining,
  Wallet,
  StarBorder
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/useAuth';
import { patientAPI } from '../../../services/api';
import heroImage from '../../../assets/man_no_bg.png';

const DashboardOverview = ({ onNavigate, handleAddToCart, onSeeMoreCommon }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [commonMedicines, setCommonMedicines] = useState([]);
  const [rxOrders, setRxOrders] = useState([]);
  const [chronicAlerts, setChronicAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const COLORS = {
    green1: '#f0fdf4', // Soft mint green
    green2: '#ecfdf5', // Soft emerald green
    emerald: '#10b981', // Brand green
    blue2: '#3b82f6',  // Premium sky blue
    text: '#0f172a',   // Slate 900
    subtext: '#64748b',// Slate 500
    border: 'rgba(226, 232, 240, 0.8)',
    white: '#ffffff',
  };

  const pastelColors = ['#f8fafc', '#f8fafc', '#f8fafc', '#f8fafc'];

  useEffect(() => {
    let mounted = true;
    
    const fetchDashboardData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [profileRes, commonRes, rxOrdersRes, alertsRes] = await Promise.all([
          patientAPI.getProfile(),
          patientAPI.getCommonMedicines(),
          patientAPI.getPrescriptionOrders(),
          patientAPI.getChronicAlerts()
        ]);
        if (mounted) {
          setProfile(profileRes.data);
          setCommonMedicines(commonRes.data);
          setRxOrders(rxOrdersRes.data || []);
          setChronicAlerts(alertsRes.data?.alerts || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData(true);

    // Setup background polling every 10 seconds to sync counts in real-time
    const intervalId = setInterval(() => {
      fetchDashboardData(false);
    }, 10000);

    return () => { 
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const stats = profile?.stats || {};

  const handleIncrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));
  };

  const handleAddMedicineToCart = (medicine) => {
    if (handleAddToCart) {
      const medId = medicine._id || medicine.id;
      const qty = quantities[medId] || 1;
      handleAddToCart({
        itemId: medId,
        name: medicine.name,
        quantity: qty,
        price: medicine.price,
        unit: medicine.unit || medicine.baseUnit || 'tablet',
        itemType: 'medicine',
        image: medicine.image,
      });
      // Reset quantity after adding
      setQuantities(prev => ({ ...prev, [medId]: 1 }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.emerald }} />
      </Box>
    );
  }

  const billsReadyToConfirm = rxOrders.filter(order => order.status === 'pending' && order.finalAmount > 0);

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, md: 3 } }}>
      
      {/* 0.0 CHRONIC RUN-OUT ALERT BANNER */}
      {chronicAlerts.map((alert, idx) => (
        <Alert 
          key={idx}
          severity={alert.type === 'error' ? 'error' : 'warning'} 
          icon={<NotificationsActive />}
          action={
            <Button 
              color="inherit" 
              variant="outlined"
              size="small" 
              onClick={() => onNavigate?.(1)} // Redirect to upload prescription tab
              sx={{ 
                fontWeight: 800, 
                textTransform: 'none', 
                borderRadius: 2,
                px: 2
              }}
            >
              Upload Prescription
            </Button>
          }
          sx={{ 
            mb: 3, 
            borderRadius: 4, 
            alignItems: 'center',
            '& .MuiAlert-message': { width: '100%' },
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.05)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {alert.type === 'error' ? 'Medicine Supply Expired' : 'Medicine Supply Running Out'}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.2 }}>
            {alert.message}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 700, opacity: 0.8 }}>
            Medicines: {alert.medicines}
          </Typography>
        </Alert>
      ))}

      {/* 0. ACTION REQUIRED ALERT BANNER */}
      {billsReadyToConfirm.length > 0 && (
        <Alert 
          severity="info" 
          icon={<NotificationsActive sx={{ color: '#0284c7' }} />}
          action={
            <Button 
              color="info" 
              variant="contained"
              size="small" 
              onClick={() => onNavigate?.(3)} // Redirect to Prescriptions & Bills tab
              sx={{ 
                fontWeight: 800, 
                textTransform: 'none', 
                bgcolor: '#0284c7', 
                color: 'white',
                '&:hover': { bgcolor: '#0369a1' },
                borderRadius: 2,
                px: 2
              }}
            >
              Review Bill
            </Button>
          }
          sx={{ 
            mb: 4, 
            borderRadius: 4, 
            border: '1px solid #bae6fd', 
            bgcolor: '#f0f9ff',
            color: '#0369a1',
            alignItems: 'center',
            '& .MuiAlert-message': { width: '100%' },
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.05)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Action Required: Bill Ready for Review</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.82rem', mt: 0.2 }}>
            A pharmacist has calculated the bill for your prescription upload. Please review it, add your delivery address, and complete the order.
          </Typography>
        </Alert>
      )}

      {/* 1. HERO BANNER SECTION */}
      <Box sx={{
        position: 'relative',
        background: `linear-gradient(135deg, ${COLORS.green1} 0%, ${COLORS.green2} 100%)`,
        borderRadius: { xs: 6, md: 10 },
        p: { xs: 3, md: 6 },
        pb: { xs: 4, md: 15 }, // reduced bottom padding on mobile
        mb: { xs: 4, md: 13 }, // reduced margin on mobile since cards are relative
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'visible',
        boxShadow: '0 20px 50px -20px rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.08)'
      }}>
        <Box sx={{ flex: 1.2, zIndex: 2, pr: { md: 4 } }}>
          <Chip 
            label="Jayathura LifeCare Pharmacy" 
            size="small" 
            sx={{ mb: 2.5, bgcolor: COLORS.white, color: '#047857', fontWeight: 800, borderRadius: 2, px: 1, border: '1px solid rgba(4, 120, 87, 0.1)' }} 
          />
          <Typography sx={{ 
            fontSize: { xs: '2.2rem', md: '3.2rem' }, 
            fontWeight: 800, 
            color: COLORS.text, 
            mb: 2.5, 
            lineHeight: 1.15, 
            letterSpacing: '-0.02em',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Your Journey to<br />
            <Box component="span" sx={{ color: '#047857' }}>Wellness, simplified.</Box>
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<Upload />} 
            onClick={() => onNavigate?.(1)} 
            sx={{ 
              fontWeight: 700, 
              px: 4, 
              py: 1.8,
              borderRadius: 4,
              bgcolor: COLORS.text,
              color: 'white',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
              transition: 'all 0.2s'
            }}
          >
            Upload Prescription
          </Button>
        </Box>

        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', zIndex: 2, position: 'relative', height: { md: 280, lg: 320 } }}>
          {/* Subtle glowing circular backdrop behind the transparent man */}
          <Box sx={{
            position: 'absolute',
            width: { md: 320, lg: 370 },
            height: { md: 320, lg: 370 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(255,255,255,0) 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }} />
          <Box 
            component="img" 
            src={heroImage} 
            alt="Wellness Journey" 
            sx={{ 
              width: 'auto', 
              maxHeight: { md: 350, lg: 400 },
              objectFit: 'contain',
              zIndex: 2,
              filter: 'drop-shadow(0 20px 30px rgba(16, 185, 129, 0.25))',
              position: 'absolute',
              bottom: { md: -30, lg: -40 }, // overflows both top and bottom edges symmetrically
              right: { md: 10, lg: 20 },
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'scale(1.04) translateY(-5px)' }
            }} 
          />
        </Box>

        {/* FLOATING ACTION CARDS (Sitting halfway over bottom of banner) */}
        <Box sx={{
          position: { xs: 'relative', md: 'absolute' },
          bottom: { md: -48 },
          left: { md: '5%' },
          right: { md: '5%' },
          mt: { xs: 4, md: 0 },
          width: { xs: '100%', md: 'auto' },
          zIndex: 5,
        }}>
          <Grid container spacing={2}>
            {[
              { title: 'Telehealth', sub: 'New Feature', icon: <PhoneIphone />, color: '#3b82f6' },
              { title: 'Wellness Coach', sub: 'New Feature', icon: <HealthAndSafety />, color: '#10b981' },
              { title: 'Medication Reminders', sub: 'Stay on track', icon: <NotificationsActive />, color: '#f59e0b' },
              { title: 'Prescription Orders', sub: 'View status', icon: <ReceiptLong />, color: '#6366f1', action: () => onNavigate?.(3) },
            ].map((card, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Paper 
                  onClick={card.action}
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 6, 
                    bgcolor: 'white', 
                    textAlign: 'center', 
                    cursor: card.action ? 'pointer' : 'default',
                    border: '1px solid',
                    borderColor: COLORS.border,
                    boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    '&:hover': { 
                      transform: 'translateY(-6px)', 
                      boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.08)',
                      borderColor: card.color + '60'
                    } 
                  }}
                >
                  <Box sx={{ 
                    color: card.color, 
                    mb: 1.5, 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: card.color + '0a',
                    mx: 'auto'
                  }}>
                    {React.cloneElement(card.icon, { sx: { fontSize: 26 } })}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text, fontSize: '0.88rem', mb: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: card.sub === 'New Feature' ? '#10b981' : COLORS.subtext, fontWeight: 600, fontSize: '0.75rem' }}>
                    {card.sub}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* 2. PERSONALIZED MEDICINE CABINET SECTION */}
      <Box sx={{ mb: 12, mt: 10 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2} 
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em', mb: 0.5 }}>
              Your Personalized Medicine Cabinet
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
              Frequently ordered essentials — ready to add to cart
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForward sx={{ fontSize: '1rem !important' }} />}
            onClick={() => onSeeMoreCommon?.()}
            sx={{
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '0.88rem',
              px: 3,
              py: 1.3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
              border: '1px solid rgba(16,185,129,0.3)',
              letterSpacing: '0.2px',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes subtlePulse': {
                '0%, 100%': { boxShadow: '0 6px 20px rgba(16,185,129,0.35)' },
                '50%': { boxShadow: '0 8px 28px rgba(16,185,129,0.55)' },
              },
              animation: 'subtlePulse 2.5s ease-in-out infinite',
              '&:hover': {
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                boxShadow: '0 10px 30px rgba(16,185,129,0.5)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            See More
          </Button>
        </Stack>


        <Grid container spacing={3}>
          {commonMedicines.length === 0 ? (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 4, borderStyle: 'dashed' }}>
                <Typography color="text.secondary">No common medicines set in the cabinet currently.</Typography>
              </Paper>
            </Grid>
          ) : (
            commonMedicines.slice(0, 10).map((medicine, index) => {
              const medId = medicine._id || medicine.id;
              const qty = quantities[medId] || 1;
              const bgColor = pastelColors[index % pastelColors.length];

              return (
                <Grid item xs={12} sm={6} md={3} lg={2.4} key={medId}>
                  <Card sx={{ 
                    borderRadius: 6, 
                    border: '1px solid',
                    borderColor: 'rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 20px -8px rgba(15, 23, 42, 0.02)',
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-6px)',
                      boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.06)',
                    }
                  }}>
                    {/* Contained image with soft background and elegant padding */}
                    <Box sx={{ 
                      bgcolor: '#f8fafc', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: 140,
                      p: 2,
                      overflow: 'hidden',
                      borderTopLeftRadius: 'inherit',
                      borderTopRightRadius: 'inherit',
                      borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
                    }}>
                      <Box 
                        component="img"
                        src={medicine.image || 'https://via.placeholder.com/150'}
                        alt={medicine.name}
                        sx={{ 
                          maxHeight: '100%', 
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text, fontSize: '0.92rem', mb: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>
                          {medicine.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500, fontSize: '0.78rem' }}>
                          {medicine.brand || 'General Care'}
                        </Typography>
                      </Box>

                      {/* Footer Actions (Price, Qty Picker, Add button) */}
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontWeight: 800, color: COLORS.emerald, fontSize: '1rem' }}>
                          Rs. {medicine.price?.toFixed(2)}
                        </Typography>

                        <Stack direction="row" alignItems="center" sx={{ bgcolor: '#f1f5f9', borderRadius: 4, px: 0.5, py: 0.2 }}>
                          <IconButton size="small" onClick={() => handleDecrement(medId)} sx={{ p: 0.5 }}>
                            <Remove fontSize="small" sx={{ fontSize: '0.8rem', color: COLORS.text }} />
                          </IconButton>
                          <Typography sx={{ mx: 1, fontWeight: 700, fontSize: '0.85rem', color: COLORS.text }}>
                            {qty}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleIncrement(medId)}
                            sx={{ p: 0.5 }}
                          >
                            <Add fontSize="small" sx={{ fontSize: '0.8rem', color: COLORS.text }} />
                          </IconButton>
                        </Stack>

                        <Tooltip title="Add to Cart">
                          <IconButton 
                            onClick={() => handleAddMedicineToCart(medicine)}
                            sx={{ 
                              bgcolor: '#94a3b8', 
                              color: 'white', 
                              p: 0.75,
                              boxShadow: '0 2px 8px rgba(148, 163, 184, 0.12)',
                              '&:hover': { 
                                bgcolor: '#64748b',
                                transform: 'scale(1.05)'
                              },
                              transition: 'all 0.2s'
                            }}
                            size="small"
                          >
                            <ShoppingCartIcon sx={{ fontSize: '0.95rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>

      {/* 3. MY HEALTH AT A GLANCE STATS SECTION */}
      <Box sx={{ mb: 12, mt: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em', textAlign: 'left' }}>
          My Health at a Glance
        </Typography>

        <Grid container spacing={3.5}>
          {[
            { 
              label: 'Active Orders', 
              value: stats.pendingOrders || 0, 
              icon: <History />, 
              color: '#0284c7', 
              gradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              desc: 'Orders in progress',
              badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} Active` : 'None',
              badgeBg: 'rgba(2, 132, 199, 0.08)'
            },
            { 
              label: 'Clinical Files', 
              value: stats.totalPrescriptions || 0, 
              icon: <LocalPharmacy />, 
              color: '#10b981', 
              gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              desc: 'Verified prescriptions',
              badge: stats.totalPrescriptions > 0 ? `${stats.totalPrescriptions} Files` : 'None',
              badgeBg: 'rgba(16, 185, 129, 0.08)'
            },
            { 
              label: 'Wellness Plans', 
              value: stats.activeRefillPlans || 0, 
              icon: <TrackChanges />, 
              color: '#f59e0b', 
              gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              desc: 'Active refill plans',
              badge: stats.activeRefillPlans > 0 ? `${stats.activeRefillPlans} Active` : 'None',
              badgeBg: 'rgba(245, 158, 11, 0.08)'
            },
            { 
              label: 'Total Orders', 
              value: stats.totalOrders || 0, 
              icon: <ReceiptLong />, 
              color: '#8b5cf6', 
              gradient: 'linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%)',
              desc: 'Purchase history',
              badge: 'LifeCare Member',
              badgeBg: 'rgba(139, 92, 246, 0.08)'
            },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 5, 
                  border: `1px solid rgba(226, 232, 240, 0.9)`, 
                  bgcolor: 'white', 
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 160,
                  boxShadow: '0 4px 20px -8px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: stat.gradient,
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 36px -12px rgba(15, 23, 42, 0.08)',
                    borderColor: stat.color + '30',
                    '& .stat-icon': {
                      transform: 'scale(1.08)',
                      bgcolor: stat.color + '15'
                    }
                  }
                }}
              >
                {/* Top Row: Icon + Badge */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box 
                    className="stat-icon"
                    sx={{ 
                      p: 1.25, 
                      borderRadius: '12px', 
                      bgcolor: stat.color + '0a', 
                      color: stat.color, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 22 } })}
                  </Box>
                  
                  <Box sx={{ 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: 2, 
                    bgcolor: stat.badgeBg, 
                    color: stat.color,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {stat.badge}
                  </Box>
                </Stack>

                {/* Body Row: Value + Label */}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: COLORS.text, fontWeight: 700, fontSize: '0.88rem', mb: 0.2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontSize: '0.75rem', fontWeight: 500 }}>
                    {stat.desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 4. PREMIUM SERVICES SECTION */}
      <Box sx={{ mb: 12, mt: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 4.5, textAlign: 'center', letterSpacing: '-0.01em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Jayathura Premium Services
        </Typography>

        <Grid container spacing={3}>
          {[
            { 
              title: 'Digital RX', 
              desc: 'Secure encryption for clinical documents and fast approval.', 
              icon: <CheckCircle sx={{ fontSize: 28 }} />, 
              color: '#10b981',
              bgColor: '#ecfdf5'
            },
            { 
              title: 'Express Delivery', 
              desc: 'Pharmacy direct to your coordinates within hours.', 
              icon: <DeliveryDining sx={{ fontSize: 28 }} />, 
              color: '#3b82f6',
              bgColor: '#eff6ff'
            },
            { 
              title: 'Smart Refills', 
              desc: 'Automated recurring health refills and status reminders.', 
              icon: <TrackChanges sx={{ fontSize: 28 }} />, 
              color: '#8b5cf6',
              bgColor: '#f5f3ff'
            },
            { 
              title: 'Health Wallet', 
              desc: 'Integrated medical expense and billing analytics.', 
              icon: <Wallet sx={{ fontSize: 28 }} />, 
              color: '#f59e0b',
              bgColor: '#fffbeb'
            },
          ].map((service, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper elevation={0} sx={{ 
                p: 3.5, 
                borderRadius: 6, 
                border: '1px solid rgba(226, 232, 240, 0.8)',
                bgcolor: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 8px 30px -10px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.08)',
                  borderColor: service.color + '25',
                }
              }}>
                <Box sx={{ 
                  color: service.color, 
                  bgcolor: service.bgColor,
                  p: 2,
                  borderRadius: '50%',
                  mb: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {service.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: COLORS.text, fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 400, px: 1, lineHeight: 1.6, fontSize: '0.82rem' }}>
                  {service.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 5. OPTIMIZED PRESCRIPTION BANNER */}
      <Paper elevation={0} sx={{ 
        borderRadius: 7, 
        p: 4.5, 
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', 
        color: 'white',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 3,
        mt: 10,
        boxShadow: '0 20px 40px -15px rgba(4, 120, 87, 0.25)'
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.08)', 
            color: '#34d399', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Star sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white', letterSpacing: '-0.01em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Optimized Prescription Submission
            </Typography>
            <Typography variant="body2" sx={{ color: '#a7f3d0', fontWeight: 400, maxWidth: 680, fontSize: '0.85rem', lineHeight: 1.6 }}>
              Ensure your prescription is clear and includes the doctor's seal. Digital uploads are verified by our team in real-time, allowing for billing within minutes.
            </Typography>
          </Box>
        </Stack>

        <Button 
          variant="contained" 
          size="large" 
          onClick={() => onNavigate?.(1)}
          sx={{ 
            bgcolor: '#10b981', 
            color: 'white', 
            fontWeight: 700, 
            borderRadius: 4, 
            px: 4.5, 
            py: 2, 
            fontSize: '0.9rem',
            textTransform: 'none',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
            '&:hover': { 
              bgcolor: '#34d399',
              boxShadow: '0 15px 25px rgba(16, 185, 129, 0.3)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s'
          }}
        >
          Start Submission
        </Button>
      </Paper>

    </Container>
  );
};

export default DashboardOverview;
