import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  LocalPharmacy,
  ExpandMore,
  Help,
  QuestionAnswer,
  Chat as ChatIcon,
  Phone,
  Email,
  Description,
  ShoppingCart,
  UploadFile,
  DeliveryDining,
  Payment,
  SupportAgent,
  LiveHelp,
  AutoAwesome,
  HealthAndSafety,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';
import medicareImage from '../assets/medicare.jpg';

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <Help />,
      questions: [
        {
          q: 'How do I register for an account?',
          a: 'Click on "Get Started" or "Register" in the navigation menu. Fill in your details including name, email, password, phone number, and select your role. Patients are automatically approved and can start using the platform immediately.',
        },
        {
          q: 'Can I register as a pharmacist or admin?',
          a: 'Yes, you can register as a pharmacist, admin, or delivery person. However, these roles require approval from the super admin. You will receive a notification once your account is approved.',
        },
        {
          q: 'How do I login?',
          a: 'Click on "Login" in the navigation menu and enter your email and password. After successful login, you will be redirected to your role-specific portal.',
        },
      ],
    },
    {
      title: 'Prescriptions',
      icon: <UploadFile />,
      questions: [
        {
          q: 'How do I upload a prescription?',
          a: 'After logging in as a patient, go to the "Upload Prescription" tab in your Patient Portal. Click the upload button, select your prescription file (PDF or image), and submit. Our pharmacists will verify it within 24 hours.',
        },
        {
          q: 'What file formats are accepted for prescriptions?',
          a: 'We accept PDF, JPG, PNG, and other common image formats. Make sure the prescription is clear and readable.',
        },
        {
          q: 'How long does prescription verification take?',
          a: 'Our pharmacists typically verify prescriptions within 24 hours. You will be notified once your prescription is verified.',
        },
      ],
    },
    {
      title: 'Shopping & Orders',
      icon: <ShoppingCart />,
      questions: [
        {
          q: 'Can I buy medicines without a prescription?',
          a: 'Yes! You can browse and purchase over-the-counter (OTC) medicines, vitamins, herbal products, and medical supplies without a prescription. Items that require a prescription are clearly marked.',
        },
        {
          q: 'How do I add items to my cart?',
          a: 'Browse the medicine or grocery catalog, use filters to find what you need, and click "Add to Cart" on any item. You can adjust quantities in your shopping cart.',
        },
        {
          q: 'Can I attach a prescription to my order?',
          a: 'Yes! When submitting your order, you can attach a previously uploaded prescription. This helps our pharmacists process prescription medications faster.',
        },
      ],
    },
    {
      title: 'Delivery',
      icon: <DeliveryDining />,
      questions: [
        {
          q: 'Do you deliver islandwide?',
          a: 'Yes, we offer fast islandwide delivery across Sri Lanka. Delivery typically takes 2-3 business days depending on your location.',
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order is confirmed, you can track it in real-time through your Patient Portal under "Order History".',
        },
        {
          q: 'What are the delivery charges?',
          a: 'Delivery charges vary based on your location. The exact amount will be shown during checkout before you confirm your order.',
        },
      ],
    },
    {
      title: 'Payments',
      icon: <Payment />,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept cash on delivery (COD), credit/debit cards, and secure online payments through our payment gateway.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use secure payment gateways and never store your full card details. All transactions are encrypted and secure.',
        },
        {
          q: 'When do I pay for my order?',
          a: 'For cash on delivery, you pay when you receive your order. For card payments, payment is processed immediately upon order confirmation.',
        },
      ],
    },
    {
      title: 'Chat & Support',
      icon: <ChatIcon />,
      questions: [
        {
          q: 'How do I chat with a pharmacist?',
          a: 'Click on the floating chat button (bottom-right) in your Patient Portal, or go to the Chat page. Our chatbot will assist you immediately, and a pharmacist will join the conversation when needed.',
        },
        {
          q: 'Is the chat available 24/7?',
          a: 'Yes! Our online chat platform is available 24/7. The chatbot responds immediately, and pharmacists respond during business hours (8 AM - 8 PM).',
        },
        {
          q: 'Can I get help with medication questions?',
          a: 'Absolutely! Our pharmacists are available through chat to answer any questions about medications, dosages, interactions, and general health advice.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'Start Chatting',
      description: 'Get instant help from our pharmacists',
      icon: <ChatIcon />,
      action: () => navigate('/chat'),
      color: '#ABE7B2',
      gradient: 'linear-gradient(135deg, #ABE7B2 0%, #CBF3BB 100%)',
    },
    {
      title: 'Contact Us',
      description: 'Reach out via phone or email',
      icon: <Phone />,
      action: () => navigate('/contact'),
      color: '#93BFC7',
      gradient: 'linear-gradient(135deg, #93BFC7 0%, #BBDEFB 100%)',
    },
    {
      title: 'Upload Prescription',
      description: 'Submit your prescription for verification',
      icon: <UploadFile />,
      action: () => (user ? navigate('/patient') : navigate('/login')),
      color: '#CBF3BB',
      gradient: 'linear-gradient(135deg, #CBF3BB 0%, #ABE7B2 100%)',
    },
    {
      title: 'Browse Medicines',
      description: 'Shop OTC medicines and healthcare products',
      icon: <ShoppingCart />,
      action: () => (user ? navigate('/patient') : navigate('/register')),
      color: '#90CAF9',
      gradient: 'linear-gradient(135deg, #90CAF9 0%, #BBDEFB 100%)',
    },
  ];

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          pt: { xs: 2, md: 4 },
          pb: { xs: 4, md: 8 },
          position: 'relative',
          background: 'linear-gradient(180deg, #ECF4E8 0%, #FFFFFF 20%, #FFFFFF 80%, #ECF4E8 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(171, 231, 178, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147, 191, 199, 0.15) 0%, transparent 50%)',
            zIndex: 0,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
          <PageHeader title="Support Center" showBack={false} />
          
          {/* Hero Section with Medical Image */}
          <Box
            sx={{
              mb: { xs: 5, md: 7 },
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              minHeight: { xs: 400, md: 500 },
            }}
          >
            <Grid container sx={{ height: '100%', minHeight: { xs: 400, md: 500 } }}>
              {/* Left Side - Content */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: { xs: 4, md: 6 },
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    px: 2.5,
                    py: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(171, 231, 178, 0.2), rgba(147, 191, 199, 0.2))',
                    border: '1px solid rgba(171, 231, 178, 0.3)',
                    width: 'fit-content',
                  }}
                >
                  <SupportAgent sx={{ fontSize: 20, color: '#ABE7B2' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#ABE7B2' }}>
                    24/7 Support Available
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#FFFFFF',
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                    lineHeight: 1.2,
                  }}
                >
                  How Can We Help You?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    fontWeight: 400,
                    mb: 3,
                  }}
                >
                  Find answers to common questions, get help, and learn how to use Jayathura LifeCare. Our expert team is here to assist you 24/7.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<ChatIcon />}
                    onClick={() => navigate('/chat')}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#ABE7B2',
                      color: '#2C3E50',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#CBF3BB',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Start Chat
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    onClick={() => navigate('/contact')}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: '#ABE7B2',
                      color: '#ABE7B2',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#CBF3BB',
                        backgroundColor: 'rgba(171, 231, 178, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Grid>

              {/* Right Side - Medical Image */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  position: 'relative',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(15, 52, 96, 0.5) 100%)',
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={medicareImage}
                  alt="Medical Care"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 200, md: 300 },
                      height: { xs: 200, md: 300 },
                      borderRadius: '50%',
                      border: '4px solid rgba(171, 231, 178, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      background: 'rgba(171, 231, 178, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <HealthAndSafety
                      sx={{
                        fontSize: { xs: 100, md: 150 },
                        color: '#ABE7B2',
                        opacity: 0.8,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Mobile Image */}
              <Grid
                item
                xs={12}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  position: 'relative',
                  height: 250,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={medicareImage}
                  alt="Medical Care"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.4,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.8) 0%, transparent 100%)',
                  }}
                />
              </Grid>
            </Grid>
          </Box>

        {/* Quick Links */}
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 5, md: 7 } }}>
          {quickLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: 4,
                  background: link.gradient,
                  border: `2px solid ${link.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.5s',
                  },
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-8px) scale(1.02)' },
                    boxShadow: `0 12px 40px ${link.color}60`,
                    '&::before': {
                      transform: 'scale(1.5)',
                      opacity: 0.5,
                    },
                  },
                }}
                onClick={link.action}
              >
                <CardContent sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3, md: 3.5 }, position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{
                      mb: { xs: 2, md: 2.5 },
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 64, md: 80 },
                        height: { xs: 64, md: 80 },
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        color: '#2C3E50',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      }}
                    >
                      {React.cloneElement(link.icon, { sx: { fontSize: { xs: 32, md: 40 } } })}
                    </Avatar>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1, 
                      color: '#2C3E50',
                      fontSize: { xs: '1.1rem', md: '1.35rem' },
                    }}
                  >
                    {link.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#546E7A',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 500,
                    }}
                  >
                    {link.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQs */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Chip
              icon={<LiveHelp sx={{ color: '#ABE7B2' }} />}
              label="Common Questions"
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
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                textAlign: 'center', 
                color: 'text.primary',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #2C3E50, #93BFC7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              Find quick answers to the most common questions about our services
            </Typography>
          </Box>

          {faqCategories.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: { xs: 4, md: 5 } }}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 244, 232, 0.3) 100%)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(171, 231, 178, 0.3)',
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 1.5, sm: 2 },
                      mb: { xs: 2, md: 2.5 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                  >
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
                      {React.cloneElement(category.icon, {
                        sx: { fontSize: { xs: 28, md: 36 }, color: '#2C3E50' },
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#2C3E50',
                        fontSize: { xs: '1.35rem', md: '1.75rem' },
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: { xs: 2, md: 2.5 } }} />
                  {category.questions.map((faq, faqIndex) => (
                    <Accordion
                      key={faqIndex}
                      sx={{
                        mb: 1.5,
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(171, 231, 178, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(171, 231, 178, 0.2)',
                          borderColor: 'primary.main',
                        },
                        '&.Mui-expanded': {
                          bgcolor: 'primary.light',
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMore
                            sx={{
                              color: 'primary.main',
                              transition: 'transform 0.3s',
                              '&.Mui-expanded': {
                                transform: 'rotate(180deg)',
                              },
                            }}
                          />
                        }
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          '&:hover': { bgcolor: 'primary.light' },
                          px: { xs: 2, md: 2.5 },
                          py: 1.5,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                          <AutoAwesome
                            sx={{
                              fontSize: 20,
                              color: 'primary.main',
                              opacity: 0.7,
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              fontSize: { xs: '1rem', md: '1.15rem' },
                            }}
                          >
                            {faq.q}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          bgcolor: 'background.default',
                          px: { xs: 2, md: 2.5 },
                          pb: 2.5,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            lineHeight: 1.85,
                            fontSize: { xs: '0.95rem', md: '1.05rem' },
                            fontWeight: 400,
                          }}
                        >
                          {faq.a}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Contact Support */}
        <Card
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ABE7B2 0%, #93BFC7 50%, #CBF3BB 100%)',
            boxShadow: '0 8px 32px rgba(171, 231, 178, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              animation: 'floatAbout 6s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              animation: 'floatAbout 8s ease-in-out infinite reverse',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <SupportAgent
              sx={{
                fontSize: { xs: 56, md: 72 },
                color: '#2C3E50',
                mb: 2,
                animation: 'floatAbout 3s ease-in-out infinite',
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, md: 2 },
                color: '#2C3E50',
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Still Need Help?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#546E7A',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1rem', md: '1.15rem' },
                fontWeight: 500,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Our support team is here to help you. Get in touch with us through any of these channels.
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} justifyContent="center" sx={{ mb: { xs: 3, md: 4 } }}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={() => navigate('/chat')}
                  fullWidth
                  sx={{
                    py: { xs: 1.5, md: 1.75 },
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundColor: '#2C3E50',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)',
                    '&:hover': {
                      backgroundColor: '#4A5568',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(44, 62, 80, 0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Start Chat
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={() => navigate('/contact')}
                  fullWidth
                  sx={{
                    py: { xs: 1.5, md: 1.75 },
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: '#2C3E50',
                    borderWidth: 2,
                    color: '#2C3E50',
                    '&:hover': {
                      backgroundColor: 'rgba(44, 62, 80, 0.1)',
                      borderColor: '#2C3E50',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Contact Us
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  href="mailto:support@jayathuralifecare.com"
                  fullWidth
                  sx={{
                    py: { xs: 1.5, md: 1.75 },
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: '#2C3E50',
                    borderWidth: 2,
                    color: '#2C3E50',
                    '&:hover': {
                      backgroundColor: 'rgba(44, 62, 80, 0.1)',
                      borderColor: '#2C3E50',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Send Email
                </Button>
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: { xs: 3, md: 4 },
                pt: { xs: 3, md: 4 },
                borderTop: '2px solid rgba(44, 62, 80, 0.2)',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#2C3E50',
                  mb: 1,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  fontWeight: 600,
                }}
              >
                📞 Phone: <strong>+94 71 259 9785</strong>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#2C3E50',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  wordBreak: 'break-word',
                  fontWeight: 600,
                }}
              >
                ✉️ Email: <strong>support@jayathuralifecare.com</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </>
  );
};

export default Support;

