import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const RevenueByCategory = ({ data, formatCurrency }) => {
  if (!data || data.length === 0) return null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Revenue by Product Type</Typography>
        <Box sx={{ mt: 2 }}>
          {data.map((cat, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{cat.category}</Typography>
                <Typography variant="body2" color="text.secondary">{cat.percentage}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={cat.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': { bgcolor: index === 0 ? 'primary.main' : 'success.main' },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {formatCurrency ? formatCurrency(cat.revenue) : cat.revenue}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueByCategory;
