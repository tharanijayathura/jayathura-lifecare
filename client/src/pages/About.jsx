import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Paper, Divider } from '@mui/material';
import {
  VerifiedUser,
  AccessTime,
  Security,
  Receipt,
  DeliveryDining,
  Notifications,
  Favorite,
  CheckCircle,
  Lightbulb,
  Gavel,
  Visibility,
  Flag,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';

const VALUES = [
  { Icon: Favorite, title: 'Care', description: 'We care deeply about your health and wellbeing' },
  { Icon: CheckCircle, title: 'Reliability', description: 'Dependable service you can trust' },
  { Icon: Visibility, title: 'Transparency', description: 'Clear pricing and honest communication' },
  { Icon: Lightbulb, title: 'Innovation', description: 'Cutting-edge technology for better healthcare' },
  { Icon: Gavel, title: 'Integrity', description: 'Ethical practices in everything we do' },
];

const FEATURES = [
  { Icon: AccessTime, title: '24/7 Online Access', description: 'Access our services anytime, anywhere through our digital platform' },
  { Icon: Security, title: 'Secure Prescription Handling', description: 'Your prescriptions are handled with the utmost security and confidentiality' },
  { Icon: Receipt, title: 'Auto-Generated Billing', description: 'Automated billing system ensures accuracy and saves time' },
  { Icon: VerifiedUser, title: 'High-Accuracy Verification', description: 'Expert pharmacists verify every prescription with precision' },
  { Icon: DeliveryDining, title: 'Fast Islandwide Delivery', description: 'Quick and reliable delivery service across Sri Lanka' },
  { Icon: Notifications, title: 'Refill Reminders', description: 'Never miss a dose with automated reminders for chronic patients' },
];

const sx = {
  page: {
    bgcolor: 'background.default',
    minHeight: '100vh',
    pt: { xs: 2, md: 4 },
    pb: { xs: 6, md: 9 },
  },
  section: { mb: { xs: 3, md: 4 } },
  card: { borderRadius: 3 },
  cardPad: { p: { xs: 2.5, sm: 3.25, md: 4 } },

  contentWrap: { maxWidth: 980, mx: 'auto' },

  // ✅ NORMAL (not heavy)
  sectionTitle: {
    fontWeight: 600,
    textAlign: 'center',
    color: 'text.primary',
    fontSize: { xs: '1.45rem', sm: '1.75rem', md: '2.05rem' },
    mb: { xs: 2.25, md: 3 },
  },

  paragraph: {
    lineHeight: 1.9,
    color: 'text.primary',
    fontSize: { xs: '0.95rem', md: '1rem' },
    textAlign: 'left',
    fontWeight: 400,
  },

  subtle: {
    color: 'text.secondary',
    lineHeight: 1.9,
    fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.2rem' },
    textAlign: 'center',
    maxWidth: 820,
    mx: 'auto',
    fontWeight: 400,
  },

  listTitle: {
    mb: 1.5,
    textAlign: { xs: 'center', md: 'left' },
    fontWeight: 500,
    color: 'text.primary',
    fontSize: { xs: '0.95rem', md: '1rem' },
  },

  serviceRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.25,
    py: 0.25,
  },

  iconTick: { color: 'primary.main', fontSize: 20, mt: '2px' },

  simpleCard: {
    height: '100%',
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-4px)' },
      boxShadow: { xs: 0, sm: 4 },
      borderColor: 'primary.main',
    },
  },

  tilePad: { p: { xs: 2.25, sm: 2.75, md: 3.25 } },

  // ✅ NORMAL titles
  tileTitle: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '1.05rem', md: '1.2rem' },
    mb: 0.75,
  },

  tileText: {
    color: 'text.secondary',
    lineHeight: 1.75,
    fontSize: { xs: '0.9rem', md: '0.92rem' },
    fontWeight: 400,
  },

  missionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'flex-start' },
    gap: 1.5,
    mb: { xs: 1.5, md: 2 },
  },

  // ✅ NORMAL
  missionTitle: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '1.25rem', md: '1.5rem' },
    textAlign: { xs: 'center', md: 'left' },
  },

  ctaTitle: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '1.25rem', md: '1.6rem' },
    mb: 1.25,
    textAlign: 'center',
  },

  ctaText: {
    color: 'text.secondary',
    maxWidth: 760,
    mx: 'auto',
    lineHeight: 1.85,
    fontSize: { xs: '0.95rem', md: '1rem' },
    textAlign: 'center',
    fontWeight: 400,
  },
};

const SectionTitle = ({ children }) => <Typography sx={sx.sectionTitle}>{children}</Typography>;

const ServiceItem = ({ text }) => (
  <Box sx={sx.serviceRow}>
    <CheckCircle sx={sx.iconTick} />
    <Typography
      variant="body2"
      sx={{
        color: 'text.primary',
        lineHeight: 1.7,
        fontSize: { xs: '0.9rem', md: '0.95rem' },
        fontWeight: 400,
      }}
    >
      {text}
    </Typography>
  </Box>
);

const ValueCard = ({ Icon, title, description }) => (
  <Paper elevation={0} sx={sx.simpleCard}>
    <Box sx={{ ...sx.tilePad, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.3, color: 'primary.main' }}>
        <Icon sx={{ fontSize: { xs: 34, md: 42 } }} />
      </Box>
      <Typography sx={sx.tileTitle}>{title}</Typography>
      <Typography sx={sx.tileText}>{description}</Typography>
    </Box>
  </Paper>
);

const FeatureCard = ({ Icon, title, description }) => (
  <Paper elevation={0} sx={sx.simpleCard}>
    <Box sx={{ ...sx.tilePad, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.3, color: 'primary.main' }}>
        <Icon sx={{ fontSize: { xs: 30, md: 36 } }} />
      </Box>
      <Typography sx={sx.tileTitle}>{title}</Typography>
      <Typography sx={{ ...sx.tileText, flexGrow: 1 }}>{description}</Typography>
    </Box>
  </Paper>
);

export default function About() {
  return (
    <>
      <Navbar />

      <Box sx={sx.page}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <PageHeader title="About Jayathura LifeCare" showBack={false} />

          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3.5, md: 5 } }}>
            <Typography variant="h6" sx={sx.subtle}>
              A modern digital healthcare platform revolutionizing pharmaceutical services in Sri Lanka
            </Typography>
          </Box>

          {/* Company Overview */}
          <Card sx={{ ...sx.card, ...sx.section }}>
            <CardContent sx={sx.cardPad}>
              <Box sx={sx.contentWrap}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 2, md: 2.5 },
                    color: 'text.primary',
                    fontSize: { xs: '1.55rem', sm: '1.8rem', md: '2.1rem' },
                    textAlign: 'center',
                  }}
                >
                  Company Overview
                </Typography>

                <Typography sx={{ ...sx.paragraph, mb: { xs: 2, md: 2.5 } }}>
                  <strong>Jayathura LifeCare</strong> is a comprehensive digital healthcare platform designed to transform how Sri Lankans access
                  pharmaceutical services. Founded by <strong>Tharani Jayathura</strong>, our platform combines cutting-edge technology with
                  compassionate healthcare to deliver exceptional service to patients across the island.
                </Typography>

                <Divider sx={{ my: { xs: 2, md: 2.5 } }} />

                <Typography sx={sx.listTitle}>We offer a complete suite of healthcare services including:</Typography>

                <Grid container spacing={{ xs: 1.25, md: 2 }}>
                  {[
                    'Online pharmacy services',
                    'Prescription upload & verification',
                    'Chronic patient refill plans',
                    'Delivery tracking',
                    'Secure online payments',
                    'Patient–pharmacist communication',
                  ].map((service, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <ServiceItem text={service} />
                    </Grid>
                  ))}
                </Grid>

                <Typography
                  sx={{
                    ...sx.paragraph,
                    mt: { xs: 2.5, md: 3 },
                    fontStyle: 'italic',
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontWeight: 400,
                  }}
                >
                  As a modern healthcare solution from Sri Lanka, we are committed to making quality pharmaceutical care accessible, convenient,
                  and reliable for everyone.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={sx.section} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card sx={{ ...sx.card, height: '100%', bgcolor: 'primary.light' }}>
                <CardContent sx={sx.cardPad}>
                  <Box sx={sx.missionHeader}>
                    <Flag sx={{ fontSize: { xs: 28, md: 32 }, color: 'primary.main' }} />
                    <Typography sx={sx.missionTitle}>Our Mission</Typography>
                  </Box>
                  <Typography sx={{ ...sx.paragraph, textAlign: { xs: 'center', md: 'left' } }}>
                    To provide accessible, reliable, and fast pharmaceutical services that improve patient convenience and safety through
                    innovative technology. We strive to bridge the gap between traditional pharmacy services and modern digital healthcare
                    solutions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ ...sx.card, height: '100%', bgcolor: 'info.light' }}>
                <CardContent sx={sx.cardPad}>
                  <Box sx={sx.missionHeader}>
                    <Visibility sx={{ fontSize: { xs: 28, md: 32 }, color: 'info.main' }} />
                    <Typography sx={sx.missionTitle}>Our Vision</Typography>
                  </Box>
                  <Typography sx={{ ...sx.paragraph, textAlign: { xs: 'center', md: 'left' } }}>
                    To become Sri Lanka&apos;s leading digital healthcare and pharmacy service provider, recognized for excellence in patient
                    care, technological innovation, and commitment to improving healthcare accessibility across the nation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Our Values */}
          <Card sx={{ ...sx.card, ...sx.section }}>
            <CardContent sx={sx.cardPad}>
              <SectionTitle>Our Values</SectionTitle>
              <Box sx={sx.contentWrap}>
                <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
                  {VALUES.map((value, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ValueCard {...value} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card sx={{ ...sx.card, ...sx.section }}>
            <CardContent sx={sx.cardPad}>
              <SectionTitle>Why Choose Us</SectionTitle>
              <Box sx={sx.contentWrap}>
                <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
                  {FEATURES.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <FeatureCard {...feature} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <Box sx={{ mt: { xs: 4, md: 6 } }}>
            <Typography sx={sx.ctaTitle}>Ready to Experience Modern Healthcare?</Typography>
            <Typography sx={sx.ctaText}>
              Join thousands of satisfied patients who trust Jayathura LifeCare for their pharmaceutical needs.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
