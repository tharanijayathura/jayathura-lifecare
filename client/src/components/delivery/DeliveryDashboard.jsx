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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  LocalShipping, 
  LocationOn, 
  Phone, 
  CheckCircle, 
  DirectionsCar,
  AccessTime,
  Person,
  Map as MapIcon,
  Close,
  ArrowBack
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [transitMilestone, setTransitMilestone] = useState('');
  const [transitLocation, setTransitLocation] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (activeOrderId = null) => {
    try {
      if (orders.length === 0) {
        setLoading(true);
      }
      const response = await deliveryAPI.getAssignedOrders();
      const updatedOrders = response.data || [];
      setOrders(updatedOrders);
      if (activeOrderId) {
        const found = updatedOrders.find(o => o._id === activeOrderId);
        if (found) {
          setSelectedOrder(found);
        }
      }
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status, message, location) => {
    try {
      await deliveryAPI.updateOrderStatus(orderId, { status, message, location });
      if (status === 'delivered') {
        setSelectedOrder(null);
        fetchOrders();
      } else {
        await fetchOrders(orderId);
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

  const totalCashToCollect = orders
    .filter(o => o.status !== 'delivered' && o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + (o.finalAmount || 0), 0);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Left Column: Tasks */}
        <Grid item xs={12} md={4} sx={{ display: isMobile && selectedOrder ? 'none' : 'block' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.text }}>
              Tasks <Box component="span" sx={{ color: COLORS.blue2 }}>({orders.length})</Box>
            </Typography>
            <IconButton onClick={() => fetchOrders()} sx={{ color: COLORS.blue2 }}><AccessTime /></IconButton>
          </Box>
          
          {/* COD Cash to Collect Summary */}
          {orders.length > 0 && totalCashToCollect > 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 3, 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: '#f0fdf4', 
                border: '1px solid #dcfce7', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)'
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>COD Cash to Collect</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#16a34a', mt: 0.5 }}>Rs. {totalCashToCollect.toFixed(2)}</Typography>
              </Box>
              <LocalShipping sx={{ color: '#16a34a', fontSize: 32, opacity: 0.8 }} />
            </Paper>
          )}

          <Stack spacing={2}>
            {orders.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: `2px dashed ${COLORS.border}`, bgcolor: 'transparent' }}>
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
                    px: 3,
                    py: 2.5,
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: `2px solid ${selectedOrder?._id === order._id ? COLORS.blue2 : 'white'}`,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: selectedOrder?._id === order._id ? '0 10px 25px rgba(122, 168, 176, 0.15)' : '0 4px 12px rgba(0,0,0,0.02)',
                    '&:hover': { transform: 'translateX(8px)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                      #{order.orderId || order._id.slice(-6).toUpperCase()}
                    </Typography>
                    {getStatusChip(order.status)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text, mb: 0.5 }}>{order.patientId?.name}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14 }} /> {order.deliveryAddress?.city || 'Not specified'}
                  </Typography>

                  {order.trackingHistory && order.trackingHistory.length > 0 && (
                    <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px dashed #e2e8f0' }}>
                      <Typography variant="caption" sx={{ color: COLORS.blue2, fontWeight: 700, display: 'block' }}>
                        LATEST: {order.trackingHistory[order.trackingHistory.length - 1].message}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))
            )}
          </Stack>
        </Grid>

        {/* Right Column: Details */}
        <Grid item xs={12} md={8} sx={{ display: isMobile && !selectedOrder ? 'none' : 'block' }}>
          {selectedOrder ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 3, 
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
                  <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text }}>
                    #{selectedOrder.orderId || selectedOrder._id.slice(-6).toUpperCase()}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setSelectedOrder(null)} 
                  sx={{ height: 48, width: 48, border: '1px solid #f1f5f9', color: COLORS.blue2 }}
                >
                  {isMobile ? <ArrowBack /> : <Close />}
                </IconButton>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Recipient</Typography>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{selectedOrder.patientId?.name}</Typography>
                      <Stack spacing={1.5}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: COLORS.text }}>
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'white', color: COLORS.blue2, display: 'flex' }}><Phone fontSize="small" /></Box>
                          {selectedOrder.patientId?.phone || 'No phone'}
                        </Typography>
                        
                        {/* Call and WhatsApp Shortcuts */}
                        {selectedOrder.patientId?.phone && (
                          <Stack direction="row" spacing={1} sx={{ mt: 1, pl: 0.5 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              href={`tel:${selectedOrder.patientId.phone}`}
                              sx={{ 
                                borderRadius: 2, 
                                fontSize: '0.7rem', 
                                py: 0.5, 
                                px: 1.5, 
                                color: COLORS.blue2, 
                                borderColor: COLORS.blue2,
                                fontWeight: 700,
                                textTransform: 'none'
                              }}
                            >
                              Call
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => window.open(`https://wa.me/${selectedOrder.patientId.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                              sx={{ 
                                borderRadius: 2, 
                                fontSize: '0.7rem', 
                                py: 0.5, 
                                px: 1.5, 
                                color: '#16a34a', 
                                borderColor: '#16a34a',
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#f0fdf4', borderColor: '#16a34a' }
                              }}
                            >
                              WhatsApp
                            </Button>
                          </Stack>
                        )}

                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: COLORS.text, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
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
                      borderRadius: 3, 
                      py: 2, 
                      bgcolor: COLORS.blue2, 
                      color: 'white',
                      fontWeight: 800,
                      boxShadow: '0 10px 25px rgba(122, 168, 176, 0.2)',
                      '&:hover': { bgcolor: COLORS.blue1 }
                    }}
                  >
                    Open GPS Navigation
                  </Button>

                  {/* Milestone History Log Timeline */}
                  {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 && (
                    <Box sx={{ mt: 5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Milestone Log
                      </Typography>
                      <Stack spacing={3} sx={{ position: 'relative', pl: 3.5, '&::before': { content: '""', position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', bgcolor: 'rgba(122, 168, 176, 0.2)' } }}>
                        {selectedOrder.trackingHistory.map((hist, idx) => (
                          <Box key={idx} sx={{ position: 'relative' }}>
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                left: '-33px', 
                                top: '4px', 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                bgcolor: idx === selectedOrder.trackingHistory.length - 1 ? '#059669' : COLORS.blue2,
                                border: '3px solid white',
                                boxShadow: '0 0 0 2px rgba(122, 168, 176, 0.15)'
                              }} 
                            />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, fontSize: '0.85rem' }}>
                              {hist.message}
                            </Typography>
                            {hist.location && hist.location !== 'In Transit' && hist.location !== 'Pharmacy Hub' && (
                              <Typography variant="caption" sx={{ color: COLORS.blue2, fontWeight: 700, display: 'block', mt: 0.3 }}>
                                {hist.location}
                              </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600, display: 'block', mt: 0.3 }}>
                              {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(hist.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
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
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery', 'Order picked up from pharmacy hub', 'Pharmacy Hub')}
                        sx={{ borderRadius: 3, py: 2, bgcolor: COLORS.blue1, color: 'white', fontWeight: 800 }}
                      >
                        Start Delivery
                      </Button>
                    )}
                    {selectedOrder.status === 'out_for_delivery' && (
                      <Stack spacing={3}>
                        {/* Transit Milestones Form */}
                        <Box sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${COLORS.border}`, bgcolor: '#f8fafc' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: COLORS.text, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DirectionsCar fontSize="small" sx={{ color: COLORS.blue2 }} /> Update Transit Milestone
                          </Typography>
                          
                          <Stack spacing={2}>
                            <FormControl size="small" fullWidth>
                              <InputLabel>Choose Milestone</InputLabel>
                              <Select
                                value={transitMilestone}
                                onChange={(e) => setTransitMilestone(e.target.value)}
                                label="Choose Milestone"
                                sx={{ bgcolor: 'white', borderRadius: 2 }}
                              >
                                <MenuItem value="Took the package from the pharmacy">Took the package from the pharmacy</MenuItem>
                                <MenuItem value="Near to your city">Near to your city</MenuItem>
                                <MenuItem value="Out for delivery">Out for delivery</MenuItem>
                              </Select>
                            </FormControl>

                            <TextField
                              size="small"
                              fullWidth
                              label="Current Location (Optional)"
                              value={transitLocation}
                              onChange={(e) => setTransitLocation(e.target.value)}
                              placeholder="e.g. Colombo 03, Kandy Hub"
                              sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />

                            <Button
                              variant="outlined"
                              size="small"
                              disabled={!transitMilestone && !transitLocation}
                              onClick={() => {
                                let fullMsg = '';
                                if (transitMilestone) {
                                  fullMsg = `${transitMilestone}${transitLocation ? ` (${transitLocation})` : ''}`;
                                } else {
                                  fullMsg = `Transit location updated to ${transitLocation}`;
                                }
                                const defaultLoc = transitMilestone === 'Took the package from the pharmacy' ? 'Pharmacy Hub' : 'In Transit';
                                handleUpdateStatus(selectedOrder._id, 'out_for_delivery', fullMsg, transitLocation || defaultLoc);
                                setTransitMilestone('');
                                setTransitLocation('');
                              }}
                              sx={{ 
                                borderRadius: 3, 
                                fontWeight: 800, 
                                color: COLORS.blue2, 
                                borderColor: COLORS.blue2,
                                py: 1,
                                textTransform: 'none',
                                '&:hover': { bgcolor: COLORS.green1, borderColor: COLORS.blue2 }
                              }}
                            >
                              Post Milestone
                            </Button>
                          </Stack>
                        </Box>

                        {/* Complete Delivery Action */}
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<CheckCircle />}
                          onClick={() => handleUpdateStatus(
                            selectedOrder._id, 
                            'delivered', 
                            'Order successfully delivered and COD payment collected.', 
                            'Customer Address'
                          )}
                          sx={{ 
                            borderRadius: 3, 
                            py: 2, 
                            bgcolor: COLORS.green3, 
                            color: COLORS.text, 
                            fontWeight: 800,
                            boxShadow: '0 8px 20px rgba(171, 231, 178, 0.3)',
                            '&:hover': { bgcolor: '#9ae2a1' }
                          }}
                        >
                          Complete Delivery & Confirm COD
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 10, textAlign: 'center', borderRadius: 3, border: `2px dashed ${COLORS.border}`, bgcolor: 'transparent' }}>
              <Box sx={{ p: 4, borderRadius: '50%', bgcolor: 'white', display: 'inline-flex', mb: 3 }}>
                <LocalShipping sx={{ fontSize: 80, color: COLORS.blue1, opacity: 0.2 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.subtext, mb: 1 }}>Ready for action?</Typography>
              <Typography sx={{ color: COLORS.subtext }}>Select an assignment to see the customer details and start your route.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>Navigation</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              width: '100%', 
              height: 350, 
              bgcolor: '#f8fafc', 
              borderRadius: 3, 
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
            sx={{ borderRadius: 3, px: 3, bgcolor: COLORS.blue2, color: 'white', fontWeight: 800 }}
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
