import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Paper, Stack, Button, useTheme, useMediaQuery } from '@mui/material';
import { LocalShipping, Refresh, History } from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import OrderCard from './orders/OrderCard.jsx';
import OrderDetailsDialog from './orders/OrderDetailsDialog.jsx';

const OrderHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      const invoice = response.data.invoice;
      const order = response.data.order;
      
      if (!order) {
        alert("Order details not found.");
        return;
      }

      const invId = invoice?.invoiceId || `INV-${order.orderId || orderId}`;
      const invDate = new Date(order.createdAt).toLocaleDateString();
      const itemsText = (order.items || []).map(item => 
        `- ${item.medicineName || 'Item'}: ${item.quantity} x Rs. ${item.price} = Rs. ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const subtotal = order.totalAmount || invoice?.subtotal || 0;
      const deliveryFee = order.deliveryFee || invoice?.deliveryFee || 0;
      const total = order.finalAmount || invoice?.totalAmount || 0;
      const paymentMethod = order.paymentMethod?.toUpperCase() || 'COD';
      const patientName = order.patientId?.name || 'Customer';

      const invoiceContent = `
========================================
         JAYATHURA LIFECARE
========================================
INVOICE: ${invId}
DATE:    ${invDate}
CUSTOMER: ${patientName}
----------------------------------------
ITEMS:
${itemsText}
----------------------------------------
SUBTOTAL:     Rs. ${subtotal.toFixed(2)}
DELIVERY FEE: Rs. ${deliveryFee.toFixed(2)}
TOTAL AMOUNT: Rs. ${total.toFixed(2)}
PAYMENT:      ${paymentMethod}
========================================
Thank you for shopping with us!
      `.trim();

      // Create a blob and download it
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setLoading(true);
      await patientAPI.cancelOrder(orderId);
      alert("Order cancelled successfully.");
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setLoading(false);
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
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'flex-end' }, 
        gap: 3 
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' }, fontWeight: 900, color: COLORS.text, mb: 1 }}>
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
          fullWidth={isMobile}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2, py: { xs: 1.2, sm: 0.8 } }}
        >
          Refresh List
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

      {(() => {
        const confirmedAndCompletedOrders = orders.filter(
          order => order.status !== 'draft' && order.status !== 'pending'
        );

        if (confirmedAndCompletedOrders.length > 0) {
          return (
            <Box>
              {confirmedAndCompletedOrders.map((order) => (
                <OrderCard
                  key={order._id || order.orderId}
                  order={order}
                  onViewDetails={() => handleViewDetails(order._id || order.orderId)}
                  onDownloadInvoice={() => handleDownloadInvoice(order._id || order.orderId)}
                  onCancel={() => handleCancelOrder(order._id || order.orderId)}
                />
              ))}
            </Box>
          );
        }

        return (
          <Paper elevation={0} sx={{ py: 12, textAlign: 'center', borderRadius: 8, border: `2px dashed ${COLORS.border}`, bgcolor: 'white' }}>
            <Box sx={{ p: 3, borderRadius: '50%', bgcolor: COLORS.green1, display: 'inline-flex', mb: 3 }}>
              <History sx={{ fontSize: 48, color: COLORS.blue2 }} />
            </Box>
            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800 }}>No Orders Found</Typography>
            <Typography sx={{ color: COLORS.subtext, maxWidth: 400, mx: 'auto', mt: 1 }}>
              You haven't placed any confirmed orders yet. Visit our shop or upload a prescription to get started.
            </Typography>
          </Paper>
        );
      })()}

      <OrderDetailsDialog
        open={detailsDialogOpen}
        order={selectedOrder}
        onClose={() => setDetailsDialogOpen(false)}
        onDownloadInvoice={() => selectedOrder && handleDownloadInvoice(selectedOrder._id || selectedOrder.orderId)}
        onOrderUpdated={fetchOrders}
      />
    </Box>
  );
};

export default OrderHistory;