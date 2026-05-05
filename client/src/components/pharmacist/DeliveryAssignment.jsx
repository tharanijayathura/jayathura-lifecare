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
  Avatar
} from '@mui/material';
import { LocalShipping, Person, CheckCircle, AssignmentInd, Refresh, LocationOn } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const DeliveryAssignment = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
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
        ['ready', 'processing', 'confirmed'].includes(o.status)
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
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Dispatch Control
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Assign ready orders to available delivery personnel for final shipment
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchData}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Update Status
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
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
                        #{order.orderId || order._id.slice(-6).toUpperCase()}
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
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<AssignmentInd />}
                        onClick={() => handleOpenAssignDialog(order)}
                        sx={{ 
                          borderRadius: 3, 
                          bgcolor: COLORS.blue2, 
                          fontWeight: 800,
                          boxShadow: '0 4px 12px rgba(122, 168, 176, 0.2)',
                          '&:hover': { bgcolor: COLORS.blue1 }
                        }}
                      >
                        Dispatch
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogTitle sx={{ fontWeight: 900, pt: 3 }}>Assign Personnel</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 3, color: COLORS.subtext }}>
              Select an available delivery person to handle the dispatch for <strong>#{selectedOrder?.orderId || 'Order'}</strong>
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
    </Box>
  );
};

export default DeliveryAssignment;
