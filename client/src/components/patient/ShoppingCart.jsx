import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Paper,
  TextField,
  Grid
} from '@mui/material';
import { Delete, ShoppingCart as CartIcon, Payment, LocalShipping, ReceiptLong, CheckCircleOutline, ShoppingBag, LocationOn, LocalOffer } from '@mui/icons-material';

const ShoppingCart = ({ cartItems, onRemoveItem, onSubmitOrder, latestPrescription, loading, orderId }) => {
  const [attachPrescription, setAttachPrescription] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [deliveryAddress, setDeliveryAddress] = useState({ street: '', city: '', postalCode: '' });

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

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = totalAmount > 1000 ? 0 : 200;
  const finalAmount = totalAmount + deliveryFee;

  useEffect(() => {
    if (!latestPrescription) {
      setAttachPrescription(false);
    }
  }, [latestPrescription]);

  const handleSendToPharmacist = () => {
    setPaymentDialogOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!deliveryAddress.street || !deliveryAddress.city) {
      alert('Please provide a delivery address');
      return;
    }
    setPaymentDialogOpen(false);
    onSubmitOrder?.({
      attachPrescription: attachPrescription && !!latestPrescription,
      paymentMethod: paymentMethod,
      deliveryAddress: deliveryAddress
    });
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 6, 
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 15px 45px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        position: 'sticky',
        top: 24,
        bgcolor: 'white'
      }}
    >
      <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: COLORS.green1, color: COLORS.blue2, display: 'flex' }}>
            <ShoppingBag />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.text }}>Cart Summary</Typography>
        </Stack>
        {cartItems.length > 0 && (
          <Chip label={`${cartItems.length} items`} size="small" sx={{ bgcolor: COLORS.text, fontWeight: 800, color: 'white', borderRadius: 2 }} />
        )}
      </Box>

      <CardContent sx={{ p: 0 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
            <Box sx={{ p: 3, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'inline-flex', mb: 3 }}>
              <CartIcon sx={{ fontSize: 64, color: COLORS.blue1, opacity: 0.3 }} />
            </Box>
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 900, mb: 1 }}>Your cart is empty</Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500 }}>
              Discover health essentials in our catalog and start building your order.
            </Typography>
          </Box>
        ) : (
          <Box>
            <List sx={{ maxHeight: '420px', overflowY: 'auto', py: 0 }}>
              {cartItems.map((item, index) => {
                const uniqueKey = item.uniqueKey || item.orderItemId || `${item.itemId}-${index}`;
                return (
                  <React.Fragment key={uniqueKey}>
                    <ListItem sx={{ py: 3, px: 3, alignItems: 'flex-start' }}>
                      <ListItemAvatar sx={{ mt: 0.5 }}>
                        <Avatar
                          variant="rounded"
                          src={item.image}
                          sx={{ width: 64, height: 64, bgcolor: '#f8fafc', borderRadius: 3, border: `1px solid ${COLORS.border}` }}
                        >
                          <LocalPharmacy />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ ml: 1 }}
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text, mb: 0.5 }}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={1}>
                            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>
                              {item.quantity} units • Rs. {item.price?.toFixed(2)} /ea
                            </Typography>
                            <Chip 
                              label={item.itemType?.toUpperCase() || 'OTC'} 
                              size="small" 
                              variant="outlined" 
                              sx={{ fontSize: '0.6rem', height: 18, width: 'fit-content', fontWeight: 800, color: COLORS.blue2, borderColor: COLORS.blue1 }} 
                            />
                          </Stack>
                        }
                      />
                      <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Typography sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => onRemoveItem(index)} 
                          sx={{ 
                            color: '#f43f5e', 
                            bgcolor: '#fff1f2',
                            '&:hover': { bgcolor: '#ffe4e6' } 
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider sx={{ mx: 3, borderStyle: 'dashed' }} />
                  </React.Fragment>
                );
              })}
            </List>

            <Box sx={{ p: 4, bgcolor: '#f8fafc' }}>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text }}>Rs. {totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Delivery Logistics</Typography>
                  {deliveryFee === 0 ? (
                    <Chip label="COMPLIMENTARY" size="small" sx={{ bgcolor: COLORS.green3, color: '#059669', fontWeight: 900, fontSize: '0.65rem' }} />
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text }}>Rs. {deliveryFee.toFixed(2)}</Typography>
                  )}
                </Box>
                {totalAmount < 1000 && (
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: COLORS.green1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <LocalOffer sx={{ color: '#059669', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                      Add Rs. {(1000 - totalAmount).toFixed(2)} for <strong>Free Express Delivery</strong>
                    </Typography>
                  </Paper>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>Final Total</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.blue2 }}>Rs. {finalAmount.toFixed(2)}</Typography>
                </Box>
              </Stack>

              {latestPrescription && (
                <Paper elevation={0} sx={{ mt: 4, p: 2, bgcolor: 'white', borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
                  <FormControlLabel
                    sx={{ width: '100%', m: 0 }}
                    control={
                      <Switch
                        checked={attachPrescription}
                        onChange={(e) => setAttachPrescription(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.blue2 },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: COLORS.blue2 }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.text, display: 'block' }}>Attach Verified Prescription</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 500 }}>{latestPrescription.originalName || 'Latest upload'}</Typography>
                      </Box>
                    }
                  />
                </Paper>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 4, 
                  py: 2, 
                  borderRadius: 4, 
                  fontWeight: 900, 
                  bgcolor: COLORS.text, 
                  color: 'white',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                  '&:disabled': { bgcolor: '#e2e8f0' }
                }}
                onClick={handleSendToPharmacist}
                disabled={cartItems.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutline />}
              >
                {loading ? 'Finalizing...' : 'Proceed to Checkout'}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Payment Method Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 8, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, pt: 3, px: 3 }}>Order Placement</DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Strategy</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <Stack spacing={2}>
                <Paper 
                  elevation={0}
                  onClick={() => setPaymentMethod('online')}
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 4, 
                    cursor: 'pointer',
                    border: `2px solid ${paymentMethod === 'online' ? COLORS.blue2 : '#f1f5f9'}`,
                    bgcolor: paymentMethod === 'online' ? COLORS.green1 : 'white',
                    transition: 'all 0.2s'
                  }} 
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Radio value="online" size="small" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Online Checkout</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 500 }}>Secure Card/Wallet Payment</Typography>
                    </Box>
                  </Stack>
                </Paper>
                <Paper 
                  elevation={0}
                  onClick={() => setPaymentMethod('cod')}
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 4, 
                    cursor: 'pointer',
                    border: `2px solid ${paymentMethod === 'cod' ? COLORS.blue2 : '#f1f5f9'}`,
                    bgcolor: paymentMethod === 'cod' ? COLORS.green1 : 'white',
                    transition: 'all 0.2s'
                  }} 
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Radio value="cod" size="small" />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Pay on Arrival</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 500 }}>Cash on Delivery Service</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </RadioGroup>

            <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.blue2, mt: 5, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>Shipping Destination</Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Street Address"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                InputProps={{ sx: { borderRadius: 4, bgcolor: '#f8fafc' }, startAdornment: <LocationOn sx={{ color: '#cbd5e1', mr: 1, fontSize: 20 }} /> }}
              />
              <TextField
                fullWidth
                label="City / District"
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                InputProps={{ sx: { borderRadius: 4, bgcolor: '#f8fafc' } }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} sx={{ fontWeight: 700, color: COLORS.subtext }}>Dismiss</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmOrder}
            sx={{ borderRadius: 4, px: 4, py: 1.5, bgcolor: COLORS.text, fontWeight: 900, '&:hover': { bgcolor: '#000' } }}
          >
            Confirm & Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ShoppingCart;
