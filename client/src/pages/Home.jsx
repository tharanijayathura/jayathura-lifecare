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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import {
  LocalPharmacy,
  MedicalServices,
  DeliveryDining,
  SupportAgent,
  Menu as MenuIcon,
  Close as CloseIcon,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import symbolImage from '../assets/medical-symbol.png';

// Import images
import deliveryPerson from '../assets/deliver1-removebg-preview.png';
import pharImage from '../assets/phar.png';
import homeBgImage from '../assets/c315609e636d82456e8d2ac8a244ddff.jpg';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const scrollY = useScrollTrigger({ threshold: 100 });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawer = (
    <Box sx={{ width: 280, backgroundColor: '#ECF4E8', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src={symbolImage} alt="Jayathura" sx={{ height: 26 }} /> Jayathura
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon sx={{ color: '#2C3E50' }} />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} onClick={() => { navigate(item.path); handleDrawerToggle(); }}>
            <ListItemText primary={item.label} sx={{ color: '#2C3E50', fontWeight: 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#ABE7B2',
            color: '#2C3E50',
            '&:hover': { backgroundColor: '#CBF3BB' },
            mb: 1,
          }}
          onClick={() => { navigate('/login'); handleDrawerToggle(); }}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#93BFC7',
            color: '#2C3E50',
            '&:hover': { backgroundColor: '#7AA8B0' },
          }}
          onClick={() => { navigate('/register'); handleDrawerToggle(); }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#ECF4E8', minHeight: '100vh' }}>
      
      <HideOnScroll>
        <AppBar position="fixed" sx={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
                gap: 1,
              }}
            >
              <Box component="img" src={symbolImage} alt="Jayathura LifeCare" sx={{ height: 28 }} />
              Jayathura LifeCare
            </Typography>

            {isMobile ? (
              <IconButton edge="start" onClick={handleDrawerToggle}>
                <MenuIcon sx={{ color: '#2C3E50', fontSize: 30 }} />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: '#2C3E50',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: '#93BFC7' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#93BFC7',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: '#f5fffa' },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#ABE7B2',
                    color: '#2C3E50',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#CBF3BB' },
                    px: 3,
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Toolbar />

      
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
                  mb: 4,
                  fontSize: '1.2rem',
                  lineHeight: 1.7,
                  color: '#546E7A',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.3s forwards',
                }}
              >
                Discover convenient healthcare solutions with prescription management,
                medicine delivery, and expert pharmacist support — all in one platform.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  opacity: 0,
                  animation: 'fadeInUp 1s ease-out 0.6s forwards',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    backgroundColor: '#ABE7B2',
                    color: '#2C3E50',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(171, 231, 178, 0.4)',
                    animation: isMobile ? 'pulse 2s infinite' : 'none',
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
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: '#93BFC7',
                    color: '#93BFC7',
                    fontWeight: 500,
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

      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          backgroundImage: `url(${homeBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(236, 244, 232, 0.85) 0%, rgba(203, 243, 187, 0.85) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 6 },
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#2C3E50',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Your Trusted Healthcare Partner
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#546E7A',
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Experience the future of healthcare with our innovative platform designed to make pharmaceutical services accessible, convenient, and reliable for everyone in Sri Lanka.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6, color: '#2C3E50' }}
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
                  transition: 'all 0.3s ease',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #f0f7f0',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(171, 231, 178, 0.25)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' } }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2C3E50' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#546E7A' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      
      <Box
        sx={{
          backgroundColor: '#ABE7B2',
          color: '#2C3E50',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sx={{ textAlign: 'left' }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#2C3E50',
                }}
              >
                <Box component="img" src={symbolImage} alt="Jayathura LifeCare" sx={{ height: 26 }} /> Jayathura LifeCare
              </Typography>
              <Typography variant="body2" sx={{ color: '#546E7A', lineHeight: 1.7 }}>
                Your trusted partner in healthcare. We bring the pharmacy to your doorstep with modern solutions and expert care.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Facebook /></IconButton>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Twitter /></IconButton>
                <IconButton size="small" sx={{ color: '#2C3E50' }}><Instagram /></IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2C3E50', fontWeight: 600 }}>
                Quick Links
              </Typography>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    color: '#546E7A',
                    textTransform: 'none',
                    py: 0.5,
                    '&:hover': { color: '#2C3E50' },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2C3E50', fontWeight: 600 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#546E7A' }}>
                <Phone fontSize="small" /> +94 71 234 5678
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#546E7A' }}>
                <Email fontSize="small" /> jayathuralifecare@gmail.com
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#546E7A' }}>
                <LocationOn fontSize="small" /> Colombo, Sri Lanka
              </Box>
            </Grid>

            <Grid item xs={12} md={3} sx={{ textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2C3E50', fontWeight: 600 }}>
                Support
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/chat')}
                sx={{
                  backgroundColor: '#2C3E50',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#4A5568' },
                }}
                startIcon={<SupportAgent sx={{ color: '#FFFFFF' }} />}
              >
                Chat Now
              </Button>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ color: '#546E7A', mt: 4 }}>
            © {new Date().getFullYear()} Jayathura LifeCare. All rights reserved.
          </Typography>
        </Container>
      </Box>

      
      <Fab
        size="small"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#ABE7B2',
          color: '#2C3E50',
          '&:hover': { backgroundColor: '#CBF3BB' },
          opacity: scrollY ? 1 : 0,
          transition: 'all 0.3s',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Up
      </Fab>

      
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