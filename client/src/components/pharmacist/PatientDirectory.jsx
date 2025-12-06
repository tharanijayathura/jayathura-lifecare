import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack } from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';

const mockPatients = [
  { id: 'P4567', name: 'Kumar P.', age: 52, lastOrder: 'Today', conditions: 'Diabetes, Hypertension' },
  { id: 'P2345', name: 'N. Silva', age: 68, lastOrder: 'Oct 5', conditions: 'Arthritis' },
];

const PatientDirectory = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">PATIENT DIRECTORY | 2,456 Patients</Typography>
        <Button variant="outlined">Export List</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, ID, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Last Order</TableCell>
              <TableCell>Chronic Conditions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.lastOrder}</TableCell>
                <TableCell>{patient.conditions}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => onSelectPatient(patient)} startIcon={<Visibility />}>
                    Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientDirectory;

