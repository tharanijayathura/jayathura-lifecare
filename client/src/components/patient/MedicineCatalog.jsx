import React, { useMemo, useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { AddShoppingCart, Search } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import medPlaceholder from '../../assets/med.png';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'otc', label: 'Non Prescription Items' },
  { value: 'herbal', label: 'Herbal & Ayurvedic' },
  { value: 'vitamins', label: 'Vitamins & Supplements' },
  { value: 'medical-devices', label: 'Medical Devices & Equipment' },
  { value: 'personal-care', label: 'Personal Care & Hygiene' },
  { value: 'groceries', label: 'Groceries & Snacks' },
  { value: 'baby-care', label: 'Baby & Infant Care' },
  { value: 'first-aid', label: 'First Aid & Emergency' },
  { value: 'seasonal', label: 'Seasonal & Special' },
  { value: 'dermatology', label: 'Dermatology & Skin Care' },
  { value: 'eye-ear-care', label: 'Eye & Ear Care' },
  { value: 'womens-health', label: "Women's Health" },
  { value: 'mens-health', label: "Men's Health" },
  { value: 'dental-care', label: 'Dental Care' },
  { value: 'home-healthcare', label: 'Home Healthcare' },
  { value: 'fitness-weight', label: 'Fitness & Weight Management' },
  { value: 'cold-chain', label: 'Cold Chain' },
  { value: 'pet-health', label: 'Pet Health' },
];

const formatCategory = (value = '') =>
  value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const MedicineCatalog = ({ onAddToCart }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceMin: '',
    priceMax: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.browseOTC();
      const medicinesData = response.data || [];
      
      
      const seenIds = new Map();
      const seenNames = new Map(); // Also check by name+brand as fallback
      const uniqueMedicines = medicinesData.filter(medicine => {
        const medicineId = medicine._id?.toString() || medicine.id?.toString();
        const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
        
        // Check by ID first
        if (medicineId && seenIds.has(medicineId)) {
          
          return false;
        }
        
        // Also check by name+brand combination (in case IDs are different but same medicine)
        if (nameKey && seenNames.has(nameKey)) {
          
          return false;
        }
        
        if (medicineId) seenIds.set(medicineId, true);
        if (nameKey) seenNames.set(nameKey, true);
        return true;
      });
      
      
      setMedicines(uniqueMedicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

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
    
    const seenIds = new Map();
    const seenNames = new Map();
    const uniqueMedicines = medicines.filter(medicine => {
      const medicineId = medicine._id?.toString() || medicine.id?.toString();
      const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
      
      
      if (medicineId && seenIds.has(medicineId)) {
        return false;
      }
      
      
      if (nameKey && seenNames.has(nameKey)) {
        return false;
      }
      
      if (medicineId) seenIds.set(medicineId, true);
      if (nameKey) seenNames.set(nameKey, true);
      return true;
    });
    
    
    return uniqueMedicines
      .filter(
        (medicine) =>
          medicine.stock > 0 &&
          (filters.category === 'all' || medicine.category === filters.category) &&
          (filters.brand === 'all' || medicine.brand === filters.brand) &&
          (filters.priceMin === '' || medicine.price >= Number(filters.priceMin)) &&
          (filters.priceMax === '' || medicine.price <= Number(filters.priceMax)),
      );
  }, [medicines, filters]);

  
  useEffect(() => {
    if (!searchTerm) {
      
      fetchMedicines();
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await patientAPI.searchMedicines(searchTerm);
        const medicinesData = response.data || [];
        
        
        const seenIds = new Map();
        const seenNames = new Map();
        const uniqueMedicines = medicinesData.filter(medicine => {
          const medicineId = medicine._id?.toString() || medicine.id?.toString();
          const nameKey = `${medicine.name || ''}_${medicine.brand || ''}`.toLowerCase();
          
          if (medicineId && seenIds.has(medicineId)) return false;
          if (nameKey && seenNames.has(nameKey)) return false;
          
          if (medicineId) seenIds.set(medicineId, true);
          if (nameKey) seenNames.set(nameKey, true);
          return true;
        });
        
        
        setMedicines(uniqueMedicines);
      } catch (error) {
        console.error('Error searching medicines:', error);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = (medicine) => {
    
    const medicineId = medicine._id?.toString() || medicine.id?.toString();
    onAddToCart({
      itemId: medicineId,
      name: medicine.name,
      quantity: 1,
      price: medicine.price,
      unit: medicine.unit || medicine.doseUnit || 'dose',
      itemType: 'medicine',
      image: medicine.image || medPlaceholder,
    });
  };

  if (loading && medicines.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Medicine Catalog (Function 6)
      </Typography>
      <Alert
        severity="info"
        sx={{ mb: 3, bgcolor: 'success.50', color: 'success.dark' }}
      >
        Browse all non-prescription items such as Panadol, Siddhalepa, ENO, Vicks, vitamins, baby products,
        and medical supplies like cotton wool, masks, and bandages. Prescription medicines are not shown here.
        Use filters to sort by category, price, or brand, and add items directly to your cart without a prescription.
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
        {filteredMedicines.map((medicine) => {
          // Use _id or id for the key
          const medicineId = medicine._id?.toString() || medicine.id?.toString() || Math.random().toString();
          return (
          <Grid item xs={12} sm={6} md={4} key={medicineId}>
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

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAddToCart(medicine)}
                  disabled={medicine.stock === 0}
                  sx={{
                    bgcolor: medicine.stock === 0 ? 'grey.400' : 'primary.main',
                    '&:hover': {
                      bgcolor: medicine.stock === 0 ? 'grey.400' : 'primary.dark',
                    }
                  }}
                >
                  {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          );
        })}
      </Grid>

      {!loading && filteredMedicines.length === 0 && (
        <Card sx={{ mt: 4, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No medicines found' : 'No medicines available'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? `Try searching with different keywords or browse all categories.`
              : `Please check back later or contact support.`
            }
          </Typography>
        </Card>
      )}

      {loading && filteredMedicines.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default MedicineCatalog;