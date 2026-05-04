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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Search, Warning } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const InventoryManagement = ({ showLowStockSection = false }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await pharmacistAPI.getInventory();
      setInventory(response.data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">INVENTORY MANAGEMENT</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock (Units)</TableCell>
              <TableCell>Stock (Packs)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const isLow = item.stock?.units <= item.minStockUnits;
                const isOut = item.stock?.units <= 0;
                
                return (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.brand || 'No Brand'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.category?.toUpperCase()} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={isLow ? 'error.main' : 'text.primary'} sx={{ fontWeight: isLow ? 700 : 400 }}>
                        {item.stock?.units || 0} {item.baseUnit}s
                      </Typography>
                    </TableCell>
                    <TableCell>{item.stock?.packs || 0} packs</TableCell>
                    <TableCell>Rs. {item.price?.perPack?.toFixed(2)}</TableCell>
                    <TableCell>
                      {isOut ? (
                        <Chip label="OUT OF STOCK" size="small" color="error" />
                      ) : isLow ? (
                        <Chip label="LOW STOCK" size="small" color="warning" icon={<Warning fontSize="small" />} />
                      ) : (
                        <Chip label="AVAILABLE" size="small" color="success" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No medicines found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryManagement;
