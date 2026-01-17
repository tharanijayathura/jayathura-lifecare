import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Stack } from '@mui/material';

const ReviewSummary = ({ prescriptionItems, otcItems, groceryItems, totalAmount }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Review Your Order</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {prescriptionItems.length > 0 && (
            <Box>
              <Typography variant="subtitle1" color="primary" gutterBottom>Prescription Medicines ({prescriptionItems.length})</Typography>
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
              <Typography variant="subtitle1" color="secondary" gutterBottom>Non Prescription Items ({otcItems.length})</Typography>
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
              <Typography variant="subtitle1" color="success.main" gutterBottom>Groceries ({groceryItems.length})</Typography>
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
            <Typography variant="h6" color="primary">Rs. {totalAmount.toFixed(2)}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReviewSummary;
