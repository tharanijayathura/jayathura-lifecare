import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import { 
  LocalPharmacy, 
  ShoppingCart, 
  Send,
  CheckCircle,
  AddShoppingCart
} from '@mui/icons-material';
import MedicineCatalog from './MedicineCatalog';
import GroceryCatalog from './GroceryCatalog';
import { patientAPI } from '../../services/api';

const AddItemsToPrescription = ({ orderId, open, onClose, onSent }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [catalogTab, setCatalogTab] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const steps = ['Add Items (Optional)', 'Review & Send'];

  useEffect(() => {
    if (open && orderId) {
      loadOrderItems();
    }
  }, [open, orderId]);

  const loadOrderItems = async () => {
    try {
      const response = await patientAPI.getOrderStatus(orderId);
      if (response.data?.items) {
        const orderItems = response.data.items.map(orderItem => ({
          itemId: orderItem.medicineId?._id || orderItem.medicineId,
          name: orderItem.medicineName || orderItem.medicineId?.name,
          price: orderItem.price || 0,
          quantity: orderItem.quantity || 1,
          itemType: orderItem.isPrescription ? 'Prescription' : 
                   orderItem.category === 'groceries' ? 'Grocery' : 'Non Prescription',
          image: orderItem.medicineId?.image,
          orderItemId: orderItem._id
        }));
        setCartItems(orderItems);
      }
    } catch (error) {
      console.error('Error loading order items:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setLoading(true);
      const response = await patientAPI.addToCart({
        orderId: orderId,
        medicineId: item.itemId,
        quantity: item.quantity || 1
      });

      if (response.data?.order) {
        const order = response.data.order;
        const orderItems = (order.items || []).map(orderItem => ({
          itemId: orderItem.medicineId?._id || orderItem.medicineId,
          name: orderItem.medicineName || orderItem.medicineId?.name,
          price: orderItem.price || 0,
          quantity: orderItem.quantity || 1,
          itemType: orderItem.isPrescription ? 'Prescription' : 
                   orderItem.category === 'groceries' ? 'Grocery' : 'Non Prescription',
          image: orderItem.medicineId?.image,
          orderItemId: orderItem._id
        }));
        setCartItems(orderItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (index) => {
    const item = cartItems[index];
    try {
      if (item.orderItemId) {
        await patientAPI.removeOrderItem(orderId, item.orderItemId);
        await loadOrderItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      await loadOrderItems();
    }
  };

  const handleSendToPharmacist = async () => {
    try {
      setSending(true);
      await patientAPI.sendOrderToPharmacist(orderId);
      onSent?.();
      onClose();
    } catch (error) {
      console.error('Error sending to pharmacist:', error);
      alert(error.response?.data?.message || 'Failed to send order to pharmacist');
    } finally {
      setSending(false);
    }
  };

  const prescriptionItems = cartItems.filter(i => i.itemType === 'Prescription');
  const otcItems = cartItems.filter(i => i.itemType === 'Non Prescription' || i.itemType === 'OTC');
  const groceryItems = cartItems.filter(i => i.itemType === 'Grocery');
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <LocalPharmacy color="primary" />
          <Typography variant="h6">Add Items to Prescription Order</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Optional:</strong> You can add non prescription items and groceries to your prescription order, or send it directly to the pharmacist without adding any items.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
              <strong>Note:</strong> Delivery address will be required later when you confirm the final order after pharmacist generates the bill.
            </Typography>
          </Alert>
        </Box>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Tabs
                    value={catalogTab}
                    onChange={(e, newValue) => setCatalogTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                  >
                    <Tab label="Non Prescription Items" icon={<LocalPharmacy />} />
                    <Tab label="Groceries" icon={<ShoppingCart />} />
                  </Tabs>

                  {catalogTab === 0 ? (
                    <MedicineCatalog onAddToCart={handleAddToCart} />
                  ) : (
                    <GroceryCatalog onAddToCart={handleAddToCart} />
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Current Items
                  </Typography>

                  {cartItems.length === 0 ? (
                    <Alert severity="info">
                      No items added yet. You can add non prescription items or groceries, or skip and send directly.
                    </Alert>
                  ) : (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {prescriptionItems.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" color="primary" fontWeight={600}>
                            Prescription Medicines: {prescriptionItems.length}
                          </Typography>
                          {prescriptionItems.map((item, idx) => (
                            <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                              • {item.name} x {item.quantity}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {otcItems.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" color="secondary" fontWeight={600}>
                            Non Prescription Items: {otcItems.length}
                          </Typography>
                          {otcItems.map((item, idx) => (
                            <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                              • {item.name} x {item.quantity}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {groceryItems.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                            Groceries: {groceryItems.length}
                          </Typography>
                          {groceryItems.map((item, idx) => (
                            <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                              • {item.name} x {item.quantity}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                          Rs. {totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Review Your Order
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {prescriptionItems.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Prescription Medicines ({prescriptionItems.length})
                      </Typography>
                      {prescriptionItems.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography>{item.name} x {item.quantity}</Typography>
                          <Typography>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {otcItems.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" color="secondary" gutterBottom>
                        Non Prescription Items ({otcItems.length})
                      </Typography>
                      {otcItems.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography>{item.name} x {item.quantity}</Typography>
                          <Typography>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {groceryItems.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" color="success.main" gutterBottom>
                        Groceries ({groceryItems.length})
                      </Typography>
                      {groceryItems.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography>{item.name} x {item.quantity}</Typography>
                          <Typography>Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      Rs. {totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        {activeStep === 0 && (
          <>
            {cartItems.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => setActiveStep(1)}
                disabled={loading}
              >
                Review & Continue
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSendToPharmacist}
              disabled={sending || loading}
              color={cartItems.length > 0 ? 'primary' : 'success'}
            >
              {sending ? 'Sending...' : cartItems.length > 0 ? 'Skip & Send to Pharmacist' : 'Send to Pharmacist'}
            </Button>
          </>
        )}
        {activeStep === 1 && (
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSendToPharmacist}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send to Pharmacist'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddItemsToPrescription;

