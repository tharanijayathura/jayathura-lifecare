import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Alert, Stack, Stepper, Step, StepLabel, Divider, IconButton, CircularProgress } from '@mui/material';
import { LocalPharmacy, ShoppingCart, Send, Close, ArrowBack, ArrowForward } from '@mui/icons-material';
import CatalogTabs from './prescription/CatalogTabs.jsx';
import CartSummary from './prescription/CartSummary.jsx';
import ReviewSummary from './prescription/ReviewSummary.jsx';
import { patientAPI } from '../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const AddItemsToPrescription = ({ orderId, open, onClose, onSent }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [catalogTab, setCatalogTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const steps = ['Browse Essentials', 'Final Review'];

  useEffect(() => {
    if (open && orderId) {
      loadOrderItems();
    }
  }, [open, orderId]);

  const loadOrderItems = async () => {
    try {
      const response = await patientAPI.getOrderStatus(orderId);
      if (response.data?.items) {
        const orderItems = response.data.items.map(orderItem => ({
          itemId: orderItem.medicineId?._id || orderItem.medicineId,
          name: orderItem.medicineName || orderItem.medicineId?.name,
          price: orderItem.price || 0,
          quantity: orderItem.quantity || 1,
          itemType: orderItem.isPrescription ? 'Prescription' : 
                   orderItem.category === 'groceries' ? 'Grocery' : 'Non Prescription',
          image: orderItem.medicineId?.image,
          orderItemId: orderItem._id
        }));
        setCartItems(orderItems);
      }
    } catch (error) {
      console.error('Error loading order items:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setLoading(true);
      const response = await patientAPI.addToCart({
        orderId: orderId,
        medicineId: item.itemId,
        quantity: item.quantity || 1
      });

      if (response.data?.order) {
        const order = response.data.order;
        const orderItems = (order.items || []).map(orderItem => ({
          itemId: orderItem.medicineId?._id || orderItem.medicineId,
          name: orderItem.medicineName || orderItem.medicineId?.name,
          price: orderItem.price || 0,
          quantity: orderItem.quantity || 1,
          itemType: orderItem.isPrescription ? 'Prescription' : 
                   orderItem.category === 'groceries' ? 'Grocery' : 'Non Prescription',
          image: orderItem.medicineId?.image,
          orderItemId: orderItem._id
        }));
        setCartItems(orderItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToPharmacist = async () => {
    try {
      setSending(true);
      await patientAPI.sendOrderToPharmacist(orderId);
      onSent?.();
      onClose();
    } catch (error) {
      console.error('Error sending to pharmacist:', error);
    } finally {
      setSending(false);
    }
  };

  const prescriptionItems = cartItems.filter(i => i.itemType === 'Prescription');
  const otcItems = cartItems.filter(i => i.itemType === 'Non Prescription' || i.itemType === 'OTC');
  const groceryItems = cartItems.filter(i => i.itemType === 'Grocery');
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ p: 3, bgcolor: COLORS.green1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: COLORS.text, display: 'flex' }}>
              <LocalPharmacy />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>Customize Your Order</Typography>
              <Typography variant="caption" sx={{ color: COLORS.subtext }}>Adding items to Order #{orderId?.slice(-6)}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4, mt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Alert severity="info" sx={{ borderRadius: 3, bgcolor: 'rgba(147, 191, 199, 0.05)', border: `1px solid ${COLORS.blue1}` }}>
                  You can add non-prescription items (Panadol, Vitamins) or groceries to your order. 
                  If you're done, click <strong>Review & Continue</strong>.
                </Alert>
              </Box>
              <CatalogTabs catalogTab={catalogTab} setCatalogTab={setCatalogTab} onAddToCart={handleAddToCart} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 0 }}>
                <CartSummary
                  cartItems={cartItems}
                  prescriptionItems={prescriptionItems}
                  otcItems={otcItems}
                  groceryItems={groceryItems}
                  totalAmount={totalAmount}
                  loading={loading}
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Box sx={{ py: 2 }}>
            <ReviewSummary
              prescriptionItems={prescriptionItems}
              otcItems={otcItems}
              groceryItems={groceryItems}
              totalAmount={totalAmount}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'action.hover', borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} disabled={sending} sx={{ color: COLORS.subtext, fontWeight: 600 }}>Cancel</Button>
        <Box sx={{ flexGrow: 1 }} />
        
        {activeStep === 0 ? (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(1)}
              disabled={loading || cartItems.length === 0}
              endIcon={<ArrowForward />}
              sx={{ borderRadius: 2.5, fontWeight: 700, borderColor: COLORS.blue2, color: COLORS.text }}
            >
              Review Order
            </Button>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSendToPharmacist}
              disabled={sending || loading}
              sx={{ 
                borderRadius: 2.5, 
                px: 3, 
                bgcolor: COLORS.green3, 
                color: COLORS.text, 
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(171, 231, 178, 0.4)',
                '&:hover': { bgcolor: COLORS.green2 }
              }}
            >
              {sending ? <CircularProgress size={24} color="inherit" /> : 'Send to Pharmacist'}
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep(0)}
              disabled={sending}
              sx={{ fontWeight: 600, color: COLORS.text }}
            >
              Back to Catalog
            </Button>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSendToPharmacist}
              disabled={sending}
              sx={{ 
                borderRadius: 2.5, 
                px: 4, 
                bgcolor: COLORS.blue2, 
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(122, 168, 176, 0.4)',
                '&:hover': { bgcolor: COLORS.blue1 }
              }}
            >
              {sending ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Send'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddItemsToPrescription;
