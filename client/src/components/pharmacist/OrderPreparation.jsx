import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Stack, 
  IconButton, 
  Checkbox, 
  Divider,
  CircularProgress,
  Grid
} from '@mui/material';
import { ArrowBack, CheckCircle, Print, LocalShipping, FactCheck, Person, LocationOn } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';
import OrderTrackingStepper from '../patient/orders/OrderTrackingStepper';

const OrderPreparation = ({ order: initialOrder, onBack }) => {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [pickedItems, setPickedItems] = useState({});

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
    if (order?.items) {
      const initialPicked = {};
      order.items.forEach((_, idx) => initialPicked[idx] = false);
      setPickedItems(initialPicked);
    }
  }, [order]);

  const handleTogglePick = (idx) => {
    setPickedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleMarkReady = async () => {
    try {
      setLoading(true);
      await pharmacistAPI.updateOrderStatus(order._id, { 
        status: 'ready', 
        message: 'Order has been packed and is ready for delivery' 
      });
      onBack();
    } catch (err) {
      console.error('Error marking order as ready:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  const allPicked = order.items?.every((_, idx) => pickedItems[idx]);

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <IconButton 
          onClick={onBack} 
          sx={{ bgcolor: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.blue2, '&:hover': { bgcolor: COLORS.green1 } }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 0.5 }}>
            Packing Station
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Order #{order.orderId || order._id.slice(-6).toUpperCase()} • Verification & Item Picking
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ borderRadius: 6, border: `1px solid ${COLORS.border}`, overflow: 'hidden', mb: 4 }}>
            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: COLORS.text }}>Inventory Picking List</Typography>
              <Chip 
                label={`${Object.values(pickedItems).filter(Boolean).length}/${order.items?.length || 0} Items Picked`} 
                size="small" 
                sx={{ bgcolor: COLORS.green1, color: '#059669', fontWeight: 800, borderRadius: 2 }} 
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Confirmation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, idx) => (
                    <TableRow key={idx} sx={{ 
                      bgcolor: pickedItems[idx] ? 'rgba(171, 231, 178, 0.05)' : 'inherit',
                      '& td': { borderBottom: '1px solid #f1f5f9', py: 2 }
                    }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: pickedItems[idx] ? '#94a3b8' : COLORS.text, textDecoration: pickedItems[idx] ? 'line-through' : 'none' }}>
                          {item.medicineName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.dosage || 'Standard Dosage'}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontWeight: 800 }}>{item.quantity} Units</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Checkbox 
                          checked={pickedItems[idx] || false} 
                          onChange={() => handleTogglePick(idx)}
                          sx={{ color: COLORS.blue2, '&.Mui-checked': { color: '#059669' } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {order.status !== 'draft' && order.status !== 'pending' && (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                Fulfillment Status
              </Typography>
              <OrderTrackingStepper status={order.status} history={order.trackingHistory} />
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={4} sx={{ position: 'sticky', top: 24 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                Shipment Destination
              </Typography>
              <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS.blue1, width: 32, height: 32 }}><Person fontSize="small" /></Avatar>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{order.patientId?.name || 'Unknown Patient'}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <LocationOn sx={{ color: COLORS.blue2, mt: 0.5 }} fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: COLORS.subtext }}>
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}<br />
                    {order.deliveryAddress?.postalCode}
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

              <Stack spacing={1.5} sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {order.totalAmount?.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Delivery Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {order.deliveryFee?.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ pt: 1 }}>
                  <Typography sx={{ fontWeight: 900 }}>Total Value</Typography>
                  <Typography variant="h6" sx={{ color: COLORS.blue2, fontWeight: 900 }}>Rs. {order.finalAmount?.toFixed(2)}</Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  disabled={!allPicked || loading || order.status === 'ready'}
                  onClick={handleMarkReady}
                  fullWidth
                  sx={{ 
                    py: 2, 
                    borderRadius: 4, 
                    bgcolor: COLORS.text, 
                    color: 'white', 
                    fontWeight: 900,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#000' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : order.status === 'ready' ? 'Awaiting Dispatch' : 'Complete Packing'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Print />} 
                  fullWidth 
                  sx={{ borderRadius: 4, py: 1.5, borderColor: COLORS.blue2, color: COLORS.blue2, fontWeight: 700 }}
                >
                  Print Shipping Label
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPreparation;
