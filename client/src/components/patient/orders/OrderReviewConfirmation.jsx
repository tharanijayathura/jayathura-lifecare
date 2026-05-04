import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Stack, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import { Delete, CheckCircle, LocationOn, LocalPharmacy } from '@mui/icons-material';
import { patientAPI } from '../../../services/api';

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

const OrderReviewConfirmation = ({ order: initialOrder, onConfirmed }) => {
  const [order, setOrder] = useState(initialOrder);
  const [items, setItems] = useState(initialOrder.items || []);
  const [address, setAddress] = useState(initialOrder.deliveryAddress || {
    street: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState(initialOrder?.paymentMethod || 'cod');
  const [loading, setLoading] = useState(false);

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => (item._id || item.id) !== itemId));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const subtotal = calculateSubtotal();
      const deliveryFee = subtotal > 1000 ? 0 : 200;
      
      const updateData = {
        items: items,
        deliveryAddress: address,
        paymentMethod: paymentMethod,
        status: 'confirmed',
        totalAmount: subtotal,
        deliveryFee: deliveryFee,
        finalAmount: subtotal + deliveryFee
      };

      await patientAPI.confirmOrder(order._id, updateData);
      onConfirmed();
    } catch (err) {
      console.error('Confirmation error:', err);
      alert('Failed to confirm order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: COLORS.text }}>Review & Confirm Order</Typography>
      
      <Grid container spacing={3}>
        {/* Left Side: Items & Address */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocalPharmacy sx={{ mr: 1, color: COLORS.blue2 }} /> Review Medicine Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={item?._id || item?.id || idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{item?.medicineName || 'Unknown Item'}</Typography>
                          {item?.dosage && <Typography variant="caption" color="text.secondary">{item.dosage}</Typography>}
                        </TableCell>
                        <TableCell>{item?.quantity || 0}</TableCell>
                        <TableCell>Rs. {((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(item?._id || item?.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, color: COLORS.blue2 }} /> Delivery Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Street Address" 
                    value={address.street} 
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="City" 
                    value={address.city} 
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="Postal Code" 
                    value={address.postalCode} 
                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>

        {/* Right Side: Payment & Totals */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: COLORS.green1 }}>
            <Stack direction="row" spacing={2}>
              <Button 
                variant={paymentMethod === 'online' ? 'contained' : 'outlined'} 
                onClick={() => setPaymentMethod('online')} 
                fullWidth
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: paymentMethod === 'online' ? COLORS.blue2 : 'white',
                  color: paymentMethod === 'online' ? 'white' : COLORS.text,
                  '&:hover': { bgcolor: paymentMethod === 'online' ? COLORS.blue1 : COLORS.green1 }
                }}
              >
                Online
              </Button>
              <Button 
                variant={paymentMethod === 'cod' ? 'contained' : 'outlined'} 
                onClick={() => setPaymentMethod('cod')} 
                fullWidth
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: paymentMethod === 'cod' ? COLORS.blue2 : 'white',
                  color: paymentMethod === 'cod' ? 'white' : COLORS.text,
                  '&:hover': { bgcolor: paymentMethod === 'cod' ? COLORS.blue1 : COLORS.green1 }
                }}
              >
                COD
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>Rs. {calculateSubtotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Delivery Fee</Typography>
                <Typography variant="body2" fontWeight={600}>Rs. {(calculateSubtotal() > 1000 ? 0 : 200).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={800}>Final Amount</Typography>
                <Typography variant="h6" fontWeight={800} color={COLORS.blue2}>
                  Rs. {(calculateSubtotal() + (calculateSubtotal() > 1000 ? 0 : 200)).toFixed(2)}
                </Typography>
              </Box>
            </Stack>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
              onClick={handleConfirm}
              disabled={loading || items.length === 0 || !address.street || !address.city}
              sx={{ 
                mt: 4, 
                borderRadius: 3, 
                bgcolor: COLORS.blue2, 
                fontWeight: 700,
                py: 1.5,
                '&:hover': { bgcolor: COLORS.blue1 }
              }}
            >
              Confirm & Place Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReviewConfirmation;
