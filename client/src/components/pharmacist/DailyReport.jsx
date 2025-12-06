import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Stack } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

const DailyReport = () => {
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">DAILY ACTIVITY REPORT | Oct 8, 2024</Typography>
        <Button variant="contained" startIcon={<PictureAsPdf />}>Export PDF</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>SHIFT SUMMARY</Typography>
        <Stack spacing={1}>
          <Typography>Total Prescriptions: 24 | Avg Time: 8.5 min</Typography>
          <Typography>Orders Processed: 18 | Total Value: LKR 45,680</Typography>
          <Typography>Chat Sessions: 12 | Avg Response Time: 2.3 min</Typography>
          <Typography>Issues Resolved: 3 | Customer Rating: 4.7/5</Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>PERFORMANCE METRICS</Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">Average Processing Time</Typography>
            <Typography variant="h6">8.5 min (Target: &lt;10 min) ✅</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Customer Satisfaction</Typography>
            <Typography variant="h6">4.7/5 (Target: &gt;4.5) ✅</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DailyReport;

