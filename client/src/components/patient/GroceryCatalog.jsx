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
  CardMedia,
  Chip,
} from '@mui/material';
import { AddShoppingCart, Search } from '@mui/icons-material';
import { useCatalog } from '../../contexts/CatalogContext';

const groceryPlaceholder =
  'https://images.unsplash.com/photo-1502741126161-b048400d08b3?auto=format&fit=crop&w=600&q=80';

const GroceryCatalog = ({ onAddToCart }) => {
  const { groceries } = useCatalog();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroceries = useMemo(() => {
    return groceries.filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.unit?.toLowerCase().includes(query)
      );
    });
  }, [groceries, searchTerm]);

  const handleAddToCart = (item) => {
    onAddToCart({
      itemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
      unit: item.unit || 'item',
      itemType: 'grocery',
      image: item.image || groceryPlaceholder,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Grocery & Wellness Catalog
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search grocery items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredGroceries.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="180"
                image={item.image || groceryPlaceholder}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    Rs. {item.price} / {item.unit || 'item'}
                  </Typography>
                  <Chip
                    label={`${item.stock ?? 0} in stock`}
                    size="small"
                    color={item.stock > 0 ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock === 0}
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredGroceries.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 4, color: 'text.secondary' }}>
          No grocery items found. Ask the admin to add them in the catalogue.
        </Typography>
      )}
    </Box>
  );
};

export default GroceryCatalog;

