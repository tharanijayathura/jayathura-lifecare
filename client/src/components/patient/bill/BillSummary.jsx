import React from 'react';
import { Typography, Stack, Box, Divider, Chip } from '@mui/material';

const COLORS = {
  text: '#2C3E50',
  subtext: '#546E7A',
  blue2: '#7AA8B0',
};

const BillSummary = ({ totalAmount, deliveryFee, finalAmount }) => {
  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: COLORS.subtext }}>Subtotal</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text }}>
          Rs. {(totalAmount || 0).toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: COLORS.subtext }}>Delivery Fee</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.text }}>
            Rs. {(deliveryFee || 0).toFixed(2)}
          </Typography>
          {(deliveryFee === 0 || totalAmount > 1000) && (
            <Chip label="Free" size="small" color="success" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
          )}
        </Box>
      </Box>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.text }}>Grand Total</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.blue2 }}>
          Rs. {(finalAmount || 0).toFixed(2)}
        </Typography>
      </Box>
    </Stack>
  );
};

export default BillSummary;
