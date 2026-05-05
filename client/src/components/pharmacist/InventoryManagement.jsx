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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import { Search, Warning, Refresh, Inventory } from '@mui/icons-material';
import { pharmacistAPI } from '../../services/api';

const InventoryManagement = ({ showLowStockSection = false }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress sx={{ color: COLORS.blue2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 0 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.text, mb: 1 }}>
            Stock Control
          </Typography>
          <Typography sx={{ color: COLORS.subtext, fontWeight: 500 }}>
            Monitor and manage pharmacy inventory levels in real-time
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchInventory}
          sx={{ borderRadius: 3, fontWeight: 700, color: COLORS.blue2, borderColor: COLORS.blue2 }}
        >
          Update Stock
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ mb: 4, borderRadius: 5, border: `1px solid ${COLORS.border}`, bgcolor: 'white', overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: `1px solid ${COLORS.border}` }}>
          <TextField
            fullWidth
            placeholder="Search by medicine name, brand, or category..."
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
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: `2px solid #f1f5f9`, color: COLORS.subtext, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell>Medicine Details</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Stock Level</TableCell>
                <TableCell align="right">Pricing (per pack)</TableCell>
                <TableCell align="right">Inventory Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isLow = item.stock?.units <= item.minStockUnits;
                  const isOut = item.stock?.units <= 0;
                  
                  return (
                    <TableRow key={item._id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9', py: 2.5 } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: COLORS.text }}>{item.name}</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.brand || 'General'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.category?.toUpperCase()} size="small" variant="outlined" sx={{ borderRadius: 2, fontSize: '0.65rem', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 800, color: isLow ? '#f43f5e' : COLORS.text }}>
                            {item.stock?.units || 0} {item.baseUnit}s
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.subtext }}>{item.stock?.packs || 0} packs</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 800 }}>Rs. {item.price?.perPack?.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {isOut ? (
                          <Chip label="OUT OF STOCK" size="small" sx={{ bgcolor: '#fff1f2', color: '#f43f5e', fontWeight: 800, borderRadius: 2 }} />
                        ) : isLow ? (
                          <Chip label="LOW STOCK" size="small" sx={{ bgcolor: '#fff7ed', color: '#f97316', fontWeight: 800, borderRadius: 2 }} />
                        ) : (
                          <Chip label="AVAILABLE" size="small" sx={{ bgcolor: COLORS.green1, color: '#059669', fontWeight: 800, borderRadius: 2 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Inventory sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography sx={{ color: COLORS.subtext, fontWeight: 600 }}>No matching inventory found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryManagement;
