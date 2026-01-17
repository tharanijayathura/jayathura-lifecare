import React from 'react';
import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Download, Print } from '@mui/icons-material';

const HeaderControls = ({ timePeriod, setTimePeriod, onExport }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>System Analytics & Reports</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select value={timePeriod} label="Time Period" onChange={(e) => setTimePeriod(e.target.value)}>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="threeMonths">Last 3 Months</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" startIcon={<Download />} onClick={onExport} size="small">Export Report</Button>
        <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()} size="small">Print</Button>
      </Stack>
    </Box>
  );
};

export default HeaderControls;
