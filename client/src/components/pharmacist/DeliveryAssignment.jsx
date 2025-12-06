import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Stack } from '@mui/material';

const DeliveryAssignment = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>DELIVERY ASSIGNMENT | Oct 8, 2024</Typography>
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>AVAILABLE DELIVERY PERSONS</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Current Load</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Amal (Rating: 4.8)</TableCell>
                <TableCell>Bike</TableCell>
                <TableCell>2/6 orders</TableCell>
                <TableCell><Chip label="Available" color="success" size="small" /></TableCell>
                <TableCell><Button size="small">Assign Orders</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DeliveryAssignment;

