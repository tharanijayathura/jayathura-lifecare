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
import { LocationOn, Phone, Email, AccessTime, Send, CheckCircle } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    console.log('Contact form submitted:', formData);

    setSnackbarMessage('Thank you! Your message has been sent. We will get back to you soon.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const contactInfo = [
    { icon: <Phone />, title: 'Phone', content: '+94 71 259 9785', subtitle: 'Call us anytime', color: 'primary' },
    { icon: <Email />, title: 'Email', content: 'support@jayathuralifecare.com', subtitle: 'Send us an email', color: 'info' },
    { icon: <LocationOn />, title: 'Address', content: 'Kamburupitiya, Matara, Sri Lanka', subtitle: 'Visit our location', color: 'primary' },
    { icon: <AccessTime />, title: 'Business Hours', content: 'Monday - Sunday: 8:00 AM - 8:00 PM', subtitle: '24/7 Online Support', color: 'info' },
  ];

  // ✅ Alignment & modern layout helpers (NO color/font changes)
  const sx = {
    page: {
      bgcolor: 'background.default',
      minHeight: '100vh',
      pt: { xs: 2, md: 4 },
      pb: { xs: 4, md: 8 },
    },
    container: { px: { xs: 2, sm: 3 } },
    hero: { textAlign: 'center', mb: { xs: 4, md: 6 } },
    heroText: {
      color: 'text.secondary',
      maxWidth: 820,
      mx: 'auto',
      lineHeight: 1.8,
      fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' },
      px: { xs: 1, sm: 0 },
    },
    grid: {
      alignItems: 'stretch',
      mb: { xs: 3, md: 4 },
    },
    card: { borderRadius: 3, height: '100%' },
    cardPad: { p: { xs: 2.5, sm: 3, md: 4 } },
    titleH4: {
      fontWeight: 700,
      mb: { xs: 2, md: 2.5 },
      color: 'text.primary',
      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
      textAlign: 'left',
    },
    titleH5: {
      fontWeight: 700,
      mb: { xs: 2, md: 2.5 },
      color: 'text.primary',
      fontSize: { xs: '1.25rem', md: '1.5rem' },
      textAlign: 'left',
    },
    subtleText: {
      color: 'text.secondary',
      mb: { xs: 2.5, md: 3 },
      fontSize: { xs: '0.85rem', md: '0.875rem' },
      lineHeight: 1.7,
    },
    formGrid: { mt: 0.5 },
    tf: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover fieldset': { borderColor: 'primary.main' },
      },
    },
    infoPaper: (color) => ({
      p: { xs: 2, sm: 2.5, md: 3 },
      borderRadius: 2,
      bgcolor: `${color}.light`,
      border: '1px solid',
      borderColor: `${color}.main`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%',
      '&:hover': {
        transform: { xs: 'none', sm: 'translateY(-4px)' },
        boxShadow: { xs: 1, sm: 4 },
      },
    }),
    infoRow: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '52px 1fr' }, // ✅ perfect alignment
      gap: { xs: 1.25, sm: 2 },
      alignItems: 'start',
      textAlign: { xs: 'center', sm: 'left' },
    },
    iconBox: (color) => ({
      color: `${color}.main`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: 2,
      bgcolor: 'background.paper',
      mx: { xs: 'auto', sm: 0 },
    }),
    infoTitle: {
      fontWeight: 600,
      mb: 0.5,
      color: 'text.primary',
      fontSize: { xs: '1rem', md: '1.15rem' },
      lineHeight: 1.2,
    },
    infoContent: {
      fontWeight: 500,
      color: 'text.primary',
      mb: 0.5,
      fontSize: { xs: '0.9rem', md: '1rem' },
      wordBreak: 'break-word',
      lineHeight: 1.5,
    },
    infoSub: {
      color: 'text.secondary',
      fontSize: { xs: '0.85rem', md: '0.875rem' },
      lineHeight: 1.6,
    },
    rightColumnWrap: {
      position: { md: 'sticky' },
      top: { md: 96 }, // ✅ stays aligned while scrolling (modern feel)
      alignSelf: 'start',
    },
    chatCardPad: { p: { xs: 2.5, sm: 3 } },
    button: {
      py: { xs: 1.25, md: 1.5 },
      px: { xs: 3, md: 4 },
      fontSize: { xs: '0.9rem', md: '1rem' },
      fontWeight: 600,
      borderRadius: 2,
    },
    extraGrid: { mt: { xs: 2, md: 3 } },
    extraCardPad: { p: { xs: 2.5, sm: 3, md: 4 } },
  };

  return (
    <>
      <Navbar />

      <Box sx={sx.page}>
        <Container maxWidth="lg" sx={sx.container}>
          <PageHeader title="Contact Us" showBack={false} />

          {/* Hero */}
          <Box sx={sx.hero}>
            <Typography variant="h6" sx={sx.heroText}>
              We&apos;re here to help! Get in touch with our team for any questions, support, or inquiries.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={sx.grid}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card sx={sx.card}>
                <CardContent sx={sx.cardPad}>
                  <Typography variant="h4" sx={sx.titleH4}>
                    Send us a Message
                  </Typography>

                  <Typography variant="body2" sx={sx.subtleText}>
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </Typography>

                  <Divider sx={{ mb: { xs: 2.5, md: 3 } }} />

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={sx.formGrid}>
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
                          sx={sx.tf}
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
                          sx={sx.tf}
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
                          sx={sx.tf}
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
                          sx={sx.tf}
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
                          sx={sx.tf}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size={isMobile ? 'medium' : 'large'}
                          startIcon={<Send />}
                          fullWidth
                          sx={sx.button}
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
              <Box sx={sx.rightColumnWrap}>
                <Typography variant="h5" sx={sx.titleH5}>
                  Get in Touch
                </Typography>

                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {contactInfo.map((info, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={sx.infoPaper(info.color)}>
                        <Box sx={sx.infoRow}>
                          <Box sx={sx.iconBox(info.color)}>
                            {React.cloneElement(info.icon, { sx: { fontSize: { xs: 20, md: 24 } } })}
                          </Box>

                          <Box>
                            <Typography variant="h6" sx={sx.infoTitle}>
                              {info.title}
                            </Typography>

                            <Typography variant="body1" sx={sx.infoContent}>
                              {info.content}
                            </Typography>

                            <Typography variant="body2" sx={sx.infoSub}>
                              {info.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Live Chat Support */}
                <Card sx={{ borderRadius: 3, mt: { xs: 2, md: 3 } }}>
                  <CardContent sx={sx.chatCardPad}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Live Chat Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                      Need quick assistance? Chat with our team.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/chat')} sx={{ fontWeight: 600, borderRadius: 2 }}>
                      Chat Now
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={sx.extraGrid} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, bgcolor: 'primary.light', height: '100%' }}>
                <CardContent sx={sx.extraCardPad}>
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
              <Card sx={{ borderRadius: 3, bgcolor: 'info.light', height: '100%' }}>
                <CardContent sx={sx.extraCardPad}>
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

          {/* Snackbar */}
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
    </>
  );
};

export default Contact;
