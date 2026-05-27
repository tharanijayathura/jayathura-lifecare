import React from 'react';
import { Grid, TextField, MenuItem, InputAdornment, Box, Paper } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

const COLORS = {
  green1: '#f8fafc',
  green2: '#059669',
  green3: '#10b981',
  blue1: '#10b981',
  blue2: '#059669',
  text: '#0f172a',
  subtext: '#64748b',
  border: 'rgba(226, 232, 240, 0.8)',
  paper: 'rgba(255,255,255,0.9)',
};

const CatalogFilters = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  CATEGORY_OPTIONS,
  brandOptions,
}) => {
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3.5,
      bgcolor: 'white',
      '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.9)' },
      '&:hover fieldset': { borderColor: COLORS.green3 },
      '&.Mui-focused fieldset': { borderColor: COLORS.green2 },
    },
    '& .MuiInputLabel-root': { color: COLORS.subtext, fontWeight: 600, fontSize: '0.85rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.green2 },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search medicines, brands, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: COLORS.blue2 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField 
            select 
            fullWidth 
            label="Category" 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
            sx={inputSx}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField 
            select 
            fullWidth 
            label="Brand" 
            name="brand" 
            value={filters.brand} 
            onChange={handleFilterChange}
            sx={inputSx}
          >
            {brandOptions.map((brand) => (
              <MenuItem key={brand} value={brand}>{brand === 'all' ? 'All brands' : brand}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField 
            label="Min Price" 
            type="number" 
            name="priceMin" 
            value={filters.priceMin} 
            onChange={handleFilterChange} 
            fullWidth 
            sx={inputSx}
            inputProps={{ min: 0 }} 
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField 
            label="Max Price" 
            type="number" 
            name="priceMax" 
            value={filters.priceMax} 
            onChange={handleFilterChange} 
            fullWidth 
            sx={inputSx}
            inputProps={{ min: 0 }} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CatalogFilters;
