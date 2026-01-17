import React from 'react';
import { Box, Typography } from '@mui/material';

const SimpleBarChart = ({ data, height = 200, valueKey = 'sales' }) => {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0));
  return (
    <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1, px: 1 }}>
      {data.map((item, index) => {
        const value = item[valueKey] || 0;
        const heightPercent = maxValue ? (value / maxValue) * 100 : 0;
        return (
          <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', height: `${heightPercent}%`, minHeight: 20, bgcolor: 'primary.main', borderRadius: '4px 4px 0 0', transition: 'all 0.3s', '&:hover': { bgcolor: 'primary.dark', transform: 'scaleY(1.05)' } }} />
            <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.7rem', textAlign: 'center' }}>{item.day || item.category}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SimpleBarChart;
