import React from 'react';
import { Card, CardContent, Typography, Alert, Grid, TextField } from '@mui/material';

const DeliveryAddressForm = ({ address, setAddress, orderStatus }) => {
  return (
    <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">Delivery Address *</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please enter your delivery address. You can edit or change it anytime before confirming the order.
        </Alert>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              placeholder="Enter your street address, building name, apartment number"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
              multiline
              rows={2}
              error={!address.street && orderStatus !== 'draft'}
              helperText={!address.street ? 'Street address is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              placeholder="Enter your city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
              error={!address.city && orderStatus !== 'draft'}
              helperText={!address.city ? 'City is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              placeholder="Enter postal code (optional)"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeliveryAddressForm;
