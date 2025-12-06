import React, { useState } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { Refresh, Visibility, LocalShipping } from '@mui/icons-material';

const mockOrders = [
  { id: '#2456', patient: 'Kumar', items: '3 Rx + 2 OTC', total: 'LKR 4,850', status: 'Processing', delivery: '2:00-4:00 PM' },
  { id: '#2455', patient: 'Silva', items: '2 Rx', total: 'LKR 2,150', status: 'Ready', delivery: 'ASAP' },
  { id: '#2454', patient: 'Fernando', items: '5 OTC', total: 'LKR 3,250', status: 'Out Delivery', delivery: 'Delivering' },
];

const ActiveOrders = ({ onSelectOrder }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'success';
      case 'Processing': return 'info';
      case 'Out Delivery': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">ACTIVE ORDERS | {mockOrders.length} Total</Typography>
        <Button variant="outlined" size="small" startIcon={<Refresh />}>Refresh</Button>
      </Box>

      <Tabs value={statusFilter} onChange={(e, v) => setStatusFilter(v)} sx={{ mb: 2 }}>
        <Tab label="All" value="all" />
        <Tab label="Pending" value="Pending" />
        <Tab label="Processing" value="Processing" />
        <Tab label="Ready" value="Ready" />
        <Tab label="Out Delivery" value="Out Delivery" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.patient}</TableCell>
                <TableCell>
                  <Typography variant="body2">{order.items}</Typography>
                  <Typography variant="caption" color="text.secondary">{order.total}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={order.status} size="small" color={getStatusColor(order.status)} />
                </TableCell>
                <TableCell>{order.delivery}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => onSelectOrder(order)}>
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActiveOrders;

