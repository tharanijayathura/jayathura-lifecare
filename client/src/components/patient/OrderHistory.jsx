import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';

const OrderHistory = () => {
  // Mock data for demonstration
  const mockOrders = [
    {
      id: 'JLC000001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250.00,
      items: ['Paracetamol', 'Vitamin C']
    },
    {
      id: 'JLC000002',
      date: '2024-01-10',
      status: 'processing',
      total: 850.00,
      items: ['Amoxicillin']
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'success',
      processing: 'warning',
      pending: 'info',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order History (Function 23)
      </Typography>

      {mockOrders.map((order) => (
        <Card key={order.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(order.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Items: {order.items.join(', ')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Chip 
                  label={order.status.toUpperCase()} 
                  color={getStatusColor(order.status)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6">
                  Rs. {order.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Visibility />}
                variant="outlined"
                size="small"
              >
                View Details
              </Button>
              <Button
                startIcon={<Download />}
                variant="outlined"
                size="small"
              >
                Invoice
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {mockOrders.length === 0 && (
        <Card>
          <CardContent>
            <Typography textAlign="center" color="text.secondary">
              No orders found
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OrderHistory;