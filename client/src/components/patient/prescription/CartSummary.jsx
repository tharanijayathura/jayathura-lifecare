import React from 'react';
import { Card, CardContent, Typography, Alert, Stack, Box, Divider } from '@mui/material';

const CartSummary = ({ cartItems, prescriptionItems, otcItems, groceryItems, totalAmount }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Current Items</Typography>
        {cartItems.length === 0 ? (
          <Alert severity="info">No items added yet. You can add non prescription items or groceries, or skip and send directly.</Alert>
        ) : (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {prescriptionItems.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="primary" fontWeight={600}>Prescription Medicines: {prescriptionItems.length}</Typography>
                {prescriptionItems.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ pl: 2 }}>• {item.name} x {item.quantity}</Typography>
                ))}
              </Box>
            )}
            {otcItems.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="secondary" fontWeight={600}>Non Prescription Items: {otcItems.length}</Typography>
                {otcItems.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ pl: 2 }}>• {item.name} x {item.quantity}</Typography>
                ))}
              </Box>
            )}
            {groceryItems.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="success.main" fontWeight={600}>Groceries: {groceryItems.length}</Typography>
                {groceryItems.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ pl: 2 }}>• {item.name} x {item.quantity}</Typography>
                ))}
              </Box>
            )}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">Rs. {totalAmount.toFixed(2)}</Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
