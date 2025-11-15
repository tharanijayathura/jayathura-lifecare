import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import MedicineCatalog from '../components/patient/MedicineCatalog';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';

const PatientPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (medicine) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.medicineId === medicine.medicineId);
      if (existingItem) {
        return prev.map(item =>
          item.medicineId === medicine.medicineId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, medicine];
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Checkout:', cartItems);
    alert('Checkout functionality coming soon! Total: Rs. ' + 
      cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    );
  };

  const tabs = [
    { label: 'Dashboard', component: <DashboardOverview /> },
    { label: 'Upload Prescription', component: <PrescriptionUpload /> },
    { label: 'Buy OTC Medicines', component: (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MedicineCatalog onAddToCart={handleAddToCart} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ShoppingCart
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </Grid>
      </Grid>
    )},
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