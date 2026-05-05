import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Button, Divider, Grid, Avatar, Paper, IconButton } from '@mui/material';
import { Visibility, Download, LocalShipping, ShoppingBag, Description, ReceiptLong, ConfirmationNumber } from '@mui/icons-material';

const OrderCard = ({ order, onViewDetails, onDownloadInvoice, onTrackDelivery }) => {
  const items = order.items || [];
  const totalItems = items.length;
  const isPrescriptionOrder = !!order.prescriptionId;

  const COLORS = {
    green1: '#ECF4E8',
    green2: '#CBF3BB',
    green3: '#ABE7B2',
    blue1: '#93BFC7',
    blue2: '#7AA8B0',
    text: '#1e293b',
    subtext: '#64748b',
    border: 'rgba(147, 191, 199, 0.25)',
  };

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { color: '#059669', bg: '#ecfdf5', label: 'Delivered' },
      out_for_delivery: { color: '#0284c7', bg: '#f0f9ff', label: 'Out for Delivery' },
      ready: { color: '#7c3aed', bg: '#f5f3ff', label: 'Ready to Collect' },
      processing: { color: '#d97706', bg: '#fffbeb', label: 'Processing' },
      confirmed: { color: '#0891b2', bg: '#ecfeff', label: 'Confirmed' },
      pending: { color: '#64748b', bg: '#f8fafc', label: 'Pending Review' },
      cancelled: { color: '#dc2626', bg: '#fef2f2', label: 'Cancelled' },
      draft: { color: '#94a3b8', bg: '#f1f5f9', label: 'Draft' },
    };
    return configs[status] || configs.pending;
  };

  const status = getStatusConfig(order.status);

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 6,
        border: `1px solid ${COLORS.border}`,
        bgcolor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
          borderColor: COLORS.blue2
        }
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Order Icon & ID */}
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              bgcolor: isPrescriptionOrder ? '#eff6ff' : '#f0fdf4', 
              color: isPrescriptionOrder ? '#2563eb' : '#16a34a',
              width: 56, 
              height: 56,
              borderRadius: 4
            }}>
              {isPrescriptionOrder ? <Description /> : <ShoppingBag />}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 900, color: COLORS.text, fontSize: '1.1rem' }}>
                #{order.orderId || order._id?.slice(-6).toUpperCase()}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Status & Amount */}
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={4} alignItems="center" justifyContent={{ md: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Status</Typography>
              <Chip 
                label={status.label} 
                size="small" 
                sx={{ 
                  bgcolor: status.bg, 
                  color: status.color, 
                  fontWeight: 800, 
                  borderRadius: 2,
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Amount</Typography>
              <Typography sx={{ fontWeight: 900, color: COLORS.text }}>
                Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton 
              onClick={onDownloadInvoice}
              sx={{ bgcolor: '#f8fafc', color: COLORS.blue2, '&:hover': { bgcolor: COLORS.green1 } }}
              title="Download Invoice"
            >
              <ReceiptLong fontSize="small" />
            </IconButton>
            
            {order.status === 'pending' ? (
              <Button
                variant="contained"
                onClick={onViewDetails}
                sx={{ 
                  borderRadius: 4, 
                  px: 3, 
                  bgcolor: COLORS.blue2, 
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': { bgcolor: COLORS.blue1 }
                }}
              >
                Review Rx
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={onViewDetails}
                sx={{ 
                  borderRadius: 4, 
                  px: 3, 
                  bgcolor: COLORS.text, 
                  fontWeight: 800,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#000' }
                }}
              >
                View Track
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderCard;
