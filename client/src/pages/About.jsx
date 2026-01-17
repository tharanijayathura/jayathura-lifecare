import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  VerifiedUser,
  AccessTime,
  Security,
  Receipt,
  DeliveryDining,
  Notifications,
  LocationOn,
  Phone,
  Email,
  Favorite,
  CheckCircle,
  Lightbulb,
  Gavel,
  Visibility,
  Flag,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const values = [
    { icon: <Favorite />, title: 'Care', description: 'We care deeply about your health and wellbeing' },
    { icon: <CheckCircle />, title: 'Reliability', description: 'Dependable service you can trust' },
    { icon: <Visibility />, title: 'Transparency', description: 'Clear pricing and honest communication' },
    { icon: <Lightbulb />, title: 'Innovation', description: 'Cutting-edge technology for better healthcare' },
    { icon: <Gavel />, title: 'Integrity', description: 'Ethical practices in everything we do' },
  ];

  const features = [
    {
      icon: <AccessTime />,
      title: '24/7 Online Access',
      description: 'Access our services anytime, anywhere through our digital platform',
    },
    {
      icon: <Security />,
      title: 'Secure Prescription Handling',
      description: 'Your prescriptions are handled with the utmost security and confidentiality',
    },
    {
      icon: <Receipt />,
      title: 'Auto-Generated Billing',
      description: 'Automated billing system ensures accuracy and saves time',
    },
    {
      icon: <VerifiedUser />,
      title: 'High-Accuracy Verification',
      description: 'Expert pharmacists verify every prescription with precision',
    },
    {
      icon: <DeliveryDining />,
      title: 'Fast Islandwide Delivery',
      description: 'Quick and reliable delivery service across Sri Lanka',
    },
    {
      icon: <Notifications />,
      title: 'Refill Reminders',
      description: 'Never miss a dose with automated reminders for chronic patients',
    },
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageHeader title="About Jayathura LifeCare" showBack={false} />
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            A modern digital healthcare platform revolutionizing pharmaceutical services in Sri Lanka
          </Typography>
        </Box>

        {/* Company Overview */}
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 2, md: 3 }, 
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              }}
            >
              Company Overview
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 2, md: 3 }, 
                lineHeight: 1.8, 
                color: 'text.primary',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              <strong>Jayathura LifeCare</strong> is a comprehensive digital healthcare platform designed to transform
              how Sri Lankans access pharmaceutical services. Founded by <strong>Tharani Jayathura</strong>, our platform
              combines cutting-edge technology with compassionate healthcare to deliver exceptional service to patients
              across the island.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: 'text.primary' }}>
              We offer a complete suite of healthcare services including:
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: 1 }}>
              {[
                'Online pharmacy services',
                'Prescription upload & verification',
                'Chronic patient refill plans',
                'Delivery tracking',
                'Secure online payments',
                'Patient–pharmacist communication',
              ].map((service, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: 'primary.main', fontSize: { xs: 18, md: 20 } }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.primary',
                        fontSize: { xs: '0.85rem', md: '0.875rem' },
                      }}
                    >
                      {service}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="body1" sx={{ mt: 3, lineHeight: 1.8, color: 'text.primary', fontStyle: 'italic' }}>
              As a modern healthcare solution from Sri Lanka, we are committed to making quality pharmaceutical care
              accessible, convenient, and reliable for everyone.
            </Typography>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 3, md: 4 } }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'primary.light' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 2 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Flag sx={{ fontSize: { xs: 28, md: 32 }, color: 'primary.main', mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'text.primary',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    Our Mission
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8, 
                    color: 'text.primary',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  To provide accessible, reliable, and fast pharmaceutical services that improve patient convenience
                  and safety through innovative technology. We strive to bridge the gap between traditional pharmacy
                  services and modern digital healthcare solutions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'info.light' }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 2 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Visibility sx={{ fontSize: { xs: 28, md: 32 }, color: 'info.main', mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'text.primary',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    Our Vision
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8, 
                    color: 'text.primary',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  To become Sri Lanka's leading digital healthcare and pharmacy service provider, recognized for
                  excellence in patient care, technological innovation, and commitment to improving healthcare
                  accessibility across the nation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Our Values */}
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 3, md: 4 }, 
                textAlign: 'center', 
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              }}
            >
              Our Values
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'primary.light',
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                        boxShadow: { xs: 1, sm: 4 },
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: { xs: 1.5, md: 2 }, display: 'flex', justifyContent: 'center' }}>
                      {React.cloneElement(value.icon, { sx: { fontSize: { xs: 32, md: 40 } } })}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: 'text.primary',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.85rem', md: '0.875rem' },
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 3, md: 4 }, 
                textAlign: 'center', 
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              }}
            >
              Why Choose Us
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'primary.light',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                        boxShadow: { xs: 1, sm: 4 },
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: { xs: 1.5, md: 2 } }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: { xs: 28, md: 36 } } })}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: 'text.primary',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary', 
                        flexGrow: 1,
                        fontSize: { xs: '0.85rem', md: '0.875rem' },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Location Section */}
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 }, bgcolor: 'primary.light' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 2 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                <LocationOn sx={{ fontSize: { xs: 28, md: 32 }, color: 'primary.main', mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  }}
                >
                  Our Location
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.primary', 
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                Visit us at our headquarters in Kamburupitiya, Matara, Sri Lanka
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '300px', md: '400px' },
                borderRadius: '0 0 12px 12px',
                overflow: 'hidden',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.26807417058!2d80.5640!3d6.0632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae146af3c0b6b25%3A0xbbbcb461a775888e!2sKamburupitiya%2C%20Matara!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jayathura LifeCare Location"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: 'text.primary' }}>
              Get In Touch
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    +94 71 259 9785
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'info.light',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Email sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    support@jayathuralifecare.com
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    Kamburupitiya, Matara, Sri Lanka
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Ready to Experience Modern Healthcare?
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Join thousands of satisfied patients who trust Jayathura LifeCare for their pharmaceutical needs.
          </Typography>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default About;

