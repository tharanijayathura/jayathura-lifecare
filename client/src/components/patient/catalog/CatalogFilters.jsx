import React from 'react';
import { Grid, TextField, MenuItem, InputAdornment, Box, Paper } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
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
      borderRadius: 3,
      bgcolor: 'white',
      '& fieldset': { borderColor: COLORS.border },
      '&:hover fieldset': { borderColor: COLORS.blue1 },
      '&.Mui-focused fieldset': { borderColor: COLORS.blue2 },
    },
    '& .MuiInputLabel-root': { color: COLORS.subtext },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.blue2 },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} sm={6} md={2}>
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
