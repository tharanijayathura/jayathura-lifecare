import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Stack } from '@mui/material';

const OrderItemsTable = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => {
            const medicineName = item.medicineName || item.medicineId?.name || item.name || 'Unknown';
            const price = item.price || item.medicineId?.price?.perPack || 0;
            const quantity = item.quantity || 0;
            return (
              <TableRow key={item._id || idx}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{medicineName}</Typography>
                    {item.isPrescription && <Chip label="Rx" size="small" color="primary" />}
                  </Stack>
                  {item.dosage && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {item.dosage} {item.frequency ? `- ${item.frequency}` : ''}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{quantity}</TableCell>
                <TableCell align="right">Rs. {price.toFixed(2)}</TableCell>
                <TableCell align="right">Rs. {(price * quantity).toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderItemsTable;
