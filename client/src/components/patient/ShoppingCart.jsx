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
} from '@mui/material';
import { Delete, ShoppingCart as CartIcon, Payment, LocalShipping } from '@mui/icons-material';

const ShoppingCart = ({ cartItems, onRemoveItem, onSubmitOrder, latestPrescription, loading }) => {
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

  const handleRemoveItem = (index) => {
    onRemoveItem(index);
  };

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
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Shopping Cart</Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add medicines to your cart to get started
            </Typography>
          </Box>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <ListItem key={`${item.itemId}-${index}`} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Chip label={item.itemType} size="small" color="info" />
                      </Stack>
                    }
                    secondary={`Qty: ${item.quantity} × Rs. ${item.price} (${item.unit})`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton edge="end" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">Rs. {totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Delivery Fee:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deliveryFee === 0 ? (
                    <Chip label="FREE" size="small" color="success" />
                  ) : (
                    `Rs. ${deliveryFee.toFixed(2)}`
                  )}
                </Typography>
              </Box>
              {totalAmount < 1000 && (
                <Alert severity="info" sx={{ mt: 1, mb: 1, py: 0.5 }}>
                  Add Rs. {(1000 - totalAmount).toFixed(2)} more for free delivery!
                </Alert>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Rs. {finalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Tooltip
              title={
                latestPrescription ? 'Attach the most recent prescription to this request' : 'Upload a prescription first'
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={attachPrescription && !!latestPrescription}
                    onChange={(e) => setAttachPrescription(e.target.checked)}
                    disabled={!latestPrescription}
                  />
                }
                label={
                  latestPrescription
                    ? `Attach prescription (${latestPrescription.fileName || latestPrescription.id})`
                    : 'No prescription available'
                }
              />
            </Tooltip>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleSendToPharmacist}
              disabled={cartItems.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Payment />}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </>
        )}
      </CardContent>

      {/* Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
            <FormLabel component="legend">Choose how you want to pay:</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Box sx={{ 
                border: paymentMethod === 'online' ? 2 : 1, 
                borderColor: paymentMethod === 'online' ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }} onClick={() => setPaymentMethod('online')}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Radio value="online" />
                  <Box>
                    <Typography variant="h6">Online Payment</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pay securely with credit/debit card or digital wallet
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ 
                border: paymentMethod === 'cod' ? 2 : 1, 
                borderColor: paymentMethod === 'cod' ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }} onClick={() => setPaymentMethod('cod')}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Radio value="cod" />
                  <Box>
                    <Typography variant="h6">Cash on Delivery (COD)</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pay when you receive your order
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </RadioGroup>
          </FormControl>

          {latestPrescription && (
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={attachPrescription && !!latestPrescription}
                    onChange={(e) => setAttachPrescription(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    Attach prescription ({latestPrescription.fileName || latestPrescription.id})
                  </Typography>
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmOrder}
            startIcon={<LocalShipping />}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ShoppingCart;
