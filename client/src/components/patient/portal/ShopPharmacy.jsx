import React from 'react';
import { Box, Grid, Paper, Alert, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import MedicineCatalog from '../../patient/MedicineCatalog';
import ShoppingCart from '../../patient/ShoppingCart';

const ShopPharmacy = ({
  shopTab,
  setShopTab,
  handleAddToCart,
  cartItems,
  handleRemoveItem,
  handleOrderSubmit,
  latestPrescription,
  loading,
  currentOrderId,
  orderStatus,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      <Grid item xs={12} md={8}>
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Alert severity="info" sx={{ mb: 2, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
            Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
            medical supplies like cotton wool, masks, and bandages. Use filters to sort by category, price, or brand,
            and add items directly to your cart without a prescription.
          </Alert>
          <Box sx={{ mt: 2 }}>
            <MedicineCatalog onAddToCart={handleAddToCart} filterFrequentlyUsed={true} />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <ShoppingCart
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleOrderSubmit}
          latestPrescription={latestPrescription}
          loading={loading}
          orderId={currentOrderId}
        />
        {orderStatus && (
          <Alert severity="success" sx={{ mt: 2, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
            {orderStatus}
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default ShopPharmacy;
