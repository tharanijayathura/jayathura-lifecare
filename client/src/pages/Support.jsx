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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';

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
      color: 'primary',
    },
    {
      title: 'Contact Us',
      description: 'Reach out via phone or email',
      icon: <Phone />,
      action: () => navigate('/contact'),
      color: 'info',
    },
    {
      title: 'Upload Prescription',
      description: 'Submit your prescription for verification',
      icon: <UploadFile />,
      action: () => (user ? navigate('/patient') : navigate('/login')),
      color: 'success',
    },
    {
      title: 'Browse Medicines',
      description: 'Shop OTC medicines and healthcare products',
      icon: <ShoppingCart />,
      action: () => (user ? navigate('/patient') : navigate('/register')),
      color: 'warning',
    },
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageHeader title="Support Center" showBack={false} />
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Help sx={{ fontSize: { xs: 48, sm: 56, md: 64 }, color: 'primary.main', mb: 2 }} />
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
            Find answers to common questions, get help, and learn how to use Jayathura LifeCare
          </Typography>
        </Box>

        {/* Quick Links */}
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 4, md: 6 } }}>
          {quickLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-4px)' },
                    boxShadow: { xs: 2, sm: 4 },
                  },
                }}
                onClick={link.action}
              >
                <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Box sx={{ color: `${link.color}.main`, mb: { xs: 1.5, md: 2 }, display: 'flex', justifyContent: 'center' }}>
                    {React.cloneElement(link.icon, { sx: { fontSize: { xs: 32, md: 40 } } })}
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
                    {link.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.85rem', md: '0.875rem' },
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
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
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
            Frequently Asked Questions
          </Typography>

          {faqCategories.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 1.5, md: 2 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                <Box sx={{ color: 'primary.main' }}>{React.cloneElement(category.icon, { sx: { fontSize: { xs: 24, md: 28 } } })}</Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {category.title}
                </Typography>
              </Box>
              <Divider sx={{ mb: { xs: 1.5, md: 2 } }} />
              {category.questions.map((faq, faqIndex) => (
                <Accordion
                  key={faqIndex}
                  sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'primary.light' },
                      px: { xs: 1.5, md: 2 },
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500, 
                        color: 'text.primary',
                        fontSize: { xs: '0.95rem', md: '1.25rem' },
                      }}
                    >
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'background.default', px: { xs: 1.5, md: 2 } }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.primary', 
                        lineHeight: 1.8,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>

        {/* Contact Support */}
        <Card sx={{ borderRadius: 3, bgcolor: 'primary.light' }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 }, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 1.5, md: 2 }, 
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Still Need Help?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary', 
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Our support team is here to help you. Get in touch with us through any of these channels.
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={() => navigate('/chat')}
                  fullWidth
                  sx={{ 
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
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
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
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
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.85rem', md: '0.875rem' },
                  }}
                >
                  Send Email
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: { xs: 3, md: 4 }, pt: { xs: 2, md: 3 }, borderTop: 1, borderColor: 'divider' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 1,
                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                }}
              >
                Phone: <strong>+94 71 259 9785</strong>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                  wordBreak: 'break-word',
                }}
              >
                Email: <strong>support@jayathuralifecare.com</strong>
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

