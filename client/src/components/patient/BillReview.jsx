import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Stack, 
  Divider, 
  Alert, 
  CircularProgress, 
  IconButton, 
  Paper 
} from '@mui/material';
import { ShoppingCart, Close, ReceiptLong, LocalShipping, Payment, ShoppingBag, LocalPharmacy, Verified } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import PrescriptionItemsTable from './bill/PrescriptionItemsTable.jsx';
import OtcItemsTable from './bill/OtcItemsTable.jsx';
import BillSummary from './bill/BillSummary.jsx';
import DeliveryAddressForm from './bill/DeliveryAddressForm.jsx';
import PaymentMethodSection from './bill/PaymentMethodSection.jsx';

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

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

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
      PaperProps={{
        sx: { borderRadius: 8, bgcolor: '#f8fafc', backgroundImage: 'none' }
      }}
    >
      <DialogTitle sx={{ p: 4, bgcolor: 'white', borderBottom: `1px solid ${COLORS.border}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2, display: 'flex' }}>
                <ReceiptLong />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>
                Finalize Purchase
              </Typography>
            </Stack>
            <Typography sx={{ color: COLORS.subtext, fontWeight: 500, fontSize: '0.9rem' }}>
              Order ID: #{order?.orderId || orderId} • Verified by Pharmacist
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ bgcolor: '#f1f5f9' }}><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        {loading && !order ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={10}>
            <CircularProgress size={48} sx={{ color: COLORS.blue2, mb: 3 }} />
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 700 }}>Calculating your bill...</Typography>
            <Typography sx={{ color: COLORS.subtext }}>Fetching prices and verifying stock levels.</Typography>
          </Box>
        ) : order ? (
          <Stack spacing={4}>
            {/* Verification Badge */}
            <Box sx={{ p: 2.5, borderRadius: 5, bgcolor: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Verified sx={{ color: '#2563eb' }} />
              <Box>
                <Typography sx={{ color: '#1e40af', fontWeight: 800, fontSize: '0.95rem' }}>Pharmacist Verified</Typography>
                <Typography sx={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 500 }}>Your prescription has been reviewed and priced by our licensed pharmacist.</Typography>
              </Box>
            </Box>

            {/* Medicines List */}
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Prescription Items
              </Typography>
              <PrescriptionItemsTable items={order.items.filter(item => item.isPrescription)} />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Additional OTC Products
              </Typography>
              <OtcItemsTable items={order.items.filter(item => !item.isPrescription)} onRemoveItem={handleRemoveItem} removingId={removing} />
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Stack spacing={4}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Shipment Details
                    </Typography>
                    <DeliveryAddressForm address={deliveryAddress} setAddress={setDeliveryAddress} orderStatus={order.status} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Payment Preference
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
                <Box sx={{ position: 'sticky', top: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Cost Summary
                  </Typography>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
                    <BillSummary 
                      totalAmount={order.totalAmount} 
                      deliveryFee={order.deliveryFee} 
                      finalAmount={order.finalAmount} 
                    />
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Alert severity="error" sx={{ borderRadius: 4 }}>Unable to retrieve bill. Please contact support.</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 4, bgcolor: 'white', borderTop: `1px solid ${COLORS.border}`, gap: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 4, px: 3, fontWeight: 700, color: COLORS.subtext }}>
          Close Review
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading || !order || order.items.length === 0 || !deliveryAddress.street || order.status === 'confirmed'}
          sx={{ 
            borderRadius: 4, 
            px: 6, 
            py: 1.8, 
            bgcolor: COLORS.text, 
            color: 'white',
            fontWeight: 900,
            fontSize: '1rem',
            '&:hover': { bgcolor: '#000' }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : order?.status === 'confirmed' ? (
            'Payment Confirmed'
          ) : (
            'Complete Order'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillReview;
