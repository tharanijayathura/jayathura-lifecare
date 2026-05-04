import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Stack, Divider, Alert, CircularProgress, IconButton, Paper } from '@mui/material';
import { ShoppingCart, Close, ReceiptLong, LocalShipping, Payment, ShoppingBag, LocalPharmacy } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import PrescriptionItemsTable from './bill/PrescriptionItemsTable.jsx';
import OtcItemsTable from './bill/OtcItemsTable.jsx';
import BillSummary from './bill/BillSummary.jsx';
import DeliveryAddressForm from './bill/DeliveryAddressForm.jsx';
import PaymentMethodSection from './bill/PaymentMethodSection.jsx';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
  paper: 'rgba(255,255,255,0.9)',
};

const BillReview = ({ orderId, open, onClose, onConfirm }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [requestAudioInstructions, setRequestAudioInstructions] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      setOrder(null);
      setDeliveryAddress({ street: '', city: '', postalCode: '' });
      setPaymentMethod('online');
      setRequestAudioInstructions(false);
      fetchBill();
    }
  }, [open, orderId]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.viewBill(orderId);
      const orderData = response.data.order || response.data;
      setOrder(orderData);
      
      const addressSource = response.data.patientAddress || orderData.deliveryAddress || {};
      setDeliveryAddress({
        street: addressSource.street || '',
        city: addressSource.city || '',
        postalCode: addressSource.postalCode || ''
      });
    } catch (error) {
      console.error('Error fetching bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const item = order.items.find(i => i._id === itemId);
    if (item && item.isPrescription) return;

    try {
      setRemoving(itemId);
      await patientAPI.removeOrderItem(orderId, itemId);
      await fetchBill();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleConfirm = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city) return;

    try {
      setLoading(true);
      const response = await patientAPI.confirmOrder(orderId, {
        deliveryAddress,
        paymentMethod,
        requestAudioInstructions
      });
      onConfirm?.(response.data);
      onClose();
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ p: 3, bgcolor: COLORS.green1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: COLORS.text, display: 'flex' }}>
              <ReceiptLong />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>Review & Confirm Bill</Typography>
              <Typography variant="caption" sx={{ color: COLORS.subtext }}>Order ID: {order?.orderId || orderId}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        {loading && !order ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={40} sx={{ color: COLORS.blue2, mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Loading your bill details...</Typography>
          </Box>
        ) : order ? (
          <Stack spacing={4}>
            <Alert severity="info" icon={<ShoppingCart />} sx={{ borderRadius: 3, '& .MuiAlert-message': { fontWeight: 500 } }}>
              Please review the medicines and products added by our pharmacist. You can remove non-prescription items if you've changed your mind.
            </Alert>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacy fontSize="small" sx={{ color: COLORS.blue2 }} /> Prescription Medicines
              </Typography>
              <PrescriptionItemsTable items={order.items.filter(item => item.isPrescription)} />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingBag fontSize="small" sx={{ color: COLORS.blue2 }} /> Other Items
              </Typography>
              <OtcItemsTable items={order.items.filter(item => !item.isPrescription)} onRemoveItem={handleRemoveItem} removingId={removing} />
            </Box>

            <Divider sx={{ borderColor: COLORS.border }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping fontSize="small" sx={{ color: COLORS.blue2 }} /> Delivery Address
                    </Typography>
                    <DeliveryAddressForm address={deliveryAddress} setAddress={setDeliveryAddress} orderStatus={order.status} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payment fontSize="small" sx={{ color: COLORS.blue2 }} /> Payment & Preferences
                    </Typography>
                    <PaymentMethodSection
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      requestAudioInstructions={requestAudioInstructions}
                      setRequestAudioInstructions={setRequestAudioInstructions}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: COLORS.green1 + '44', borderColor: COLORS.border }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: COLORS.text }}>Order Summary</Typography>
                  <BillSummary 
                    totalAmount={order.totalAmount} 
                    deliveryFee={order.deliveryFee} 
                    finalAmount={order.finalAmount} 
                  />
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Alert severity="error">Failed to load bill. Please try again.</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'action.hover', borderTop: `1px solid ${COLORS.border}` }}>
        <Button onClick={onClose} sx={{ color: COLORS.subtext, fontWeight: 600 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading || !order || order.items.length === 0 || !deliveryAddress.street || order.status === 'confirmed'}
          sx={{ 
            borderRadius: 2.5, 
            px: 4, 
            py: 1, 
            bgcolor: COLORS.blue2, 
            fontWeight: 700, 
            boxShadow: '0 4px 14px rgba(122, 168, 176, 0.4)',
            '&:hover': { bgcolor: COLORS.blue1 }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : order?.status === 'confirmed' ? (
            'Confirmed'
          ) : (
            'Confirm & Place Order'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillReview;
