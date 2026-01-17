import React from 'react';
import { Card, CardContent, Typography, Stack, Box, Divider, Chip } from '@mui/material';

const BillSummary = ({ totalAmount, deliveryFee, finalAmount }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Bill Summary</Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal:</Typography>
            <Typography>Rs. {(totalAmount || 0).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Delivery Fee:</Typography>
            <Typography>
              Rs. {(deliveryFee || 0).toFixed(2)}
              {totalAmount > 1000 && <Chip label="Free" size="small" color="success" sx={{ ml: 1 }} />}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h6" color="primary">Rs. {(finalAmount || 0).toFixed(2)}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BillSummary;
