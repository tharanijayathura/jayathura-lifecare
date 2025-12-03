import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab, Paper, Alert, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import MedicineCatalog from '../components/patient/MedicineCatalog';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';
import GroceryCatalog from '../components/patient/GroceryCatalog';
import ChatWidget from '../components/chat/ChatWidget';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const PatientPortal = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [shopTab, setShopTab] = useState(0);
  const [latestPrescription, setLatestPrescription] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.itemId === item.itemId && cartItem.itemType === item.itemType,
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.itemId === item.itemId && cartItem.itemType === item.itemType
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prev, item];
    });
    setOrderStatus('');
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderSubmit = ({ attachPrescription }) => {
    if (cartItems.length === 0) return;

    const payload = {
      items: cartItems,
      prescription: attachPrescription ? latestPrescription : null,
      patientId: user?._id || user?.id || 'guest',
      submittedAt: new Date().toISOString(),
    };

    console.log('Sending order to pharmacist:', payload);
    setOrderStatus(
      attachPrescription && latestPrescription
        ? 'Order and prescription sent to the pharmacist.'
        : 'Order sent without a prescription. Pharmacist will review.',
    );
    setCartItems([]);
  };

  const handlePrescriptionUploaded = (prescriptionMeta) => {
    setLatestPrescription(prescriptionMeta);
  };

  const tabs = [
    { label: 'Dashboard', component: <DashboardOverview /> },
    {
      label: 'Upload Prescription',
      component: (
        <Box>
          <PrescriptionUpload onUploaded={handlePrescriptionUploaded} />
          {latestPrescription && (
            <Alert severity="info">
              Latest prescription ready to attach: {latestPrescription.fileName || latestPrescription.id}
            </Alert>
          )}
        </Box>
      ),
    },
    {
      label: 'Shop Pharmacy',
      component: (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Alert severity="info" sx={{ mb: 2, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
                medical supplies like cotton wool, masks, and bandages. Use filters to sort by category, price, or brand,
                and add items directly to your cart without a prescription.
              </Alert>
              <Tabs
                value={shopTab}
                onChange={(e, newValue) => setShopTab(newValue)}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 2,
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: 80, sm: 120 },
                  },
                }}
                variant={isMobile ? 'fullWidth' : 'standard'}
              >
                <Tab label="OTC Medicines" />
                <Tab label="Groceries & Wellness" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {shopTab === 0 ? (
                  <MedicineCatalog onAddToCart={handleAddToCart} />
                ) : (
                  <GroceryCatalog onAddToCart={handleAddToCart} />
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <ShoppingCart
              cartItems={cartItems}
              onRemoveItem={handleRemoveItem}
              onSubmitOrder={handleOrderSubmit}
              latestPrescription={latestPrescription}
            />
            {orderStatus && (
              <Alert severity="success" sx={{ mt: 2, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                {orderStatus}
              </Alert>
            )}
          </Grid>
        </Grid>
      ),
    },
    { label: 'Order History', component: <OrderHistory /> },
    { label: 'Profile', component: <PatientProfile /> }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <PageHeader 
        title={`Welcome back, ${user?.name || 'Patient'}!`}
        subtitle="Manage your prescriptions, orders, and health needs"
        showBack={false}
      />

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              minWidth: { xs: 60, sm: 80, md: 120 },
              px: { xs: 1, sm: 2, md: 3 },
            },
          }}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {tabs[activeTab].component}
        </Box>
      </Paper>
      <ChatWidget onOpenFullScreen={() => window.location.href = '/chat'} />
    </Container>
  );
};

// Placeholder components
const DashboardOverview = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Quick Actions
    </Typography>
    <Typography>
      Dashboard overview with recent orders, prescriptions, etc.
    </Typography>
  </Box>
);

const PatientProfile = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Your Profile
    </Typography>
    <Typography>
      Profile management coming soon...
    </Typography>
  </Box>
);

export default PatientPortal;