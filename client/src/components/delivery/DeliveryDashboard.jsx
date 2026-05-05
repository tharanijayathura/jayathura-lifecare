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
  text: '#1e293b',
  subtext: '#64748b',
  border: 'rgba(147, 191, 199, 0.25)',
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
    const styles = {
      ready: { bg: COLORS.green2, text: COLORS.text, label: 'Ready to Pick' },
      out_for_delivery: { bg: COLORS.blue2, text: 'white', label: 'In Transit' },
      delivered: { bg: COLORS.green3, text: COLORS.text, label: 'Completed' }
    };
    const style = styles[status] || { bg: '#f1f5f9', text: COLORS.subtext, label: status };
    return (
      <Chip 
        label={style.label} 
        size="small" 
        sx={{ 
          bgcolor: style.bg, 
          color: style.text, 
          fontWeight: 800,
          borderRadius: 2,
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }} 
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Left Column: Tasks */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>
              Tasks <Box component="span" sx={{ color: COLORS.blue2 }}>({orders.length})</Box>
            </Typography>
            <IconButton onClick={fetchOrders} sx={{ color: COLORS.blue2 }}><AccessTime /></IconButton>
          </Box>
          
          <Stack spacing={2}>
            {orders.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 6, border: `2px dashed ${COLORS.border}`, bgcolor: 'transparent' }}>
                <LocalShipping sx={{ fontSize: 64, color: COLORS.blue1, mb: 2, opacity: 0.2 }} />
                <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No deliveries active.</Typography>
              </Paper>
            ) : (
              orders.map((order) => (
                <Paper
                  key={order._id}
                  elevation={0}
                  onClick={() => setSelectedOrder(order)}
                  sx={{
                    p: 2.5,
                    cursor: 'pointer',
                    borderRadius: 5,
                    border: `2px solid ${selectedOrder?._id === order._id ? COLORS.blue2 : 'white'}`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: selectedOrder?._id === order._id ? '0 10px 25px rgba(122, 168, 176, 0.15)' : '0 4px 12px rgba(0,0,0,0.02)',
                    '&:hover': { transform: 'translateX(8px)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.orderId}</Typography>
                    {getStatusChip(order.status)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, mb: 0.5 }}>{order.patientId?.name}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14 }} /> {order.deliveryAddress?.city}
                  </Typography>
                </Paper>
              ))
            )}
          </Stack>
        </Grid>

        {/* Right Column: Details */}
        <Grid item xs={12} md={8}>
          {selectedOrder ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 8, 
                border: `1px solid ${COLORS.border}`, 
                bgcolor: 'white',
                boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 24
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
                <Box>
                  <Chip label="Delivery Assignment" size="small" sx={{ mb: 1.5, bgcolor: COLORS.green1, color: COLORS.blue2, fontWeight: 800 }} />
                  <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text }}>{selectedOrder.orderId}</Typography>
                </Box>
                <IconButton onClick={() => setSelectedOrder(null)} sx={{ height: 48, width: 48, border: '1px solid #f1f5f9' }}>
                  <Close />
                </IconButton>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Recipient</Typography>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{selectedOrder.patientId?.name}</Typography>
                      <Stack spacing={1.5}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: COLORS.text }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'white', color: COLORS.blue2, display: 'flex' }}><Phone fontSize="small" /></Box>
                          {selectedOrder.patientId?.phone || 'No phone'}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: COLORS.text }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'white', color: COLORS.blue2, display: 'flex' }}><LocationOn fontSize="small" /></Box>
                          <Box>
                            {selectedOrder.deliveryAddress?.street}<br />
                            {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.postalCode}
                          </Box>
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>

                  <Button 
                    variant="contained" 
                    startIcon={<MapIcon />}
                    fullWidth
                    onClick={() => setMapDialogOpen(true)}
                    sx={{ 
                      borderRadius: 4, 
                      py: 2, 
                      bgcolor: COLORS.blue2, 
                      fontWeight: 800,
                      boxShadow: '0 10px 25px rgba(122, 168, 176, 0.2)',
                      '&:hover': { bgcolor: COLORS.blue1 }
                    }}
                  >
                    Open GPS Navigation
                  </Button>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Items</Typography>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {selectedOrder.items?.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.medicineName} <Box component="span" sx={{ color: COLORS.subtext, fontSize: '0.7rem' }}>x{item.quantity}</Box></Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Rs. {item.price * item.quantity}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 800 }}>Total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.blue2 }}>Rs. {selectedOrder.finalAmount}</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 'auto', pt: 4 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Status Control</Typography>
                    {selectedOrder.status === 'ready' && (
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<DirectionsCar />}
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery', 'Picked up')}
                        sx={{ borderRadius: 4, py: 2, bgcolor: COLORS.blue1, fontWeight: 800 }}
                      >
                        Start Delivery
                      </Button>
                    )}
                    {selectedOrder.status === 'out_for_delivery' && (
                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<CheckCircle />}
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered', 'Delivered')}
                        sx={{ borderRadius: 4, py: 2, bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 800 }}
                      >
                        Complete Delivery
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 10, textAlign: 'center', borderRadius: 8, border: `2px dashed ${COLORS.border}`, bgcolor: 'transparent' }}>
              <Box sx={{ p: 4, borderRadius: '50%', bgcolor: 'white', display: 'inline-flex', mb: 3 }}>
                <LocalShipping sx={{ fontSize: 80, color: COLORS.blue1, opacity: 0.2 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.subtext, mb: 1 }}>Ready for action?</Typography>
              <Typography sx={{ color: COLORS.subtext }}>Select an assignment to see the customer details and start your route.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>Navigation</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              width: '100%', 
              height: 350, 
              bgcolor: '#f8fafc', 
              borderRadius: 5, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              border: `1px solid #f1f5f9`
            }}
          >
            <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'white', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', mb: 3 }}>
              <LocationOn sx={{ fontSize: 48, color: '#f43f5e' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>{selectedOrder?.deliveryAddress?.street}</Typography>
            <Typography sx={{ color: COLORS.subtext, mb: 4 }}>{selectedOrder?.deliveryAddress?.city}, Sri Lanka</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setMapDialogOpen(false)} sx={{ fontWeight: 700, color: COLORS.subtext }}>Dismiss</Button>
          <Button 
            variant="contained" 
            sx={{ borderRadius: 4, px: 3, bgcolor: COLORS.blue2, fontWeight: 800 }}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder?.deliveryAddress?.street + ' ' + selectedOrder?.deliveryAddress?.city)}`, '_blank')}
          >
            Open Maps
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryDashboard;
