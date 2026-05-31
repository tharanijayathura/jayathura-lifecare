import React from 'react';
import { Stack, Button } from '@mui/material';
import { Payment } from '@mui/icons-material';

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

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button 
          variant={paymentMethod === 'online' ? 'contained' : 'outlined'} 
          onClick={() => setPaymentMethod('online')} 
          fullWidth
          startIcon={<Payment />}
          sx={{ 
            borderRadius: 3, 
            py: 1.2, 
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: paymentMethod === 'online' ? COLORS.blue2 : 'transparent',
            borderColor: COLORS.blue1,
            color: paymentMethod === 'online' ? 'white' : COLORS.text,
            '&:hover': { bgcolor: paymentMethod === 'online' ? COLORS.blue1 : COLORS.green1 }
          }}
        >
          Online Payment
        </Button>
        <Button 
          variant={paymentMethod === 'cod' ? 'contained' : 'outlined'} 
          onClick={() => setPaymentMethod('cod')} 
          fullWidth
          startIcon={<Payment />}
          sx={{ 
            borderRadius: 3, 
            py: 1.2, 
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: paymentMethod === 'cod' ? COLORS.blue2 : 'transparent',
            borderColor: COLORS.blue1,
            color: paymentMethod === 'cod' ? 'white' : COLORS.text,
            '&:hover': { bgcolor: paymentMethod === 'cod' ? COLORS.blue1 : COLORS.green1 }
          }}
        >
          Cash on Delivery
        </Button>
      </Stack>
    </Stack>
  );
};

export default PaymentMethodSection;
