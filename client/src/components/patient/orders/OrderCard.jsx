import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Button, Divider, Grid } from '@mui/material';
import { Visibility, Download, LocalShipping, ShoppingBag, Description } from '@mui/icons-material';

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

const getStatusColor = (status) => {
  const colors = {
    delivered: 'success',
    processing: 'warning',
    pending: 'info',
    confirmed: 'info',
    ready: 'success',
    out_for_delivery: 'warning',
    cancelled: 'error',
    draft: 'default',
  };
  return colors[status] || 'default';
};

const OrderCard = ({ order, onViewDetails, onDownloadInvoice, onTrackDelivery }) => {
  const items = order.items || [];
  const totalItems = items.length;
  const isPrescriptionOrder = !!order.prescriptionId;

  return (
    <Card 
      sx={{ 
        mb: 3, 
        borderRadius: 4, 
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 12px rgba(44,62,80,0.04)',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(44,62,80,0.08)' }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: isPrescriptionOrder ? 'primary.light' : COLORS.green1, 
                color: isPrescriptionOrder ? 'primary.main' : COLORS.text,
                display: 'flex'
              }}
            >
              {isPrescriptionOrder ? <Description /> : <ShoppingBag />}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text }}>
                Order #{order.orderId || order._id?.slice(-6) || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={(order.status || 'pending').toUpperCase().replace(/_/g, ' ')}
              color={getStatusColor(order.status)}
              size="small"
              sx={{ fontWeight: 700, borderRadius: 1.5, mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>
              Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: COLORS.border }} />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="body2" sx={{ color: COLORS.subtext, mb: 1 }}>
              <strong>Items ({totalItems}):</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {items.slice(0, 3).map((item, idx) => (
                <Chip 
                  key={idx} 
                  label={item.medicineName || item.medicineId?.name || item.name || 'Item'} 
                  size="small" 
                  variant="outlined" 
                  sx={{ borderColor: COLORS.blue1, fontSize: '0.7rem' }} 
                />
              ))}
              {totalItems > 3 && (
                <Typography variant="caption" sx={{ color: COLORS.blue2, fontWeight: 600, mt: 0.5 }}>
                  +{totalItems - 3} more
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Button 
                startIcon={<Visibility />} 
                variant="outlined" 
                size="small" 
                onClick={onViewDetails}
                sx={{ borderRadius: 2, textTransform: 'none', borderColor: COLORS.blue1, color: COLORS.text }}
              >
                Details
              </Button>
              <Button 
                startIcon={<Download />} 
                variant="outlined" 
                size="small" 
                onClick={onDownloadInvoice}
                sx={{ borderRadius: 2, textTransform: 'none', borderColor: COLORS.blue1, color: COLORS.text }}
              >
                Invoice
              </Button>
              {order.status === 'pending' && (
                <Button
                  startIcon={<Description />}
                  variant="contained"
                  size="small"
                  onClick={onViewDetails}
                  sx={{ borderRadius: 2, textTransform: 'none', bgcolor: COLORS.blue2, color: 'white', '&:hover': { bgcolor: COLORS.blue1 } }}
                >
                  Review & Confirm
                </Button>
              )}
              {(order.status === 'out_for_delivery' || order.status === 'confirmed' || order.status === 'processing' || order.status === 'ready') && (
                <Button
                  startIcon={<LocalShipping />}
                  variant="contained"
                  size="small"
                  onClick={onViewDetails}
                  sx={{ borderRadius: 2, textTransform: 'none', bgcolor: COLORS.green3, color: COLORS.text, '&:hover': { bgcolor: COLORS.green2 } }}
                >
                  Track
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
