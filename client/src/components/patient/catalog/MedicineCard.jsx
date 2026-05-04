import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Box, Chip, Button, Stack } from '@mui/material';
import { AddShoppingCart, InfoOutlined } from '@mui/icons-material';
import medPlaceholder from '../../../assets/med.png';

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

const formatCategory = (value = '') => value.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

const MedicineCard = ({ medicine, onAdd }) => {
  const image = medicine.image || medPlaceholder;
  const unit = medicine.unit || medicine.doseUnit || 'unit';
  const inStock = (medicine.stock || 0) > 0;
  const isLowStock = medicine.stock > 0 && medicine.stock <= 10;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 8px 24px rgba(44,62,80,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(44,62,80,0.12)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia 
          component="img" 
          height="200" 
          image={image} 
          alt={medicine.name}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }} 
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end' }}>
          <Chip 
            label={formatCategory(medicine.category)} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
              color: COLORS.text,
              fontSize: '0.65rem'
            }} 
          />
          {medicine.requiresPrescription && (
            <Chip 
              label="Rx Required" 
              size="small" 
              color="error"
              sx={{ fontWeight: 600, fontSize: '0.65rem' }} 
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text, lineHeight: 1.2, mb: 0.5 }}>
            {medicine.name}
          </Typography>
          {medicine.brand && (
            <Typography variant="caption" sx={{ color: COLORS.blue2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {medicine.brand}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.5rem' }}>
          {medicine.description || 'Quality medicine for your recovery and wellness.'}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="caption" color="text.secondary">Price</Typography>
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800 }}>
              Rs. {medicine.price?.toFixed(2)}
              <Typography component="span" variant="caption" sx={{ ml: 0.5, color: COLORS.subtext }}>/ {unit}</Typography>
            </Typography>
          </Box>
          <Chip 
            label={inStock ? (isLowStock ? 'Low Stock' : 'In Stock') : 'Out of Stock'} 
            size="small"
            variant="outlined"
            color={inStock ? (isLowStock ? 'warning' : 'success') : 'error'}
            sx={{ fontWeight: 600, borderRadius: 1.5, fontSize: '0.7rem' }}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<AddShoppingCart />} 
          onClick={() => onAdd(medicine)} 
          disabled={!inStock} 
          sx={{ 
            borderRadius: 2.5,
            py: 1,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            bgcolor: COLORS.green3,
            color: COLORS.text,
            '&:hover': { 
              bgcolor: COLORS.green2,
              boxShadow: '0 4px 12px rgba(171, 231, 178, 0.4)'
            },
            '&.Mui-disabled': {
              bgcolor: '#f5f5f5',
              color: '#bdbdbd'
            }
          }}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default MedicineCard;
