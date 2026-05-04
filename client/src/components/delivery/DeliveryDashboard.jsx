import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Stack, 
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  LocalShipping, 
  LocationOn, 
  Phone, 
  CheckCircle, 
  DirectionsCar,
  AccessTime,
  Person,
  Map as MapIcon
} from '@mui/icons-material';
import { deliveryAPI } from '../../services/api';

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

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getAssignedOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status, message) => {
    try {
      await deliveryAPI.updateOrderStatus(orderId, { status, message });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'ready': return <Chip label="Ready for Pickup" size="small" sx={{ bgcolor: COLORS.green2, color: COLORS.text, fontWeight: 700 }} />;
      case 'out_for_delivery': return <Chip label="In Transit" size="small" sx={{ bgcolor: COLORS.blue1, color: 'white', fontWeight: 700 }} />;
      case 'delivered': return <Chip label="Delivered" size="small" sx={{ bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 700 }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: COLORS.text, display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1, color: COLORS.blue2 }} /> My Assignments
          </Typography>
          <Stack spacing={2}>
            {orders.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.02)' }}>
                <LocalShipping sx={{ fontSize: 48, color: COLORS.blue1, mb: 2, opacity: 0.5 }} />
                <Typography sx={{ color: COLORS.subtext }}>No orders assigned yet.</Typography>
              </Paper>
            ) : (
              orders.map((order) => (
                <Card 
                  key={order._id} 
                  onClick={() => setSelectedOrder(order)}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: `2px solid ${selectedOrder?._id === order._id ? COLORS.blue2 : 'transparent'}`,
                    transition: '0.2s',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography sx={{ fontWeight: 800, color: COLORS.text }}>{order.orderId}</Typography>
                      {getStatusChip(order.status)}
                    </Box>
                    <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 1 }}>
                      <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {order.patientId?.name}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: COLORS.subtext }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.street}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedOrder ? (
            <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>Order {selectedOrder.orderId}</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.subtext }}>
                    Assigned on {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedOrder(null)}>
                  <CheckCircle sx={{ color: COLORS.blue1 }} />
                </IconButton>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 3, bgcolor: COLORS.green1, borderRadius: 4 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Patient Details</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{selectedOrder.patientId?.name}</Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 18, mr: 1, color: COLORS.blue2 }} /> {selectedOrder.patientId?.phone || 'No phone provided'}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: COLORS.blue2, mt: 0.5 }} />
                        {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.postalCode}
                      </Typography>
                    </Stack>
                    <Button 
                      variant="contained" 
                      startIcon={<MapIcon />}
                      fullWidth
                      onClick={() => setMapDialogOpen(true)}
                      sx={{ mt: 3, borderRadius: 3, bgcolor: COLORS.blue2, '&:hover': { bgcolor: COLORS.blue1 } }}
                    >
                      View on Map
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Order Items</Typography>
                  <Stack spacing={1}>
                    {selectedOrder.items?.map((item, idx) => (
                      <Box key={idx} display="flex" justifyContent="space-between">
                        <Typography variant="body2">{item.medicineName} x{item.quantity}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {item.price * item.quantity}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Amount</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Rs. {selectedOrder.finalAmount}</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.blue2, fontWeight: 800, mb: 2, textTransform: 'uppercase' }}>Update Status</Typography>
                    <Stack direction="row" spacing={2}>
                      {selectedOrder.status === 'ready' && (
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<DirectionsCar />}
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery', 'Order picked up and out for delivery')}
                          sx={{ borderRadius: 3, bgcolor: COLORS.blue1 }}
                        >
                          Pick Up
                        </Button>
                      )}
                      {selectedOrder.status === 'out_for_delivery' && (
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<CheckCircle />}
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered', 'Order successfully delivered to customer')}
                          sx={{ borderRadius: 3, bgcolor: COLORS.green3, color: COLORS.text }}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, border: `2px dashed ${COLORS.border}`, bgcolor: 'rgba(0,0,0,0.01)' }}>
              <LocalShipping sx={{ fontSize: 64, color: COLORS.blue1, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" sx={{ color: COLORS.subtext }}>Select an order to view details and start delivery</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Simulated Map Dialog */}
      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Delivery Location</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              width: '100%', 
              height: 400, 
              bgcolor: '#f0f4f8', 
              borderRadius: 4, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              border: `2px solid ${COLORS.border}`
            }}
          >
            <LocationOn sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
            <Typography variant="h6" sx={{ color: COLORS.text }}>{selectedOrder?.deliveryAddress?.street}</Typography>
            <Typography sx={{ color: COLORS.subtext }}>{selectedOrder?.deliveryAddress?.city}, Sri Lanka</Typography>
            <Typography variant="caption" sx={{ mt: 4, color: COLORS.blue2 }}>[ Simulated Map View - Integration with Google Maps API would go here ]</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setMapDialogOpen(false)} variant="outlined" sx={{ borderRadius: 3 }}>Close</Button>
          <Button 
            variant="contained" 
            sx={{ borderRadius: 3, bgcolor: COLORS.blue2 }}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder?.deliveryAddress?.street + ' ' + selectedOrder?.deliveryAddress?.city)}`, '_blank')}
          >
            Open in Google Maps
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryDashboard;
