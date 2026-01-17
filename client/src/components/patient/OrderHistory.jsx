import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import OrderCard from './orders/OrderCard.jsx';
import OrderDetailsDialog from './orders/OrderDetailsDialog.jsx';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  // Dialog state for order details

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getOrdersHistory();
      console.log('Orders history response:', response);
      const ordersData = response.data || [];
      console.log('Orders data:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load order history. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers

  const handleViewDetails = async (orderId) => {
    try {
      const response = await patientAPI.getOrderStatus(orderId);
      setSelectedOrder(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details. Please try again.');
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await patientAPI.viewBill(orderId);
      // You can open this in a new window or download as PDF
      console.log('Invoice:', response.data);
      alert(`Invoice ID: ${response.data.invoiceId || response.data.orderId}\nTotal: Rs. ${response.data.totalAmount || 0}`);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const handleTrackDelivery = async (orderId) => {
    try {
      const res = await patientAPI.trackDelivery(orderId);
      alert(`Delivery Status: ${res.data.deliveryStatus || 'N/A'}\nEstimated Delivery: ${res.data.estimatedDelivery ? new Date(res.data.estimatedDelivery).toLocaleString() : 'N/A'}`);
    } catch (err) {
      console.error('Error tracking delivery:', err);
      alert('Unable to track delivery right now.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>

      {orders.length > 0 && orders.map((order) => (
        <OrderCard
          key={order._id || order.orderId}
          order={order}
          onViewDetails={() => handleViewDetails(order._id || order.orderId)}
          onDownloadInvoice={() => handleDownloadInvoice(order._id || order.orderId)}
          onTrackDelivery={() => handleTrackDelivery(order._id || order.orderId)}
        />
      ))}

      {orders.length === 0 && !loading && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <LocalShipping sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start shopping to see your orders here
            </Typography>
          </CardContent>
        </Card>
      )}

      <OrderDetailsDialog
        open={detailsDialogOpen}
        order={selectedOrder}
        onClose={() => setDetailsDialogOpen(false)}
        onDownloadInvoice={() => selectedOrder && handleDownloadInvoice(selectedOrder._id || selectedOrder.orderId)}
      />
    </Box>
  );
};

export default OrderHistory;