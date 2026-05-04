import React from 'react';
import { Typography, Stack, Button, FormControlLabel, Checkbox, Box, Paper } from '@mui/material';
import { VolumeUp, Payment } from '@mui/icons-material';

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

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod, requestAudioInstructions, setRequestAudioInstructions }) => {
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

      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          borderRadius: 3, 
          bgcolor: requestAudioInstructions ? COLORS.green1 : 'transparent',
          borderColor: requestAudioInstructions ? COLORS.green3 : COLORS.border,
          transition: 'all 0.3s ease'
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={requestAudioInstructions}
              onChange={(e) => setRequestAudioInstructions(e.target.checked)}
              sx={{ color: COLORS.blue2, '&.Mui-checked': { color: COLORS.blue2 } }}
            />
          }
          label={
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VolumeUp fontSize="small" sx={{ color: COLORS.blue2 }} /> Request Audio Instructions
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                Our pharmacist will provide a personalized voice guide for your medicines.
              </Typography>
            </Box>
          }
        />
      </Paper>
    </Stack>
  );
};

export default PaymentMethodSection;
