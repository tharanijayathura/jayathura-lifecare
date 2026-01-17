import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack } from '@mui/material';

const PrescriptionItemsTable = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">Prescription Medicines</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{item.medicineName || item.medicineId?.name}</Typography>
                      <Chip label="Rx" size="small" color="primary" />
                    </Stack>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.dosage || '-'}</TableCell>
                  <TableCell>{item.frequency || '-'}</TableCell>
                  <TableCell align="right">Rs. {(item.price || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">Rs. {((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PrescriptionItemsTable;
