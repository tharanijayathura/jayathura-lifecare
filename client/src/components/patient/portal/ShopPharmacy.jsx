import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Alert, Typography, Stack, Chip, Divider, Drawer, Fab, Badge, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ShoppingBag, Description, Info, Close, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import MedicineCatalog from '../../patient/MedicineCatalog';
import ShoppingCart from '../../patient/ShoppingCart';

const COLORS = {
  green1: '#eef7f2',
  green2: '#059669',
  green3: '#10b981',
  blue1: '#10b981',
  blue2: '#64748b',
  text: '#0f172a',
  subtext: '#64748b',
  border: 'rgba(226, 232, 240, 0.8)',
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
  initialShopCategory,
  setInitialShopCategory,
}) => {
  const isAddingToPrescription = !!latestPrescription || cartItems.some(i => i.itemType === 'Prescription');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (initialShopCategory === 'frequent') {
      setInitialShopCategory('all');
    }
  }, [initialShopCategory, setInitialShopCategory]);

  return (
    <Box>
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

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 5, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 20px rgba(15,23,42,0.015)' }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(16, 185, 129, 0.08)', color: '#10b981', borderRadius: 3, display: 'flex' }}>
                  <ShoppingBag />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, fontSize: { xs: '1.3rem', sm: '1.6rem' }, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em', textAlign: 'left' }}>
                    Medicine & Wellness Shop
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 500, mt: 0.2, textAlign: 'left' }}>
                    Browse and add healthcare essentials directly to your order cart.
                  </Typography>
                </Box>
              </Box>
              
              <MedicineCatalog onAddToCart={handleAddToCart} filterFrequentlyUsed={initialShopCategory === 'frequent'} />
            </Paper>
          </Stack>
        </Grid>
        
        {/* On desktop: show inline cart panel. On mobile: hidden since it will be in Drawer */}
        <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
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

      {/* Mobile/Tablet Cart Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="view cart"
          onClick={() => setCartOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 96, // Placed nicely above the ChatWidget Fab (bottom: 24)
            right: 24,
            bgcolor: '#10b981',
            color: 'white',
            zIndex: 1100,
            boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
            '&:hover': { bgcolor: '#059669' }
          }}
        >
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      {/* Mobile/Tablet Sliding Cart Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 400 },
              p: 0,
              borderLeft: 'none',
            }
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
                Shopping Cart
              </Typography>
              <IconButton onClick={() => setCartOpen(false)}>
                <Close sx={{ color: COLORS.text }} />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Box sx={{ p: 2 }}>
                <ShoppingCart
                  cartItems={cartItems}
                  onRemoveItem={handleRemoveItem}
                  onSubmitOrder={(orderData) => {
                    setCartOpen(false);
                    handleOrderSubmit(orderData);
                  }}
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
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default ShopPharmacy;
