import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
} from '@mui/material';
import { Visibility, Download, LocalShipping, Payment, CheckCircle, VolumeUp, PlayArrow, Pause } from '@mui/icons-material';
import { patientAPI } from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getOrdersHistory();
      console.log('Orders history response:', response);
      const ordersData = response.data || [];
      console.log('Orders data:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load order history. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'success',
      processing: 'warning',
      pending: 'info',
      confirmed: 'info',
      ready: 'success',
      out_for_delivery: 'warning',
      cancelled: 'error',
      draft: 'default'
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await patientAPI.getOrderStatus(orderId);
      setSelectedOrder(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details. Please try again.');
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await patientAPI.viewBill(orderId);
      // You can open this in a new window or download as PDF
      console.log('Invoice:', response.data);
      alert(`Invoice ID: ${response.data.invoiceId || response.data.orderId}\nTotal: Rs. ${response.data.totalAmount || 0}`);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order History (Function 23)
      </Typography>

      {orders.length > 0 && orders.map((order) => {
        const items = order.items || [];
        const itemNames = items.length > 0 
          ? items.map(item => item.medicineName || item.medicineId?.name || item.name || 'Unknown').join(', ')
          : 'No items';
        
        return (
          <Card key={order._id || order.orderId} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Order #{order.orderId || order._id?.slice(-6) || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Items: {itemNames}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Type: {(order.type || 'N/A').toUpperCase()}
                    {order.prescriptionId && (
                      <Chip label="Prescription" size="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip 
                    label={(order.status || 'pending').toUpperCase().replace(/_/g, ' ')} 
                    color={getStatusColor(order.status)}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}
                  </Typography>
                  {order.deliveryFee !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      {order.deliveryFee === 0 ? 'Free delivery' : `Delivery: Rs. ${order.deliveryFee.toFixed(2)}`}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  startIcon={<Visibility />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewDetails(order._id || order.orderId)}
                >
                  View Details
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleDownloadInvoice(order._id || order.orderId)}
                >
                  Invoice
                </Button>
                {order.status === 'out_for_delivery' && (
                  <Button
                    startIcon={<LocalShipping />}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      // Track delivery functionality
                      patientAPI.trackDelivery(order._id || order.orderId)
                        .then(res => {
                          alert(`Delivery Status: ${res.data.deliveryStatus || order.deliveryStatus}\nEstimated Delivery: ${res.data.estimatedDelivery ? new Date(res.data.estimatedDelivery).toLocaleString() : 'N/A'}`);
                        })
                        .catch(err => console.error('Error tracking delivery:', err));
                    }}
                  >
                    Track
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}

      {orders.length === 0 && !loading && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <LocalShipping sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start shopping to see your orders here
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Order #{selectedOrder.orderId || selectedOrder._id}
                </Typography>
                <Chip 
                  label={(selectedOrder.status || 'pending').toUpperCase().replace('_', ' ')} 
                  color={getStatusColor(selectedOrder.status)}
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
                  <Typography variant="body1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order Type</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {selectedOrder.type || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Payment fontSize="small" />
                    <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                      {selectedOrder.paymentMethod || 'N/A'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
                  <Chip 
                    label={selectedOrder.paymentStatus || 'pending'} 
                    color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
                
                {/* Audio Instructions */}
                {selectedOrder.audioInstructions?.url && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <VolumeUp />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Audio Instructions
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Listen to personalized instructions from your pharmacist
                            </Typography>
                          </Box>
                          <audio
                            ref={audioRef}
                            src={selectedOrder.audioInstructions.url}
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
                
                {selectedOrder.audioInstructions?.requested && !selectedOrder.audioInstructions?.url && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Alert severity="info" icon={<VolumeUp />}>
                      Audio instructions have been requested. Your pharmacist will provide them soon.
                    </Alert>
                  </Grid>
                )}

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Order Items
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, idx) => {
                            const medicineName = item.medicineName || item.medicineId?.name || item.name || 'Unknown';
                            const price = item.price || item.medicineId?.price?.perPack || 0;
                            const quantity = item.quantity || 0;
                            return (
                              <TableRow key={item._id || idx}>
                                <TableCell>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>{medicineName}</Typography>
                                    {item.isPrescription && (
                                      <Chip label="Rx" size="small" color="primary" />
                                    )}
                                  </Stack>
                                  {item.dosage && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {item.dosage} {item.frequency ? `- ${item.frequency}` : ''}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell align="right">{quantity}</TableCell>
                                <TableCell align="right">Rs. {price.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                  Rs. {(price * quantity).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Subtotal:</Typography>
                      <Typography variant="body1">Rs. {(selectedOrder.totalAmount || 0).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Delivery Fee:</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {(selectedOrder.deliveryFee || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography variant="h6" color="primary.main">
                        Rs. {(selectedOrder.finalAmount || selectedOrder.totalAmount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={() => handleDownloadInvoice(selectedOrder._id || selectedOrder.orderId)}
              >
                Download Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrderHistory;