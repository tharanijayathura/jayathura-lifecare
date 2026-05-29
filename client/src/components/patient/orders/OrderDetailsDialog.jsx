import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Grid,
  Divider,
  Stack,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import { Download, Payment, VolumeUp, PlayArrow, Pause } from '@mui/icons-material';
import OrderItemsTable from './OrderItemsTable.jsx';
import OrderTrackingStepper from './OrderTrackingStepper.jsx';
import OrderReviewConfirmation from './OrderReviewConfirmation.jsx';
import { getPublicFileUrl, patientAPI } from '../../../services/api';

const getStatusColor = (status) => {
  const colors = {
    delivered: 'success',
    processing: 'warning',
    pending: 'info',
    confirmed: 'info',
    ready: 'success',
    out_for_delivery: 'warning',
    cancelled: 'error',
    draft: 'default',
  };
  return colors[status] || 'default';
};

const OrderDetailsDialog = ({ open, order, onClose, onDownloadInvoice, onOrderUpdated }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState({ street: '', city: '', postalCode: '' });
  const [editPaymentMethod, setEditPaymentMethod] = useState('cod');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  if (!order) return null;

  const handleEditInit = () => {
    setEditAddress({
      street: order.deliveryAddress?.street || '',
      city: order.deliveryAddress?.city || '',
      postalCode: order.deliveryAddress?.postalCode || ''
    });
    setEditPaymentMethod(order.paymentMethod || 'cod');
    setActionError('');
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!editAddress.street?.trim() || !editAddress.city?.trim()) {
      setActionError('Street address and City are required.');
      return;
    }
    try {
      setActionLoading(true);
      setActionError('');
      await patientAPI.editOrderDetails(order._id || order.orderId, {
        deliveryAddress: editAddress,
        paymentMethod: editPaymentMethod
      });
      setIsEditing(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
      onClose();
    } catch (err) {
      console.error('Error saving order changes:', err);
      setActionError(err.response?.data?.message || 'Failed to update order details.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    try {
      setActionLoading(true);
      setActionError('');
      await patientAPI.cancelOrder(order._id || order.orderId);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
      onClose();
    } catch (err) {
      console.error('Error cancelling order:', err);
      setActionError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? 'Edit Order Details' : `Order #${order.orderId || order._id}${order.patientId?.name ? ` - ${order.patientId.name}` : ''}`}
          </Typography>
          {!isEditing && (
            <Chip label={(order.status || 'pending').toUpperCase().replace('_', ' ')} color={getStatusColor(order.status)} />
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isEditing ? (
          <Box sx={{ mt: 2 }}>
            {actionError && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{actionError}</Alert>}
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Street Address"
                placeholder="No, Street Name, Apartment/Building"
                value={editAddress.street}
                onChange={(e) => setEditAddress({ ...editAddress, street: e.target.value })}
                required
                multiline
                rows={2}
                disabled={actionLoading}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    placeholder="Colombo, Kandy, etc."
                    value={editAddress.city}
                    onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                    required
                    disabled={actionLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    placeholder="Optional"
                    value={editAddress.postalCode}
                    onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })}
                    disabled={actionLoading}
                  />
                </Grid>
              </Grid>
              
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Payment Method</FormLabel>
                <RadioGroup
                  row
                  value={editPaymentMethod}
                  onChange={(e) => setEditPaymentMethod(e.target.value)}
                >
                  <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" disabled={actionLoading} />
                  <FormControlLabel value="online" control={<Radio />} label="Online Payment" disabled={actionLoading} />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
              <Typography variant="body1">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Order Type</Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{order.type || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Payment fontSize="small" />
                <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{order.paymentMethod || 'N/A'}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
              <Chip label={order.paymentStatus || 'pending'} color={order.paymentStatus === 'paid' ? 'success' : 'warning'} size="small" />
            </Grid>

            {/* Tracking Stepper */}
            {order.status !== 'draft' && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <OrderTrackingStepper status={order.status} history={order.trackingHistory} />
              </Grid>
            )}

            {/* Audio Instructions */}
            {order.audioInstructions?.url && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <VolumeUp />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>Audio Instructions</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Listen to personalized instructions from your pharmacist</Typography>
                      </Box>
                      <audio
                        ref={audioRef}
                        src={getPublicFileUrl(order.audioInstructions.url)}
                        onPlay={() => setIsPlayingAudio(true)}
                        onPause={() => setIsPlayingAudio(false)}
                        onEnded={() => setIsPlayingAudio(false)}
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="contained"
                        color="inherit"
                        startIcon={isPlayingAudio ? <Pause /> : <PlayArrow />}
                        onClick={() => {
                          if (audioRef.current) {
                            if (isPlayingAudio) {
                              audioRef.current.pause();
                            } else {
                              audioRef.current.play();
                            }
                          }
                        }}
                      >
                        {isPlayingAudio ? 'Pause' : 'Play'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {order.audioInstructions?.requested && !order.audioInstructions?.url && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Alert severity="info" icon={<VolumeUp />}>Audio instructions have been requested. Your pharmacist will provide them soon.</Alert>
              </Grid>
            )}

            {order.status === 'pending' ? (
              <Grid item xs={12}>
                <OrderReviewConfirmation order={order} onConfirmed={() => onClose()} />
              </Grid>
            ) : (
              <>
                {order.items && order.items.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Order Items</Typography>
                    <OrderItemsTable items={order.items} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Subtotal:</Typography>
                      <Typography variant="body1">Rs. {(order.totalAmount || 0).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Delivery Fee:</Typography>
                      <Typography variant="body2" color="text.secondary">Rs. {(order.deliveryFee || 0).toFixed(2)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color="primary.main">Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} disabled={actionLoading} sx={{ borderRadius: 3, fontWeight: 700 }}>
              Cancel Edit
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{ borderRadius: 3, fontWeight: 850, px: 4, py: 1.2, bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#000' } }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
              {['draft', 'pending', 'confirmed'].includes(order.status) && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelOrder}
                  disabled={actionLoading}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  Cancel Order
                </Button>
              )}
              {['pending', 'confirmed'].includes(order.status) && (
                <Button
                  variant="outlined"
                  onClick={handleEditInit}
                  disabled={actionLoading}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  Edit Details
                </Button>
              )}
            </Stack>
            <Button onClick={onClose} sx={{ borderRadius: 3, fontWeight: 700 }}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={onDownloadInvoice}
              sx={{ borderRadius: 3, fontWeight: 800, bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#000' } }}
            >
              Download Invoice
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
