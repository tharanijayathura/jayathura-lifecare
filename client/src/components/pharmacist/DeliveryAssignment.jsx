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
  MenuItem
} from '@mui/material';
import { LocalShipping, Person, CheckCircle } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const COLORS = {
  green1: '#ECF4E8',
  green2: '#CBF3BB',
  green3: '#ABE7B2',
  blue1: '#93BFC7',
  blue2: '#7AA8B0',
  text: '#2C3E50',
  subtext: '#546E7A',
  border: 'rgba(147, 191, 199, 0.35)',
};

const DeliveryAssignment = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');

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
      
      // Filter only orders that are ready or processing
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

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text, mb: 3 }}>Delivery Assignment</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: COLORS.green1 }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Destination</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assignment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No orders ready for assignment</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell sx={{ fontWeight: 600 }}>{order.orderId}</TableCell>
                    <TableCell>{order.patientId?.name}</TableCell>
                    <TableCell>{order.deliveryAddress?.city}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status.toUpperCase()} 
                        size="small" 
                        sx={{ bgcolor: order.status === 'ready' ? COLORS.green3 : COLORS.blue1, color: COLORS.text, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      {order.assignedTo ? (
                        <Chip icon={<Person />} label={deliveryPersons.find(p => p._id === order.assignedTo)?.name || 'Assigned'} variant="outlined" size="small" />
                      ) : (
                        <Typography variant="caption" color="error">Not Assigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<LocalShipping />}
                        onClick={() => handleOpenAssignDialog(order)}
                        sx={{ bgcolor: COLORS.blue2, borderRadius: 2, '&:hover': { bgcolor: COLORS.blue1 } }}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Assign Delivery Personnel</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>Assigning delivery for <strong>{selectedOrder?.orderId}</strong> to:</Typography>
            <FormControl fullWidth>
              <InputLabel>Select Delivery Person</InputLabel>
              <Select
                value={selectedDeliveryPerson}
                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                label="Select Delivery Person"
                sx={{ borderRadius: 3 }}
              >
                {deliveryPersons.map((person) => (
                  <MenuItem key={person._id} value={person._id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person fontSize="small" />
                      <Box>
                        <Typography variant="body2">{person.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{person.phone}</Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAssignOrder} 
            disabled={!selectedDeliveryPerson}
            sx={{ bgcolor: COLORS.blue2, borderRadius: 3, px: 4 }}
          >
            Confirm Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryAssignment;
