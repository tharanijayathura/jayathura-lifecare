import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Button } from '@mui/material';
import { Visibility, Download, LocalShipping } from '@mui/icons-material';

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
  const itemNames = items.length > 0
    ? items.map((item) => item.medicineName || item.medicineId?.name || item.name || 'Unknown').join(', ')
    : 'No items';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.orderId || order._id?.slice(-6) || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Items: {itemNames}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Type: {(order.type || 'N/A').toUpperCase()}
              {order.prescriptionId && (
                <Chip label="Prescription" size="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={(order.status || 'pending').toUpperCase().replace(/_/g, ' ')}
              color={getStatusColor(order.status)}
              sx={{ mb: 1 }}
            />
            <Typography variant="h6" color="primary">
              Rs. {(order.finalAmount || order.totalAmount || 0).toFixed(2)}
            </Typography>
            {order.deliveryFee !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {order.deliveryFee === 0 ? 'Free delivery' : `Delivery: Rs. ${order.deliveryFee.toFixed(2)}`}
              </Typography>
            )}
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button startIcon={<Visibility />} variant="outlined" size="small" onClick={onViewDetails}>
            View Details
          </Button>
          <Button startIcon={<Download />} variant="outlined" size="small" onClick={onDownloadInvoice}>
            Invoice
          </Button>
          {order.status === 'out_for_delivery' && (
            <Button
              startIcon={<LocalShipping />}
              variant="contained"
              size="small"
              color="primary"
              onClick={onTrackDelivery}
            >
              Track
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
