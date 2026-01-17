import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Stack, Divider, Alert, CircularProgress } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
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

  useEffect(() => {
    if (open && orderId) {
      // Reset state when dialog opens
      setOrder(null);
      setDeliveryAddress({ street: '', city: '', postalCode: '' });
      setPaymentMethod('online');
      setRequestAudioInstructions(false);
      fetchBill();
    } else if (!open) {
      // Reset when dialog closes
      setOrder(null);
      setDeliveryAddress({ street: '', city: '', postalCode: '' });
    }
  }, [open, orderId]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.viewBill(orderId);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      const orderData = response.data.order || response.data;
      if (!orderData) {
        throw new Error('Order not found');
      }
      
      setOrder(orderData);
      
      // Set default address from user profile or existing order address
      const addressSource = response.data.patientAddress || orderData.deliveryAddress || {};
      const newAddress = {
        street: addressSource.street || '',
        city: addressSource.city || '',
        postalCode: addressSource.postalCode || ''
      };
      setDeliveryAddress(newAddress);
      console.log('Address loaded:', newAddress);
    } catch (error) {
      console.error('Error fetching bill:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        orderId: orderId
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load bill. Please try again.';
      alert(`Error: ${errorMessage}\n\nOrder ID: ${orderId}\n\nPlease check the console for more details.`);
      // Don't close dialog on error - let user see the error and try again
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!order) return;
    
    // Don't allow removing prescription items
    const item = order.items.find(i => i._id === itemId);
    if (item && item.isPrescription) {
      alert('Cannot remove prescription medicines. Please contact pharmacist.');
      return;
    }

    try {
      setRemoving(itemId);
      await patientAPI.removeOrderItem(orderId, itemId);
      await fetchBill(); // Refresh bill
      alert('Item removed successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      alert(error.response?.data?.message || 'Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleConfirm = async () => {
    // Validate address fields
    if (!deliveryAddress.street || !deliveryAddress.street.trim()) {
      alert('Please enter a valid street address');
      return;
    }

    if (!deliveryAddress.city || !deliveryAddress.city.trim()) {
      alert('Please enter a valid city');
      return;
    }

    if (order.items.length === 0) {
      alert('Cannot confirm empty order');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare address data
      const addressToSend = {
        street: deliveryAddress.street.trim(),
        city: deliveryAddress.city.trim(),
        postalCode: deliveryAddress.postalCode?.trim() || ''
      };
      
      console.log('Confirming order with address:', addressToSend);
      
      const response = await patientAPI.confirmOrder(orderId, {
        deliveryAddress: addressToSend,
        paymentMethod,
        requestAudioInstructions
      });
      
      if (response.data.alreadyConfirmed) {
        alert('Order is already confirmed.');
      } else {
        alert('Order confirmed successfully!');
      }
      onConfirm?.(response.data);
      onClose();
    } catch (error) {
      console.error('Error confirming order:', error);
      alert(error.response?.data?.message || 'Failed to confirm order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading Bill...</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Bill Review</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            Failed to load order. Please try again or contact support.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const prescriptionItems = order.items.filter(item => item.isPrescription);
  const otcItems = order.items.filter(item => !item.isPrescription);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <ShoppingCart />
          <Typography variant="h6">Review Bill & Confirm Order</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Order Info */}
          {order.status === 'confirmed' ? (
            <Alert severity="success">
              <Typography variant="body2">
                This order has already been confirmed. No further action is needed.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                Review your order below. You can remove non prescription items if needed. 
                Prescription medicines cannot be removed.
              </Typography>
            </Alert>
          )}

          <PrescriptionItemsTable items={prescriptionItems} />

          <OtcItemsTable items={otcItems} onRemoveItem={handleRemoveItem} removingId={removing} />

          {order.finalAmount && (
            <BillSummary totalAmount={order.totalAmount} deliveryFee={order.deliveryFee} finalAmount={order.finalAmount} />
          )}

          <DeliveryAddressForm address={deliveryAddress} setAddress={setDeliveryAddress} orderStatus={order.status} />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            requestAudioInstructions={requestAudioInstructions}
            setRequestAudioInstructions={setRequestAudioInstructions}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={loading || order.items.length === 0 || !deliveryAddress.street || order.status === 'confirmed'}
        >
          {loading ? <CircularProgress size={24} /> : order.status === 'confirmed' ? 'Already Confirmed' : 'Confirm Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillReview;

