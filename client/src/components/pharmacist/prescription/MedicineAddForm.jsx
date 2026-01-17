import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Autocomplete, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const MedicineAddForm = ({
  medicines,
  selectedMedicine,
  setSelectedMedicine,
  quantity,
  setQuantity,
  dosage,
  setDosage,
  frequency,
  setFrequency,
  instructions,
  setInstructions,
  loading,
  onAdd,
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Add Medicines from Prescription</Typography>
      <Autocomplete
        options={medicines}
        getOptionLabel={(option) => `${option.name}${option.brand ? ` (${option.brand})` : ''} - Rs. ${option.price}`}
        value={selectedMedicine}
        onChange={(e, newValue) => setSelectedMedicine(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Search Medicine" variant="outlined" fullWidth sx={{ mb: 2 }} />
        )}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} inputProps={{ min: 1 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Dosage (e.g., 500mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="500mg" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Frequency (e.g., Twice daily)" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Twice daily" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="After meals" />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" startIcon={<Add />} onClick={onAdd} disabled={!selectedMedicine || loading}>
            Add to Order
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default MedicineAddForm;
