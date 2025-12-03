import React from 'react';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  useScrollTrigger,
  IconButton,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalPharmacy,
  MedicalServices,
  DeliveryDining,
  SupportAgent,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../contexts/useAuth';

// Import images
import deliveryPerson from '../assets/deliver1-removebg-preview.png';
import pharImage from '../assets/phar.png';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollY = useScrollTrigger({ threshold: 100 });

  const features = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 48, color: '#ABE7B2' }} />,
      title: 'Easy Prescription Upload',
      description: 'Upload your prescriptions easily and get them verified by our pharmacists',
    },
    {
      icon: <MedicalServices sx={{ fontSize: 48, color: '#93BFC7' }} />,
      title: 'Medicine Catalog',
      description: 'Browse through our extensive collection of medicines and healthcare products',
    },
    {
      icon: <DeliveryDining sx={{ fontSize: 48, color: '#CBF3BB' }} />,
      title: 'Fast Delivery',
      description: 'Get your medicines delivered to your doorstep with real-time tracking',
    },
    {
      icon: <SupportAgent sx={{ fontSize: 48, color: '#ABE7B2' }} />,
      title: '24/7 Support',
      description: 'Chat with our pharmacists anytime for guidance and support',
    },
  ];

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Support', path: '/support' },
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#ECF4E8', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 100%)',
          py: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: '#2C3E50',
                  fontSize: { xs: '2.5rem', md: '3.8rem' },
                  lineHeight: 1.2,
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out forwards',
                }}
              >
                Your Health,{' '}
                <Box component="span" sx={{ color: '#93BFC7' }}>
                  Our Priority
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  lineHeight: 1.7,
                  color: '#546E7A',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.3s forwards',
                  px: { xs: 1, sm: 0 },
                }}
              >
                Discover convenient healthcare solutions with prescription management,
                medicine delivery, and expert pharmacist support — all in one platform.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.5, sm: 2 },
                  flexWrap: 'wrap',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.6s forwards',
                }}
              >
                <Button
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={() => navigate('/register')}
                  fullWidth={isMobile}
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.25, md: 1.5 },
                    backgroundColor: '#ABE7B2',
                    color: '#2C3E50',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(171, 231, 178, 0.4)',
                    animation: isMobile ? 'pulse 2s infinite' : 'none',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': {
                      backgroundColor: '#CBF3BB',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Your Health Journey
                </Button>
                <Button
                  variant="outlined"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={() => navigate('/login')}
                  fullWidth={isMobile}
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.25, md: 1.5 },
                    borderColor: '#93BFC7',
                    color: '#93BFC7',
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    '&:hover': {
                      backgroundColor: '#f0f8f5',
                      borderColor: '#93BFC7',
                    },
                  }}
                >
                  Existing User
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 350, sm: 400, md: 450 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'center', md: 'center' },
                  pl: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  component="img"
                  src={pharImage}
                  alt="Medicine"
                  sx={{
                    position: 'absolute',
                    width: { xs: '90%', sm: '120%', md: '140%' },
                    maxWidth: { xs: 200, sm: 400, md: 680 },
                    height: 'auto',
                    bottom: { xs: 0, sm: -20, md: -20 },
                    right: { xs: 20, sm: -40, md: -120 },
                    zIndex: 1,
                    opacity: 0.85,
                    animation: scrollY ? 'floatSlow 6s ease-in-out infinite' : 'none',
                  }}
                />

                <Box
                  component="img"
                  src={deliveryPerson}
                  alt="Delivery Person"
                  sx={{
                    width: { xs: '70%', sm: '90%', md: '88%' },
                    maxWidth: { xs: 200, sm: 350, md: 440 },
                    height: 'auto',
                    filter: 'drop-shadow(0 12px 24px rgba(171, 231, 178, 0.3))',
                    position: 'relative',
                    zIndex: 2,
                    opacity: 0,
                    animation: 'floatIn 1.8s ease-out forwards, float 3.5s ease-in-out infinite 1.8s',
                  }}
                />

                <Box sx={floatingPill('#ABE7B2', '25%', '15%', '4s')} />
                <Box sx={floatingPill('#93BFC7', '70%', '20%', '3.2s', 0.7)} />
                <Box sx={floatingPill('#CBF3BB', '10%', '60%', '5s', 0.6)} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 10 }, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            mb: { xs: 4, md: 6 }, 
            color: '#2C3E50',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            px: { xs: 2, sm: 0 },
          }}
        >
          Why Choose Jayathura LifeCare?
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #f0f7f0',
                  borderRadius: 3,
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-8px)' },
                    boxShadow: { xs: 2, sm: '0 12px 30px rgba(171, 231, 178, 0.25)' },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  <Box sx={{ mb: { xs: 1.5, md: 2 }, transition: 'transform 0.3s', '&:hover': { transform: { xs: 'none', sm: 'scale(1.1)' } } }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: { xs: 40, md: 48 } } })}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2C3E50',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#546E7A',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.875rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#ABE7B2',
          color: '#2C3E50',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 1,
                  color: '#2C3E50',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                <LocalPharmacy sx={{ color: '#2C3E50' }} /> Jayathura LifeCare
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#546E7A', 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                }}
              >
                Your trusted partner in healthcare. We bring the pharmacy to your doorstep with modern solutions and expert care.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Facebook /></IconButton>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Twitter /></IconButton>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Instagram /></IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#2C3E50', 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Quick Links
              </Typography>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  fullWidth
                  sx={{
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    color: '#546E7A',
                    textTransform: 'none',
                    py: 0.5,
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                    '&:hover': { color: '#2C3E50' },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#2C3E50', 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 1, color: '#546E7A', fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                <Phone fontSize="small" /> +94 71 234 5678
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 1, color: '#546E7A', fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                <Email fontSize="small" /> jayathuralifecare@gmail.com
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, color: '#546E7A', fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                <LocationOn fontSize="small" /> Colombo, Sri Lanka
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#2C3E50', 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Support
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (user) {
                    navigate('/chat');
                  } else {
                    navigate('/login');
                  }
                }}
                sx={{
                  backgroundColor: '#2C3E50',
                  color: '#FFFFFF',
                  fontSize: { xs: '0.85rem', md: '0.875rem' },
                  py: { xs: 1, md: 1.25 },
                  '&:hover': { backgroundColor: '#4A5568' },
                }}
                startIcon={<SupportAgent sx={{ color: '#FFFFFF' }} />}
              >
                Chat Now
              </Button>
            </Grid>
          </Grid>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              color: '#546E7A', 
              mt: { xs: 3, md: 4 },
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            © {new Date().getFullYear()} Jayathura LifeCare. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Scroll to Top */}
      <Fab
        size={isMobile ? 'small' : 'medium'}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 20 },
          right: { xs: 16, md: 20 },
          backgroundColor: '#ABE7B2',
          color: '#2C3E50',
          '&:hover': { backgroundColor: '#CBF3BB' },
          opacity: scrollY ? 1 : 0,
          transition: 'all 0.3s',
          zIndex: 1000,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Up
      </Fab>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(1deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes floatPackage {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(171, 231, 178, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(171, 231, 178, 0); }
          100% { box-shadow: 0 0 0 0 rgba(171, 231, 178, 0); }
        }
      `}</style>
    </Box>
  );
};

// Helper function for floating pills
const floatingPill = (color, top, left, duration, opacity = 0.7) => ({
  position: 'absolute',
  top,
  left,
  width: { xs: 32, md: 40 },
  height: { xs: 32, md: 40 },
  backgroundColor: color,
  borderRadius: '50%',
  animation: `floatPackage ${duration} ease-in-out infinite`,
  opacity,
  zIndex: 1,
});

export default Home;