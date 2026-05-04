import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Refresh, Visibility, Search, FilterList, Payment, EventBusy } from '@mui/icons-material';
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

const ActiveOrders = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await pharmacistAPI.getActiveOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching active orders:', err);
      setError('Failed to load active orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return { bg: COLORS.green2, text: COLORS.text };
      case 'processing': return { bg: COLORS.blue1, text: 'white' };
      case 'out_for_delivery': return { bg: '#FFF3E0', text: '#E65100' };
      case 'confirmed': return { bg: COLORS.green1, text: COLORS.text };
      case 'delivered': return { bg: '#E8F5E9', text: '#2E7D32' };
      default: return { bg: '#F5F5F5', text: COLORS.subtext };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.patientId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" p={4}><CircularProgress sx={{ color: COLORS.blue2 }} /></Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.text }}>Active Orders</Typography>
          <Typography variant="body2" sx={{ color: COLORS.subtext }}>Manage placements and preparation pipeline</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Refresh />} 
          onClick={fetchOrders}
          sx={{ borderRadius: 3, bgcolor: COLORS.blue2, fontWeight: 700, px: 3, '&:hover': { bgcolor: COLORS.blue1 } }}
        >
          Refresh Data
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3, borderRadius: 4, border: `1px solid ${COLORS.border}`, bgcolor: 'rgba(255,255,255,0.5)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by Order ID or Patient Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: COLORS.blue2 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="all">All Active Orders</MenuItem>
              <MenuItem value="confirmed">New (Confirmed)</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="ready">Ready for Pickup</MenuItem>
              <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: COLORS.green1 }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patient Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Placement Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Billing</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.blue2 }}>
                        #{order.orderId || order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: COLORS.blue1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <Typography variant="caption" fontWeight={700}>{(order.patientId?.name || 'U')[0]}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.patientId?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.patientId?.phone || 'No phone'}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.type?.toUpperCase() || 'OTC'} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700, borderColor: COLORS.blue1, color: COLORS.blue2 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Rs. {order.finalAmount?.toFixed(2)}</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Payment sx={{ fontSize: 12, color: COLORS.subtext }} />
                        <Typography variant="caption" color="text.secondary">
                          {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status.replace(/_/g, ' ').toUpperCase()} 
                        size="small" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.7rem',
                          bgcolor: statusStyle.bg, 
                          color: statusStyle.text,
                          borderRadius: 1.5
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="contained"
                        size="small" 
                        startIcon={<Visibility />}
                        onClick={() => onSelectOrder(order)}
                        sx={{ borderRadius: 2, bgcolor: COLORS.green3, color: COLORS.text, fontWeight: 700, '&:hover': { bgcolor: COLORS.green2 } }}
                      >
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <EventBusy sx={{ fontSize: 64, color: 'rgba(0,0,0,0.05)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: COLORS.subtext }}>No orders match your criteria</Typography>
                  <Button sx={{ mt: 1, color: COLORS.blue2 }} onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>Clear Filters</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActiveOrders;

