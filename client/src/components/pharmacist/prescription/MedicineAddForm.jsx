import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Autocomplete, Button, MenuItem } from '@mui/material';
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
  searchTerm,
  setSearchTerm,
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Add Medicines from Prescription</Typography>
      <Autocomplete
        options={medicines}
        getOptionLabel={(option) => `${option.name}${option.brand ? ` (${option.brand})` : ''} - Rs. ${option.price}`}
        value={selectedMedicine}
        onChange={(e, newValue) => setSelectedMedicine(newValue)}
        inputValue={searchTerm}
        onInputChange={(e, value) => setSearchTerm(value)}
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
          <TextField
            select
            fullWidth
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Twice daily"
          >
            <MenuItem value="">Select Frequency</MenuItem>
            <MenuItem value="Once daily">Once daily</MenuItem>
            <MenuItem value="Twice daily">Twice daily</MenuItem>
            <MenuItem value="Thrice daily">Thrice daily</MenuItem>
            <MenuItem value="Every 6 hours">Every 6 hours</MenuItem>
            <MenuItem value="Every 8 hours">Every 8 hours</MenuItem>
            <MenuItem value="As needed">As needed</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="After meals"
          >
            <MenuItem value="">Select Instructions</MenuItem>
            <MenuItem value="After meals">After meals</MenuItem>
            <MenuItem value="Before meals">Before meals</MenuItem>
            <MenuItem value="With water">With water</MenuItem>
            <MenuItem value="With food">With food</MenuItem>
            <MenuItem value="Empty stomach">Empty stomach</MenuItem>
            <MenuItem value="As directed">As directed</MenuItem>
          </TextField>
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
