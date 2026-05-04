import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Autocomplete, Button, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';

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
  <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: COLORS.text }}>Add Prescribed Item</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Autocomplete
          options={medicines}
          getOptionLabel={(option) => `${option.name}${option.brand ? ` (${option.brand})` : ''} - Rs. ${option.price}`}
          value={selectedMedicine}
          onChange={(e, newValue) => setSelectedMedicine(newValue)}
          inputValue={searchTerm}
          onInputChange={(e, value) => setSearchTerm(value)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search Inventory" 
              variant="outlined" 
              fullWidth 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} 
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="body2" fontWeight={700}>{option.name} {option.brand && `(${option.brand})`}</Typography>
                <Typography variant="caption" color="text.secondary">Price: Rs. {option.price} | Stock: {option.stock > 0 ? `${option.stock} units` : 'Out of stock'}</Typography>
              </Box>
            </li>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField 
          fullWidth 
          label="Quantity" 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
          inputProps={{ min: 1 }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField 
          fullWidth 
          label="Dosage" 
          value={dosage} 
          onChange={(e) => setDosage(e.target.value)} 
          placeholder="e.g. 500mg" 
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        >
          <MenuItem value="Once daily">Once daily</MenuItem>
          <MenuItem value="Twice daily">Twice daily (BD)</MenuItem>
          <MenuItem value="Thrice daily (TID)">Thrice daily (TID)</MenuItem>
          <MenuItem value="Four times daily (QID)">Four times daily (QID)</MenuItem>
          <MenuItem value="Every 6 hours">Every 6 hours</MenuItem>
          <MenuItem value="Every 8 hours">Every 8 hours</MenuItem>
          <MenuItem value="At bedtime (HS)">At bedtime (HS)</MenuItem>
          <MenuItem value="As needed (PRN)">As needed (PRN)</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        >
          <MenuItem value="After meals">After meals (PC)</MenuItem>
          <MenuItem value="Before meals">Before meals (AC)</MenuItem>
          <MenuItem value="With water">With plenty of water</MenuItem>
          <MenuItem value="With food">With food</MenuItem>
          <MenuItem value="Empty stomach">On an empty stomach</MenuItem>
          <MenuItem value="As directed">As directed by doctor</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<Add />} 
          onClick={onAdd} 
          disabled={!selectedMedicine || loading}
          sx={{ py: 1.5, borderRadius: 3, bgcolor: COLORS.blue2, fontWeight: 700, '&:hover': { bgcolor: COLORS.blue1 } }}
        >
          Add to Prescription Order
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

export default MedicineAddForm;
