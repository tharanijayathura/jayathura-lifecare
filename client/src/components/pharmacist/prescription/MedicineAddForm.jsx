import React from 'react';
import { Paper, Typography, Grid, TextField, Autocomplete, Button, MenuItem, Box, Stack } from '@mui/material';
import { Add, Science, AccessTime, MenuBook } from '@mui/icons-material';

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
}) => {
  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: `1px solid ${COLORS.border}`, bgcolor: 'white' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            options={medicines}
            getOptionLabel={(option) => `${option.name}${option.brand ? ` (${option.brand})` : ''}`}
            value={selectedMedicine}
            onChange={(e, newValue) => setSelectedMedicine(newValue)}
            inputValue={searchTerm}
            onInputChange={(e, value) => setSearchTerm(value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search product name..." variant="outlined" fullWidth />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{option.name} {option.brand && `(${option.brand})`}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                    Rs. {option.price} • Stock: {option.stock} units
                  </Typography>
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField 
            fullWidth 
            label="Dosage Strength" 
            value={dosage} 
            onChange={(e) => setDosage(e.target.value)} 
            placeholder="e.g. 500mg" 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
          >
            {[
              { val: 'Once daily', label: 'Once daily (OD)' },
              { val: 'Twice daily', label: 'Twice daily (BD)' },
              { val: 'Thrice daily', label: 'Thrice daily (TDS)' },
              { val: 'Four times daily', label: 'Four times daily (QDS)' },
              { val: 'At bedtime', label: 'At bedtime (HS)' },
              { val: 'As needed', label: 'As needed (PRN)' },
            ].map((opt) => (
              <MenuItem key={opt.val} value={opt.val}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Usage Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' } }}
          >
            {[
              { val: 'After meals', label: 'After meals (PC)' },
              { val: 'Before meals', label: 'Before meals (AC)' },
              { val: 'With food', label: 'Take with food' },
              { val: 'Empty stomach', label: 'On empty stomach' },
              { val: 'As directed', label: 'As directed' },
            ].map((opt) => (
              <MenuItem key={opt.val} value={opt.val}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<Add />} 
            onClick={onAdd} 
            disabled={!selectedMedicine || loading}
            sx={{ 
              py: 2, 
              borderRadius: 4, 
              bgcolor: COLORS.blue2, 
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(122, 168, 176, 0.25)',
              '&:hover': { bgcolor: COLORS.blue1 } 
            }}
          >
            Add to Active Verification
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MedicineAddForm;
