import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper, Alert, useTheme, useMediaQuery, Snackbar } from '@mui/material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';
import ShopPharmacy from '../components/patient/portal/ShopPharmacy.jsx';
import ChatWidget from '../components/chat/ChatWidget';
import BillReview from '../components/patient/BillReview';
import AddItemsToPrescription from '../components/patient/AddItemsToPrescription';
import DashboardOverview from '../components/patient/portal/DashboardOverview.jsx';
import PatientProfile from '../components/patient/portal/PatientProfile.jsx';
import PrescriptionOrders from '../components/patient/portal/PrescriptionOrders.jsx';
import PortalHeader from '../components/common/PortalHeader';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';
import { usePatientPortal } from '../components/patient/portal/usePatientPortal.js';

const PatientPortal = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [initialShopCategory, setInitialShopCategory] = useState('all');

  const {
    activeTab, setActiveTab,
    cartItems, setCartItems,
    shopTab, setShopTab,
    latestPrescription, setLatestPrescription,
    orderStatus, setOrderStatus,
    currentOrderId, setCurrentOrderId,
    loading, setLoading,
    snackbar, setSnackbar,
    prescriptionOrders, setPrescriptionOrders,
    billReviewOpen, setBillReviewOpen,
    selectedOrderForBill, setSelectedOrderForBill,
    addItemsDialogOpen, setAddItemsDialogOpen,
    selectedPrescriptionOrderId, setSelectedPrescriptionOrderId,
    handleAddToCart,
    handleRemoveItem,
    handleOrderSubmit,
    handlePrescriptionUploaded,
    fetchPrescriptionOrders,
    handleViewBill,
    handleBillConfirmed,
  } = usePatientPortal();

  const tabs = [
    {
      label: 'Dashboard',
      component: (
        <DashboardOverview
          onNavigate={setActiveTab}
          handleAddToCart={handleAddToCart}
          onSeeMoreCommon={() => {
            setInitialShopCategory('frequent');
            setActiveTab(2);
          }}
        />
      )
    },
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
        <ShopPharmacy
          shopTab={shopTab}
          setShopTab={setShopTab}
          handleAddToCart={handleAddToCart}
          cartItems={cartItems}
          handleRemoveItem={handleRemoveItem}
          handleOrderSubmit={handleOrderSubmit}
          latestPrescription={latestPrescription}
          loading={loading}
          currentOrderId={currentOrderId}
          orderStatus={orderStatus}
          initialShopCategory={initialShopCategory}
          setInitialShopCategory={setInitialShopCategory}
        />
      ),
    },
    {
      label: 'Prescription Orders',
      component: (
        <PrescriptionOrders
          orders={prescriptionOrders}
          onViewBill={(order) => handleViewBill(order)}
          onAddItems={(order) => {
            setActiveTab(2);
            setCurrentOrderId(order._id);
            setSnackbar({ open: true, message: 'You can now add non prescription items to this prescription order', severity: 'info' });
          }}
        />
      ),
    },
    { label: 'Order History', component: <OrderHistory /> },
    { label: 'Profile', component: <PatientProfile /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eef7f2', pb: 6, textAlign: 'left' }}>

      {/* ── Shared Portal Header (fetches live name from DB) ── */}
      <PortalHeader
        title="Patient Dashboard"
        subtitle="Manage health services and prescriptions"
        role="patient"
        onLogoClick={() => setActiveTab(0)}
        onProfile={() => setActiveTab(5)}
      />

      {/* ── Main Content Card with Tabs ── */}
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            border: '1px solid rgba(0,0,0,0.04)',
            bgcolor: 'white',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          {/* Tab Navigation Bar */}
          <Box sx={{ borderBottom: '1px solid #f1f5f9', px: { xs: 2, md: 4 }, pt: 0.5 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ sx: { bgcolor: '#10b981', height: 3, borderRadius: '3px 3px 0 0' } }}
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#10b981' },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  color: '#64748b',
                  minWidth: 'auto',
                  px: 2.5,
                  py: 2.2,
                  transition: 'color 0.2s',
                  '&.Mui-selected': { color: '#10b981' },
                  '&:hover': { color: '#10b981' },
                }
              }}
            >
              {tabs.map((tab, idx) => (
                <Tab key={idx} label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            {tabs[activeTab].component}
          </Box>
        </Paper>
      </Container>

      <ChatWidget onOpenFullScreen={() => window.location.href = '/chat'} />

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

      {selectedOrderForBill && (
        <BillReview
          orderId={typeof selectedOrderForBill === 'string' ? selectedOrderForBill : selectedOrderForBill._id}
          open={billReviewOpen}
          onClose={() => {
            setBillReviewOpen(false);
            setSelectedOrderForBill(null);
          }}
          onConfirm={handleBillConfirmed}
        />
      )}

      <AddItemsToPrescription
        orderId={selectedPrescriptionOrderId}
        open={addItemsDialogOpen}
        onClose={() => {
          setAddItemsDialogOpen(false);
          setSelectedPrescriptionOrderId(null);
        }}
        onSent={() => {
          fetchPrescriptionOrders();
          setSnackbar({
            open: true,
            message: 'Order sent to pharmacist successfully!',
            severity: 'success'
          });
        }}
      />
    </Box>
  );
};

export default PatientPortal;
