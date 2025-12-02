import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab, Paper, Alert } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import MedicineCatalog from '../components/patient/MedicineCatalog';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';
import GroceryCatalog from '../components/patient/GroceryCatalog';
import ChatWidget from '../components/chat/ChatWidget';
import { useNavigate } from 'react-router-dom';

const PatientPortal = () => {
  const { user } = useAuth();
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
                medical supplies like cotton wool, masks, and bandages. Use filters to sort by category, price, or brand,
                and add items directly to your cart without a prescription.
              </Alert>
              <Tabs
                value={shopTab}
                onChange={(e, newValue) => setShopTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
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
              <Alert severity="success" sx={{ mt: 2 }}>
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your prescriptions, orders, and health needs
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
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