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
} from '@mui/material';
import { Download, Payment, VolumeUp, PlayArrow, Pause } from '@mui/icons-material';
import OrderItemsTable from './OrderItemsTable.jsx';

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

const OrderDetailsDialog = ({ open, order, onClose, onDownloadInvoice }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Order #{order.orderId || order._id}</Typography>
          <Chip label={(order.status || 'pending').toUpperCase().replace('_', ' ')} color={getStatusColor(order.status)} />
        </Stack>
      </DialogTitle>
      <DialogContent>
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
                      src={order.audioInstructions.url}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" startIcon={<Download />} onClick={onDownloadInvoice}>Download Invoice</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
