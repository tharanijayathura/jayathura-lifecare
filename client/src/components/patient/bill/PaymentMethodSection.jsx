import React from 'react';
import { Card, CardContent, Typography, Stack, Button, FormControlLabel, Checkbox, Box } from '@mui/material';
import { RecordVoiceOver } from '@mui/icons-material';

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod, requestAudioInstructions, setRequestAudioInstructions }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Payment Method</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant={paymentMethod === 'online' ? 'contained' : 'outlined'} onClick={() => setPaymentMethod('online')} fullWidth>
            Online Payment
          </Button>
          <Button variant={paymentMethod === 'cod' ? 'contained' : 'outlined'} onClick={() => setPaymentMethod('cod')} fullWidth>
            Cash on Delivery
          </Button>
        </Stack>
        <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
          <CardContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={requestAudioInstructions}
                  onChange={(e) => setRequestAudioInstructions(e.target.checked)}
                  icon={<RecordVoiceOver />}
                  checkedIcon={<RecordVoiceOver color="primary" />}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight={600}>Request Audio Instructions</Typography>
                  <Typography variant="body2" color="text.secondary">Get personalized audio instructions from pharmacist on how to take your medicines</Typography>
                </Box>
              }
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSection;
