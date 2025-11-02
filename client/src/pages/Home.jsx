// client/src/pages/Home.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  LocalPharmacy,
  MedicalServices,
  DeliveryDining,
  SupportAgent,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalPharmacy sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Easy Prescription Upload',
      description: 'Upload your prescriptions easily and get them verified by our pharmacists'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Medicine Catalog',
      description: 'Browse through our extensive collection of medicines and healthcare products'
    },
    {
      icon: <DeliveryDining sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Fast Delivery',
      description: 'Get your medicines delivered to your doorstep with real-time tracking'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: '24/7 Support',
      description: 'Chat with our pharmacists anytime for guidance and support'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <HideOnScroll>
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LocalPharmacy /> Jayathura LifeCare
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'primary.main' }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Toolbar /> {/* Spacer */}

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%)',
          py: 10,
          px: 2,
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
                  color: 'text.primary',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Your Health, 
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {' '}Our Priority
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, fontSize: '1.2rem', lineHeight: 1.6 }}
              >
                Discover convenient healthcare solutions with prescription management, 
                medicine delivery, and expert pharmacist support - all in one platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Start Your Health Journey
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Existing User
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #2E7D32, #0288D1)',
                  height: 300,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Typography variant="h4" align="center" sx={{ p: 3 }}>
                  Smart Pharmacy Solutions for Modern Healthcare
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Why Choose Jayathura LifeCare?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
          backgroundColor: 'primary.dark',
          color: 'white',
          py: 6,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                <LocalPharmacy sx={{ mr: 1 }} />
                Jayathura LifeCare
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your trusted partner in healthcare. We bring the pharmacy to your doorstep 
                with modern solutions and expert care.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Button color="inherit" fullWidth sx={{ justifyContent: 'start' }}>
                About Us
              </Button>
              <Button color="inherit" fullWidth sx={{ justifyContent: 'start' }}>
                Contact
              </Button>
              <Button color="inherit" fullWidth sx={{ justifyContent: 'start' }}>
                Support
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Typography variant="body2">
                24/7 Customer Support
              </Typography>
              <Typography variant="body2">
                Email: support@jayathuralifecare.lk
              </Typography>
              <Typography variant="body2">
                Phone: +94 11 234 5678
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;