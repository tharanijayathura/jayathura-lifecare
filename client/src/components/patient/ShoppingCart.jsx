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
} from '@mui/material';
import { Delete, ShoppingCart as CartIcon, Payment, LocalShipping, ReceiptLong, CheckCircleOutline } from '@mui/icons-material';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
  paper: 'rgba(255,255,255,0.9)',
};

const ShoppingCart = ({ cartItems, onRemoveItem, onSubmitOrder, latestPrescription, loading, orderId }) => {
  const [attachPrescription, setAttachPrescription] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
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
    setPaymentDialogOpen(false);
    onSubmitOrder?.({
      attachPrescription: attachPrescription && !!latestPrescription,
      paymentMethod: paymentMethod,
    });
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 4, 
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 8px 32px rgba(44,62,80,0.08)',
        overflow: 'hidden',
        position: 'sticky',
        top: 20
      }}
    >
      <Box sx={{ p: 2.5, bgcolor: COLORS.green1, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CartIcon sx={{ color: COLORS.text }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>Your Cart</Typography>
        </Stack>
        {cartItems.length > 0 && (
          <Chip label={`${cartItems.length} items`} size="small" sx={{ bgcolor: 'white', fontWeight: 700, color: COLORS.text }} />
        )}
      </Box>

      <CardContent sx={{ p: 0 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <CartIcon sx={{ fontSize: 80, color: COLORS.blue2, mb: 2, opacity: 0.2 }} />
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 700 }}>Empty Cart</Typography>
            <Typography variant="body2" sx={{ color: COLORS.subtext }}>
              Start adding medicines or healthcare products to see them here.
            </Typography>
          </Box>
        ) : (
          <Box>
            <List sx={{ maxHeight: '400px', overflowY: 'auto', p: 0 }}>
              {cartItems.map((item, index) => {
                const uniqueKey = item.uniqueKey || item.orderItemId || `${item.itemId}-${index}`;
                return (
                  <React.Fragment key={uniqueKey}>
                    <ListItem sx={{ py: 2, px: 2.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 56, height: 56, bgcolor: COLORS.green1, border: `1px solid ${COLORS.border}` }}
                        >
                          <CartIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text }}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                              Qty: {item.quantity} × Rs. {item.price?.toFixed(2)}
                            </Typography>
                            <Chip label={item.itemType} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18, width: 'fit-content', borderColor: COLORS.blue1 }} />
                          </Stack>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack alignItems="flex-end">
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5 }}>
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton size="small" onClick={() => onRemoveItem(index)} sx={{ color: 'error.light', '&:hover': { bgcolor: 'error.lighter' } }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.04)' }} />
                  </React.Fragment>
                );
              })}
            </List>

            <Box sx={{ p: 3, bgcolor: 'rgba(236, 244, 232, 0.3)' }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: COLORS.subtext }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text }}>Rs. {totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: COLORS.subtext }}>Delivery Fee</Typography>
                  {deliveryFee === 0 ? (
                    <Chip label="FREE" size="small" color="success" sx={{ height: 20, fontWeight: 700, fontSize: '0.65rem' }} />
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text }}>Rs. {deliveryFee.toFixed(2)}</Typography>
                  )}
                </Box>
                {totalAmount < 1000 && (
                  <Alert severity="info" variant="outlined" sx={{ border: `1px dashed ${COLORS.blue1}`, py: 0.5, '& .MuiAlert-message': { fontSize: '0.75rem' } }}>
                    Add Rs. {(1000 - totalAmount).toFixed(2)} more for <strong>Free Delivery</strong>
                  </Alert>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.blue2 }}>Rs. {finalAmount.toFixed(2)}</Typography>
                </Box>
              </Stack>

              {latestPrescription && (
                <Paper sx={{ mt: 2, p: 1.5, bgcolor: 'white', borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attachPrescription}
                        onChange={(e) => setAttachPrescription(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.text, display: 'block' }}>Attach Prescription</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>{latestPrescription.originalName || 'Latest upload'}</Typography>
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
                  mt: 3, 
                  py: 1.5, 
                  borderRadius: 3, 
                  fontWeight: 700, 
                  bgcolor: COLORS.green3, 
                  color: COLORS.text,
                  boxShadow: '0 4px 14px rgba(171, 231, 178, 0.4)',
                  '&:hover': { bgcolor: COLORS.green2 }
                }}
                onClick={handleSendToPharmacist}
                disabled={cartItems.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Payment />}
              >
                {loading ? 'Processing...' : 'Secure Checkout'}
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
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Checkout Options</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ width: '100%', mt: 1 }}>
            <FormLabel component="legend" sx={{ mb: 2, fontSize: '0.875rem' }}>Select Payment Method</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Paper 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  borderColor: paymentMethod === 'online' ? COLORS.blue2 : COLORS.border,
                  bgcolor: paymentMethod === 'online' ? COLORS.green1 : 'white',
                  '&:hover': { borderColor: COLORS.blue2 }
                }} 
                onClick={() => setPaymentMethod('online')}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Radio value="online" size="small" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Card / Online Payment</Typography>
                    <Typography variant="caption" color="text.secondary">Secure payment via gateway</Typography>
                  </Box>
                </Stack>
              </Paper>
              <Paper 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  borderColor: paymentMethod === 'cod' ? COLORS.blue2 : COLORS.border,
                  bgcolor: paymentMethod === 'cod' ? COLORS.green1 : 'white',
                  '&:hover': { borderColor: COLORS.blue2 }
                }} 
                onClick={() => setPaymentMethod('cod')}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Radio value="cod" size="small" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Cash on Delivery</Typography>
                    <Typography variant="caption" color="text.secondary">Pay when you receive items</Typography>
                  </Box>
                </Stack>
              </Paper>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} sx={{ fontWeight: 600, color: COLORS.subtext }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmOrder}
            startIcon={<CheckCircleOutline />}
            sx={{ borderRadius: 2.5, px: 3, bgcolor: COLORS.blue2, fontWeight: 700, '&:hover': { bgcolor: COLORS.blue1 } }}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ShoppingCart;
