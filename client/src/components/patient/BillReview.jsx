import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Grid,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Delete, ShoppingCart, RecordVoiceOver } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { patientAPI } from '../../services/api';

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

          {/* Prescription Items */}
          {prescriptionItems.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Prescription Medicines
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptionItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography>{item.medicineName || item.medicineId?.name}</Typography>
                              <Chip label="Rx" size="small" color="primary" />
                            </Stack>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.dosage || '-'}</TableCell>
                          <TableCell>{item.frequency || '-'}</TableCell>
                          <TableCell align="right">Rs. {(item.price || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            Rs. {((item.price || 0) * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* OTC Items */}
          {otcItems.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Items (Non Prescription)
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {otcItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.medicineName || item.medicineId?.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell align="right">Rs. {(item.price || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            Rs. {((item.price || 0) * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={removing === item._id}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Bill Summary */}
          {order.finalAmount && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bill Summary</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>Rs. {(order.totalAmount || 0).toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Delivery Fee:</Typography>
                    <Typography>
                      Rs. {(order.deliveryFee || 0).toFixed(2)}
                      {order.totalAmount > 1000 && (
                        <Chip label="Free" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total Amount:</Typography>
                    <Typography variant="h6" color="primary">
                      Rs. {(order.finalAmount || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Delivery Address *
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Please enter your delivery address. You can edit or change it anytime before confirming the order.
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    placeholder="Enter your street address, building name, apartment number"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    required
                    multiline
                    rows={2}
                    error={!deliveryAddress.street && order.status !== 'draft'}
                    helperText={!deliveryAddress.street ? 'Street address is required' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    placeholder="Enter your city"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    required
                    error={!deliveryAddress.city && order.status !== 'draft'}
                    helperText={!deliveryAddress.city ? 'City is required' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    placeholder="Enter postal code (optional)"
                    value={deliveryAddress.postalCode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant={paymentMethod === 'online' ? 'contained' : 'outlined'}
                  onClick={() => setPaymentMethod('online')}
                  fullWidth
                >
                  Online Payment
                </Button>
                <Button
                  variant={paymentMethod === 'cod' ? 'contained' : 'outlined'}
                  onClick={() => setPaymentMethod('cod')}
                  fullWidth
                >
                  Cash on Delivery
                </Button>
              </Stack>
              
              {/* Audio Instructions Request */}
              <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={requestAudioInstructions}
                        onChange={(e) => setRequestAudioInstructions(e.target.checked)}
                        icon={<RecordVoiceOver />}
                        checkedIcon={<RecordVoiceOver color="primary" />}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Request Audio Instructions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get personalized audio instructions from pharmacist on how to take your medicines
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
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

