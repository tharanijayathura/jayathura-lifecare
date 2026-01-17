import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Box, Chip, Button, Stack } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import medPlaceholder from '../../../assets/med.png';

const formatCategory = (value = '') => value.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

const MedicineCard = ({ medicine, onAdd }) => {
  const image = medicine.image || medPlaceholder;
  const unit = medicine.unit || medicine.doseUnit || 'dose';
  const inStock = (medicine.stock || 0) > 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="180" image={image} alt={medicine.name} />
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
        <Typography variant="body2" sx={{ mb: 2 }}>{medicine.description}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">Rs. {medicine.price} / {unit}</Typography>
          <Chip label={medicine.stock > 10 ? 'In Stock' : 'Low Stock'} color={medicine.stock > 10 ? 'success' : 'warning'} size="small" />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" size="medium" startIcon={<AddShoppingCart />} onClick={() => onAdd(medicine)} disabled={!inStock} sx={{ bgcolor: !inStock ? 'grey.400' : 'primary.main', '&:hover': { bgcolor: !inStock ? 'grey.400' : 'primary.dark' } }}>
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default MedicineCard;
