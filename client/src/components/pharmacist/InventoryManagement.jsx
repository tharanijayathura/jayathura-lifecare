import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import LowStockAlerts from './LowStockAlerts';

const mockInventory = [
  { name: 'Metformin 500mg', category: 'Rx', stock: 12, min: 50, max: 200, lastSold: 'Today 10:15' },
  { name: 'Panadol Extra', category: 'OTC', stock: 120, min: 100, max: 500, lastSold: 'Today 9:30' },
  { name: 'Losartan 50mg', category: 'Rx', stock: 8, min: 30, max: 150, lastSold: 'Yesterday' },
];

const InventoryManagement = ({ showLowStockSection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  return (
    <Box sx={{ mt: { xs: 6, md: 8 }, px: { xs: 1, md: 3 }, width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">INVENTORY MANAGEMENT | Total Items: 1,245</Typography>
        <Button variant="outlined" size="small" startIcon={<Refresh />}>Refresh Stock</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Rx">Rx</MenuItem>
              <MenuItem value="OTC">OTC</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Stock Level</InputLabel>
            <Select value={stockFilter} label="Stock Level" onChange={(e) => setStockFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Medicine</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Min/Max</TableCell>
              <TableCell>Last Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockInventory.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Chip
                    label={item.stock}
                    size="small"
                    color={item.stock < item.min ? 'error' : item.stock < item.min * 1.5 ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell>{item.min}/{item.max}</TableCell>
                <TableCell>{item.lastSold}</TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showLowStockSection && (
        <Box sx={{ mt: 5 }}>
          <LowStockAlerts />
        </Box>
      )}
    </Box>
  );
};

export default InventoryManagement;

