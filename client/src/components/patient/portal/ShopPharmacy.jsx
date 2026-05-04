import React from 'react';
import { Box, Grid, Paper, Alert, Typography, Stack, Chip, Divider } from '@mui/material';
import { ShoppingBag, Description, Info } from '@mui/icons-material';
import MedicineCatalog from '../../patient/MedicineCatalog';
import ShoppingCart from '../../patient/ShoppingCart';

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

const ShopPharmacy = ({
  handleAddToCart,
  cartItems,
  handleRemoveItem,
  handleOrderSubmit,
  latestPrescription,
  loading,
  currentOrderId,
  orderStatus,
}) => {
  const isAddingToPrescription = !!latestPrescription || cartItems.some(i => i.itemType === 'Prescription');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {isAddingToPrescription && (
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 4, 
                bgcolor: COLORS.green1, 
                border: `1px solid ${COLORS.green3}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: COLORS.text, display: 'flex' }}>
                  <Description />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text }}>
                    Adding to Prescription Order
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                    Your prescription items are already in the cart. Browse and add extra items below.
                  </Typography>
                </Box>
              </Stack>
              <Chip label="Mixed Order Mode" size="small" sx={{ bgcolor: COLORS.green3, fontWeight: 700 }} />
            </Paper>
          )}

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 5, border: `1px solid ${COLORS.border}` }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, bgcolor: COLORS.blue1 + '22', color: COLORS.blue1, borderRadius: 2, display: 'flex' }}>
                <ShoppingBag />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>Medicine & Wellness Shop</Typography>
                <Typography variant="body2" sx={{ color: COLORS.subtext }}>Browse and add non-prescription items directly to your cart.</Typography>
              </Box>
            </Box>
            
            <MedicineCatalog onAddToCart={handleAddToCart} filterFrequentlyUsed={false} />
          </Paper>
        </Stack>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Box sx={{ position: 'sticky', top: 24 }}>
          <ShoppingCart
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onSubmitOrder={handleOrderSubmit}
            latestPrescription={latestPrescription}
            loading={loading}
            orderId={currentOrderId}
          />
          
          {orderStatus && (
            <Alert severity="success" sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}>
              {orderStatus}
            </Alert>
          )}

          <Alert 
            severity="info" 
            icon={<Info />} 
            sx={{ mt: 3, borderRadius: 4, bgcolor: 'rgba(147, 191, 199, 0.05)', border: `1px solid ${COLORS.blue1}` }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.text }}>
              Free delivery on orders over Rs. 10,000. Our pharmacists will verify all prescription items before final billing.
            </Typography>
          </Alert>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ShopPharmacy;
