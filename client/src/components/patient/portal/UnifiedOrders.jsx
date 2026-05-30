import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Grid, 
  Stack, 
  Chip, 
  Button, 
  Alert, 
  CircularProgress,
  IconButton,
  Divider,
  Link
} from '@mui/material';
import { 
  Description, 
  ReceiptLong, 
  LocalShipping, 
  History, 
  Refresh, 
  AddCircleOutline, 
  Visibility, 
  CheckCircleOutline,
  ShoppingBag,
  ArrowForward,
  Delete
} from '@mui/icons-material';
import { patientAPI } from '../../../services/api';
import { useNotification } from '../../../contexts/NotificationContext';
import OrderCard from '../orders/OrderCard';
import OrderDetailsDialog from '../orders/OrderDetailsDialog';

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

const UnifiedOrders = ({ onViewBill, onCancel, setActiveTab }) => {
  const { showNotification, confirmAction } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Tab indices: 0 = Actions Required (Draft/Pending), 1 = Active Tracking, 2 = Past History
  const [activeSubTab, setActiveSubTab] = useState(0);

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
      setError('Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = await confirmAction("Are you sure you want to cancel this order?", {
      title: "Cancel Order",
      danger: true
    });
    if (!confirmed) return;
    try {
      setLoading(true);
      await patientAPI.cancelOrder(orderId);
      showNotification("Order cancelled successfully.", { type: 'success' });
      fetchOrders();
      if (onCancel) {
        onCancel(orderId);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showNotification(error.response?.data?.message || 'Failed to cancel order.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = await confirmAction("Are you sure you want to remove this order from your history? This action cannot be undone.", {
      title: "Delete Order History",
      danger: true
    });
    if (!confirmed) return;
    try {
      setLoading(true);
      await patientAPI.deleteOrder(orderId);
      showNotification("Order removed from history successfully.", { type: 'success' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification(error.response?.data?.message || 'Failed to remove order from history.', { type: 'error' });
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
        showNotification("Order details not found.", { type: 'error' });
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
      showNotification('Failed to download invoice. Please try again.', { type: 'error' });
    }
  };

  // Grouping orders
  const awaitingActionOrders = orders.filter(
    order => order.status === 'draft' || order.status === 'pending'
  );

  const activeTrackingOrders = orders.filter(
    order => ['confirmed', 'processing', 'ready', 'out_for_delivery'].includes(order.status)
  );

  const pastHistoryOrders = orders.filter(
    order => ['delivered', 'cancelled'].includes(order.status)
  );

  const displayedOrders = 
    activeSubTab === 0 ? awaitingActionOrders :
    activeSubTab === 1 ? activeTrackingOrders :
    pastHistoryOrders;

  const getSubTabBadgeColor = (tabIndex, count) => {
    if (count === 0) return 'default';
    if (tabIndex === 0) return 'error';
    if (tabIndex === 1) return 'primary';
    return 'default';
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress sx={{ color: COLORS.blue2 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            My Orders & Bills
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Track prescription approvals, pay pending bills, and monitor shipments in real time.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchOrders}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Refresh Lists
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: `1px solid ${COLORS.border}`, px: { xs: 1, md: 3 }, pt: 1, bgcolor: '#ffffff' }}>
          <Tabs
            value={activeSubTab}
            onChange={(e, val) => setActiveSubTab(val)}
            TabIndicatorProps={{ sx: { bgcolor: '#10b981' } }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                minWidth: 'auto',
                px: { xs: 2.5, md: 4 },
                py: 2,
                color: COLORS.subtext,
                '&.Mui-selected': { color: '#10b981' }
              }
            }}
          >
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Actions Required</span>
                  {awaitingActionOrders.length > 0 ? (
                    <Chip label={awaitingActionOrders.length} size="small" color="error" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                  ) : (
                    <Chip label="0" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#f1f5f9' }} />
                  )}
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Active Tracking</span>
                  {activeTrackingOrders.length > 0 ? (
                    <Chip label={activeTrackingOrders.length} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                  ) : (
                    <Chip label="0" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#f1f5f9' }} />
                  )}
                </Stack>
              } 
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Past History</span>
                  <Chip label={pastHistoryOrders.length} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#f1f5f9', color: COLORS.text }} />
                </Stack>
              } 
            />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
          {displayedOrders.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                py: 10, 
                textAlign: 'center', 
                borderRadius: 4, 
                border: `2px dashed ${COLORS.border}`,
                bgcolor: '#fafafa'
              }}
            >
              <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: COLORS.green1, display: 'inline-flex', mb: 3 }}>
                <ReceiptLong sx={{ fontSize: 44, color: COLORS.blue2 }} />
              </Box>
              <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 800, mb: 1 }}>
                {activeSubTab === 0 ? 'No actions required' : activeSubTab === 1 ? 'No active shipments' : 'No past orders'}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.subtext, maxWidth: 420, mx: 'auto', mb: 3 }}>
                {activeSubTab === 0 
                  ? 'There are no pending pharmacist calculations or draft invoices awaiting your checkout confirmation.' 
                  : activeSubTab === 1 
                  ? 'All your orders are fully processed. You do not have any active tracking shipments currently in transit.' 
                  : 'You have not completed or cancelled any purchases yet.'}
              </Typography>
              {activeSubTab === 0 && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button 
                    variant="contained" 
                    onClick={() => setActiveTab(1)}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: COLORS.text, color: 'white', '&:hover': { bgcolor: '#000' } }}
                  >
                    Upload a Prescription
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(2)}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, borderColor: COLORS.blue2, color: COLORS.blue2 }}
                  >
                    Go Shop OTC Items
                  </Button>
                </Stack>
              )}
            </Paper>
          ) : (
            <Stack spacing={3}>
              {displayedOrders.map((order) => {
                // If it is Awaiting Action (Tab 0), we want to show customized action buttons below/inside card
                const isPendingBill = order.status === 'pending' && order.finalAmount > 0;
                const isDraft = order.status === 'draft';
                const isPrescription = !!order.prescriptionId;

                return (
                  <Paper 
                    key={order._id}
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      borderRadius: 5, 
                      border: `1px solid ${COLORS.border}`,
                      bgcolor: 'white',
                      '&:hover': {
                        borderColor: '#10b981',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip 
                              label={order.type?.toUpperCase()} 
                              size="small" 
                              sx={{ 
                                bgcolor: isPrescription ? '#eff6ff' : '#f0fdf4', 
                                color: isPrescription ? '#2563eb' : '#16a34a',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                borderRadius: 1.5
                              }} 
                            />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              ID: #{order.orderId || order._id.slice(-6).toUpperCase()}{order.patientId?.name ? ` - ${order.patientId.name}` : ''}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: COLORS.text }}>
                            {isPrescription ? 'Clinical Prescription Order' : 'OTC Shop Wellness Order'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                            Date Placed: {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                          {order.prescriptionId?.originalName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Description fontSize="small" sx={{ color: COLORS.blue2 }} />
                              <Link 
                                href={getPublicFileUrl(order.prescriptionId.imageUrl)} 
                                target="_blank" 
                                rel="noreferrer"
                                sx={{ fontWeight: 650, fontSize: '0.78rem', color: COLORS.blue2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                              >
                                View uploaded prescription document
                              </Link>
                            </Box>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase' }}>
                            Summary
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {order.items?.length || 0} items included
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: COLORS.text }}>
                            {order.finalAmount ? `Rs. ${order.finalAmount.toFixed(2)}` : 'Pricing pending review'}
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
                          {/* Case 1: Pending action (Bill is calculated) */}
                          {isPendingBill && (
                            <Button 
                              variant="contained"
                              size="medium"
                              onClick={() => onViewBill(order)}
                              sx={{ 
                                borderRadius: 3.5, 
                                textTransform: 'none', 
                                fontWeight: 800, 
                                bgcolor: '#10b981', 
                                color: 'white',
                                boxShadow: '0 6px 12px rgba(16,185,129,0.2)',
                                '&:hover': { bgcolor: '#059669' } 
                              }}
                            >
                              Review & Pay Bill
                            </Button>
                          )}

                          {/* Case 3: Cancel Draft / Pending */}
                          {['draft', 'pending'].includes(order.status) && (
                            <Button 
                              variant="outlined"
                              color="error"
                              size="medium"
                              onClick={() => handleCancelOrder(order._id || order.orderId)}
                              sx={{ borderRadius: 3.5, textTransform: 'none', fontWeight: 700 }}
                            >
                              Cancel Request
                            </Button>
                          )}

                          {/* Case 4: Track Delivery for confirmed/processing */}
                          {['confirmed', 'processing', 'ready', 'out_for_delivery'].includes(order.status) && (
                            <Button 
                              variant="contained"
                              startIcon={<LocalShipping />}
                              onClick={() => handleViewDetails(order._id || order.orderId)}
                              sx={{ 
                                borderRadius: 3.5, 
                                textTransform: 'none', 
                                fontWeight: 800, 
                                bgcolor: COLORS.text, 
                                color: 'white',
                                '&:hover': { bgcolor: '#000' }
                              }}
                            >
                              Track Progress
                            </Button>
                          )}

                          {/* Case 5: View past details */}
                          {['delivered', 'cancelled'].includes(order.status) && (
                            <Stack direction="row" spacing={1}>
                              <Button 
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => handleViewDetails(order._id || order.orderId)}
                                sx={{ borderRadius: 3.5, textTransform: 'none', fontWeight: 700, borderColor: COLORS.border, color: COLORS.text }}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteOrder(order._id || order.orderId)}
                                sx={{ borderRadius: 3.5, textTransform: 'none', fontWeight: 700 }}
                              >
                                Delete History
                              </Button>
                            </Stack>
                          )}

                          {/* Case 6: Download Invoice for confirmed & completed orders */}
                          {['confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status) && (
                            <IconButton 
                              onClick={() => handleDownloadInvoice(order._id || order.orderId)}
                              sx={{ border: `1px solid ${COLORS.border}`, borderRadius: 2.5, bgcolor: '#f8fafc', color: COLORS.blue2 }}
                              title="Download Invoice File"
                            >
                              <ReceiptLong fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Paper>

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

export default UnifiedOrders;
