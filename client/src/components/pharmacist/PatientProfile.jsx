import React from 'react';
import { Box, Paper, Typography, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const PatientProfile = ({ patient, onBack }) => {
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack}><ArrowBack /></IconButton>
        <Typography variant="h5">PATIENT PROFILE: {patient?.name} (ID: {patient?.id})</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>BASIC INFORMATION</Typography>
            <Stack spacing={1}>
              <Typography><strong>Name:</strong> {patient?.name}</Typography>
              <Typography><strong>Age:</strong> {patient?.age}</Typography>
              <Typography><strong>Phone:</strong> 077-123-4567</Typography>
              <Typography><strong>Address:</strong> 123 Galle Road, Colombo 03</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>MEDICAL INFORMATION</Typography>
            <Stack spacing={1}>
              <Typography><strong>Allergies:</strong> Penicillin</Typography>
              <Typography><strong>Chronic Conditions:</strong> {patient?.conditions}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>ORDER HISTORY</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Order #</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Oct 1</TableCell>
                    <TableCell>#2456</TableCell>
                    <TableCell>3 Rx + 2 OTC</TableCell>
                    <TableCell>LKR 4,850</TableCell>
                    <TableCell>Delivered</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientProfile;

