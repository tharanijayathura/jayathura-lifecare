import React from 'react';
import { Typography, Grid, TextField, Box } from '@mui/material';

const COLORS = {
  blue2: '#7AA8B0',
  border: 'rgba(147, 191, 199, 0.35)',
  text: '#2C3E50',
  subtext: '#546E7A',
};

const DeliveryAddressForm = ({ address, setAddress, orderStatus }) => {
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      bgcolor: 'white',
      '& fieldset': { borderColor: COLORS.border },
      '&:hover fieldset': { borderColor: COLORS.blue2 },
      '&.Mui-focused fieldset': { borderColor: COLORS.blue2 },
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            placeholder="No, Street Name, Apartment/Building"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
            multiline
            rows={2}
            sx={inputSx}
            error={!address.street && orderStatus !== 'draft'}
            helperText={!address.street && orderStatus !== 'draft' ? 'Street address is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            placeholder="Colombo, Kandy, etc."
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
            sx={inputSx}
            error={!address.city && orderStatus !== 'draft'}
            helperText={!address.city && orderStatus !== 'draft' ? 'City is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            placeholder="Optional"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            sx={inputSx}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryAddressForm;
