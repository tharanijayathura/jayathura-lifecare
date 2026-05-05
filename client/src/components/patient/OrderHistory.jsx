import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Paper, Stack, Button } from '@mui/material';
import { LocalShipping, Refresh, History } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import OrderCard from './orders/OrderCard.jsx';
import OrderDetailsDialog from './orders/OrderDetailsDialog.jsx';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getOrdersHistory();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to load your order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await patientAPI.getOrderStatus(orderId);
      setSelectedOrder(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await patientAPI.viewBill(orderId);
      alert(`Invoice ID: ${response.data.invoiceId || response.data.orderId}\nTotal: Rs. ${response.data.totalAmount || 0}`);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Purchase History
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Track your current orders and review past medical purchases
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchOrders}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Refresh List
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

      {orders.length > 0 ? (
        <Box>
          {orders.map((order) => (
            <OrderCard
              key={order._id || order.orderId}
              order={order}
              onViewDetails={() => handleViewDetails(order._id || order.orderId)}
              onDownloadInvoice={() => handleDownloadInvoice(order._id || order.orderId)}
            />
          ))}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ py: 12, textAlign: 'center', borderRadius: 8, border: `2px dashed ${COLORS.border}`, bgcolor: 'white' }}>
          <Box sx={{ p: 3, borderRadius: '50%', bgcolor: COLORS.green1, display: 'inline-flex', mb: 3 }}>
            <History sx={{ fontSize: 48, color: COLORS.blue2 }} />
          </Box>
          <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800 }}>No Orders Found</Typography>
          <Typography sx={{ color: COLORS.subtext, maxWidth: 400, mx: 'auto', mt: 1 }}>
            You haven't placed any orders yet. Visit our shop or upload a prescription to get started.
          </Typography>
        </Paper>
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