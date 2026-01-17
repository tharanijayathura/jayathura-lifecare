import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const SalesByCategory = ({ breakdown, formatCurrency }) => {
  if (!breakdown || breakdown.length === 0) return null;
  const total = breakdown.reduce((sum, c) => sum + (c.sales || 0), 0);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Sales by Category</Typography>
        <Box sx={{ mt: 2 }}>
          {breakdown.map((cat, index) => {
            const percentage = total ? (cat.sales / total) * 100 : 0;
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{cat.category}</Typography>
                  <Typography variant="body2" color="text.secondary">{cat.sales} ({percentage.toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'success.main' : 'info.main',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {formatCurrency ? formatCurrency(cat.revenue) : cat.revenue}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesByCategory;
