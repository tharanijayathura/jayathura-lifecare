import React from 'react';
import { Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

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

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField select fullWidth label="Category" name="category" value={filters.category} onChange={handleFilterChange}>
          {CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField select fullWidth label="Brand" name="brand" value={filters.brand} onChange={handleFilterChange}>
          {brandOptions.map((brand) => (
            <MenuItem key={brand} value={brand}>{brand === 'all' ? 'All brands' : brand}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <TextField label="Min Price" type="number" name="priceMin" value={filters.priceMin} onChange={handleFilterChange} fullWidth inputProps={{ min: 0 }} />
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <TextField label="Max Price" type="number" name="priceMax" value={filters.priceMax} onChange={handleFilterChange} fullWidth inputProps={{ min: 0 }} />
      </Grid>
    </Grid>
  );
};

export default CatalogFilters;
