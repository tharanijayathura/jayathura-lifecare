import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab, Paper, Alert, useTheme, useMediaQuery, Snackbar } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import PrescriptionUpload from '../components/patient/PrescriptionUpload';
import MedicineCatalog from '../components/patient/MedicineCatalog';
import ShoppingCart from '../components/patient/ShoppingCart';
import OrderHistory from '../components/patient/OrderHistory';
import GroceryCatalog from '../components/patient/GroceryCatalog';
import ShopPharmacy from '../components/patient/portal/ShopPharmacy.jsx';
import ChatWidget from '../components/chat/ChatWidget';
import BillReview from '../components/patient/BillReview';
import AddItemsToPrescription from '../components/patient/AddItemsToPrescription';
import DashboardOverview from '../components/patient/portal/DashboardOverview.jsx';
import PatientProfile from '../components/patient/portal/PatientProfile.jsx';
import PrescriptionOrders from '../components/patient/portal/PrescriptionOrders.jsx';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { patientAPI } from '../services/api';
import API from '../services/api';

import { usePatientPortal } from '../components/patient/portal/usePatientPortal.js';
const PatientPortal = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  useEffect(() => {
    const checkAndClearInvalidOrder = async () => {
      if (currentOrderId) {
        try {
          const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
          const order = orderResponse.data;
          if (!order || (order.status !== 'draft' && order.status !== 'pending')) {
            setCurrentOrderId(null);
            setCartItems([]);
          }
        } catch (error) {
          setCurrentOrderId(null);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    checkAndClearInvalidOrder();
  }, []);

  useEffect(() => {
    const loadCartFromOrder = async () => {
      if (currentOrderId) {
        try {
          const orderResponse = await patientAPI.getOrderStatus(currentOrderId);
          const order = orderResponse.data;
          if (order && (order.status === 'draft' || order.status === 'pending')) {
            if (order.items && order.items.length > 0) {
              const seenItems = new Map();
              const orderItems = order.items
                .map(orderItem => {
                  const itemId = orderItem.medicineId?._id || orderItem.medicineId;
                  const orderItemId = orderItem._id?.toString();
                  const uniqueKey = orderItemId || itemId?.toString();
                  if (seenItems.has(uniqueKey)) return null;
                  seenItems.set(uniqueKey, true);
                  return {
                    itemId: itemId,
                    name: orderItem.medicineName || orderItem.medicineId?.name,
                    price: orderItem.price || 0,
                    quantity: orderItem.quantity || 1,
                    itemType: orderItem.isPrescription ? 'Prescription' : 'Non Prescription',
                    image: orderItem.medicineId?.image,
                    orderItemId: orderItem._id,
                    uniqueKey: uniqueKey
                  };
                })
                .filter(item => item !== null);
              setCartItems(orderItems);
            } else {
              setCartItems([]);
            }
          } else {
            setCartItems([]);
            setCurrentOrderId(null);
          }
        } catch (error) {
          console.error('Error loading cart from order:', error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    loadCartFromOrder();
  }, [currentOrderId]);

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
    </Container>
  );
};

export default PatientPortal;
