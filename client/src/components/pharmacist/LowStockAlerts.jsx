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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Warning, ShoppingCart } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const LowStockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getInventory();
      const filtered = (response.data || []).filter(item => 
        item.stock?.units <= item.minStockUnits
      );
      setLowStockItems(filtered);
    } catch (err) {
      console.error('Error fetching low stock:', err);
      setError('Failed to load low stock alerts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} /></Box>;

  if (lowStockItems.length === 0) return (
    <Alert severity="success" sx={{ borderRadius: 2 }}>
      All items are well stocked!
    </Alert>
  );

  return (
    <Box>
      <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning /> LOW STOCK ALERTS
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: 'error.lighter' }}>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Min Required</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
                    {item.stock?.units} {item.baseUnit}s
                  </Typography>
                </TableCell>
                <TableCell>{item.minStockUnits} {item.baseUnit}s</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="error" startIcon={<ShoppingCart fontSize="small" />}>
                    Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LowStockAlerts;

