import React, { useMemo, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  CardMedia,
  Stack,
  MenuItem,
  InputAdornment,
  Alert,
} from '@mui/material';
import { AddShoppingCart, Search } from '@mui/icons-material';
import { useCatalog } from '../../contexts/CatalogContext';
import medPlaceholder from '../../assets/med.png';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'otc', label: 'OTC' },
  { value: 'herbal', label: 'Herbal' },
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'non-medical', label: 'Non-Medical' },
];

const formatCategory = (value = '') =>
  value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const MedicineCatalog = ({ onAddToCart }) => {
  const { medicines } = useCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceMin: '',
    priceMax: '',
  });

  const brandOptions = useMemo(() => {
    const brands = new Set(
      medicines
        .filter((medicine) => !medicine.requiresPrescription)
        .map((medicine) => medicine.brand)
        .filter(Boolean),
    );
    return ['all', ...Array.from(brands)];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter(
        (medicine) =>
          medicine.isActive !== false &&
          medicine.stock > 0 &&
          !medicine.requiresPrescription &&
          (filters.category === 'all' || medicine.category === filters.category) &&
          (filters.brand === 'all' || medicine.brand === filters.brand) &&
          (filters.priceMin === '' || medicine.price >= Number(filters.priceMin)) &&
          (filters.priceMax === '' || medicine.price <= Number(filters.priceMax)),
      )
      .filter((medicine) => {
        const query = searchTerm.toLowerCase();
        return (
          medicine.name.toLowerCase().includes(query) ||
          medicine.brand?.toLowerCase().includes(query) ||
          medicine.description?.toLowerCase().includes(query)
        );
      });
  }, [medicines, searchTerm, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = (medicine) => {
    onAddToCart({
      itemId: medicine.id,
      name: medicine.name,
      quantity: 1,
      price: medicine.price,
      unit: medicine.unit || medicine.doseUnit || 'dose',
      itemType: 'medicine',
      image: medicine.image || medPlaceholder,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        OTC Medicine Catalog
      </Typography>
      <Alert
        severity="info"
        sx={{ mb: 3, bgcolor: 'success.50', color: 'success.dark' }}
      >
        Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
        and medical supplies like cotton wool, masks, and bandages. Use filters to sort by category, price,
        or brand, and add items directly to your cart without a prescription.
      </Alert>

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
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
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
          >
            {brandOptions.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand === 'all' ? 'All brands' : brand}
              </MenuItem>
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
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredMedicines.map((medicine) => (
          <Grid item xs={12} sm={6} md={4} key={medicine.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="180"
                image={medicine.image || medPlaceholder}
                alt={medicine.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6">{medicine.name}</Typography>
                  <Chip label={formatCategory(medicine.category)} size="small" color="info" />
                </Stack>
                {medicine.brand && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {medicine.brand}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {medicine.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    Rs. {medicine.price} / {medicine.unit || 'dose'}
                  </Typography>
                  <Chip
                    label={medicine.stock > 10 ? 'In Stock' : 'Low Stock'}
                    color={medicine.stock > 10 ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAddToCart(medicine)}
                  disabled={medicine.stock === 0}
                >
                  {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMedicines.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 4, color: 'text.secondary' }}>
          No medicines found matching your search.
        </Typography>
      )}
    </Box>
  );
};

export default MedicineCatalog;