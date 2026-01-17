import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Paper, Divider, Avatar, Chip } from '@mui/material';
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
  LocalPharmacy,
  People,
  TrendingUp,
  Star,
  EmojiEvents,
  HealthAndSafety,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';
import aboutusBg from '../assets/aboutusbg.jpg';

const VALUES = [
  { Icon: Favorite, title: 'Care', description: 'We care deeply about your health and wellbeing' },
  { Icon: CheckCircle, title: 'Reliability', description: 'Dependable service you can trust' },
  { Icon: Visibility, title: 'Transparency', description: 'Clear pricing and honest communication' },
  { Icon: Lightbulb, title: 'Innovation', description: 'Cutting-edge technology for better healthcare' },
  { Icon: Gavel, title: 'Integrity', description: 'Ethical practices in everything we do' },
];

const FEATURES = [
  { Icon: AccessTime, title: '24/7 Online Access', description: 'Access our services anytime, anywhere through our digital platform', color: '#ABE7B2' },
  { Icon: Security, title: 'Secure Prescription Handling', description: 'Your prescriptions are handled with the utmost security and confidentiality', color: '#93BFC7' },
  { Icon: Receipt, title: 'Auto-Generated Billing', description: 'Automated billing system ensures accuracy and saves time', color: '#CBF3BB' },
  { Icon: VerifiedUser, title: 'High-Accuracy Verification', description: 'Expert pharmacists verify every prescription with precision', color: '#ABE7B2' },
  { Icon: DeliveryDining, title: 'Fast Islandwide Delivery', description: 'Quick and reliable delivery service across Sri Lanka', color: '#93BFC7' },
  { Icon: Notifications, title: 'Refill Reminders', description: 'Never miss a dose with automated reminders for chronic patients', color: '#CBF3BB' },
];

const STATS = [
  { number: '10K+', label: 'Happy Patients', Icon: People, color: '#ABE7B2' },
  { number: '50K+', label: 'Orders Delivered', Icon: LocalPharmacy, color: '#93BFC7' },
  { number: '99%', label: 'Satisfaction Rate', Icon: Star, color: '#CBF3BB' },
  { number: '24/7', label: 'Support Available', Icon: HealthAndSafety, color: '#ABE7B2' },
];

const sx = {
  page: {
    minHeight: '100vh',
    pt: { xs: 2, md: 4 },
    pb: { xs: 6, md: 9 },
    position: 'relative',
    background: 'linear-gradient(180deg, #ECF4E8 0%, #FFFFFF 20%, #FFFFFF 80%, #ECF4E8 100%)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${aboutusBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      opacity: 0.15,
      zIndex: 0,
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(171, 231, 178, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 191, 199, 0.15) 0%, transparent 50%)',
      zIndex: 0,
      pointerEvents: 'none',
    },
  },
  section: { mb: { xs: 3, md: 4 } },
  card: { borderRadius: 3 },
  cardPad: { p: { xs: 2.5, sm: 3.25, md: 4 } },

  contentWrap: { maxWidth: 980, mx: 'auto' },

  // ✅ Modern text sizes and alignments
  sectionTitle: {
    fontWeight: 700,
    textAlign: 'center',
    color: 'text.primary',
    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
    mb: { xs: 3, md: 4 },
    letterSpacing: '-0.02em',
  },

  paragraph: {
    lineHeight: 1.85,
    color: 'text.primary',
    fontSize: { xs: '1rem', md: '1.125rem' },
    textAlign: 'left',
    fontWeight: 400,
    mb: { xs: 1.5, md: 2 },
  },

  subtle: {
    color: 'text.secondary',
    lineHeight: 1.8,
    fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.3rem' },
    textAlign: 'center',
    maxWidth: 900,
    mx: 'auto',
    fontWeight: 400,
    mb: { xs: 3, md: 4 },
  },

  listTitle: {
    mb: 2,
    textAlign: { xs: 'center', md: 'left' },
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '1.1rem', md: '1.25rem' },
    letterSpacing: '-0.01em',
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
    borderRadius: 4,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #ABE7B2, #93BFC7, #CBF3BB)',
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
    },
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px) scale(1.02)' },
      boxShadow: '0 12px 40px rgba(171, 231, 178, 0.25)',
      borderColor: 'primary.main',
      '&::before': {
        transform: 'scaleX(1)',
      },
    },
  },

  tilePad: { p: { xs: 2.25, sm: 2.75, md: 3.25 } },

  // ✅ NORMAL titles
  tileTitle: {
    fontWeight: 700,
    color: 'text.primary',
    fontSize: { xs: '1.15rem', md: '1.35rem' },
    mb: 1,
    letterSpacing: '-0.01em',
  },

  tileText: {
    color: 'text.secondary',
    lineHeight: 1.8,
    fontSize: { xs: '0.95rem', md: '1.05rem' },
    fontWeight: 400,
  },

  missionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'flex-start' },
    gap: 1.5,
    mb: { xs: 1.5, md: 2 },
  },

  // ✅ Modern mission title
  missionTitle: {
    fontWeight: 700,
    color: 'text.primary',
    fontSize: { xs: '1.5rem', md: '1.875rem' },
    textAlign: { xs: 'center', md: 'left' },
    letterSpacing: '-0.02em',
  },

  ctaTitle: {
    fontWeight: 700,
    color: 'text.primary',
    fontSize: { xs: '1.5rem', md: '2rem' },
    mb: 1.5,
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },

  ctaText: {
    color: 'text.secondary',
    maxWidth: 800,
    mx: 'auto',
    lineHeight: 1.85,
    fontSize: { xs: '1.05rem', md: '1.15rem' },
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

const ValueCard = ({ Icon, title, description, index }) => (
  <Paper elevation={0} sx={sx.simpleCard}>
    <Box sx={{ ...sx.tilePad, textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 1.5,
          color: 'primary.main',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(171, 231, 178, 0.2), rgba(147, 191, 199, 0.2))',
            zIndex: -1,
            animation: `pulseAbout 2s ease-in-out infinite ${index * 0.2}s`,
          },
        }}
      >
        <Icon sx={{ fontSize: { xs: 40, md: 48 }, transition: 'transform 0.3s', '&:hover': { transform: 'rotate(360deg) scale(1.1)' } }} />
      </Box>
      <Typography sx={sx.tileTitle}>{title}</Typography>
      <Typography sx={sx.tileText}>{description}</Typography>
    </Box>
  </Paper>
);

const FeatureCard = ({ Icon, title, description, color, index }) => (
  <Paper
    elevation={0}
    sx={{
      ...sx.simpleCard,
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderColor: `${color}40`,
    }}
  >
    <Box sx={{ ...sx.tilePad, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1.5,
          color: color,
          p: 1.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          width: 'fit-content',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: `0 4px 12px ${color}40`,
          },
        }}
      >
        <Icon sx={{ fontSize: { xs: 32, md: 40 } }} />
      </Box>
      <Typography sx={sx.tileTitle}>{title}</Typography>
      <Typography sx={{ ...sx.tileText, flexGrow: 1 }}>{description}</Typography>
    </Box>
  </Paper>
);

const StatCard = ({ number, label, Icon, color }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 4,
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: '#2C3E50',
      textAlign: 'center',
      p: { xs: 2.5, md: 3.5 },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        transition: 'all 0.5s',
      },
      '&:hover': {
        transform: 'translateY(-8px) scale(1.05)',
        boxShadow: `0 12px 40px ${color}60`,
        '&::before': {
          transform: 'scale(1.5)',
          opacity: 0.3,
        },
      },
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            width: { xs: 56, md: 72 },
            height: { xs: 56, md: 72 },
            color: '#2C3E50',
          }}
        >
          <Icon sx={{ fontSize: { xs: 32, md: 40 } }} />
        </Avatar>
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 0.5,
          fontSize: { xs: '2rem', md: '3rem' },
          background: 'linear-gradient(135deg, #2C3E50, #546E7A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {number}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
        {label}
      </Typography>
    </Box>
  </Card>
);

export default function About() {
  return (
    <>
      <Navbar />

      <Box sx={sx.page}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
          <PageHeader title="About Jayathura LifeCare" showBack={false} />

          {/* Hero Section with Animation */}
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 4, md: 6 },
              position: 'relative',
              py: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, rgba(171, 231, 178, 0.1) 0%, rgba(147, 191, 199, 0.1) 100%)',
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'primary.light',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                px: 2,
                py: 0.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ABE7B2, #93BFC7)',
                color: '#2C3E50',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Trusted Healthcare Partner
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                ...sx.subtle,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                fontWeight: 500,
                maxWidth: 1000,
              }}
            >
              A modern digital healthcare platform revolutionizing pharmaceutical services in Sri Lanka
            </Typography>
          </Box>

          {/* Statistics Section */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 5, md: 7 } }}>
            {STATS.map((stat, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>

          {/* Company Overview */}
          <Card
            sx={{
              ...sx.card,
              ...sx.section,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(171, 231, 178, 0.3)',
            }}
          >
            <CardContent sx={sx.cardPad}>
              <Box sx={sx.contentWrap}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: { xs: 2, md: 3 },
                      color: 'text.primary',
                      fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.75rem' },
                      textAlign: 'center',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Company Overview
                  </Typography>
                </Box>

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
              <Card
                sx={{
                  ...sx.card,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 100%)',
                  border: '2px solid #ABE7B2',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(171, 231, 178, 0.2)',
                  },
                }}
              >
                <CardContent sx={{ ...sx.cardPad, position: 'relative', zIndex: 1 }}>
                  <Box sx={sx.missionHeader}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #ABE7B2, #CBF3BB)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Flag sx={{ fontSize: { xs: 32, md: 40 }, color: '#2C3E50' }} />
                    </Box>
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
              <Card
                sx={{
                  ...sx.card,
                  height: '100%',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  border: '2px solid #90CAF9',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(144, 202, 249, 0.2)',
                  },
                }}
              >
                <CardContent sx={{ ...sx.cardPad, position: 'relative', zIndex: 1 }}>
                  <Box sx={sx.missionHeader}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #90CAF9, #BBDEFB)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Visibility sx={{ fontSize: { xs: 32, md: 40 }, color: '#2C3E50' }} />
                    </Box>
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
          <Card
            sx={{
              ...sx.card,
              ...sx.section,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 244, 232, 0.3) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent sx={sx.cardPad}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Chip
                  icon={<Favorite sx={{ color: '#ABE7B2' }} />}
                  label="What We Stand For"
                  sx={{
                    mb: 2,
                    px: 2,
                    py: 3,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #ABE7B2, #CBF3BB)',
                    color: '#2C3E50',
                  }}
                />
                <SectionTitle>Our Values</SectionTitle>
              </Box>
              <Box sx={sx.contentWrap}>
                <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
                  {VALUES.map((value, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ValueCard {...value} index={index} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <Card
            sx={{
              ...sx.card,
              ...sx.section,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 244, 232, 0.3) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent sx={sx.cardPad}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Chip
                  icon={<TrendingUp sx={{ color: '#93BFC7' }} />}
                  label="Why We're Different"
                  sx={{
                    mb: 2,
                    px: 2,
                    py: 3,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #93BFC7, #ABE7B2)',
                    color: '#2C3E50',
                  }}
                />
                <SectionTitle>Why Choose Us</SectionTitle>
              </Box>
              <Box sx={sx.contentWrap}>
                <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
                  {FEATURES.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <FeatureCard {...feature} index={index} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ECF4E8 0%, #CBF3BB 50%, #ABE7B2 100%)',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid rgba(171, 231, 178, 0.3)',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                sx={{
                  ...sx.ctaTitle,
                  color: 'text.primary',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
              >
                Ready to Experience Modern Healthcare?
              </Typography>
              <Typography
                sx={{
                  ...sx.ctaText,
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 500,
                }}
              >
                Join thousands of satisfied patients who trust Jayathura LifeCare for their pharmaceutical needs.
              </Typography>
            </Box>
          </Box>
        </Container>

      </Box>
    </>
  );
}
