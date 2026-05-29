import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button, 
  Stack, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { LocalShipping, Person, CheckCircle, AssignmentInd, Refresh, LocationOn, Phone } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const DeliveryAssignment = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, personsRes] = await Promise.all([
        pharmacistAPI.getActiveOrders(),
        pharmacistAPI.getDeliveryPersons()
      ]);
      
      const readyOrders = (ordersRes.data || []).filter(o => 
         o.status === 'ready'
      );
      
      setOrders(readyOrders);
      setDeliveryPersons(personsRes.data || []);
    } catch (err) {
      console.error('Error fetching delivery data:', err);
      setError('Failed to load delivery data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignDialog = (order) => {
    setSelectedOrder(order);
    setAssignDialogOpen(true);
  };

  const handleOpenDetailsDialog = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleProceedToAssign = () => {
    setDetailsDialogOpen(false);
    setAssignDialogOpen(true);
  };

  const handleAssignOrder = async () => {
    if (!selectedOrder || !selectedDeliveryPerson) return;
    try {
      await pharmacistAPI.assignToDelivery(selectedOrder._id, selectedDeliveryPerson);
      setAssignDialogOpen(false);
      setSelectedOrder(null);
      setSelectedDeliveryPerson('');
      fetchData();
    } catch (err) {
      console.error('Error assigning order:', err);
      setError('Failed to assign order');
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 }, width: '100%' }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'flex-end' }, 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 3,
        width: '100%'
      }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1, textAlign: 'left' }}>
            Dispatch Control
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500, textAlign: 'left' }}>
            Assign ready orders to available delivery personnel for final shipment
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchData}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Update Status
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ 
            minWidth: 650,
            '& th:first-of-type, & td:first-of-type': { pl: 4 },
            '& th:last-of-type, & td:last-of-type': { pr: 4 }
          }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', py: 2 } }}>
                <TableCell>Order Reference</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Preparation</TableCell>
                <TableCell>Current Assignment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <LocalShipping sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No orders currently awaiting dispatch</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, color: COLORS.text }}>
                        #{order.orderId || order._id.slice(-6).toUpperCase()}{order.patientId?.name ? ` - ${order.patientId.name}` : ''}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 600 }}>
                        PLACED: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.patientId?.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.blue2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14 }} /> {order.deliveryAddress?.city || 'Not specified'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status === 'ready' ? 'PACKED' : order.status.toUpperCase()} 
                        size="small" 
                        sx={{ bgcolor: order.status === 'ready' ? COLORS.green1 : '#f1f5f9', color: order.status === 'ready' ? '#059669' : COLORS.subtext, fontWeight: 800, borderRadius: 2, fontSize: '0.65rem' }} 
                      />
                    </TableCell>
                    <TableCell>
                      {order.assignedTo ? (
                        <Chip 
                          avatar={<Avatar sx={{ bgcolor: COLORS.blue2 }}>P</Avatar>} 
                          label={deliveryPersons.find(p => p._id === order.assignedTo)?.name || 'Assigned'} 
                          variant="outlined" 
                          size="small" 
                          sx={{ borderRadius: 2, fontWeight: 700, borderColor: COLORS.blue1 }}
                        />
                      ) : (
                        <Chip label="UNASSIGNED" size="small" sx={{ bgcolor: '#fff1f2', color: '#f43f5e', fontWeight: 800, borderRadius: 2, fontSize: '0.65rem' }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleOpenDetailsDialog(order)}
                          sx={{ 
                            borderRadius: 3, 
                            color: COLORS.blue2, 
                            borderColor: COLORS.blue2,
                            fontWeight: 700,
                            '&:hover': { bgcolor: COLORS.green1, borderColor: COLORS.blue2 }
                          }}
                        >
                          Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          startIcon={<AssignmentInd />}
                          onClick={() => handleOpenAssignDialog(order)}
                          sx={{ 
                            borderRadius: 3, 
                            bgcolor: COLORS.blue2, 
                            color: 'white',
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(122, 168, 176, 0.2)',
                            '&:hover': { bgcolor: COLORS.blue1 }
                          }}
                        >
                          Dispatch
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, pt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentInd sx={{ color: COLORS.blue2 }} />
          Assign Delivery Agent
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {selectedOrder && (
              <Box sx={{ mb: 3, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Order Reference</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text }}>
                    #{selectedOrder.orderId || selectedOrder._id.slice(-6).toUpperCase()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Recipient & Location</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text }}>
                    {selectedOrder.patientId?.name || 'Unknown Patient'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, fontWeight: 600 }}>
                    <LocationOn sx={{ fontSize: 14 }} /> {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.subtext, fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Amount to Collect</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: COLORS.blue2 }}>
                    Rs. {selectedOrder.finalAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Typography variant="body2" sx={{ mb: 2, color: COLORS.subtext, fontWeight: 500 }}>
              Select an available delivery person to dispatch this order:
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Choose Agent</InputLabel>
              <Select
                value={selectedDeliveryPerson}
                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                label="Choose Agent"
                sx={{ borderRadius: 4, bgcolor: '#f8fafc' }}
              >
                {deliveryPersons.map((person) => (
                  <MenuItem key={person._id} value={person._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: COLORS.green1, color: COLORS.blue2, width: 32, height: 32, fontSize: '0.8rem' }}>{person.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{person.name}</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>{person.phone}</Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={() => setAssignDialogOpen(false)} sx={{ fontWeight: 700, color: COLORS.subtext }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAssignOrder} 
            disabled={!selectedDeliveryPerson}
            sx={{ 
              borderRadius: 4, 
              px: 4, 
              bgcolor: COLORS.text, 
              color: 'white', 
              fontWeight: 900,
              '&:hover': { bgcolor: '#000' }
            }}
          >
            Confirm Dispatch
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Details Dialog --- */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, pt: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping sx={{ color: COLORS.blue2 }} />
          Order Details - #{selectedOrder?.orderId || (selectedOrder?._id && selectedOrder._id.slice(-6).toUpperCase())}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Recipient info */}
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recipient Information</Typography>
                <Stack spacing={1.5}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: COLORS.text }}>
                    {selectedOrder.patientId?.name || 'Unknown Patient'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: COLORS.text, fontWeight: 500 }}>
                    <Phone sx={{ fontSize: 16, color: COLORS.blue2 }} />
                    {selectedOrder.patientId?.phone || 'No phone number'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: COLORS.text, fontWeight: 500 }}>
                    <LocationOn sx={{ fontSize: 16, color: COLORS.blue2, mt: 0.3 }} />
                    <Box>
                      {selectedOrder.deliveryAddress?.street || 'No street address'}, <br />
                      {selectedOrder.deliveryAddress?.city || 'No city'}, {selectedOrder.deliveryAddress?.postalCode || ''}
                    </Box>
                  </Typography>
                </Stack>
              </Box>

              {/* Items List */}
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: COLORS.subtext, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Items Awaiting Dispatch</Typography>
                <Stack spacing={1.5} sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderBottom: '1px solid #f1f5f9' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.text }}>
                          {item.medicineName}
                        </Typography>
                        {item.dosage && (
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                            {item.dosage}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text }}>
                        {item.quantity} x Rs. {item.price?.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Bill Details */}
              <Box sx={{ pt: 1 }}>
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {selectedOrder.totalAmount?.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: COLORS.subtext, fontWeight: 600 }}>Delivery Fee</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {selectedOrder.deliveryFee?.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <Box display="flex" justifyContent="space-between" sx={{ pt: 0.5 }}>
                    <Typography sx={{ fontWeight: 900 }}>Total Value</Typography>
                    <Typography variant="h6" sx={{ color: COLORS.blue2, fontWeight: 900 }}>Rs. {selectedOrder.finalAmount?.toFixed(2)}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDetailsDialogOpen(false)} sx={{ fontWeight: 700, color: COLORS.subtext }}>Close</Button>
          <Button 
            variant="contained" 
            onClick={handleProceedToAssign}
            sx={{ 
              borderRadius: 3, 
              px: 3, 
              bgcolor: COLORS.blue2, 
              color: 'white', 
              fontWeight: 900,
              boxShadow: '0 4px 12px rgba(122, 168, 176, 0.2)',
              '&:hover': { bgcolor: COLORS.blue1 }
            }}
          >
            Assign Delivery Agent
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryAssignment;
