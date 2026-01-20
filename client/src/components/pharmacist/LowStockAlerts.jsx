import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Checkbox } from '@mui/material';

const mockLowStock = [
  { name: 'Losartan 50mg', current: 8, min: 30, daysOut: 2, supplier: 'MedSupplies', priority: 'Critical' },
  { name: 'Metformin 500mg', current: 12, min: 50, daysOut: 5, supplier: 'PharmaDist', priority: 'Warning' },
];

const LowStockAlerts = () => {
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">LOW STOCK ALERTS | 17 Items Need Attention</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Medicine</TableCell>
              <TableCell>Current</TableCell>
              <TableCell>Min Req.</TableCell>
              <TableCell>Days Out</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockLowStock.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  {item.name}
                  <Chip label={item.priority} size="small" color={item.priority === 'Critical' ? 'error' : 'warning'} sx={{ ml: 1 }} />
                </TableCell>
                <TableCell>
                  <Chip label={item.current} size="small" color="error" />
                </TableCell>
                <TableCell>{item.min}</TableCell>
                <TableCell>{item.daysOut}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>
                  <Button size="small">Contact</Button>
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

