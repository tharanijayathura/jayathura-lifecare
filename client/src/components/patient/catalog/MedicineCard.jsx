import React from 'react';
import { Card, CardContent, CardActions, CardMedia, Typography, Box, Chip, Button, Stack } from '@mui/material';
import { AddShoppingCart, InfoOutlined } from '@mui/icons-material';
import medPlaceholder from '../../../assets/med.png';

const COLORS = {
  green1: '#f8fafc',
  green2: '#059669',
  green3: '#10b981',
  blue1: '#3b82f6',
  blue2: '#64748b',
  text: '#0f172a',
  subtext: '#64748b',
  border: 'rgba(226, 232, 240, 0.8)',
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
        boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden',
        textAlign: 'left',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
        }
      }}
    >
      <Box sx={{ 
        position: 'relative',
        bgcolor: '#f8fafc',
        height: 150,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <Box 
          component="img" 
          src={image} 
          alt={medicine.name}
          sx={{ 
            maxHeight: '100%', 
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }} 
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end', zIndex: 3 }}>
          <Chip 
            label={formatCategory(medicine.category)} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(4px)',
              fontWeight: 700,
              color: COLORS.text,
              fontSize: '0.65rem'
            }} 
          />
          {medicine.requiresPrescription && (
            <Chip 
              label="Rx Required" 
              size="small" 
              color="error"
              sx={{ fontWeight: 700, fontSize: '0.65rem' }} 
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5, textAlign: 'left' }}>
        <Box sx={{ mb: 1.5, textAlign: 'left' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.text, lineHeight: 1.2, mb: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem', textAlign: 'left' }}>
            {medicine.name}
          </Typography>
          {medicine.brand && (
            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem', display: 'block', textAlign: 'left' }}>
              {medicine.brand}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.5rem', fontSize: '0.8rem', lineHeight: 1.5, textAlign: 'left' }}>
          {medicine.description || 'Quality medicine for your recovery and wellness.'}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ textAlign: 'left' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 500, display: 'block', textAlign: 'left' }}>Price</Typography>
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800, fontSize: '1.05rem', textAlign: 'left' }}>
              Rs. {medicine.price?.toFixed(2)}
              <Typography component="span" variant="caption" sx={{ ml: 0.5, color: COLORS.subtext }}>/ {unit}</Typography>
            </Typography>
          </Box>
          <Chip 
            label={inStock ? (isLowStock ? 'Low Stock' : 'In Stock') : 'Out of Stock'} 
            size="small"
            variant="outlined"
            color={inStock ? (isLowStock ? 'warning' : 'success') : 'error'}
            sx={{ fontWeight: 700, borderRadius: 2, fontSize: '0.68rem', px: 0.5 }}
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0, justifyContent: 'center' }}>
        <Button 
          fullWidth 
          variant="contained" 
          size="small"
          startIcon={<AddShoppingCart fontSize="small" />} 
          onClick={() => onAdd(medicine)} 
          disabled={!inStock} 
          sx={{ 
            borderRadius: 2,
            py: 0.8,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            bgcolor: '#f1f5f9',
            color: '#475569',
            '&:hover': { 
              bgcolor: '#e2e8f0',
              boxShadow: 'none',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s',
            '&.Mui-disabled': {
              bgcolor: '#f8fafc',
              color: '#cbd5e1'
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
