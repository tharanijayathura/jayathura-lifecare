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
  IconButton,
  Checkbox,
  TextField,
} from '@mui/material';
import { ArrowBack, CheckCircle, Print } from '@mui/icons-material';

const OrderPreparation = ({ order, onBack }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Metformin 500mg', qty: 30, shelf: 'A-12', stock: 45, picked: true },
    { id: 2, name: 'Losartan 50mg', qty: 30, shelf: 'B-08', stock: 12, picked: false },
    { id: 3, name: 'Atorvastatin 20mg', qty: 30, shelf: 'B-15', stock: 68, picked: false },
  ]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack}><ArrowBack /></IconButton>
        <Typography variant="h5">PREPARING ORDER {order?.id} | Patient: {order?.patient}</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>ORDER SUMMARY</Typography>
        <Typography>Patient: {order?.patient} | Total: {order?.total}</Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Shelf</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Pick Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.shelf}</TableCell>
                <TableCell>
                  <Chip label={item.stock} size="small" color={item.stock < 20 ? 'warning' : 'success'} />
                </TableCell>
                <TableCell>
                  <Checkbox checked={item.picked} />
                  {item.picked ? 'Picked' : 'Pending'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>PACKING STATION</Typography>
        <Stack spacing={2}>
          <Checkbox label="Include dosage instructions" />
          <Checkbox label="Include prescription copy" />
          <Button variant="contained" startIcon={<CheckCircle />} fullWidth>
            Mark as Packed & Ready
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default OrderPreparation;

