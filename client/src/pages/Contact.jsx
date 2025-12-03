import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  LocalPharmacy,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  CheckCircle,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Simulate form submission (in production, this would send to backend)
    console.log('Contact form submitted:', formData);
    
    // Show success message
    setSnackbarMessage('Thank you! Your message has been sent. We will get back to you soon.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Phone',
      content: '+94 71 259 9785',
      subtitle: 'Call us anytime',
      color: 'primary',
    },
    {
      icon: <Email />,
      title: 'Email',
      content: 'support@jayathuralifecare.com',
      subtitle: 'Send us an email',
      color: 'info',
    },
    {
      icon: <LocationOn />,
      title: 'Address',
      content: 'Kamburupitiya, Matara, Sri Lanka',
      subtitle: 'Visit our location',
      color: 'primary',
    },
    {
      icon: <AccessTime />,
      title: 'Business Hours',
      content: 'Monday - Sunday: 8:00 AM - 8:00 PM',
      subtitle: '24/7 Online Support',
      color: 'info',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageHeader title="Contact Us" showBack={false} />
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <LocalPharmacy sx={{ fontSize: { xs: 48, sm: 56, md: 64 }, color: 'primary.main', mb: 2 }} />
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
            We're here to help! Get in touch with our team for any questions, support, or inquiries.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, mb: { xs: 3, md: 4 } }}>
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
                  Send us a Message
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                  }}
                >
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="+94 XX XXX XXXX"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="What is this regarding?"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={isMobile ? 4 : 6}
                        placeholder="Tell us how we can help you..."
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size={isMobile ? 'medium' : 'large'}
                        startIcon={<Send />}
                        fullWidth={isMobile}
                        sx={{
                          py: { xs: 1.25, md: 1.5 },
                          px: { xs: 3, md: 4 },
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          fontWeight: 600,
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 2, md: 3 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                Get in Touch
              </Typography>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        borderRadius: 2,
                        bgcolor: `${info.color}.light`,
                        border: '1px solid',
                        borderColor: `${info.color}.main`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: { xs: 'none', sm: 'translateY(-4px)' },
                          boxShadow: { xs: 1, sm: 4 },
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Box
                          sx={{
                            color: `${info.color}.main`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            mx: { xs: 'auto', sm: 0 },
                          }}
                        >
                          {React.cloneElement(info.icon, { sx: { fontSize: { xs: 20, md: 24 } } })}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 0.5, 
                              color: 'text.primary',
                              fontSize: { xs: '1rem', md: '1.25rem' },
                            }}
                          >
                            {info.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 500, 
                              color: 'text.primary', 
                              mb: 0.5,
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              wordBreak: 'break-word',
                            }}
                          >
                            {info.content}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.85rem', md: '0.875rem' },
                            }}
                          >
                            {info.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Card sx={{ mt: 4, borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 4, bgcolor: 'primary.light' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Find Us
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
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

        {/* Additional Information */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, bgcolor: 'primary.light' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Quick Response
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                  We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly at{' '}
                  <strong>+94 71 259 9785</strong>.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, bgcolor: 'info.light' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Online Support
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                  Our online platform is available 24/7 for your convenience. You can access all our services,
                  including prescription uploads and order tracking, at any time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
            icon={snackbarSeverity === 'success' ? <CheckCircle /> : null}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Contact;

