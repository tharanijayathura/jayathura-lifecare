import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, Grid } from '@mui/material';
import { Send } from '@mui/icons-material';

const ChatDashboard = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>PHARMACIST CHAT DASHBOARD</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>CHAT QUEUE</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Wait Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Kumar P.</TableCell>
                    <TableCell>2 min</TableCell>
                    <TableCell><Chip label="Active" color="primary" size="small" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>ACTIVE CHAT: Kumar Perera</Typography>
            <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', p: 2, mb: 2, overflow: 'auto' }}>
              <Typography variant="body2">Patient: What's the correct dosage for Metformin?</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>You: Take one tablet morning and evening after meals</Typography>
            </Box>
            <TextField fullWidth placeholder="Type message..." size="small" />
            <Button variant="contained" startIcon={<Send />} sx={{ mt: 1 }}>Send</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDashboard;

