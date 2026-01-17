import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const HeaderControls = ({ timePeriod, setTimePeriod, title = 'Sales Analytics' }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Time Period</InputLabel>
        <Select value={timePeriod} label="Time Period" onChange={(e) => setTimePeriod(e.target.value)}>
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
          <MenuItem value="threeMonths">Last 3 Months</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default HeaderControls;
