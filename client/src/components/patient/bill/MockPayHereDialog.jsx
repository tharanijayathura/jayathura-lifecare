import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Close, CreditCard, Lock, CheckCircle } from '@mui/icons-material';
import { patientAPI } from '../../../services/api';

const MockPayHereDialog = ({ open, onClose, paymentParams, onCompleted, onError }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState(paymentParams?.first_name || '');

  const COLORS = {
    payhereBlue: '#0052cc',
    payhereDark: '#172b4d',
    sandboxOrange: '#ff8c00',
    border: '#dfe1e6',
    successGreen: '#36b37e',
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length > 2) {
      setExpiry(value.substring(0, 2) + '/' + value.substring(2));
    } else {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) {
      alert('Please fill in all card details.');
      return;
    }

    setLoading(true);
    try {
      // Call mock endpoint to set paymentStatus to paid
      await patientAPI.mockPay(paymentParams.order_id);
      
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onCompleted(paymentParams.order_id);
        setSuccess(false);
        setCardNumber('');
        setExpiry('');
        setCvv('');
      }, 1500);
    } catch (err) {
      console.error('Mock payment error:', err);
      setLoading(false);
      if (onError) {
        onError(err.message || 'Mock payment failed');
      } else {
        alert('Mock payment failed. Please try again.');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      {/* Sandbox Banner */}
      <Box sx={{ bgcolor: COLORS.sandboxOrange, color: 'white', py: 0.5, px: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          PayHere Sandbox Simulator
        </Typography>
      </Box>

      {/* Header */}
      <DialogTitle sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f4f5f7' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.payhereBlue }}>
            pay<span style={{ color: COLORS.payhereDark }}>here</span>
          </Typography>
          <Box sx={{ px: 1, py: 0.2, bgcolor: COLORS.payhereBlue, color: 'white', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800 }}>SANDBOX</Typography>
          </Box>
        </Stack>
        {!loading && (
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {success ? (
          <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 60, color: COLORS.successGreen, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.payhereDark }} gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mock payment processed successfully. Returning to portal...
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Amount details */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#fafbfc', borderColor: COLORS.border, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    Order Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.payhereDark }}>
                    Rs. {parseFloat(paymentParams?.amount || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Currency: {paymentParams?.currency || 'LKR'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Order ID: {paymentParams?.order_id?.slice(-8).toUpperCase()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.payhereDark, mb: 2 }}>
              Pay with Credit / Debit Card
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="small"
                required
              />

              <TextField
                fullWidth
                label="Card Number"
                placeholder="4916 2175 0161 1292"
                value={cardNumber}
                onChange={handleCardNumberChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                required
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Expiry (MM/YY)"
                  placeholder="12/28"
                  value={expiry}
                  onChange={handleExpiryChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="CVV / CVC"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="password"
                  required
                />
              </Stack>
              
              <Divider sx={{ my: 1 }} />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  bgcolor: COLORS.payhereBlue,
                  color: 'white',
                  fontWeight: 800,
                  py: 1.2,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#0043a4' }
                }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={16} color="inherit" />
                    <span>Processing Sandbox Payment...</span>
                  </Stack>
                ) : (
                  `Pay Rs. ${parseFloat(paymentParams?.amount || 0).toFixed(2)}`
                )}
              </Button>

              <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                <Lock sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Secure sandbox payment simulation
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MockPayHereDialog;
