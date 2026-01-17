import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const OtcItemsTable = ({ items, onRemoveItem, removingId }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Additional Items (Non Prescription)</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.medicineName || item.medicineId?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell align="right">Rs. {(item.price || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">Rs. {((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => onRemoveItem(item._id)} disabled={removingId === item._id}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default OtcItemsTable;
