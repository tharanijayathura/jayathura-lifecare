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
  CircularProgress
} from '@mui/material';
import { ArrowBack, CheckCircle, Print, LocalShipping } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';
import OrderTrackingStepper from '../patient/orders/OrderTrackingStepper';

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

const OrderPreparation = ({ order: initialOrder, onBack }) => {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [pickedItems, setPickedItems] = useState({});

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
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} sx={{ bgcolor: COLORS.green1 }}><ArrowBack /></IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>Preparing Order {order.orderId}</Typography>
          <Typography variant="body2" sx={{ color: COLORS.subtext }}>Customer: {order.patientId?.name || 'N/A'}</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
            <Table>
              <TableHead sx={{ bgcolor: COLORS.green1 }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Required Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Pick Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, idx) => (
                  <TableRow key={idx} sx={{ bgcolor: pickedItems[idx] ? 'rgba(171, 231, 178, 0.05)' : 'inherit' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{item.medicineName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Checkbox 
                          checked={pickedItems[idx] || false} 
                          onChange={() => handleTogglePick(idx)}
                          sx={{ color: COLORS.blue2, '&.Mui-checked': { color: COLORS.green3 } }}
                        />
                        <Typography variant="body2" sx={{ color: pickedItems[idx] ? COLORS.text : COLORS.subtext }}>
                          {pickedItems[idx] ? 'Picked' : 'Pending'}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {order.status !== 'draft' && order.status !== 'pending' && (
            <Paper sx={{ p: 3, mt: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 1, color: COLORS.blue2 }} /> Tracking Status
              </Typography>
              <OrderTrackingStepper status={order.status} history={order.trackingHistory} />
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}`, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Packing Station</Typography>
            <Stack spacing={3}>
              <Box sx={{ p: 2, bgcolor: COLORS.green1, borderRadius: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, textTransform: 'uppercase' }}>Delivery Address</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                  {order.deliveryAddress?.street}<br />
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.postalCode}
                </Typography>
              </Box>
              
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {order.totalAmount?.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Delivery Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {order.deliveryFee?.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" sx={{ color: COLORS.blue2, fontWeight: 800 }}>Rs. {order.finalAmount?.toFixed(2)}</Typography>
                </Box>
              </Stack>

              <Button 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />} 
                fullWidth
                disabled={!allPicked || loading || order.status === 'ready'}
                onClick={handleMarkReady}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 3, 
                  bgcolor: COLORS.green3, 
                  color: COLORS.text, 
                  fontWeight: 700,
                  '&:hover': { bgcolor: COLORS.green2 }
                }}
              >
                {order.status === 'ready' ? 'Ready for Assignment' : 'Mark as Ready'}
              </Button>
              
              <Button variant="outlined" startIcon={<Print />} fullWidth sx={{ borderRadius: 3, borderColor: COLORS.blue2, color: COLORS.blue2 }}>
                Print Label
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Import Grid at the top
import { Grid } from '@mui/material';

export default OrderPreparation;
