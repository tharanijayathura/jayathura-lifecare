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
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Refresh, Visibility, Search, Payment, Assignment } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const ActiveOrders = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { color: '#059669', bg: '#ecfdf5', label: 'Delivered' },
      out_for_delivery: { color: '#0284c7', bg: '#f0f9ff', label: 'In Transit' },
      ready: { color: '#7c3aed', bg: '#f5f3ff', label: 'Ready to Ship' },
      processing: { color: '#d97706', bg: '#fffbeb', label: 'Preparing' },
      confirmed: { color: '#0891b2', bg: '#ecfeff', label: 'New Order' },
      pending: { color: '#64748b', bg: '#f8fafc', label: 'Pending' },
    };
    return configs[status] || { color: '#94a3b8', bg: '#f1f5f9', label: status };
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.patientId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
            Fulfillment Queue
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Monitor and manage the active order pipeline from preparation to delivery
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchOrders}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Refresh Data
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}` }}>
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
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'white' } }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 4, bgcolor: 'white' }}
              >
                <MenuItem value="all">All Active Orders</MenuItem>
                <MenuItem value="confirmed">New (Confirmed)</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="ready">Ready for Pickup</MenuItem>
                <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Responsive Table / Card Switcher */}
        {!isMobile ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                  <TableCell>Order Info</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Total Bill</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const status = getStatusConfig(order.status);
                    return (
                      <TableRow key={order._id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, color: COLORS.text }}>
                            #{order.orderId || order._id.slice(-6).toUpperCase()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: COLORS.blue1, width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700 }}>
                              {(order.patientId?.name || 'U')[0]}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.patientId?.name || 'Unknown'}</Typography>
                              <Typography variant="caption" sx={{ color: COLORS.subtext }}>{order.patientId?.phone || 'No contact'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.type?.toUpperCase() || 'OTC'} 
                            size="small" 
                            sx={{ borderRadius: 2, fontSize: '0.65rem', fontWeight: 800, bgcolor: COLORS.green1, color: COLORS.blue2 }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800 }}>Rs. {order.finalAmount?.toFixed(2)}</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Payment sx={{ fontSize: 12 }} /> {order.paymentMethod?.toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={status.label.toUpperCase()} 
                            size="small" 
                            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<Visibility />}
                            onClick={() => onSelectOrder(order)}
                            sx={{ 
                              borderRadius: 3, 
                              bgcolor: COLORS.blue2, 
                              fontWeight: 800,
                              boxShadow: '0 4px 12px rgba(122, 168, 176, 0.2)',
                              '&:hover': { bgcolor: COLORS.blue1 }
                            }}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <Assignment sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                      <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No active orders found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack spacing={2} sx={{ p: 2 }}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => {
                const status = getStatusConfig(order.status);
                return (
                  <Paper
                    key={order._id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      borderColor: COLORS.border,
                      bgcolor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: COLORS.text }}>
                            #{order.orderId || order._id.slice(-6).toUpperCase()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                            Placed: {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={status.label.toUpperCase()} 
                          size="small" 
                          sx={{ bgcolor: status.bg, color: status.color, fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }} 
                        />
                      </Stack>

                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: COLORS.blue1, width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
                          {(order.patientId?.name || 'U')[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.patientId?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>{order.patientId?.phone || 'No contact'}</Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ borderStyle: 'dashed' }} />

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Chip 
                            label={order.type?.toUpperCase() || 'OTC'} 
                            size="small" 
                            sx={{ borderRadius: 2, fontSize: '0.65rem', fontWeight: 800, bgcolor: COLORS.green1, color: COLORS.blue2, mr: 1 }} 
                          />
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>
                            COD
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 800 }}>Rs. {order.finalAmount?.toFixed(2)}</Typography>
                      </Stack>

                      <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => onSelectOrder(order)}
                        sx={{ 
                          borderRadius: 3, 
                          py: 1,
                          bgcolor: COLORS.blue2, 
                          fontWeight: 800,
                          '&:hover': { bgcolor: COLORS.blue1 }
                        }}
                      >
                        Manage Order
                      </Button>
                    </Stack>
                  </Paper>
                );
              })
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No active orders found</Typography>
              </Box>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default ActiveOrders;
