import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { AddShoppingCart, Search } from '@mui/icons-material';
import { medicineAPI } from '../../services/api';

const MedicineCatalog = ({ onAddToCart }) => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function 6: browseOTCCatalog & Function 7: searchMedicines
  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      // Filter only OTC medicines for catalog
      const otcMedicines = response.data.filter(med => 
        med.category === 'otc' && med.isActive && med.stock > 0
      );
      setMedicines(otcMedicines);
      setFilteredMedicines(otcMedicines);
    } catch (err) {
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (medicine) => {
    // Function 8: addToCart
    onAddToCart({
      medicineId: medicine._id,
      medicineName: medicine.name,
      quantity: 1,
      price: medicine.price
    });
  };

  if (loading) return <Typography>Loading medicines...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        OTC Medicine Catalog
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredMedicines.map((medicine) => (
          <Grid item xs={12} sm={6} md={4} key={medicine._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {medicine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {medicine.brand}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {medicine.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    Rs. {medicine.price}
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