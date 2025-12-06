import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Paper, 
  Alert, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  Upload,
  ShoppingCart as ShoppingCartIcon,
  History,
  Person,
  LocalPharmacy,
  MedicalServices,
  DeliveryDining,
  SupportAgent,
  CheckCircle,
  ArrowForward,
  Info,
  Assignment,
  Payment,
  TrackChanges
} from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import MedicineCatalog from '../components/patient/MedicineCatalog';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';
import GroceryCatalog from '../components/patient/GroceryCatalog';
import ChatWidget from '../components/chat/ChatWidget';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { patientAPI } from '../services/api';
import API from '../services/api';

const PatientPortal = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [shopTab, setShopTab] = useState(0);
  const [latestPrescription, setLatestPrescription] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddToCart = async (item) => {
    try {
      setLoading(true);
      // Create order if doesn't exist
      let orderId = currentOrderId;
      if (!orderId) {
        const orderResponse = await patientAPI.createOrder();
        orderId = orderResponse.data._id;
        setCurrentOrderId(orderId);
      }

      // Add item to cart via API
      await patientAPI.addToCart({
        orderId: orderId,
        medicineId: item.itemId,
        quantity: item.quantity || 1
      });

      // Update local cart state
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
      setSnackbar({ 
        open: true, 
        message: `${item.name} added to cart successfully!`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error adding item to cart. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (index) => {
    const item = cartItems[index];
    try {
      if (currentOrderId && item.orderItemId) {
        await patientAPI.removeFromCart(item.orderItemId, currentOrderId);
      }
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing item:', error);
      // Still remove from local state even if API call fails
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleOrderSubmit = async ({ attachPrescription, paymentMethod = 'online' }) => {
    if (cartItems.length === 0 || !currentOrderId) return;

    try {
      setLoading(true);
      // Generate bill first (using orders endpoint)
      await API.post(`/orders/${currentOrderId}/generate-bill`);
      
      // Set payment method if COD
      if (paymentMethod === 'cod') {
        await patientAPI.chooseCOD(currentOrderId);
      }
      
      // Confirm order
      await patientAPI.confirmOrder(currentOrderId);
      
      const successMessage = `Order confirmed successfully! ${paymentMethod === 'cod' ? 'You will pay on delivery.' : 'Payment will be processed.'} ${attachPrescription && latestPrescription ? 'Prescription attached.' : ''}`;
      setOrderStatus(successMessage);
      setSnackbar({ 
        open: true, 
        message: successMessage, 
        severity: 'success' 
      });
      setCartItems([]);
      setCurrentOrderId(null);
      
      // Auto-refresh after 5 seconds
      setTimeout(() => {
        setOrderStatus('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit order. Please try again.';
      setOrderStatus(`Error: ${errorMessage}`);
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionUploaded = (prescriptionMeta) => {
    setLatestPrescription(prescriptionMeta);
  };

  const tabs = [
    { label: 'Dashboard', component: <DashboardOverview onNavigate={setActiveTab} /> },
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
              loading={loading}
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
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Dashboard component
const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const quickActions = [
    {
      icon: <Upload sx={{ fontSize: 40 }} />,
      title: 'Upload Prescription',
      description: 'Upload your doctor\'s prescription for verification',
      color: '#4CAF50',
      tabIndex: 1
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Shop Medicines',
      description: 'Browse and order OTC medicines and health products',
      color: '#2196F3',
      tabIndex: 2
    },
    {
      icon: <History sx={{ fontSize: 40 }} />,
      title: 'Order History',
      description: 'View your past orders and track deliveries',
      color: '#FF9800',
      tabIndex: 3
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      title: 'Chat Support',
      description: 'Get help from our pharmacists anytime',
      color: '#9C27B0',
      tabIndex: null,
      action: () => window.location.href = '/chat'
    }
  ];

  const howToSteps = [
    {
      step: 1,
      title: 'Upload Your Prescription',
      description: 'Take a clear photo of your prescription and upload it. Our pharmacists will verify it within minutes.',
      icon: <Upload color="primary" />
    },
    {
      step: 2,
      title: 'Browse & Add to Cart',
      description: 'Explore our medicine catalog. Add OTC medicines, vitamins, and health products to your cart.',
      icon: <MedicalServices color="primary" />
    },
    {
      step: 3,
      title: 'Review & Confirm',
      description: 'Review your order, attach prescription if needed, and confirm. You can pay online or choose cash on delivery.',
      icon: <CheckCircle color="primary" />
    },
    {
      step: 4,
      title: 'Track Delivery',
      description: 'Monitor your order status in real-time. Get notified when your medicines are out for delivery.',
      icon: <TrackChanges color="primary" />
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Welcome, {user?.name || 'Patient'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your one-stop solution for all your healthcare needs. Get started by following the steps below.
        </Typography>
      </Box>

      {/* Stats Cards */}
      {profile && profile.stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats.totalOrders || 0}
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 48, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Pending Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats.pendingOrders || 0}
                    </Typography>
                  </Box>
                  <DeliveryDining sx={{ fontSize: 48, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Prescriptions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats.totalPrescriptions || 0}
                    </Typography>
                  </Box>
                  <LocalPharmacy sx={{ fontSize: 48, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Refills
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats.activeRefillPlans || 0}
                    </Typography>
                  </Box>
                  <MedicalServices sx={{ fontSize: 48, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => {
                  if (action.tabIndex !== null) {
                    onNavigate?.(action.tabIndex);
                  } else if (action.action) {
                    action.action();
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: action.color, mb: 2 }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                  <IconButton 
                    sx={{ mt: 1, color: action.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action.tabIndex !== null) {
                        onNavigate?.(action.tabIndex);
                      } else if (action.action) {
                        action.action();
                      }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* How to Use Guide */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Info color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            How to Use This App
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {howToSteps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ 
                    minWidth: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>
                    {step.step}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      {step.icon}
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Important Information */}
      <Alert 
        severity="info" 
        icon={<Info />}
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Important Information
        </Typography>
        <Typography variant="body2" component="div">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Prescription medicines require a valid doctor's prescription</li>
            <li>OTC medicines can be ordered directly without a prescription</li>
            <li>Orders are typically processed within 2-4 hours</li>
            <li>Free delivery for orders above Rs. 1,000</li>
            <li>Chat with our pharmacists for any questions or concerns</li>
          </ul>
        </Typography>
      </Alert>

      {/* Features Highlight */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Why Choose Jayathura LifeCare?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <LocalPharmacy sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Verified Pharmacists
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expert verification of all prescriptions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <DeliveryDining sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Same-day or next-day delivery available
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Payment sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Flexible Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Online payment or cash on delivery
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <SupportAgent sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Always here to help you
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Profile component
const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: {} });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientAPI.getDetailedProfile();
        setProfile(response.data);
        if (response.data && response.data.user) {
          setFormData({
            name: response.data.user.name || '',
            phone: response.data.user.phone || '',
            address: response.data.user.address || {}
          });
        } else if (response.data && response.data.profile) {
          // Fallback if structure is different
          setFormData({
            name: response.data.profile.name || '',
            phone: response.data.profile.phone || '',
            address: response.data.profile.address || {}
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await patientAPI.updateProfile(formData);
      setEditing(false);
      // Refresh profile
      const response = await patientAPI.getDetailedProfile();
      setProfile(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Your Profile (Function 27)
        </Typography>
        <Button
          variant={editing ? 'contained' : 'outlined'}
          onClick={editing ? handleUpdate : () => setEditing(true)}
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Box>

      {profile && profile.user && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={profile.user.email || ''}
                      disabled
                      variant="outlined"
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.address.street || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, street: e.target.value } 
                      })}
                      disabled={!editing}
                      placeholder="Enter your street address"
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.address.city || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, city: e.target.value } 
                      })}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={formData.address.postalCode || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, postalCode: e.target.value } 
                      })}
                      disabled={!editing}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Account Statistics
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats?.totalOrders || 0}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Prescriptions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats?.totalPrescriptions || 0}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Refills
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {profile.stats?.activeRefillPlans || 0}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PatientPortal;