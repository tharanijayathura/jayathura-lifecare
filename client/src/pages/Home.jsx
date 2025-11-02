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
      icon: <LocalPharmacy sx={{ fontSize: 48, color: '#ABE7B2' }} />,
      title: 'Easy Prescription Upload',
      description: 'Upload your prescriptions easily and get them verified by our pharmacists'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 48, color: '#93BFC7' }} />,
      title: 'Medicine Catalog',
      description: 'Browse through our extensive collection of medicines and healthcare products'
    },
    {
      icon: <DeliveryDining sx={{ fontSize: 48, color: '#CBF3BB' }} />,
      title: 'Fast Delivery',
      description: 'Get your medicines delivered to your doorstep with real-time tracking'
    },
    {
      icon: <SupportAgent sx={{ fontSize: 48, color: '#ABE7B2' }} />,
      title: '24/7 Support',
      description: 'Chat with our pharmacists anytime for guidance and support'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#ECF4E8' }}>
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
                color: '#2C3E50',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LocalPharmacy sx={{ color: '#ABE7B2' }} /> 
              Jayathura LifeCare
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#93BFC7',
                  '&:hover': {
                    backgroundColor: '#ECF4E8',
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#ABE7B2',
                  color: '#2C3E50',
                  '&:hover': {
                    backgroundColor: '#CBF3BB',
                  }
                }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Toolbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 100%)',
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
                  color: '#2C3E50',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Your Health, 
                <Box component="span" sx={{ color: '#93BFC7' }}>
                  {' '}Our Priority
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  mb: 4, 
                  fontSize: '1.2rem', 
                  lineHeight: 1.6,
                  color: '#546E7A'
                }}
              >
                Discover convenient healthcare solutions with prescription management, 
                medicine delivery, and expert pharmacist support - all in one platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    backgroundColor: '#ABE7B2',
                    color: '#2C3E50',
                    '&:hover': {
                      backgroundColor: '#CBF3BB',
                    }
                  }}
                >
                  Start Your Health Journey
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderColor: '#93BFC7',
                    color: '#93BFC7',
                    '&:hover': {
                      backgroundColor: '#ECF4E8',
                      borderColor: '#93BFC7',
                    }
                  }}
                >
                  Existing User
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #ABE7B2, #93BFC7)',
                  height: 300,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2C3E50',
                  boxShadow: '0 8px 32px rgba(171, 231, 178, 0.3)',
                }}
              >
                <Typography 
                  variant="h4" 
                  align="center" 
                  sx={{ 
                    p: 3,
                    fontWeight: 600
                  }}
                >
                  Smart Pharmacy Solutions for Modern Healthcare
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, backgroundColor: '#ECF4E8' }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            fontWeight: 600, 
            mb: 6,
            color: '#2C3E50'
          }}
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
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECF4E8',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(171, 231, 178, 0.2)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: '#2C3E50'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#546E7A'
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
            backgroundColor: '#CBF3BB',
            color: '#2C3E50',
            py: 6,
            mt: 8,
            borderTop: '1px solid #ABE7B2',
        }}
        >
        <Container maxWidth="lg">
            <Grid container spacing={4}>
            {/* About Us Section */}
            <Grid 
                item 
                xs={12} 
                md={6}
                sx={{
                textAlign: 'left'
                }}
            >
                <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'flex-start'
                }}
                >
                <LocalPharmacy sx={{ color: '#93BFC7' }} />
                Jayathura LifeCare
                </Typography>

                <Typography 
                variant="body1" 
                sx={{ 
                    mb: 2,
                    color: '#546E7A',
                    textAlign: 'left'
                }}
                >
                Your trusted partner in healthcare. We bring the pharmacy to your doorstep 
                with modern solutions and expert care.
                </Typography>
            </Grid>

            {/* Quick Links Section */}
            <Grid 
                item 
                xs={12} 
                md={3}
                sx={{
                textAlign: 'left'
                }}
            >
                <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: '#2C3E50' }}
                >
                Quick Links
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button sx={{ justifyContent: 'start', color: '#93BFC7' }}>
                    About Us
                </Button>
                <Button sx={{ justifyContent: 'start', color: '#93BFC7' }}>
                    Contact
                </Button>
                <Button sx={{ justifyContent: 'start', color: '#93BFC7' }}>
                    Support
                </Button>
                </Box>
            </Grid>

            {/* Connect With Us Section */}
            <Grid 
                item 
                xs={12} 
                md={3}
                sx={{
                textAlign: 'left'
                }}
            >
                <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: '#2C3E50' }}
                >
                Connect With Us
                </Typography>

                <Typography variant="body2" sx={{ color: '#546E7A' }}>
                24/7 Customer Support
                </Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>
                Email: support@jayathuralifecare.lk
                </Typography>
                <Typography variant="body2" sx={{ color: '#546E7A' }}>
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